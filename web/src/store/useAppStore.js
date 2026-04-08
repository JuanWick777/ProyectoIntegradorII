import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8080/api`;
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

    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
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
        if (res.status === 401 || res.status === 403) {
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
                    mesaId: numeroMesa,
                    detalles: carrito.map((item) => ({
                        platilloId: item.id,
                        cantidad: item.cantidad,
                        nota: item.notas || '',
                    })),
                };

                const data = await apiFetch('/ordenes/completa', {
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
                await apiFetch(`/detalles/${detalleId}/estado`, {
                    method: 'PUT',
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

                const data = await apiFetch('/auth/me', { token });
                const usuarioNormalizado = {
                    ...data,
                    rol: (data?.rol || '').toUpperCase(),
                };

                set({ usuario: usuarioNormalizado });
                return usuarioNormalizado;
            },

            fetchAdminProducts: async () => {
                const { token } = get();
                const data = await apiFetch('/admin/platillos', { token });
                set({ products: data });
                return data;
            },

            updateProduct: async (id, productData) => {
                const { token } = get();
                return await apiFetch(`/admin/platillos/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(productData),
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