const STATUS_THEME = {
    pendiente: {
        key: 'pendiente',
        bg: '#FEF3C7',
        border: '#FCD34D',
        text: '#B45309',
        solid: '#B45309',
        soft: 'rgba(180, 83, 9, 0.10)',
        ring: 'rgba(180, 83, 9, 0.18)',
    },
    confirmado: {
        key: 'confirmado',
        bg: '#DBEAFE',
        border: '#93C5FD',
        text: '#1D4ED8',
        solid: '#1D4ED8',
        soft: 'rgba(29, 78, 216, 0.10)',
        ring: 'rgba(29, 78, 216, 0.18)',
    },
    preparacion: {
        key: 'preparacion',
        bg: '#FEF08A',
        border: '#FACC15',
        text: '#A16207',
        solid: '#A16207',
        soft: 'rgba(161, 98, 7, 0.10)',
        ring: 'rgba(161, 98, 7, 0.18)',
    },
    listo: {
        key: 'listo',
        bg: '#DCFCE7',
        border: '#86EFAC',
        text: '#15803D',
        solid: '#15803D',
        soft: 'rgba(21, 128, 61, 0.10)',
        ring: 'rgba(21, 128, 61, 0.18)',
    },
    entregado: {
        key: 'entregado',
        bg: '#E5E7EB',
        border: '#D1D5DB',
        text: '#4B5563',
        solid: '#4B5563',
        soft: 'rgba(75, 85, 99, 0.10)',
        ring: 'rgba(75, 85, 99, 0.18)',
    },
    cancelado: {
        key: 'cancelado',
        bg: '#FEE2E2',
        border: '#FCA5A5',
        text: '#B91C1C',
        solid: '#B91C1C',
        soft: 'rgba(185, 28, 28, 0.10)',
        ring: 'rgba(185, 28, 28, 0.18)',
    },
};

const STATUS_ALIASES = {
    pendiente_confirmacion: 'pendiente',
    pendiente: 'pendiente',
    confirmada: 'confirmado',
    confirmado: 'confirmado',
    en_preparacion: 'preparacion',
    preparacion: 'preparacion',
    lista: 'listo',
    listo: 'listo',
    entregada: 'entregado',
    entregado: 'entregado',
    cerrada: 'entregado',
    cerrado: 'entregado',
    finalizada: 'entregado',
    finalizado: 'entregado',
    cancelada: 'cancelado',
    cancelado: 'cancelado',
};

export function normalizeStatusKey(status) {
    const raw = String(status || '').trim().toLowerCase();
    return STATUS_ALIASES[raw] || raw || 'pendiente';
}

export function getStatusTheme(status) {
    const key = normalizeStatusKey(status);
    return STATUS_THEME[key] || STATUS_THEME.pendiente;
}

export { STATUS_THEME };
