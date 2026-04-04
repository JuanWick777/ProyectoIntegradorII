import { create } from 'zustand'
import { persist } from 'zustand/middleware'


const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8080/api`;

async function apiFetch(endpoint, options = {}) {
    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        ...options,
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
            pollingInterval: null,
            setNumeroMesa: (numero) => set({ numeroMesa: numero }),

            // ── VALIDAR MESA (Cliente) ────────────────────────────────────

            validarMesa: async (numero) => {
                return await apiFetch(`/mesas/${numero}`);
            },

            // ── PRODUCTOS (Menú público) ──────────────────────────────────

            fetchProducts: async () => {
                set({ loadingProducts: true });
                try {
                    const data = await apiFetch('/productos');
                    set({ products: data, loadingProducts: false });
                } catch (e) {
                    console.error('Error cargando productos:', e);
                    set({ loadingProducts: false });
                }
            },

            // ── CARRITO ───────────────────────────────────────────────────
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
                return { carrito: [...state.carrito, { ...producto, cantidad: 1, notas: '' }] };
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

            // ─────────────────────────────────────────────────────────────
            // ENVIAR ORDEN (Cliente → API)
            // ─────────────────────────────────────────────────────────────
            addOrder: async () => {
                const { carrito, numeroMesa } = get();
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
                });

                set({ ordenActual: data });
                return data;
            },

            // ─────────────────────────────────────────────────────────────
            // POLLING — Estado de orden del cliente
            // ─────────────────────────────────────────────────────────────
            /**
             * Inicia polling cada 5 segundos consultando GET /api/ordenes/{id}
             * Actualiza ordenActual con el estado más reciente.
             */
            startOrderPolling: (ordenId) => {
                // Limpiar polling anterior si existía
                const { pollingInterval } = get();
                if (pollingInterval) clearInterval(pollingInterval);

                const interval = setInterval(async () => {
                    try {
                        const data = await apiFetch(`/ordenes/${ordenId}`);
                        set({ ordenActual: data });

                        // Detener si la orden ya fue cerrada/cancelada
                        if (['cerrada', 'cancelada', 'entregada'].includes(data.estado)) {
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

            // ─────────────────────────────────────────────────────────────
            // ÓRDENES — Acciones del Mesero
            // ─────────────────────────────────────────────────────────────
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

            // Retrocompatibilidad (KDS y otros)
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

            // ─────────────────────────────────────────────────────────────
            // KDS — Acciones del Chef
            // ─────────────────────────────────────────────────────────────
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

            // ─────────────────────────────────────────────────────────────
            // AUTH — Login / Logout
            // ─────────────────────────────────────────────────────────────
            login: async (email, password) => {
                const data = await apiFetch('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ correo: email, contrasena: password }),
                });
                set({ usuario: data });
                return data;
            },


            logout: async () => {
                await apiFetch('/auth/logout', { method: 'POST' });
                set({ usuario: null, ordenActual: null, carrito: [] });
            },


            logoutLocal: () => {
                set({ usuario: null });
            },

            fetchCurrentUser: async () => {

                try {
                    const res = await fetch(`${API_URL}/auth/me`, {
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                    });
                    if (res.ok) {
                        const data = await res.json();
                        set({ usuario: data });
                        return data;
                    }

                    set({ usuario: null });
                    return null;
                } catch {

                    set({ usuario: null });
                    return null;
                }
            },

            // ─────────────────────────────────────────────────────────────
            // ADMIN — CRUD Productos
            // ─────────────────────────────────────────────────────────────
            fetchAdminProducts: async () => {
                const data = await apiFetch('/admin/productos');
                set({ products: data });
                return data;
            },

            updateProduct: async (id, productData) => {
                await apiFetch(`/admin/productos/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(productData),
                });
            },

            createProduct: async (productData) => {
                await apiFetch('/admin/productos', {
                    method: 'POST',
                    body: JSON.stringify(productData),
                });
            },

            deleteProduct: async (id) => {
                await apiFetch(`/admin/productos/${id}`, { method: 'DELETE' });
            },

            // ─────────────────────────────────────────────────────────────
            // ADMIN — CRUD Personal (usuarios)
            // ─────────────────────────────────────────────────────────────
            fetchUsuarios: async () => {
                return await apiFetch('/admin/usuarios');
            },

            createUsuario: async (data) => {
                return await apiFetch('/admin/usuarios', {
                    method: 'POST',
                    body: JSON.stringify(data),
                });
            },

            updateUsuario: async (id, data) => {
                return await apiFetch(`/admin/usuarios/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                });
            },

            deleteUsuario: async (id) => {
                await apiFetch(`/admin/usuarios/${id}`, { method: 'DELETE' });
            },

            // ─────────────────────────────────────────────────────────────
            // ADMIN — CRUD Brigadas
            // ─────────────────────────────────────────────────────────────
            fetchBrigadas: async () => {
                return await apiFetch('/admin/brigadas');
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
            }),
        }
    )
);
