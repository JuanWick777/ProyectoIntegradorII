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
        credentials: 'include',
    });

    const data = await res.json().catch(() => ({}));

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
                const { carrito, numeroMesa, usuario } = get();

                if (carrito.length === 0 || !numeroMesa) return;

                const payload = {
                    clienteId: usuario?.id || 1,
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
                });

                set({ ordenActual: data });
                return data;
            },

            startOrderPolling: (ordenId) => {
                const { pollingInterval } = get();
                if (pollingInterval) clearInterval(pollingInterval);

                const interval = setInterval(async () => {
                    try {
                        const data = await apiFetch(`/ordenes/${ordenId}`);
                        set({ ordenActual: data });

                        if (['cerrada', 'cancelada', 'entregada'].includes((data.estado || '').toLowerCase())) {
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
                const data = await apiFetch('/mesero/ordenes');
                set({ orders: data });
                return data;
            },

            cambiarEstadoOrden: async (ordenId, nuevoEstado) => {
                await apiFetch(`/ordenes/${ordenId}/estado`, {
                    method: 'PUT',
                    body: JSON.stringify({ estado: nuevoEstado }),
                });
            },

            fetchOrders: async () => {
                try {
                    const data = await apiFetch('/mesero/ordenes');
                    set({ orders: data });
                } catch (e) {
                    console.error('Error cargando órdenes:', e);
                }
            },

            updateOrderStatus: async (ordenId, nuevoEstado) => {
                await apiFetch(`/ordenes/${ordenId}/estado`, {
                    method: 'PUT',
                    body: JSON.stringify({ estado: nuevoEstado }),
                });
            },

            fetchKitchenTickets: async () => {
                try {
                    const data = await apiFetch('/cocina/tickets');
                    set({ orders: data });
                } catch (e) {
                    console.error('Error cargando tickets de cocina:', e);
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
                try {
                    await apiFetch('/auth/logout', { method: 'POST' });
                } catch {
                    // si no existe logout en backend, no pasa nada
                }

                set({ usuario: null, token: null, ordenActual: null, carrito: [] });
            },

            logoutLocal: () => {
                set({ usuario: null, token: null, ordenActual: null, carrito: [] });
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
                const data = await apiFetchWithFallback(['/admin/platillos', '/admin/productos'], { token });
                set({ products: data });
                return data;
            },

            updateProduct: async (id, productData) => {
                await apiFetchWithFallback([`/admin/platillos/${id}`, `/admin/productos/${id}`], {
                    method: 'PUT',
                    body: JSON.stringify(productData),
                });
            },

            createProduct: async (productData) => {
                await apiFetchWithFallback(['/admin/platillos', '/admin/productos'], {
                    method: 'POST',
                    body: JSON.stringify(productData),
                });
            },

            deleteProduct: async (id) => {
                await apiFetchWithFallback([`/admin/platillos/${id}`, `/admin/productos/${id}`], {
                    method: 'DELETE',
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
                return await apiFetch(`/admin/usuarios/${id}`, { method: 'DELETE', token });
            },

            fetchBrigadas: async () => {
                const { token } = get();
                return await apiFetch('/admin/brigadas', { token });
            },

            createBrigada: async (data) => {
                return await apiFetch('/admin/brigadas', {
                    method: 'POST',
                    body: JSON.stringify(data),
                });
            },

            updateBrigada: async (id, data) => {
                return await apiFetch(`/admin/brigadas/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                });
            },

            deleteBrigada: async (id) => {
                await apiFetch(`/admin/brigadas/${id}`, { method: 'DELETE' });
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