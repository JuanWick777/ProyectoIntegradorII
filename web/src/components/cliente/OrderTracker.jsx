import React, { useEffect, useMemo, useState } from 'react';
import { Check, ChefHat, ClipboardList, Clock, CreditCard, FileText, PartyPopper, UtensilsCrossed, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { PrimaryButton, SecondaryButton } from '../ui/Button';

const POLL_INTERVAL_MS = 8000;

const ESTADOS_CONFIG = {
    pendiente_confirmacion: {
        label: 'Pendiente de confirmacion',
        sublabel: 'Tu pedido esta esperando ser aceptado por el mesero.',
        Icon: Clock,
        color: '#856404',
        step: 1,
    },
    confirmada: {
        label: 'Pedido confirmado',
        sublabel: 'El mesero acepto tu pedido, pronto lo prepararemos.',
        Icon: Check,
        color: '#0C5460',
        step: 2,
    },
    en_preparacion: {
        label: 'En preparacion',
        sublabel: 'Nuestros chefs estan trabajando en tu pedido.',
        Icon: ChefHat,
        color: '#004085',
        step: 3,
    },
    lista: {
        label: 'Listo para servir',
        sublabel: 'Tu pedido esta listo. El mesero lo llevara a tu mesa.',
        Icon: UtensilsCrossed,
        color: '#155724',
        step: 4,
    },
    entregada: {
        label: 'Orden entregada',
        sublabel: 'Buen provecho.',
        Icon: PartyPopper,
        color: '#383D41',
        step: 5,
    },
    cerrada: {
        label: 'Cuenta cerrada',
        sublabel: 'Gracias por tu visita.',
        Icon: CreditCard,
        color: '#383D41',
        step: 5,
    },
    cancelada: {
        label: 'Pedido cancelado',
        sublabel: 'El pedido fue cancelado. Por favor, contacta al mesero.',
        Icon: X,
        color: '#721C24',
        step: 0,
    },
};

const PASOS_BARRA = [
    { step: 1, label: 'Recibido' },
    { step: 2, label: 'Confirmado' },
    { step: 3, label: 'Preparando' },
    { step: 4, label: 'Listo' },
    { step: 5, label: 'Entregado' },
];

const estadosFinales = ['cerrada', 'cancelada', 'entregada'];

const getConfig = (estado) => ESTADOS_CONFIG[estado] || ESTADOS_CONFIG.pendiente_confirmacion;

const DetalleOrden = ({ detalle }) => {
    const estadoDet = (detalle?.estadoPreparacion || '').toString().toUpperCase();
    const estadoBadge = {
        PENDIENTE: { cls: 'bg-warning text-dark', txt: 'Pendiente' },
        EN_PREPARACION: { cls: 'bg-info', txt: 'Preparando' },
        LISTO: { cls: 'bg-success', txt: 'Listo' },
        FINALIZADA: { cls: 'bg-secondary', txt: 'Finalizado' },
    }[estadoDet] || { cls: 'bg-light text-dark', txt: estadoDet || 'Pendiente' };

    return (
        <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
            <div>
                <span className="fw-semibold small">{detalle.nombre}</span>
                <span className="text-muted small ms-2">x{detalle.cantidad}</span>
                {detalle.nota && (
                    <p className="text-muted mb-0 d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
                        <FileText size={12} /> {detalle.nota}
                    </p>
                )}
            </div>
            <span className={`badge ${estadoBadge.cls} rounded-pill`} style={{ fontSize: '0.7rem' }}>
                {estadoBadge.txt}
            </span>
        </div>
    );
};

const OrdenActivaCard = ({ orden }) => {
    const estado = orden?.estado || 'pendiente_confirmacion';
    const config = getConfig(estado);
    const IconComponent = config.Icon;

    return (
        <div className="card border-0 shadow mb-4" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
            <div className="card-body p-4 text-center">
                <p className="text-muted small mb-2">Pedido #{orden.id}</p>
                <IconComponent size={38} style={{ color: config.color }} />
                <h2 className="fw-bold fs-5 mt-3 mb-1" style={{ color: config.color }}>
                    {config.label}
                </h2>
                <p className="text-muted small mb-0">{config.sublabel}</p>
            </div>

            {estado !== 'cancelada' && (
                <div className="px-4 pb-4">
                    <div className="d-flex justify-content-between align-items-end position-relative">
                        <div
                            className="position-absolute"
                            style={{
                                top: 14,
                                left: '5%',
                                right: '5%',
                                height: 4,
                                background: '#E9ECEF',
                                borderRadius: 2,
                                zIndex: 0,
                            }}
                        >
                            <div
                                style={{
                                    height: '100%',
                                    background: '#FF7A00',
                                    borderRadius: 2,
                                    width: `${Math.max(0, ((config.step - 1) / (PASOS_BARRA.length - 1)) * 100)}%`,
                                    transition: 'width 0.6s ease',
                                }}
                            />
                        </div>

                        {PASOS_BARRA.map((paso) => {
                            const completado = config.step >= paso.step;
                            const activo = config.step === paso.step;
                            return (
                                <div key={paso.step} className="d-flex flex-column align-items-center" style={{ zIndex: 1, flex: 1 }}>
                                    <div
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: '50%',
                                            background: completado ? '#FF7A00' : '#E9ECEF',
                                            border: activo ? '3px solid #FF7A00' : 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: completado ? '#fff' : '#adb5bd',
                                            fontWeight: 700,
                                            fontSize: 13,
                                            boxShadow: activo ? '0 0 0 4px rgba(255,122,0,0.2)' : 'none',
                                            marginBottom: 4,
                                        }}
                                    >
                                        {completado && !activo ? <Check size={14} /> : paso.step}
                                    </div>
                                    <span
                                        style={{
                                            fontSize: '0.65rem',
                                            fontWeight: completado ? 700 : 400,
                                            color: completado ? '#FF7A00' : '#adb5bd',
                                        }}
                                    >
                                        {paso.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {orden?.detalles?.length > 0 && (
                <>
                    <div className="card-header bg-transparent border-bottom py-3 d-flex align-items-center gap-2">
                        <ClipboardList size={18} />
                        <h6 className="fw-bold mb-0">Detalle del pedido</h6>
                    </div>
                    <div className="card-body p-0">
                        {orden.detalles.map((detalle, idx) => (
                            <DetalleOrden key={`${orden.id}-${detalle.id ?? idx}`} detalle={detalle} />
                        ))}
                    </div>
                    <div className="card-footer bg-transparent px-4 py-3">
                        <div className="d-flex justify-content-between small text-muted">
                            <span>Subtotal</span>
                            <span>${Number(orden.subtotal || 0).toFixed(2)}</span>
                        </div>
                        {Number(orden.montoDescuento || 0) > 0 && (
                            <div className="d-flex justify-content-between small text-muted">
                                <span>Descuento</span>
                                <span>- ${Number(orden.montoDescuento).toFixed(2)}</span>
                            </div>
                        )}
                        <div className="d-flex justify-content-between fw-bold mt-1">
                            <span>Total</span>
                            <span className="text-primary">${Number(orden.total || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const OrderTracker = ({ ordenId, numeroMesa, onNuevoPedido }) => {
    const { ordenActual, fetchOrdenesActivasPorMesa } = useAppStore();
    const [ordenesActivas, setOrdenesActivas] = useState(() => (ordenActual ? [ordenActual] : []));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const cargarOrdenesActivas = async () => {
        if (!numeroMesa) {
            setLoading(false);
            return;
        }

        try {
            setError('');
            const data = await fetchOrdenesActivasPorMesa(numeroMesa);
            setOrdenesActivas(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err?.message || 'No se pudieron cargar tus pedidos activos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarOrdenesActivas();
        const interval = setInterval(cargarOrdenesActivas, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numeroMesa]);

    const ordenesOrdenadas = useMemo(() => {
        return [...ordenesActivas]
            .filter((orden) => !estadosFinales.includes((orden?.estado || '').toLowerCase()))
            .sort((a, b) => Number(b.id) - Number(a.id));
    }, [ordenesActivas]);

    return (
        <div className="d-flex flex-column min-vh-100" style={{ background: '#F4F5F7' }}>
            <header
                className="text-white px-4 pt-4 pb-5"
                style={{ background: 'linear-gradient(135deg, #FF7A00, #E06900)' }}
            >
                <p className="mb-1 opacity-75 small">Mesa #{numeroMesa || '-'}</p>
                <h1 className="fw-bold fs-4 mb-0">Pedidos en preparacion</h1>
                {ordenId && <p className="small opacity-75 mb-0 mt-1">Ultimo pedido enviado: #{ordenId}</p>}
            </header>

            <div className="container px-3" style={{ marginTop: '-2rem' }}>
                {loading && (
                    <div className="card border-0 shadow mb-4" style={{ borderRadius: '1.25rem' }}>
                        <div className="card-body text-center p-4 text-muted">
                            Cargando pedidos...
                        </div>
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger shadow-sm" role="alert">
                        {error}
                    </div>
                )}

                {!loading && !error && ordenesOrdenadas.length === 0 && (
                    <div className="card border-0 shadow mb-4" style={{ borderRadius: '1.25rem' }}>
                        <div className="card-body text-center p-4">
                            <PartyPopper size={42} className="text-primary mb-3" />
                            <h2 className="fw-bold fs-5">No hay pedidos activos</h2>
                            <p className="text-muted small mb-0">Puedes volver al menu para realizar otro pedido.</p>
                        </div>
                    </div>
                )}

                {ordenesOrdenadas.map((orden) => (
                    <OrdenActivaCard key={orden.id} orden={orden} />
                ))}

                <div className="d-grid gap-2 mb-4">
                    <PrimaryButton
                        type="button"
                        fullWidth
                        className="fw-bold py-3"
                        style={{ borderRadius: '0.75rem' }}
                        onClick={onNuevoPedido}
                    >
                        Hacer otro pedido
                    </PrimaryButton>

                    <SecondaryButton
                        type="button"
                        fullWidth
                        className="fw-bold py-3"
                        style={{ borderRadius: '0.75rem' }}
                        onClick={cargarOrdenesActivas}
                    >
                        Actualizar seguimiento
                    </SecondaryButton>
                </div>
            </div>
        </div>
    );
};

export default OrderTracker;
