import React, { useState, useEffect, useCallback } from 'react';
import { User, FileText, Flame, Check, ChefHat, RefreshCw, AlertTriangle, History, Clock, Edit2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import MeseroLogin from './mesero/MeseroLogin';
import PerfilModal from './shared/PerfilModal';
import { PrimaryButton } from './ui/Button';

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
    const estado = (detalle.estadoPreparacion || 'PENDIENTE').toUpperCase();
    const cfg = ESTADO_CONFIG[estado] || ESTADO_CONFIG.PENDIENTE;

    const createdAt = new Date(detalle.orden?.fechaCreacion || detalle.createdAt || Date.now());
    const minutosAgo = Math.max(0, Math.floor((Date.now() - createdAt.getTime()) / 60000));

    const mesaNumero = detalle.orden?.mesa?.numero ?? detalle.orden?.mesaNumero ?? '-';
    const ordenId = detalle.orden?.id ?? detalle.orden?.ordenId ?? detalle.ordenId ?? '-';

    return (
        <div
            className="shadow-sm h-100"
            style={{
                borderRadius: '1.5rem',
                border: `1px solid ${cfg.border}`,
                background: '#ffffff',
                overflow: 'hidden',
            }}
        >
            <div
                className="d-flex justify-content-between align-items-start p-3"
                style={{
                    background: cfg.bg,
                    borderBottom: `1px solid ${cfg.border}`,
                }}
            >
                <div>
                    <div className="text-uppercase fw-bold small mb-2" style={{ color: cfg.color }}>
                        {cfg.label}
                    </div>
                    <h5 className="fw-bold mb-1" style={{ color: '#222' }}>
                        Orden #{ordenId}
                    </h5>
                    <div className="text-muted small">Mesa {mesaNumero}</div>
                </div>
                <div className="text-end">
                    <span
                        className="rounded-pill px-2 py-1 fw-semibold"
                        style={{
                            background: cfg.color,
                            color: '#fff',
                            fontSize: '0.8rem',
                        }}
                    >
                        {cfg.icono}
                    </span>
                    <div className="mt-2 text-muted small">{minutosAgo} min</div>
                </div>
            </div>

            <div className="p-3">
                <div className="mb-3">
                    <div className="fw-semibold" style={{ color: '#1f2937', fontSize: '1.05rem' }}>
                        {detalle.platillo?.nombre || 'Platillo'}
                    </div>
                    <div className="mt-2 d-flex flex-wrap gap-2">
                        <span className="badge rounded-pill" style={{ background: '#f3f4f6', color: '#4b5563' }}>
                            {detalle.cantidad} × ${Number(detalle.precioUnitario || 0).toFixed(2)}
                        </span>
                        <span className="badge rounded-pill" style={{ background: cfg.color, color: '#fff' }}>
                            {cfg.label}
                        </span>
                    </div>
                </div>

                {detalle.notaCliente && detalle.notaCliente.trim() !== '' && (
                    <div
                        className="mb-3 px-3 py-2 rounded-4"
                        style={{
                            background: '#fff9db',
                            border: `1px solid ${cfg.color}33`,
                            color: '#5f370e',
                        }}
                    >
                        <div className="small fw-semibold mb-1">Nota del cliente</div>
                        <div className="small">{detalle.notaCliente}</div>
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center px-3 py-3 rounded-4" style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}>
                    <span className="text-muted small">Subtotal</span>
                    <strong style={{ color: '#111827' }}>${Number(detalle.subtotal || 0).toFixed(2)}</strong>
                </div>
            </div>

            <div className="p-3 pt-0">
                {estado === 'PENDIENTE' && typeof onPreparar === 'function' && (
                    <button
                        className="btn w-100 fw-bold text-white d-flex align-items-center justify-content-center gap-2"
                        style={{ background: cfg.color, borderRadius: '1rem', minHeight: '48px' }}
                        onClick={onPreparar}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner-border spinner-border-sm" />
                        ) : (
                            <><Flame size={18} /> Preparar</>
                        )}
                    </button>
                )}

                {estado === 'EN_PREPARACION' && typeof onListo === 'function' && (
                    <button
                        className="btn w-100 fw-bold text-white d-flex align-items-center justify-content-center gap-2"
                        style={{ background: cfg.color, borderRadius: '1rem', minHeight: '48px' }}
                        onClick={onListo}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner-border spinner-border-sm" />
                        ) : (
                            <><Check size={18} /> Listo</>
                        )}
                    </button>
                )}

                {estado === 'LISTO' && (
                    <div className="text-center fw-semibold d-flex align-items-center justify-content-center gap-2 px-3 py-3 rounded-4" style={{ background: '#ecfdf5', color: '#166534' }}>
                        <Check size={20} /> Listo para entregar
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
    const [perfilAbierto, setPerfilAbierto] = useState(false);

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
                        <PrimaryButton
                            type="button"
                            className="mt-3"
                            onClick={logoutLocal}
                        >
                            Volver
                        </PrimaryButton>
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
                    <PrimaryButton
                        type="button"
                        className="mt-3"
                        onClick={logoutLocal}
                    >
                        Volver
                    </PrimaryButton>
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
                className="sticky-top shadow-sm py-3 px-3"
                style={{
                    background: '#ffffff',
                    borderBottom: '1px solid #e5e7eb',
                }}
            >
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
                    <div className="d-flex align-items-start gap-3">
                        <div
                            className="rounded-3 d-flex align-items-center justify-content-center"
                            style={{ width: 48, height: 48, background: '#f97316', color: '#ffffff' }}
                        >
                            <ChefHat size={24} />
                        </div>
                        <div>
                            <h1 className="fw-bold mb-1" style={{ fontSize: '1.25rem', color: '#111827' }}>
                                RestoApp Kitchen
                            </h1>
                            <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                                Sistema de gestión de cocina en tiempo real
                            </div>
                        </div>
                    </div>

                    <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2">
                        <span
                            className="rounded-pill px-3 py-2 d-flex align-items-center gap-2"
                            style={{ background: '#fee2e2', color: '#b91c1c', fontSize: '0.85rem' }}
                        >
                            <AlertTriangle size={16} /> Prioridad Alta
                        </span>
                        <span
                            className="rounded-pill px-3 py-2 d-flex align-items-center gap-2"
                            style={{ background: '#eef2ff', color: '#3730a3', fontSize: '0.85rem' }}
                        >
                            <Clock size={16} /> Turno: Mañana
                        </span>
                        <button
                            type="button"
                            className="btn fw-semibold px-4 py-2 d-flex align-items-center gap-2"
                            style={{ borderRadius: '9999px', borderColor: '#f97316', backgroundColor: '#ffffff', border: '2px solid #f97316', color: '#f97316' }}
                            onClick={() => setPerfilAbierto(true)}
                        >
                            <User size={16} /> Editar perfil
                        </button>
                        <button
                            type="button"
                            className="btn btn-warning fw-semibold px-4 py-2 d-flex align-items-center justify-content-center"
                            style={{ borderRadius: '9999px', backgroundColor: '#f97316', borderColor: '#f97316', color: '#ffffff' }}
                            onClick={logoutLocal}
                        >
                            Salir
                        </button>
                    </div>
                </div>

                <div className="mt-3 d-flex flex-wrap align-items-center gap-2">
                    <button
                        type="button"
                        className="btn rounded-pill px-4 py-2 fw-semibold"
                        style={vista === 'dashboard' ? { borderColor: '#f97316', backgroundColor: '#f97316', color: '#ffffff', border: '2px solid #f97316' } : { borderColor: '#f97316', backgroundColor: '#ffffff', color: '#f97316', border: '2px solid #f97316' }}
                        onClick={() => setVista('dashboard')}
                    >
                        Pedidos
                    </button>
                    <button
                        type="button"
                        className="btn rounded-pill px-4 py-2 fw-semibold"
                        style={vista === 'historial' ? { borderColor: '#f97316', backgroundColor: '#f97316', color: '#ffffff', border: '2px solid #f97316' } : { borderColor: '#f97316', backgroundColor: '#ffffff', color: '#f97316', border: '2px solid #f97316' }}
                        onClick={() => setVista('historial')}
                    >
                        Historial
                    </button>
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
                            <div className="rounded-4 p-3 h-100" style={{ background: '#fdecea', border: '1px solid #f5b7b1', maxHeight: 'calc(100vh - 110px)', overflowY: 'auto' }}>
                                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#c0392b' }}>
                                    <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#e74c3c' }} /> Pendiente ({pendientes.length})
                                </h5>
                                {pendientes.length === 0 ? (
                                    <div className="text-center text-muted py-4" style={{ color: '#c0392b' }}>
                                        Sin tickets pendientes
                                    </div>
                                ) : (
                                    <div className="d-grid gap-3">
                                        {pendientes.map(detalle => (
                                            <KitchenTicket
                                                key={detalle.id}
                                                detalle={detalle}
                                                loading={loadingId === detalle.id}
                                                onPreparar={() => accionEstado(detalle.id, 'EN_PREPARACION')}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-12 col-lg-4">
                            <div className="rounded-4 p-3 h-100" style={{ background: '#fff9e6', border: '1px solid #f9e79f', maxHeight: 'calc(100vh - 110px)', overflowY: 'auto' }}>
                                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#b9770e' }}>
                                    <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#f1c40f' }} /> En preparación ({enPreparacion.length})
                                </h5>
                                {enPreparacion.length === 0 ? (
                                    <div className="text-center text-muted py-4" style={{ color: '#b9770e' }}>
                                        Nada en preparación
                                    </div>
                                ) : (
                                    <div className="d-grid gap-3">
                                        {enPreparacion.map(detalle => (
                                            <KitchenTicket
                                                key={detalle.id}
                                                detalle={detalle}
                                                loading={loadingId === detalle.id}
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
                                    background: '#ecfdf5',
                                    border: '1px solid #abebc6',
                                    maxHeight: 'calc(100vh - 110px)',
                                    overflowY: 'auto'
                                }}
                            >
                                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#1e8449' }}>
                                    <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#27ae60' }} /> Listo ({listos.length})
                                </h5>
                                {listos.length === 0 ? (
                                    <div className="text-center text-muted py-4" style={{ color: '#1e8449' }}>
                                        Sin tickets listos
                                    </div>
                                ) : (
                                    <div className="d-grid gap-3">
                                        {listos.map(detalle => (
                                            <KitchenTicket
                                                key={detalle.id}
                                                detalle={detalle}
                                                loading={loadingId === detalle.id}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                )}
            </div>
            {perfilAbierto && (
                <PerfilModal
                    usuario={usuario}
                    onClose={() => setPerfilAbierto(false)}
                    onGuardado={() => fetchCurrentUser()}
                />
            )}
        </div>
    );
};

export default KitchenDashboard;