import React, { useState, useEffect, useCallback } from 'react';
import { Users, FileText, Flame, Check, ChefHat, RefreshCw, AlertTriangle, History } from 'lucide-react';
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
                <div className="fw-bold d-flex align-items-center gap-2" style={{ color: '#8e4b10' }}>
                    <Users size={18} /> Mesa {mesaNumero}
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
                        className="mt-2 px-2 py-2 rounded-3 small d-flex align-items-center gap-2"
                        style={{
                            background: '#fff8e1',
                            color: '#8a5a00',
                            border: '1px solid #ffd54f',
                        }}
                    >
                        <FileText size={14} /> {detalle.notaCliente}
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
                {estado === 'PENDIENTE' && typeof onPreparar === 'function' && (
                    <button
                        className="btn w-100 fw-bold text-white d-flex align-items-center justify-content-center gap-2"
                        style={{ background: '#e67e22', borderRadius: '0.75rem' }}
                        onClick={onPreparar}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner-border spinner-border-sm" />
                        ) : (
                            <><Flame size={18} /> Iniciar preparación</>
                        )}
                    </button>
                )}

                {estado === 'EN_PREPARACION' && typeof onListo === 'function' && (
                    <button
                        className="btn w-100 fw-bold text-white d-flex align-items-center justify-content-center gap-2"
                        style={{ background: '#27ae60', borderRadius: '0.75rem' }}
                        onClick={onListo}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner-border spinner-border-sm" />
                        ) : (
                            <><Check size={18} /> Marcar como listo</>
                        )}
                    </button>
                )}

                {estado === 'LISTO' && (
                    <div className="text-center fw-semibold d-flex align-items-center justify-content-center gap-2" style={{ color: '#27ae60' }}>
                        <Check size={20} /> Ticket listo para entrega
                    </div>
                )}
            </div>
        </div>
    );
};

const KitchenDashboard = () => {
    const { usuario, fetchCurrentUser, fetchKitchenTickets, fetchKitchenHistorial, updateDetalleEstado, logoutLocal } = useAppStore();

    const [tickets, setTickets] = useState([]);
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const [ultimaSync, setUltimaSync] = useState(null);
    const [vista, setVista] = useState('dashboard'); // 'dashboard' | 'historial'

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

    const cargarHistorial = useCallback(async () => {
        try {
            const data = await fetchKitchenHistorial();
            setHistorial(data || []);
        } catch (e) {
            console.error('KDS: Error cargando historial', e);
        }
    }, [fetchKitchenHistorial]);

    useEffect(() => {
        fetchCurrentUser().catch(() => { });
    }, [fetchCurrentUser]);

    useEffect(() => {
        if (!usuario) return;

        if (vista === 'historial') {
            cargarHistorial();
            const interval = setInterval(cargarHistorial, 10_000);
            return () => clearInterval(interval);
        }

        cargarTickets();
        const interval = setInterval(cargarTickets, 8000);
        return () => clearInterval(interval);
    }, [usuario, cargarTickets, cargarHistorial, vista]);

    const accionEstado = async (detalleId, nuevoEstado) => {
        setLoadingId(detalleId);
        try {
            await updateDetalleEstado(detalleId, nuevoEstado);
            await cargarTickets();
        } finally {
            setLoadingId(null);
        }
    };

    const rolesCocina = ['COCINERO', 'CHEF', 'PARRILLERO', 'BARISTA', 'REPOSTERO'];

    if (!usuario) {
        const rol = (usuario?.rol || '').toUpperCase();

        const rolesCocina = ['COCINERO', 'CHEF', 'PARRILLERO', 'BARISTA', 'REPOSTERO'];

        if (!rolesCocina.includes(rol)) {
            return (
                <div className="min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="text-center">
                        <AlertTriangle size={48} className="mx-auto mb-3" style={{ color: '#dc3545' }} />
                        <h2>Acceso denegado</h2>
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
                icono={<ChefHat size={32} />}
                demoEmail="chef1@rest.com"
            />
        );
    }

    const rol = (usuario?.rol || '').toUpperCase();

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

    const pendientes = tickets.filter(t => (t.estadoPreparacion || '').toUpperCase() === 'PENDIENTE');
    const enPreparacion = tickets.filter(t => (t.estadoPreparacion || '').toUpperCase() === 'EN_PREPARACION');
    const listos = tickets.filter(t => (t.estadoPreparacion || '').toUpperCase() === 'LISTO');

    const navItems = [
        { id: 'dashboard', icon: <ChefHat size={18} />, label: 'Dashboard' },
        { id: 'historial', icon: <History size={18} />, label: 'Historial' },
    ];

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
                    <ChefHat size={32} style={{ color: '#b45309' }} />
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
                        <span className="text-muted d-none d-md-inline d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                            <RefreshCw size={14} /> {ultimaSync.toLocaleTimeString('es-MX', {
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
                        navItems={navItems}
                        activeItem={vista}
                        onNavItemClick={setVista}
                    />
                </div>
            </header>

            <div className="container-fluid px-3 py-3">
                {vista === 'historial' ? (
                    <div className="row g-3">
                        <div className="col-12">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <History size={18} style={{ color: '#6c757d' }} />
                                <h5 className="fw-bold mb-0">Historial de cocina</h5>
                                <span className="text-muted small ms-2">{historial.length} tickets</span>
                            </div>
                        </div>

                        <div className="col-12">
                            {historial.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <p style={{ fontSize: 48 }}>📦</p>
                                    <p className="fw-semibold">Sin historial por ahora</p>
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {historial.map((detalle) => (
                                        <div key={detalle.id} className="col-12 col-md-6 col-xl-4">
                                            <KitchenTicket
                                                detalle={detalle}
                                                loading={false}
                                                onPreparar={() => { }}
                                                onListo={() => { }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : loading ? (
                    <div className="text-center py-5" style={{ color: '#b45309' }}>
                        <div className="spinner-border mb-3" style={{ color: '#e67e22' }} />
                        <p>Cargando tickets...</p>
                    </div>
                ) : (
                    <div className="row g-3">
                        <div className="col-12 col-lg-4">
                            <div className="rounded-4 p-3 h-100" style={{ background: '#ffe5e5', border: '1px solid #ffcccc', maxHeight: 'calc(100vh - 110px)', overflowY: 'auto' }}>
                                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#c0392b' }}>
                                    <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#c0392b' }} /> Pendiente ({pendientes.length})
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
                            <div className="rounded-4 p-3 h-100" style={{ background: '#fffbea', border: '1px solid #f9e79f', maxHeight: 'calc(100vh - 110px)', overflowY: 'auto' }}>
                                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#b9770e' }}>
                                    <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#f1c40f' }} /> En preparación ({enPreparacion.length})
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

                        {/* Columna "Listo" (listo para recoger por mesero) */}
                        <div className="col-12 col-lg-4">
                            <div
                                className="rounded-4 p-3 h-100"
                                style={{
                                    background: '#f0fff4',
                                    border: '1px solid #abebc6',
                                    maxHeight: 'calc(100vh - 110px)',
                                    overflowY: 'auto'
                                }}
                            >
                                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#1e8449' }}>
                                    <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#27ae60' }} /> Listo ({listos.length})
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