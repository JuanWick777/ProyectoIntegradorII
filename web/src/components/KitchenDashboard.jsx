import React, { useState, useEffect, useCallback, useRef } from 'react';
import { User, FileText, Flame, Check, ChefHat, RefreshCw, AlertTriangle, History, Clock, Edit2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import MeseroLogin from './mesero/MeseroLogin';
import PerfilModal from './shared/PerfilModal';
import { PrimaryButton } from './ui/Button';
import { getStatusTheme } from '../utils/statusTheme';

const ESTADO_CONFIG = {
    PENDIENTE: {
        label: 'Pendiente',
        color: getStatusTheme('pendiente').text,
        bg: getStatusTheme('pendiente').bg,
        border: getStatusTheme('pendiente').border,
        icono: '🔴',
    },
    EN_PREPARACION: {
        label: 'En preparación',
        color: getStatusTheme('en_preparacion').text,
        bg: getStatusTheme('en_preparacion').bg,
        border: getStatusTheme('en_preparacion').border,
        icono: '🟡',
    },
    LISTO: {
        label: 'Listo',
        color: getStatusTheme('lista').text,
        bg: getStatusTheme('lista').bg,
        border: getStatusTheme('lista').border,
        icono: '🟢',
    },
};

const TIEMPO_OBJETIVO_MINUTOS = {
    PENDIENTE: 8,
    EN_PREPARACION: 18,
    LISTO: 5,
};

const pendienteTheme = getStatusTheme('pendiente');
const preparacionTheme = getStatusTheme('en_preparacion');
const listoTheme = getStatusTheme('lista');
const confirmadaTheme = getStatusTheme('confirmada');
const entregadoTheme = getStatusTheme('entregada');
const canceladoTheme = getStatusTheme('cancelada');

function obtenerFechaDetalle(detalle) {
    return new Date(detalle.orden?.fechaCreacion || detalle.createdAt || Date.now());
}

function calcularMinutos(detalle, ahora) {
    return Math.max(0, Math.floor((ahora - obtenerFechaDetalle(detalle).getTime()) / 60000));
}

function ordenarTicketsPEPS(items) {
    return [...items].sort((a, b) => {
        const fechaA = obtenerFechaDetalle(a).getTime();
        const fechaB = obtenerFechaDetalle(b).getTime();
        if (fechaA !== fechaB) return fechaA - fechaB;
        return (a.id || 0) - (b.id || 0);
    });
}

function agruparPlatillos(items) {
    const grupos = new Map();

    items.forEach((detalle) => {
        const nombre = detalle.platillo?.nombre || 'Platillo';
        const actual = grupos.get(nombre) || 0;
        grupos.set(nombre, actual + Number(detalle.cantidad || 0));
    });

    return Array.from(grupos.entries())
        .map(([nombre, cantidad]) => ({ nombre, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad || a.nombre.localeCompare(b.nombre))
        .slice(0, 4);
}

const KitchenTicket = ({ detalle, onPreparar, onListo, loading, now, posicionCola }) => {
    const estado = (detalle.estadoPreparacion || 'PENDIENTE').toUpperCase();
    const cfg = ESTADO_CONFIG[estado] || ESTADO_CONFIG.PENDIENTE;
    const tiempoObjetivo = TIEMPO_OBJETIVO_MINUTOS[estado] || 15;

    const minutosAgo = calcularMinutos(detalle, now ?? Date.now());
    const estaAtrasado = minutosAgo >= tiempoObjetivo;
    const colaLabel = posicionCola ?? '-';

    const mesaNumero = detalle.orden?.mesa?.numero ?? detalle.orden?.mesaNumero ?? '-';
    const ordenId = detalle.orden?.id ?? detalle.orden?.ordenId ?? detalle.ordenId ?? '-';

    return (
        <div
            className="shadow-sm h-100"
            style={{
                borderRadius: '1.5rem',
                border: `1px solid ${estaAtrasado ? '#ef4444' : cfg.border}`,
                background: estaAtrasado ? 'linear-gradient(180deg, #fff7f7 0%, #ffffff 42%)' : '#ffffff',
                overflow: 'hidden',
                boxShadow: estaAtrasado
                    ? '0 18px 38px rgba(239, 68, 68, 0.15)'
                    : undefined,
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
                    <div className="text-muted small d-flex flex-wrap gap-2">
                        <span>Mesa {mesaNumero}</span>
                        <span className="fw-semibold" style={{ color: '#6b7280' }}>
                            PEPS #{colaLabel}
                        </span>
                    </div>
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
                    <div className="mt-2 small" style={{ color: estaAtrasado ? '#dc2626' : '#6b7280', fontWeight: estaAtrasado ? 700 : 500 }}>
                        {minutosAgo} min
                    </div>
                </div>
            </div>

            <div className="p-3">
                {estaAtrasado && (
                    <div
                        className="mb-3 d-flex align-items-center gap-2 px-3 py-2 rounded-4"
                        style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.18)',
                            color: '#991b1b',
                        }}
                    >
                        <AlertTriangle size={16} />
                        <div className="small fw-bold">
                            Ya supero el tiempo objetivo de {tiempoObjetivo} min
                        </div>
                    </div>
                )}

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
                    <div
                        className="text-center fw-semibold d-flex align-items-center justify-content-center gap-2 px-3 py-3 rounded-4"
                        style={{ background: listoTheme.bg, color: listoTheme.text }}
                    >
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
    const [ahora, setAhora] = useState(Date.now());
    const [avisoListo, setAvisoListo] = useState('');
    const prevListosRef = useRef(0);

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
        const interval = setInterval(() => setAhora(Date.now()), 30000);
        return () => clearInterval(interval);
    }, []);

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
            if (nuevoEstado === 'LISTO') {
                setAvisoListo('Ticket marcado como listo. El mesero lo vera en su panel.');
            }
            await cargarTickets();
        } finally {
            setLoadingId(null);
        }
    };

    useEffect(() => {
        if (!usuario) {
            prevListosRef.current = 0;
            return;
        }

        const totalListos = tickets.filter((t) => (t.estadoPreparacion || '').toUpperCase() === 'LISTO').length;
        if (prevListosRef.current > 0 && totalListos > prevListosRef.current) {
            setAvisoListo('Hay nuevos platillos listos para entregar al mesero.');
        }
        prevListosRef.current = totalListos;
    }, [tickets, usuario]);

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

    const pendientes = ordenarTicketsPEPS(tickets.filter(t => (t.estadoPreparacion || '').toUpperCase() === 'PENDIENTE'));
    const enPreparacion = ordenarTicketsPEPS(tickets.filter(t => (t.estadoPreparacion || '').toUpperCase() === 'EN_PREPARACION'));
    const listos = ordenarTicketsPEPS(tickets.filter(t => (t.estadoPreparacion || '').toUpperCase() === 'LISTO'));
    const atrasados = tickets.filter((detalle) => {
        const estado = (detalle.estadoPreparacion || 'PENDIENTE').toUpperCase();
        const objetivo = TIEMPO_OBJETIVO_MINUTOS[estado] || 15;
        return calcularMinutos(detalle, ahora) >= objetivo;
    });

    useEffect(() => {
        if (!avisoListo) return;
        const timeout = setTimeout(() => setAvisoListo(''), 5000);
        return () => clearTimeout(timeout);
    }, [avisoListo]);

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
                            style={{ background: canceladoTheme.bg, color: canceladoTheme.text, fontSize: '0.85rem' }}
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
                                                now={ahora}
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
                    <>
                        {avisoListo && (
                            <div
                                className="d-flex align-items-center justify-content-between gap-3 rounded-4 px-4 py-3 mb-3"
                                style={{
                                    background: `linear-gradient(135deg, ${listoTheme.bg} 0%, ${confirmadaTheme.bg} 100%)`,
                                    border: `1px solid ${listoTheme.ring}`,
                                    color: listoTheme.text,
                                }}
                            >
                                <div className="d-flex align-items-center gap-2 fw-semibold">
                                    <Check size={18} /> {avisoListo}
                                </div>
                                <span className="small" style={{ color: listoTheme.text }}>
                                    Sincronizado con el panel de mesero
                                </span>
                            </div>
                        )}

                        {(pendientes.length > 0 || atrasados.length > 0 || listos.length > 0) && (
                            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                                <span
                                    className="px-3 py-2 rounded-pill fw-semibold"
                                    style={{ background: pendienteTheme.bg, color: pendienteTheme.text, border: `1px solid ${pendienteTheme.border}` }}
                                >
                                    Cola pendiente: {pendientes.length}
                                </span>
                                <span
                                    className="px-3 py-2 rounded-pill fw-semibold"
                                    style={{ background: canceladoTheme.bg, color: canceladoTheme.text, border: `1px solid ${canceladoTheme.border}` }}
                                >
                                    Atrasados: {atrasados.length}
                                </span>
                                <span
                                    className="px-3 py-2 rounded-pill fw-semibold"
                                    style={{ background: listoTheme.bg, color: listoTheme.text, border: `1px solid ${listoTheme.border}` }}
                                >
                                    Listos: {listos.length}
                                </span>
                            </div>
                        )}

                    <div className="row g-3">
                        <div className="col-12 col-lg-4">
                            <div className="rounded-4 p-3 h-100" style={{ background: pendienteTheme.bg, border: `1px solid ${pendienteTheme.border}`, maxHeight: 'calc(100vh - 110px)', overflowY: 'auto' }}>
                                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: pendienteTheme.text }}>
                                    <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: pendienteTheme.solid }} /> Pendiente ({pendientes.length})
                                </h5>
                                {agruparPlatillos(pendientes).length > 0 && (
                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                        {agruparPlatillos(pendientes).map((grupo) => (
                                            <span
                                                key={`pend-${grupo.nombre}`}
                                                className="badge rounded-pill"
                                                style={{ background: '#fff', color: pendienteTheme.text, border: `1px solid ${pendienteTheme.border}` }}
                                            >
                                                {grupo.cantidad} {grupo.nombre}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {pendientes.length === 0 ? (
                                    <div className="text-center text-muted py-4" style={{ color: pendienteTheme.text }}>
                                        Sin tickets pendientes
                                    </div>
                                ) : (
                                    <div className="d-grid gap-3">
                                        {pendientes.map((detalle, index) => (
                                            <KitchenTicket
                                                key={detalle.id}
                                                detalle={detalle}
                                                loading={loadingId === detalle.id}
                                                now={ahora}
                                                posicionCola={index + 1}
                                                onPreparar={() => accionEstado(detalle.id, 'EN_PREPARACION')}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-12 col-lg-4">
                            <div className="rounded-4 p-3 h-100" style={{ background: preparacionTheme.bg, border: `1px solid ${preparacionTheme.border}`, maxHeight: 'calc(100vh - 110px)', overflowY: 'auto' }}>
                                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: preparacionTheme.text }}>
                                    <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#f1c40f' }} /> En preparación ({enPreparacion.length})
                                </h5>
                                {agruparPlatillos(enPreparacion).length > 0 && (
                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                        {agruparPlatillos(enPreparacion).map((grupo) => (
                                            <span
                                                key={`prep-${grupo.nombre}`}
                                                className="badge rounded-pill"
                                                style={{ background: '#fff', color: preparacionTheme.text, border: `1px solid ${preparacionTheme.border}` }}
                                            >
                                                {grupo.cantidad} {grupo.nombre}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {enPreparacion.length === 0 ? (
                                    <div className="text-center text-muted py-4" style={{ color: preparacionTheme.text }}>
                                        Nada en preparación
                                    </div>
                                ) : (
                                    <div className="d-grid gap-3">
                                        {enPreparacion.map((detalle, index) => (
                                            <KitchenTicket
                                                key={detalle.id}
                                                detalle={detalle}
                                                loading={loadingId === detalle.id}
                                                now={ahora}
                                                posicionCola={index + 1}
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
                                    background: listoTheme.bg,
                                    border: `1px solid ${listoTheme.border}`,
                                    maxHeight: 'calc(100vh - 110px)',
                                    overflowY: 'auto'
                                }}
                            >
                                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: listoTheme.text }}>
                                    <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: listoTheme.solid }} /> Listo ({listos.length})
                                </h5>
                                {agruparPlatillos(listos).length > 0 && (
                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                        {agruparPlatillos(listos).map((grupo) => (
                                            <span
                                                key={`listo-${grupo.nombre}`}
                                                className="badge rounded-pill"
                                                style={{ background: '#fff', color: listoTheme.text, border: `1px solid ${listoTheme.border}` }}
                                            >
                                                {grupo.cantidad} {grupo.nombre}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {listos.length === 0 ? (
                                    <div className="text-center text-muted py-4" style={{ color: listoTheme.text }}>
                                        Sin tickets listos
                                    </div>
                                ) : (
                                    <div className="d-grid gap-3">
                                        {listos.map((detalle, index) => (
                                            <KitchenTicket
                                                key={detalle.id}
                                                detalle={detalle}
                                                loading={loadingId === detalle.id}
                                                now={ahora}
                                                posicionCola={index + 1}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                    </>
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
