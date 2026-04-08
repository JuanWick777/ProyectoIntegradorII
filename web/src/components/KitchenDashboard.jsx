import React, { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import MeseroLogin from './mesero/MeseroLogin';
import HamburgerMenu from './shared/HamburgerMenu';

const ESTADO_CONFIG = {
    PENDIENTE: {
        label: 'Pendiente',
        color: '#e74c3c',
        bg: '#fff5f5',
        border: '#f5b7b1',
        icono: '🔴',
    },
    EN_PREPARACION: {
        label: 'En preparación',
        color: '#f1c40f',
        bg: '#fffbea',
        border: '#f9e79f',
        icono: '🟡',
    },
    LISTO: {
        label: 'Listo',
        color: '#27ae60',
        bg: '#f0fff4',
        border: '#abebc6',
        icono: '🟢',
    },
};

const KitchenTicket = ({ detalle, onPreparar, onListo, loading }) => {
    const estado = detalle.estadoPreparacion || 'PENDIENTE';
    const cfg = ESTADO_CONFIG[estado] || ESTADO_CONFIG.PENDIENTE;

    const createdAt = new Date(detalle.orden?.fechaCreacion || detalle.createdAt || Date.now());
    const minutosAgo = Math.max(0, Math.floor((Date.now() - createdAt.getTime()) / 60000));
    const esUrgente = minutosAgo > 12;

    const mesaNumero = detalle.orden?.mesa?.numero ?? detalle.orden?.mesaNumero ?? '-';
    const ordenId = detalle.orden?.id ?? detalle.orden?.ordenId ?? detalle.ordenId ?? '-';

    return (
        <div
            className="card border-0 shadow-sm h-100"
            style={{
                borderRadius: '1rem',
                borderLeft: `6px solid ${cfg.color}`,
                background: esUrgente ? '#fff8f5' : cfg.bg,
            }}
        >
            <div
                className="card-header d-flex justify-content-between align-items-center py-2"
                style={{
                    background: 'linear-gradient(90deg, #fff3e0, #ffffff)',
                    borderBottom: `1px solid ${cfg.border}`,
                    borderRadius: '1rem 1rem 0 0',
                }}
            >
                <div className="fw-bold" style={{ color: '#8e4b10' }}>
                    🪑 Mesa {mesaNumero}
                </div>
                <div className="d-flex align-items-center gap-2">
                    <span className="badge text-dark" style={{ background: '#ffe0b2' }}>
                        #{ordenId}
                    </span>
                    <span
                        className="badge"
                        style={{ background: cfg.color, color: '#fff' }}
                    >
                        {cfg.icono} {minutosAgo} min
                    </span>
                </div>
            </div>

            <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <div className="fw-bold" style={{ fontSize: '1.05rem', color: '#5a3a1a' }}>
                            {detalle.platillo?.nombre || 'Platillo'}
                        </div>
                        <div className="text-muted small">
                            {detalle.cantidad} × ${Number(detalle.precioUnitario || 0).toFixed(2)}
                        </div>
                    </div>
                    <span
                        className="badge rounded-pill"
                        style={{
                            background: cfg.color,
                            color: '#fff',
                        }}
                    >
                        {cfg.label}
                    </span>
                </div>

                {detalle.notaCliente && detalle.notaCliente.trim() !== '' && (
                    <div
                        className="mt-2 px-2 py-2 rounded-3 small"
                        style={{
                            background: '#fff8e1',
                            color: '#8a5a00',
                            border: '1px solid #ffd54f',
                        }}
                    >
                        📝 {detalle.notaCliente}
                    </div>
                )}

                <div className="mt-3 d-flex justify-content-between align-items-center border-top pt-2">
                    <span className="text-muted small">Subtotal</span>
                    <strong style={{ color: '#d35400' }}>
                        ${Number(detalle.subtotal || 0).toFixed(2)}
                    </strong>
                </div>
            </div>

            <div className="card-footer bg-transparent p-3 border-0">
                {estado === 'PENDIENTE' && (
                    <button
                        className="btn w-100 fw-bold text-white"
                        style={{ background: '#e67e22', borderRadius: '0.75rem' }}
                        onClick={onPreparar}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner-border spinner-border-sm me-2" />
                        ) : (
                            '🔥 Iniciar preparación'
                        )}
                    </button>
                )}

                {estado === 'EN_PREPARACION' && (
                    <button
                        className="btn w-100 fw-bold text-white"
                        style={{ background: '#27ae60', borderRadius: '0.75rem' }}
                        onClick={onListo}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner-border spinner-border-sm me-2" />
                        ) : (
                            '✅ Marcar como listo'
                        )}
                    </button>
                )}

                {estado === 'LISTO' && (
                    <div className="text-center fw-semibold" style={{ color: '#27ae60' }}>
                        🟢 Ticket listo para entrega
                    </div>
                )}
            </div>
        </div>
    );
};

const KitchenDashboard = () => {
    const { usuario, fetchCurrentUser, fetchKitchenTickets, updateDetalleEstado, logoutLocal } = useAppStore();

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const [ultimaSync, setUltimaSync] = useState(null);

    const cargarTickets = useCallback(async () => {
        try {
            const data = await fetchKitchenTickets();
            setTickets(data || []);
            setUltimaSync(new Date());
        } catch (e) {
            console.error('KDS: Error cargando tickets', e);
        } finally {
            setLoading(false);
        }
    }, [fetchKitchenTickets]);

    useEffect(() => {
        fetchCurrentUser().catch(() => {});
    }, [fetchCurrentUser]);

    useEffect(() => {
        if (!usuario) return;

        cargarTickets();
        const interval = setInterval(cargarTickets, 8000);
        return () => clearInterval(interval);
    }, [usuario, cargarTickets]);

    const accionEstado = async (detalleId, nuevoEstado) => {
        setLoadingId(detalleId);
        try {
            await updateDetalleEstado(detalleId, nuevoEstado);
            await cargarTickets();
        } finally {
            setLoadingId(null);
        }
    };

    if (!usuario) {
        const rol = (usuario?.rol || '').toUpperCase();

        const rolesCocina = ['COCINERO', 'CHEF', 'PARRILLERO', 'BARISTA', 'REPOSTERO'];

        if (!rolesCocina.includes(rol)) {
            return (
                <div className="min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="text-center">
                        <h2>🚫 Acceso denegado</h2>
                        <p>No tienes permisos para entrar a cocina</p>
                        <button className="btn btn-primary mt-3" onClick={logoutLocal}>
                            Volver
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <MeseroLogin
                onLoginExitoso={() => fetchCurrentUser()}
                titulo="Portal de Cocina"
                icono="👨‍🍳"
                demoEmail="chef1@rest.com"
            />
        );
    }

    const pendientes = tickets.filter(t => (t.estadoPreparacion || '').toUpperCase() === 'PENDIENTE');
    const enPreparacion = tickets.filter(t => (t.estadoPreparacion || '').toUpperCase() === 'EN_PREPARACION');
    const listos = tickets.filter(t => (t.estadoPreparacion || '').toUpperCase() === 'LISTO');

    return (
        <div className="min-vh-100" style={{ background: '#ffffff' }}>
            <header
                className="sticky-top shadow-sm py-3 px-3 d-flex justify-content-between align-items-center"
                style={{
                    background: 'linear-gradient(90deg, #fff7ed, #ffffff)',
                    borderBottom: '2px solid #f39c12',
                }}
            >
                <div className="d-flex align-items-center gap-3">
                    <span style={{ fontSize: 30 }}>👨‍🍳</span>
                    <div>
                        <h1 className="fw-bold mb-0" style={{ fontSize: '1.15rem', color: '#b45309' }}>
                            KDS - Cocina en Vivo
                        </h1>
                        <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                            Chef: {usuario.nombre}
                        </span>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                    {ultimaSync && (
                        <span className="text-muted d-none d-md-inline" style={{ fontSize: '0.75rem' }}>
                            🔄 {ultimaSync.toLocaleTimeString('es-MX', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                            })}
                        </span>
                    )}
                    <HamburgerMenu
                        loginPath="/login"
                        accentColor="#e67e22"
                        onLogout={logoutLocal}
                    />
                </div>
            </header>

            <div className="container-fluid px-3 py-3">
                {loading ? (
                    <div className="text-center py-5" style={{ color: '#b45309' }}>
                        <div className="spinner-border mb-3" style={{ color: '#e67e22' }} />
                        <p>Cargando tickets...</p>
                    </div>
                ) : (
                    <div className="row g-3">
                        <div className="col-12 col-lg-4">
                            <div className="rounded-4 p-3 h-100" style={{ background: '#fff5f5', border: '1px solid #f5b7b1' }}>
                                <h5 className="fw-bold mb-3" style={{ color: '#c0392b' }}>
                                    🔴 Pendiente ({pendientes.length})
                                </h5>
                                {pendientes.length === 0 ? (
                                    <p className="text-center text-muted py-4">Sin tickets pendientes</p>
                                ) : (
                                    <div className="d-grid gap-3">
                                        {pendientes.map(detalle => (
                                            <KitchenTicket
                                                key={detalle.id}
                                                detalle={detalle}
                                                loading={loadingId === detalle.id}
                                                onPreparar={() => accionEstado(detalle.id, 'EN_PREPARACION')}
                                                onListo={() => accionEstado(detalle.id, 'LISTO')}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-12 col-lg-4">
                            <div className="rounded-4 p-3 h-100" style={{ background: '#fffbea', border: '1px solid #f9e79f' }}>
                                <h5 className="fw-bold mb-3" style={{ color: '#b9770e' }}>
                                    🟡 En preparación ({enPreparacion.length})
                                </h5>
                                {enPreparacion.length === 0 ? (
                                    <p className="text-center text-muted py-4">Nada en preparación</p>
                                ) : (
                                    <div className="d-grid gap-3">
                                        {enPreparacion.map(detalle => (
                                            <KitchenTicket
                                                key={detalle.id}
                                                detalle={detalle}
                                                loading={loadingId === detalle.id}
                                                onPreparar={() => accionEstado(detalle.id, 'EN_PREPARACION')}
                                                onListo={() => accionEstado(detalle.id, 'LISTO')}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-12 col-lg-4">
                            <div className="rounded-4 p-3 h-100" style={{ background: '#f0fff4', border: '1px solid #abebc6' }}>
                                <h5 className="fw-bold mb-3" style={{ color: '#1e8449' }}>
                                    🟢 Listo ({listos.length})
                                </h5>
                                {listos.length === 0 ? (
                                    <p className="text-center text-muted py-4">Sin tickets listos</p>
                                ) : (
                                    <div className="d-grid gap-3">
                                        {listos.map(detalle => (
                                            <KitchenTicket
                                                key={detalle.id}
                                                detalle={detalle}
                                                loading={loadingId === detalle.id}
                                                onPreparar={() => accionEstado(detalle.id, 'EN_PREPARACION')}
                                                onListo={() => accionEstado(detalle.id, 'LISTO')}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KitchenDashboard;