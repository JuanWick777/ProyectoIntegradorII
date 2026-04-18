import React from 'react';
import {
    Users,
    FileText,
    UtensilsCrossed,
    DollarSign,
    Check,
    X,
    Clock,
    CheckCircle,
    ChefHat,
    Handshake,
    XCircle,
} from 'lucide-react';
import { PrimaryButton, DangerButton } from '../ui/Button';
import { getStatusTheme } from '../../utils/statusTheme';

const ESTADO_BADGE = {
    pendiente_confirmacion: { label: 'Pendiente', theme: getStatusTheme('pendiente_confirmacion'), Icon: Clock },
    confirmada: { label: 'Confirmada', theme: getStatusTheme('confirmada'), Icon: CheckCircle },
    en_preparacion: { label: 'En cocina', theme: getStatusTheme('en_preparacion'), Icon: ChefHat },
    lista: { label: 'Lista', theme: getStatusTheme('lista'), Icon: UtensilsCrossed },
    entregada: { label: 'Entregada', theme: getStatusTheme('entregada'), Icon: Handshake },
    cerrada: { label: 'Cerrada', theme: getStatusTheme('cerrada'), Icon: DollarSign },
    cancelada: { label: 'Cancelada', theme: getStatusTheme('cancelada'), Icon: XCircle },
};

const OrderCard = ({ orden, onAceptar, onCancelar, onEntregar, onCobrar, loading }) => {
    const fallbackTheme = getStatusTheme(orden.estado);
    const badge = ESTADO_BADGE[orden.estado] || { label: orden.estado, theme: fallbackTheme };
    const badgeTheme = badge.theme || fallbackTheme;
    const canceladoTheme = getStatusTheme('cancelada');
    const listoTheme = getStatusTheme('lista');
    const entregadoTheme = getStatusTheme('entregada');

    const esPendiente = orden.estado === 'pendiente_confirmacion';
    const esLista = orden.estado === 'lista';
    const esEntregada = orden.estado === 'entregada';
    const esCerrada = ['cerrada', 'cancelada'].includes(orden.estado);

    const createdAt = new Date(orden.fechaCreacion);
    const minutosTranscurridos = Math.floor((Date.now() - createdAt.getTime()) / 60000);
    const requiereAtencion = esPendiente && minutosTranscurridos >= 2;
    const accionPrincipal = esPendiente
        ? 'Confirma o cancela este pedido.'
        : esLista
            ? 'Cocina termino. Llevala a la mesa.'
            : esEntregada
                ? 'Ya fue entregada. Cobra y cierra la mesa.'
                : null;

    const accionColor = esPendiente
        ? { bg: badgeTheme.soft, color: badgeTheme.text, border: badgeTheme.ring }
        : esLista
            ? { bg: listoTheme.soft, color: listoTheme.text, border: listoTheme.ring }
            : esEntregada
                ? { bg: entregadoTheme.soft, color: entregadoTheme.text, border: entregadoTheme.ring }
                : null;

    return (
        <div
            className="card border-0 shadow-sm h-100"
            style={{
                borderRadius: '1rem',
                borderLeft: `5px solid ${requiereAtencion ? canceladoTheme.solid : badgeTheme.solid}`,
                opacity: esCerrada ? 0.6 : 1,
                transition: 'all 0.3s ease',
                boxShadow: requiereAtencion ? `0 14px 30px ${canceladoTheme.ring}` : undefined,
                background: requiereAtencion ? 'linear-gradient(180deg, #fff7f7 0%, #ffffff 38%)' : undefined,
            }}
        >
            <div className="card-body p-3 d-flex flex-column gap-2">
                {requiereAtencion && (
                    <div
                        className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
                        style={{
                            background: canceladoTheme.soft,
                            color: canceladoTheme.text,
                            border: `1px solid ${canceladoTheme.ring}`,
                        }}
                    >
                        <Clock size={16} />
                        <span className="small fw-bold">
                            Lleva {minutosTranscurridos} minutos sin confirmarse
                        </span>
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <span className="fs-4 fw-bold d-flex align-items-center gap-2">
                            <Users size={20} /> Mesa {orden.mesaNumero}
                        </span>
                        <div className="text-muted small">
                            #{orden.id} - hace {minutosTranscurridos} min
                        </div>
                    </div>

                    <span
                        className="d-inline-flex align-items-center gap-2 px-3 py-2 fw-semibold"
                        style={{
                            background: badgeTheme.bg,
                            color: badgeTheme.text,
                            border: `1px solid ${badgeTheme.border}`,
                            fontSize: '0.75rem',
                            borderRadius: '9999px',
                        }}
                    >
                        {badge.Icon && (
                            <span
                                className="d-inline-flex align-items-center justify-content-center rounded-circle"
                                style={{
                                    width: 22,
                                    height: 22,
                                    background: 'rgba(255,255,255,0.8)',
                                    color: badgeTheme.text,
                                }}
                            >
                                <badge.Icon size={14} />
                            </span>
                        )}
                        {badge.label}
                    </span>
                </div>

                <div className="border-top pt-2 mt-1">
                    {(orden.detalles || orden.items || []).map((detalle, idx) => (
                        <div key={idx} className="mb-2">
                            <div className="d-flex justify-content-between">
                                <span className="fw-semibold small">
                                    {detalle.cantidad}x {detalle.nombre}
                                </span>

                                <span className="text-muted small">
                                    ${(Number(detalle.precioUnitario || detalle.precio || 0) * detalle.cantidad).toFixed(2)}
                                </span>
                            </div>

                            {detalle.nota && (
                                <div
                                    className="small text-warning mt-1 px-2 py-1 rounded-2 d-flex align-items-center gap-1"
                                    style={{ background: 'rgba(230,126,34,0.1)', fontSize: '0.78rem' }}
                                >
                                    <FileText size={14} /> {detalle.nota}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="d-flex justify-content-between fw-bold border-top pt-2 mt-auto">
                    <span>Total</span>
                    <span className="text-primary">${Number(orden.total).toFixed(2)}</span>
                </div>

                {accionPrincipal && accionColor && (
                    <div
                        className="d-flex align-items-center justify-content-between gap-2 px-3 py-2 rounded-3"
                        style={{
                            background: accionColor.bg,
                            color: accionColor.color,
                            border: `1px solid ${accionColor.border}`,
                        }}
                    >
                        <span className="small fw-semibold">{accionPrincipal}</span>
                    </div>
                )}

                {orden.estado === 'cancelada' && orden.motivoCancelacion && (
                    <div
                        className="mt-2 p-2 rounded-3"
                        style={{
                            background: canceladoTheme.soft,
                            border: `1px solid ${canceladoTheme.ring}`,
                        }}
                    >
                        <div className="small fw-bold" style={{ color: canceladoTheme.text }}>
                            Motivo de cancelacion
                        </div>
                        <div className="small text-muted">{orden.motivoCancelacion}</div>
                        {orden.canceladaPorNombre && (
                            <div className="small mt-1" style={{ color: canceladoTheme.text }}>
                                Cancelada por: {orden.canceladaPorNombre}
                            </div>
                        )}
                    </div>
                )}

                {!esCerrada && (
                    <div className="d-flex gap-2">
                        {esPendiente && (
                            <>
                                <DangerButton
                                    type="button"
                                    size="sm"
                                    className="fw-semibold d-flex align-items-center justify-content-center gap-1"
                                    onClick={onCancelar}
                                    disabled={loading}
                                    style={{ flex: 1, minWidth: 0 }}
                                >
                                    <X size={16} /> Cancelar
                                </DangerButton>

                                <PrimaryButton
                                    type="button"
                                    size="sm"
                                    className="fw-semibold d-flex align-items-center justify-content-center gap-1"
                                    onClick={onAceptar}
                                    disabled={loading}
                                    style={{
                                        flex: 1,
                                        minWidth: 0,
                                        backgroundColor: getStatusTheme('confirmada').solid,
                                        borderColor: getStatusTheme('confirmada').solid,
                                    }}
                                >
                                    {loading ? <span className="spinner-border spinner-border-sm" /> : <><Check size={16} /> Aceptar</>}
                                </PrimaryButton>
                            </>
                        )}

                        {esLista && (
                            <PrimaryButton
                                type="button"
                                size="sm"
                                className="fw-semibold d-flex align-items-center justify-content-center gap-1"
                                onClick={onEntregar}
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    backgroundColor: listoTheme.solid,
                                    borderColor: listoTheme.solid,
                                }}
                            >
                                <CheckCircle size={16} /> Marcar entregada
                            </PrimaryButton>
                        )}

                        {esEntregada && (
                            <PrimaryButton
                                type="button"
                                size="sm"
                                className="fw-bold d-flex align-items-center justify-content-center gap-1"
                                onClick={onCobrar}
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    backgroundColor: entregadoTheme.solid,
                                    borderColor: entregadoTheme.solid,
                                }}
                            >
                                <DollarSign size={16} /> Cobrar y cerrar mesa
                            </PrimaryButton>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderCard;
