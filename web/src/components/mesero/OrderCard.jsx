import React from 'react';
import Badge from '../ui/Badge';

const ESTADO_BADGE = {
    pendiente_confirmacion: { label: 'Pendiente', color: '#e67e22' },
    confirmada: { label: 'Confirmada', color: '#3498db' },
    en_preparacion: { label: 'En cocina', color: '#9b59b6' },
    lista: { label: '¡Lista!', color: '#27ae60' },
    entregada: { label: 'Entregada', color: '#7f8c8d' },
    cerrada: { label: 'Cerrada', color: '#95a5a6' },
    cancelada: { label: 'Cancelada', color: '#e74c3c' },
};

const ESTADO_ICONO = {
    pendiente_confirmacion: '🕐',
    confirmada: '✅',
    en_preparacion: '👨‍🍳',
    lista: '🍽️',
    entregada: '🤝',
    cerrada: '💰',
    cancelada: '❌',
};

const OrderCard = ({ orden, onAceptar, onCancelar, onEntregar, onCobrar, loading }) => {

    const badge = ESTADO_BADGE[orden.estado] || { label: orden.estado, color: '#95a5a6' };
    const icono = ESTADO_ICONO[orden.estado] || '📋';

    const esPendiente = orden.estado === 'pendiente_confirmacion';
    const esLista = orden.estado === 'lista';
    const esEntregada = orden.estado === 'entregada';
    const esCerrada = ['cerrada', 'cancelada'].includes(orden.estado);

    const createdAt = new Date(orden.fechaCreacion);
    const minutosTranscurridos = Math.floor((Date.now() - createdAt.getTime()) / 60000);

    return (
        <div
            className="card border-0 shadow-sm h-100"
            style={{
                borderRadius: '1rem',
                borderLeft: `5px solid ${badge.color}`,
                opacity: esCerrada ? 0.6 : 1,
                transition: 'all 0.3s ease',
            }}
        >
            <div className="card-body p-3 d-flex flex-column gap-2">

                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <span className="fs-4 fw-bold">🪑 Mesa {orden.mesaNumero}</span>
                        <div className="text-muted small">
                            #{orden.id} · hace {minutosTranscurridos} min
                        </div>
                    </div>

                    <Badge
                        pill={true}
                        className="px-3 py-2"
                        style={{ background: badge.color, color: '#fff', fontSize: '0.75rem' }}
                    >
                        {icono} {badge.label}
                    </Badge>
                </div>

                {/* ITEMS */}
                <div className="border-top pt-2 mt-1">
                    {(orden.detalles || orden.items || []).map((d, idx) => {                         
                        return (
                        <div key={idx} className="mb-2">

                            <div className="d-flex justify-content-between">
                                <span className="fw-semibold small">
                                    {d.cantidad}× {d.nombre}
                                </span>

                                <span className="text-muted small">
                                    ${(Number(d.precioUnitario || d.precio || 0) * d.cantidad).toFixed(2)}
                                </span>
                            </div>

                            {d.nota && (
                                <div
                                    className="small text-warning mt-1 px-2 py-1 rounded-2"
                                    style={{ background: 'rgba(230,126,34,0.1)', fontSize: '0.78rem' }}
                                >
                                    📝 {d.nota}
                                </div>
                            )}
                        </div>
                    )})}
                </div>

                {/* TOTAL */}
                <div className="d-flex justify-content-between fw-bold border-top pt-2 mt-auto">
                    <span>Total</span>
                    <span className="text-primary">${Number(orden.total).toFixed(2)}</span>
                </div>

                {/* BOTONES */}
                {!esCerrada && (
                    <div className="d-flex gap-2 flex-wrap">

                        {esPendiente && (
                            <>
                                <button
                                    className="btn btn-success btn-sm flex-grow-1 fw-semibold"
                                    onClick={onAceptar}
                                    disabled={loading}
                                >
                                    {loading
                                        ? <span className="spinner-border spinner-border-sm" />
                                        : '✓ Aceptar'}
                                </button>

                                <button
                                    className="btn btn-outline-danger btn-sm fw-semibold"
                                    onClick={onCancelar}
                                    disabled={loading}
                                >
                                    ✕ Cancelar
                                </button>
                            </>
                        )}

                        {esLista && (
                            <button
                                className="btn btn-primary btn-sm w-100 fw-semibold"
                                onClick={onEntregar}
                                disabled={loading}
                            >
                                🍽️ Marcar entregada
                            </button>
                        )}

                        {esEntregada && (
                            <button
                                className="btn btn-warning btn-sm w-100 fw-bold"
                                onClick={onCobrar}
                                disabled={loading}
                            >
                                💰 Cobrar y cerrar mesa
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderCard;