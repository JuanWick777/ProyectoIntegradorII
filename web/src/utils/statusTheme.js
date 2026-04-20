const STATUS_THEME = {
    pendiente: {
        key: 'pendiente',
        bg: '#FDECEA',
        border: '#F5B7B1',
        text: '#C0392B',
        solid: '#E74C3C',
        soft: 'rgba(192, 57, 43, 0.08)',
        ring: 'rgba(192, 57, 43, 0.18)',
    },
    confirmado: {
        key: 'confirmado',
        bg: '#F0F9FF',
        border: '#BAE6FD',
        text: '#0C4A6E',
        solid: '#0EA5E9',
        soft: 'rgba(14, 165, 233, 0.10)',
        ring: 'rgba(14, 165, 233, 0.18)',
    },
    preparacion: {
        key: 'preparacion',
        bg: '#FFF9E6',
        border: '#F9E79F',
        text: '#B9770E',
        solid: '#F1C40F',
        soft: 'rgba(241, 196, 15, 0.10)',
        ring: 'rgba(241, 196, 15, 0.18)',
    },
    listo: {
        key: 'listo',
        bg: '#ECFDF5',
        border: '#ABEBC6',
        text: '#1E8449',
        solid: '#27AE60',
        soft: 'rgba(39, 174, 96, 0.10)',
        ring: 'rgba(39, 174, 96, 0.18)',
    },
    entregado: {
        key: 'entregado',
        bg: '#E2E8F0',
        border: '#CBD5E1',
        text: '#475569',
        solid: '#475569',
        soft: 'rgba(71, 85, 105, 0.10)',
        ring: 'rgba(71, 85, 105, 0.18)',
    },
    cancelado: {
        key: 'cancelado',
        bg: '#FFE4D6',
        border: '#F5B7B1',
        text: '#C0392B',
        solid: '#C0392B',
        soft: 'rgba(192, 57, 43, 0.08)',
        ring: 'rgba(192, 57, 43, 0.18)',
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
