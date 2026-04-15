import React from 'react';
import { Users, FileText, UtensilsCrossed, DollarSign, Check, X, Clock, CheckCircle, ChefHat, Handshake, XCircle } from 'lucide-react';
import { PrimaryButton, SecondaryButton, DangerButton } from '../ui/Button';

const ESTADO_BADGE = {
    pendiente_confirmacion: { label: 'Pendiente', bg: '#ffe4d6', color: '#c0392b', Icon: Clock },
    confirmada: { label: 'Confirmada', bg: '#dbeafe', color: '#0c4a6e', Icon: CheckCircle },
    en_preparacion: { label: 'En cocina', bg: '#fef3c7', color: '#b9770e', Icon: ChefHat },
    lista: { label: '¡Lista!', bg: '#bbf7d0', color: '#1e8449', Icon: UtensilsCrossed },
    entregada: { label: 'Entregada', bg: '#e2e8f0', color: '#475569', Icon: Handshake },
    cerrada: { label: 'Cerrada', bg: '#e5e7eb', color: '#4b5563', Icon: DollarSign },
    cancelada: { label: 'Cancelada', bg: '#ffe4d6', color: '#c0392b', Icon: XCircle },
};

const OrderCard = ({ orden, onAceptar, onCancelar, onEntregar, onCobrar, loading }) => {

    const badge = ESTADO_BADGE[orden.estado] || { label: orden.estado, color: '#95a5a6' };

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
                        <span className="fs-4 fw-bold d-flex align-items-center gap-2"><Users size={20} /> Mesa {orden.mesaNumero}</span>
                        <div className="text-muted small">
                            #{orden.id} · hace {minutosTranscurridos} min
                        </div>
                    </div>

                    <span
                        className="d-inline-flex align-items-center gap-2 px-3 py-2 fw-semibold"
                        style={{ background: badge.bg || badge.color, color: badge.bg ? badge.color : '#111827', fontSize: '0.75rem', borderRadius: '9999px' }}
                    >
                        {badge.Icon && (
                            <span
                                className="d-inline-flex align-items-center justify-content-center rounded-circle"
                                style={{
                                    width: 22,
                                    height: 22,
                                    background: 'rgba(255,255,255,0.8)',
                                    color: badge.color,
                                }}
                            >
                                <badge.Icon size={14} />
                            </span>
                        )}
                        {badge.label}
                    </span>
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
                                    className="small text-warning mt-1 px-2 py-1 rounded-2 d-flex align-items-center gap-1"
                                    style={{ background: 'rgba(230,126,34,0.1)', fontSize: '0.78rem' }}
                                >
                                    <FileText size={14} /> {d.nota}
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
                                    style={{ flex: 1, minWidth: 0, backgroundColor: '#27ae60', borderColor: '#27ae60' }}
                                >
                                    {loading
                                        ? <span className="spinner-border spinner-border-sm" />
                                        : <><Check size={16} /> Aceptar</>}
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
                                style={{ flex: 1, minWidth: 0, backgroundColor: '#009a43', borderColor: '#009a43'}}
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
                                style={{ flex: 1, minWidth: 0, backgroundColor: '#009a43' }}
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
