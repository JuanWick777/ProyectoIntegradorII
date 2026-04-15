import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const STORAGE_KEY = 'restaurant-storage-v2';

function getStoredToken() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed?.state?.token || null;
    } catch {
        return null;
    }
}

async function apiFetch(endpoint, options = {}) {
    const token = options.token || getStoredToken();

    const isFormDataBody =
        typeof FormData !== 'undefined' && options?.body instanceof FormData;

    const headers = {
        ...(!isFormDataBody ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
        console.log('📤 Sending with Authorization:', headers.Authorization.substring(0, 30) + '...');
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    let data = {};
    try {
        data = await res.json();
    } catch {
        data = {};
    }

    if (!res.ok) {
        const isAuthEndpoint = endpoint.startsWith('/auth/login') || endpoint.startsWith('/auth/register');

        if (res.status === 401 && !isAuthEndpoint) {
            window.dispatchEvent(new CustomEvent('session-expired'));
        }

        const err = new Error(data.error || `Error ${res.status}`);
        err.status = res.status;
        err.data = data;
        throw err;
    }

    return data;
}

async function apiFetchWithFallback(endpoints, options = {}) {
    let lastError = null;

    for (const endpoint of endpoints) {
        try {
            return await apiFetch(endpoint, options);
        } catch (err) {
            lastError = err;
            if (err.status !== 404) {
                throw err;
            }
        }
    }

    throw lastError || new Error('Not Found');
}

export const useAppStore = create(
    persist(
        (set, get) => ({
            numeroMesa: null,
            carrito: [],
            products: [],
            categorias: [],
            loadingProducts: true,
            orders: [],
            ordenActual: null,
            usuario: null,
            token: null,
            pollingInterval: null,

            setNumeroMesa: (numero) => set({ numeroMesa: numero }),

            validarMesa: async (numero) => {
                return await apiFetch(`/mesas/${numero}`);
            },

            fetchMesas: async () => {
                return await apiFetch('/mesas');
            },

            crearMesa: async (numero) => {
                const { token } = get();
                return await apiFetch('/mesas', {
                    method: 'POST',
                    body: JSON.stringify({ numero }),
                    token,
                });
            },

            eliminarMesa: async (id) => {
                const { token } = get();
                return await apiFetch(`/mesas/${id}`, {
                    method: 'DELETE',
                    token,
                });
            },

            actualizarEstadoMesa: async (id, estado) => {
                const { token } = get();
                return await apiFetch(`/mesas/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({ estado }),
                    token,
                });
            },

            fetchProducts: async () => {
                set({ loadingProducts: true });
                try {
                    const data = await apiFetchWithFallback(['/platillos', '/productos']);
                    set({ products: data, loadingProducts: false });
                } catch (e) {
                    console.error('Error cargando productos:', e);
                    set({ loadingProducts: false });
                }
            },

            agregarAlCarrito: (producto) => set((state) => {
                const existe = state.carrito.find((item) => item.id === producto.id);

                if (existe) {
                    return {
                        carrito: state.carrito.map((item) =>
                            item.id === producto.id
                                ? { ...item, cantidad: item.cantidad + 1 }
                                : item
                        ),
                    };
                }

                return {
                    carrito: [...state.carrito, { ...producto, cantidad: 1, notas: '' }],
                };
            }),

            eliminarDelCarrito: (productoId) => set((state) => ({
                carrito: state.carrito.filter((item) => item.id !== productoId),
            })),

            actualizarNotaItem: (productoId, nota) => set((state) => ({
                carrito: state.carrito.map((item) =>
                    item.id === productoId ? { ...item, notas: nota } : item
                ),
            })),

            incrementarCantidad: (productoId) => set((state) => ({
                carrito: state.carrito.map((item) =>
                    item.id === productoId ? { ...item, cantidad: item.cantidad + 1 } : item
                ),
            })),

            decrementarCantidad: (productoId) => set((state) => ({
                carrito: state.carrito.map((item) =>
                    item.id === productoId && item.cantidad > 1
                        ? { ...item, cantidad: item.cantidad - 1 }
                        : item
                ),
            })),

            limpiarCarrito: () => set({ carrito: [] }),

            addOrder: async () => {
                const { carrito, numeroMesa, usuario, token } = get();

                if (carrito.length === 0 || !numeroMesa) return;

                const payload = {
                    mesa_numero: numeroMesa,
                    items: carrito.map((item) => ({
                        producto_id: item.id,
                        cantidad: item.cantidad,
                        nota_cliente: item.notas || '',
                    })),
                };

                const data = await apiFetch('/ordenes', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    token,
                });

                set({ ordenActual: data });
                return data;
            },

            startOrderPolling: (ordenId) => {
                const { pollingInterval, token } = get();
                if (pollingInterval) clearInterval(pollingInterval);

                const interval = setInterval(async () => {
                    try {
                        const data = await apiFetch(`/ordenes/${ordenId}`, { token });
                        set({ ordenActual: data });

                        const estado = (data.estado || data.estadoPreparacion || '').toLowerCase();
                        if (['cerrada', 'cancelada', 'entregada'].includes(estado)) {
                            clearInterval(interval);
                            set({ pollingInterval: null });
                        }
                    } catch (e) {
                        console.error('Error en polling:', e);
                    }
                }, 5000);

                set({ pollingInterval: interval });
            },

            stopOrderPolling: () => {
                const { pollingInterval } = get();
                if (pollingInterval) {
                    clearInterval(pollingInterval);
                    set({ pollingInterval: null });
                }
            },

            fetchMeseroOrdenes: async () => {
                const { token } = get();
                const data = await apiFetch('/mesero/ordenes', { token });
                set({ orders: data });
                return data;
            },

            fetchMeseroHistorial: async () => {
                const { token } = get();
                const data = await apiFetch('/ordenes/historial', { token });
                set({ orders: data });
                return data;
            },

            cambiarEstadoOrden: async (ordenId, nuevoEstado) => {
                const { token } = get();
                await apiFetch(`/ordenes/${ordenId}/estado`, {
                    method: 'PUT',
                    token,
                    body: JSON.stringify({ estado: nuevoEstado }),
                });
            },

            fetchOrders: async () => {
                const { token } = get();
                try {
                    const data = await apiFetch('/mesero/ordenes', { token });
                    set({ orders: data });
                } catch (e) {
                    console.error('Error cargando órdenes:', e);
                }
            },

            updateOrderStatus: async (ordenId, nuevoEstado) => {
                const { token } = get();
                await apiFetch(`/ordenes/${ordenId}/estado`, {
                    method: 'PUT',
                    token,
                    body: JSON.stringify({ estado: nuevoEstado }),
                });
            },

            fetchKitchenTickets: async () => {
                const { token } = get();
                try {
                    const data = await apiFetch('/cocina/tickets', { token });
                    set({ orders: data });
                    return data;
                } catch (e) {
                    console.error('Error cargando tickets de cocina:', e);
                    return [];
                }
            },

            updateDetalleEstado: async (detalleId, nuevoEstado) => {
                const { token } = get();
                await apiFetch(`/detalle-orden/${detalleId}/estado`, {
                    method: 'PUT',
                    token,
                    body: JSON.stringify({ estado: nuevoEstado }),
                });
            },

            login: async (email, password) => {
                const data = await apiFetch('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ correo: email, contrasena: password }),
                });

                const usuarioNormalizado = {
                    ...data,
                    rol: (data?.rol || '').toUpperCase(),
                };

                console.log('USUARIO LOGUEADO:', usuarioNormalizado);

                set({
                    usuario: usuarioNormalizado,
                    token: data.token || null,
                });

                return usuarioNormalizado;
            },

            logout: async () => {
                set({ usuario: null, token: null, ordenActual: null, carrito: [] });
            },

            logoutLocal: () => {
                set({ usuario: null, token: null, ordenActual: null, carrito: [] });
            },

            actualizarPerfil: async ({ nombre, correo, contrasena }) => {
                const data = await apiFetch('/auth/perfil', {
                    method: 'PUT',
                    body: JSON.stringify({ nombre, correo, contrasena }),
                });
                const usuarioNormalizado = {
                    ...data,
                    rol: (data?.rol || '').toUpperCase(),
                };
                set({ usuario: usuarioNormalizado, token: data.token || get().token });
                return usuarioNormalizado;
            },

            fetchCurrentUser: async () => {
                const { token } = get();
                if (!token) {
                    set({ usuario: null });
                    return null;
                }

                try {
                    const data = await apiFetch('/auth/me', { token });
                    const usuarioNormalizado = {
                        ...data,
                        rol: (data?.rol || '').toUpperCase(),
                    };

                    set({ usuario: usuarioNormalizado });
                    return usuarioNormalizado;
                } catch (error) {
                    set({ usuario: null, token: null });
                    throw error;
                }
            },

            fetchAdminProducts: async () => {
                const { token } = get();
                const data = await apiFetch('/admin/platillos', { token });
                set({ products: data });
                return data;
            },

            fetchCategorias: async () => {
                const { token } = get();
                try {
                    const data = await apiFetch('/categorias', { token });
                    set({ categorias: data || [] });
                    return data || [];
                } catch (e) {
                    console.error('Error cargando categorías:', e);
                    return [];
                }
            },

            updateProduct: async (id, productData) => {
                const { token } = get();
                return await apiFetch(`/admin/platillos/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(productData),
                    token,
                });
            },

            uploadPlatilloImage: async (file) => {
                const { token } = get();
                const body = new FormData();
                body.append('file', file);
                return await apiFetch('/admin/uploads/platillos', {
                    method: 'POST',
                    body,
                    token,
                });
            },

            deletePlatilloImage: async (pathOrUrl) => {
                const { token } = get();
                const qs = new URLSearchParams({ path: pathOrUrl || '' }).toString();
                return await apiFetch(`/admin/uploads/platillos?${qs}`, {
                    method: 'DELETE',
                    token,
                });
            },

            createProduct: async (productData) => {
                const { token } = get();
                return await apiFetch('/admin/platillos', {
                    method: 'POST',
                    body: JSON.stringify(productData),
                    token,
                });
            },

            deleteProduct: async (id) => {
                const { token } = get();
                return await apiFetch(`/admin/platillos/${id}`, {
                    method: 'DELETE',
                    token,
                });
            },

            // ── Promociones ───────────────────────────────────────────
            fetchPromociones: async () => {
                return await apiFetch('/promociones');
            },

            fetchAdminPromociones: async () => {
                const { token } = get();
                return await apiFetch('/admin/promociones', { token });
            },

            createPromocion: async (data) => {
                const { token } = get();
                return await apiFetch('/admin/promociones', {
                    method: 'POST',
                    body: JSON.stringify(data),
                    token,
                });
            },

            updatePromocion: async (id, data) => {
                const { token } = get();
                return await apiFetch(`/admin/promociones/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                    token,
                });
            },

            deletePromocion: async (id) => {
                const { token } = get();
                return await apiFetch(`/admin/promociones/${id}`, {
                    method: 'DELETE',
                    token,
                });
            },

            aplicarPromocion: async (ordenId, codigoPromo) => {
                const { token } = get();
                return await apiFetch(`/mesero/ordenes/${ordenId}/promocion`, {
                    method: 'POST',
                    body: JSON.stringify({ codigoPromo }),
                    token,
                });
            },



            fetchUsuarios: async () => {
                const { token } = get();
                return await apiFetch('/admin/usuarios', { token });
            },

            createUsuario: async (data) => {
                const { token } = get();
                return await apiFetch('/admin/usuarios', {
                    method: 'POST',
                    body: JSON.stringify(data),
                    token,
                });
            },

            updateUsuario: async (id, data) => {
                const { token } = get();
                return await apiFetch(`/admin/usuarios/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                    token,
                });
            },

            deleteUsuario: async (id) => {
                const { token } = get();
                return await apiFetch(`/admin/usuarios/${id}`, {
                    method: 'DELETE',
                    token,
                });
            },

            fetchBrigadas: async () => {
                const { token } = get();
                return await apiFetch('/admin/brigadas', { token });
            },

            createBrigada: async (data) => {
                const { token } = get();
                return await apiFetch('/admin/brigadas', {
                    method: 'POST',
                    body: JSON.stringify(data),
                    token,
                });
            },

            updateBrigada: async (id, data) => {
                const { token } = get();
                return await apiFetch(`/admin/brigadas/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                    token,
                });
            },

            deleteBrigada: async (id) => {
                const { token } = get();
                await apiFetch(`/admin/brigadas/${id}`, {
                    method: 'DELETE',
                    token,
                });
            },
        }),
        {
            name: 'restaurant-storage-v2',
            partialize: (state) => ({
                numeroMesa: state.numeroMesa,
                carrito: state.carrito,
                ordenActual: state.ordenActual,
                usuario: state.usuario,
                token: state.token,
            }),
        }
    )
);
