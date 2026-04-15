const API_URL = import.meta.env.VITE_API_URL || '/api';

export const resolveImageUrl = (pathOrUrl) => {
    if (!pathOrUrl) return '';
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
        return pathOrUrl;
    }

    const base = API_URL.replace(/\/api$/, '');
    const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
    return `${base}${path}`;
};

export const MESAS_OPCIONES = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    nombre: `Mesa ${i + 1}`,
}));

export const normalizeRole = (rol) => (rol || '').toString().trim().toLowerCase();

export const getUserEmail = (u) => u?.email ?? u?.correo ?? '';
export const getUserRole = (u) => normalizeRole(u?.rol ?? u?.tipoUsuario);

export const isUserActive = (u) => {
    if (u == null) return false;

    const activeValue = u?.activo ?? u?.activoUsuario ?? u?.active ?? u?.isActive;
    if (activeValue !== undefined && activeValue !== null) {
        if (typeof activeValue === 'boolean') return activeValue;
        const normalized = String(activeValue).trim().toLowerCase();
        return ['1', 'true', 'si', 'sí', 'activo', 'active', 'habilitado', 'enabled', 'yes'].includes(normalized);
    }

    const estadoValue = String(u?.estado ?? u?.estadoUsuario ?? u?.estadoCuenta ?? '').trim().toLowerCase();
    return ['1', 'true', 'si', 'sí', 'activo', 'active', 'habilitado', 'enabled', 'yes'].includes(estadoValue);
};

export const getProductName = (p) => p?.nombre ?? '';
export const getProductDesc = (p) => p?.descripcion ?? '';
export const getProductPrice = (p) => p?.precio ?? 0;
export const getProductDisponibilidad = (p) => p?.estado ?? p?.disponibilidad ?? 'DISPONIBLE';

export const getProductCategoryName = (p) => {
    const cat = p?.categoria;
    if (typeof cat === 'string') return cat;
    if (cat?.nombre) return cat.nombre;
    return p?.categoria_nombre ?? p?.categoriaNombre ?? 'Otros';
};

export const getProductCategoryId = (p) => {
    if (p?.categoria?.id) return Number(p.categoria.id);
    if (p?.categoria_id) return Number(p.categoria_id);
    if (p?.categoriaId) return Number(p.categoriaId);
    return null;
};

export const getProductImage = (p) =>
    resolveImageUrl(p?.urlImagen ?? p?.url_imagen ?? p?.imagen_url ?? p?.imagenUrl ?? '');

export const ROL_BADGE = {
    admin: { color: '#6f42c1', label: 'Admin' },
    cocinero: { color: '#fd7e14', label: 'Cocinero' },
    chef: { color: '#fd7e14', label: 'Chef' },
    mesero: { color: '#0d6efd', label: 'Mesero' },
    cliente: { color: '#198754', label: 'Cliente' },
};

export const EMPTY_USER = {
    nombre: '',
    email: '',
    password: '',
    rol: 'mesero',
};

export const EMPTY_NEW = {
    nombre: '',
    precio: '',
    descripcion: '',
    imagenUrl: '',
    imagenFile: null,
    imagenRemoved: false,
    categoria_id: '',
    disponibilidad: 'DISPONIBLE',
};

export const COCINAS = [
    { id: 1, nombre: '🍳 Cocina Principal' },
    { id: 2, nombre: '☕ Barra / Bar' },
    { id: 3, nombre: '🔥 Parrilla' },
    { id: 4, nombre: '🍰 Repostería' },
];

export const CATEGORIAS = [
    { id: 1, nombre: '🍔 Comida' },
    { id: 2, nombre: '🥤 Bebidas' },
    { id: 3, nombre: '🍰 Postres' },
    { id: 4, nombre: '🥗 Entradas' },
    { id: 5, nombre: '🍕 Especialidades' },
];

export const MAPA_COCINAS_POR_CATEGORIA = {
    1: [1, 3], // Comida → Cocina Principal, Parrilla
    2: [2],    // Bebidas → Barra
    3: [4],    // Postres → Repostería
    4: [1],    // Entradas → Cocina Principal
    5: [1, 3], // Especialidades → Cocina Principal, Parrilla
};
