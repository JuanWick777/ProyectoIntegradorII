import React, { useState, useEffect, useCallback } from 'react';
import { ClipboardList, Clock, CheckCircle, ChefHat, UtensilsCrossed, Handshake, RefreshCw, User, Check, AlertTriangle, History, LogOut, Ticket } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import OrderCard from './OrderCard';
import { PrimaryButton } from '../ui/Button';
import PerfilModal from '../shared/PerfilModal';

const FILTROS = [
    { key: 'todos', label: 'Todos', Icon: ClipboardList },
    { key: 'pendiente_confirmacion', label: 'Pendientes', Icon: Clock },
    { key: 'confirmada', label: 'Confirmadas', Icon: CheckCircle },
    { key: 'en_preparacion', label: 'En cocina', Icon: ChefHat },
    { key: 'lista', label: 'Listas', Icon: UtensilsCrossed },
    { key: 'entregada', label: 'Entregadas', Icon: Handshake },
];

/**
 * WaiterDashboard.jsx — Panel principal del mesero.
 * Polling cada 10 s a GET /api/mesero/ordenes
 */
const WaiterDashboard = ({ usuario, onLogout }) => {
    const { fetchMeseroOrdenes, cambiarEstadoOrden, logoutLocal, aplicarPromocion } = useAppStore();

    const [sesionExpirada, setSesionExpirada] = useState(false);
    const [ordenes, setOrdenes] = useState([]);
    const [filtro, setFiltro] = useState('todos');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const [ultimaSync, setUltimaSync] = useState(null);
    const [promoPanel, setPromoPanel] = useState(false);
    const [promoOrdenId, setPromoOrdenId] = useState('');
    const [promoCodigo, setPromoCodigo] = useState('');
    const [promoMsg, setPromoMsg] = useState(null);
    const [vista, setVista] = useState('pedidos');
    const [perfilAbierto, setPerfilAbierto] = useState(false);

    // ── Detectar sesión expirada (server restart) ────────────
    useEffect(() => {
        const handleExpired = () => {
            setSesionExpirada(true);
            // Limpiar usuario → MeseroPage mostrará el login
            useAppStore.getState().logout().catch(() => { });
        };
        window.addEventListener('session-expired', handleExpired);
        return () => window.removeEventListener('session-expired', handleExpired);
    }, []);

    // ── Carga de órdenes ────────────────────────────────────
    const cargarOrdenes = useCallback(async () => {
        try {
            const data = await fetchMeseroOrdenes();
            // Incluir todas las órdenes para el historial
            setOrdenes(data || []);
            setUltimaSync(new Date());
            setSesionExpirada(false);       // Todo OK
        } catch (e) {
            if (e.status === 401 || e.status === 403) {
                setSesionExpirada(true);
            }
            console.error('Error cargando órdenes:', e);
        } finally {
            setLoading(false);
        }
    }, [fetchMeseroOrdenes]);

    // Primera carga + polling cada 5 s
    useEffect(() => {
        cargarOrdenes();
        const interval = setInterval(cargarOrdenes, 5_000);
        return () => clearInterval(interval);
    }, [cargarOrdenes]);

    // ── Acción: cambiar estado ───────────────────────────────
    const accionEstado = async (ordenId, nuevoEstado) => {
        setLoadingId(ordenId);
        try {
            await cambiarEstadoOrden(ordenId, nuevoEstado);
            await cargarOrdenes(); // Refresh inmediato
        } catch (e) {
            console.error('Error actualizando estado:', e);
            if (e.message?.includes('Límite alcanzado')) {
                alert('Límite de mesas: ' + e.message);
            } else {
                alert('Error: ' + (e.message || 'No se pudo actualizar la orden'));
            }
        } finally {
            setLoadingId(null);
        }
    };

    // ── Filtrado ────────────────────────────────────────────
    const ordenesFiltradas = ordenes.filter((orden) => !['cancelada', 'cerrada'].includes(orden.estado));

    // ── Columnas del tablero ──────────────────────────────────
    const columnas = [
        {
            key: 'pendiente_confirmacion',
            title: 'Pendientes',
            bg: '#fdecea',
            border: '#f5b7b1',
            color: '#c0392b',
            iconColor: '#e74c3c',
            emptyText: 'Sin órdenes pendientes',
            filterFunc: (o) => o.estado === 'pendiente_confirmacion',
            onAceptar: (orden) => accionEstado(orden.id, 'confirmada'),
            onCancelar: (orden) => accionEstado(orden.id, 'cancelada'),
        },
        {
            key: 'confirmada',
            title: 'Confirmadas',
            bg: '#f0f9ff',
            border: '#bae6fd',
            color: '#0c4a6e',
            iconColor: '#0ea5e9',
            emptyText: 'Sin órdenes confirmadas',
            filterFunc: (o) => o.estado === 'confirmada',
            onAceptar: () => {},
            onCancelar: () => {},
        },
        {
            key: 'en_preparacion',
            title: 'En cocina',
            bg: '#fff9e6',
            border: '#f9e79f',
            color: '#b9770e',
            iconColor: '#f1c40f',
            emptyText: 'Sin órdenes en cocina',
            filterFunc: (o) => o.estado === 'en_preparacion',
            onAceptar: () => {},
            onCancelar: () => {},
        },
        {
            key: 'lista',
            title: 'Listas',
            bg: '#ecfdf5',
            border: '#abebc6',
            color: '#1e8449',
            iconColor: '#27ae60',
            emptyText: 'Sin órdenes listas',
            filterFunc: (o) => o.estado === 'lista',
            onAceptar: () => {},
            onCancelar: () => {},
            onEntregar: (orden) => accionEstado(orden.id, 'entregada'),
        },
    ];

    // Filtrar columnas visibles basado en filtro
    const columnasVisibles = filtro === 'todos' ? columnas : columnas.filter(c => c.key === filtro);

    // Contadores por estado (para dropdown, sin filtro aplicado)
    const contar = (estado) => ordenes.filter(o => !['cancelada', 'cerrada'].includes(o.estado) && o.estado === estado).length;

    // Mostrar solo lo útil en la barra
    const filtrosVisibles = FILTROS.filter((f) =>
        f.key === 'todos' || f.key === filtro || contar(f.key) > 0
    );

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
                            <ClipboardList size={24} />
                        </div>
                        <div>
                            <h1 className="fw-bold mb-1" style={{ fontSize: '1.25rem', color: '#111827' }}>
                                RestoApp Mesero
                            </h1>
                            <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                                Sistema de gestión de pedidos en tiempo real
                            </div>
                        </div>
                    </div>

                    <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2">
                        <span
                            className="rounded-pill px-3 py-2 d-flex align-items-center gap-2"
                            style={{ background: '#eef2ff', color: '#3730a3', fontSize: '0.85rem' }}
                        >
                            <Clock size={16} /> Hora {ultimaSync ? ultimaSync.toLocaleTimeString() : 'Cargando...'}
                        </span>
                        <button
                            type="button"
                            className="btn fw-semibold d-flex align-items-center gap-2"
                            style={{ borderRadius: '9999px', borderColor: '#f97316', backgroundColor: '#ffffff', border: '2px solid #f97316', color: '#f97316' }}
                            onClick={() => setPerfilAbierto(true)}
                        >
                            <User size={16} /> Perfil
                        </button>
                        <button
                            type="button"
                            className="btn fw-semibold px-4 py-2 d-flex align-items-center gap-2"
                            style={{ borderRadius: '9999px', backgroundColor: '#f97316', borderColor: '#f97316', color: '#ffffff' }}
                            onClick={onLogout}
                        >
                            <LogOut size={16} /> Salir
                        </button>
                    </div>
                </div>

                <div className="mt-3 d-flex flex-column flex-md-row gap-2 align-items-stretch">
                    <button
                        type="button"
                        className="btn rounded-pill px-4 py-2 fw-semibold"
                        style={vista === 'pedidos' ? { borderColor: '#f97316', backgroundColor: '#f97316', color: '#ffffff', border: '2px solid #f97316' } : { borderColor: '#f97316', backgroundColor: '#ffffff', color: '#f97316', border: '2px solid #f97316' }}
                        onClick={() => setVista('pedidos')}
                    >
                        Pedidos
                    </button>
                    <button
                        type="button"
                        className="btn rounded-pill px-4 py-2 fw-semibold"
                        style={vista === 'entregadas' ? { borderColor: '#f97316', backgroundColor: '#f97316', color: '#ffffff', border: '2px solid #f97316' } : { borderColor: '#f97316', backgroundColor: '#ffffff', color: '#f97316', border: '2px solid #f97316' }}
                        onClick={() => setVista('entregadas')}
                    >
                        Historial
                    </button>

                    <div className="position-relative">
                        <button
                            type="button"
                            className="btn rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2"
                            style={{ borderColor: '#f97316', backgroundColor: '#ffffff', color: '#f97316', border: '2px solid #f97316' }}
                            onClick={() => setShowFilterMenu((v) => !v)}
                        >
                            <Clock size={16} /> Estado: {FILTROS.find((f) => f.key === filtro)?.label || 'Todos'}
                        </button>

                        {showFilterMenu && (
                            <div
                                className="shadow rounded-4"
                                style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 0.5rem)',
                                    right: 0,
                                    background: '#ffffff',
                                    border: '1px solid #e5e7eb',
                                    minWidth: 200,
                                    zIndex: 10,
                                }}
                            >
                                {FILTROS.map((f) => (
                                    <button
                                        key={f.key}
                                        type="button"
                                        className="btn w-100 text-start px-3 py-2"
                                        style={filtro === f.key ? { backgroundColor: '#f97316', color: '#ffffff' } : { backgroundColor: '#ffffff', color: '#111827' }}
                                        onClick={() => {
                                            setFiltro(f.key);
                                            setShowFilterMenu(false);
                                        }}
                                    >
                                        <div className="d-flex align-items-center justify-content-between gap-2">
                                            <span className="d-flex align-items-center gap-2">
                                                <f.Icon size={16} /> {f.label}
                                            </span>
                                            {f.key !== 'todos' && contar(f.key) > 0 && (
                                                <span className="badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                                                    {contar(f.key)}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {vista === 'entregadas' ? (
                <div className="container-fluid px-3 py-3">
                    <div className="row g-3">
                        <div className="col-12">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <History size={18} style={{ color: '#6c757d' }} />
                                <h5 className="fw-bold mb-0">Historial</h5>
                                <span className="text-muted small ms-2">{ordenes.filter(o => ['entregada', 'cancelada', 'cerrada'].includes(o.estado)).length} pedidos</span>
                            </div>
                        </div>

                        <div className="col-12">
                            {ordenes.filter(o => ['entregada', 'cancelada', 'cerrada'].includes(o.estado)).length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <p style={{ fontSize: 48 }}>📦</p>
                                    <p className="fw-semibold">No hay pedidos en el historial</p>
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {ordenes.filter(o => ['entregada', 'cancelada', 'cerrada'].includes(o.estado)).map(orden => (
                                        <div key={orden.id} className="col-12 col-md-6 col-xl-4">
                                            <OrderCard
                                                orden={orden}
                                                loading={false}
                                                onAceptar={() => {}}
                                                onCancelar={() => {}}
                                                onEntregar={() => {}}
                                                onCobrar={() => {}}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <>
            {/* ── Barra de Promo (mesero aplica código) ──── */}
            <div style={{ background: '#fff8f0', borderBottom: '1px solid #f0c080' }}>
                <div 
                    role="button"
                    style={{ padding: '0.6rem 1rem', display: 'block', width: '100%', textAlign: 'left', fontWeight: 'bold', color: '#e67e22', fontSize: '0.85rem' }}
                    onClick={() => { setPromoPanel(v => !v); setPromoMsg(null); }}
                >
                <Ticket size={16} /> Aplicar Promo {promoPanel ? '▲' : '▼'} 
                </div>
                {promoPanel && (
                    <div className="d-flex flex-wrap gap-2 align-items-center pb-2 px-3" onClick={e => e.stopPropagation()}>
                        <input
                            className="form-control form-control-sm"
                            style={{ maxWidth: 110, fontFamily: 'monospace', textTransform: 'uppercase' }}
                            placeholder="Código"
                            value={promoCodigo}
                            onChange={e => setPromoCodigo(e.target.value.toUpperCase())}
                        />
                        <select
                            className="form-select form-select-sm"
                            style={{ maxWidth: 160 }}
                            value={promoOrdenId}
                            onChange={e => setPromoOrdenId(e.target.value)}
                        >
                            <option value="">-- Selecciona orden --</option>
                            {ordenes
                                .filter(o => !['cerrada','cancelada'].includes(o.estado))
                                .map(o => (
                                    <option key={o.id} value={o.id}>
                                        #{o.id} — Mesa {o.mesaNumero ?? o.mesa?.numero ?? '?'}
                                    </option>
                                ))
                            }
                        </select>
                        <button
                            className="btn btn-sm fw-bold"
                            style={{ background: '#e67e22', color: 'white', borderRadius: '0.5rem' }}
                            disabled={!promoCodigo || !promoOrdenId}
                            onClick={async () => {
                                try {
                                    await aplicarPromocion(Number(promoOrdenId), promoCodigo);
                                    setPromoMsg({ ok: true, txt: 'Descuento aplicado con éxito' });
                                    setPromoCodigo(''); setPromoOrdenId('');
                                    await cargarOrdenes();
                                } catch (e) {
                                    setPromoMsg({ ok: false, txt: (e?.error || e?.message || 'Código inválido') });
                                }
                            }}
                        >
                            Aplicar
                        </button>
                        {promoMsg && (
                            <span style={{ fontSize: '0.8rem', color: promoMsg.ok ? '#198754' : '#dc3545', fontWeight: 600 }}>
                                {promoMsg.txt}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* ── Tablero Kanban de órdenes ─────────────────────────── */}
            <div className="container-fluid px-3 py-3">
                {sesionExpirada ? (
                    <div className="text-center py-5">
                        <p style={{ fontSize: 48 }}>🔒</p>
                        <p className="fw-bold fs-5 text-danger">Sesión expirada</p>
                        <p className="text-muted small mb-3">El servidor fue reiniciado. Vuelve a ingresar.</p>
                        <PrimaryButton
                            type="button"
                            onClick={() => window.location.reload()}
                        >
                            Reingresar
                        </PrimaryButton>
                    </div>
                ) : loading ? (
                    <div className="text-center py-5 text-muted">
                        <div className="spinner-border text-primary mb-3" />
                        <p>Cargando órdenes...</p>
                    </div>
                ) : (
                    <div className="row g-3">
                        {columnasVisibles.map((col) => {
                            const ordenesColumna = ordenesFiltradas.filter(col.filterFunc);
                            return (
                                <div key={col.key} className={`col-12 ${columnasVisibles.length === 1 ? '' : 'col-lg-3'}`}>
                                    <div className="rounded-4 p-3 h-100" style={{ background: col.bg, border: `1px solid ${col.border}`, maxHeight: 'calc(100vh - 110px)', overflowY: 'auto' }}>
                                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: col.color }}>
                                            <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: col.iconColor }} /> {col.title} ({ordenesColumna.length})
                                        </h5>
                                        {ordenesColumna.length === 0 ? (
                                            <div className="text-center text-muted py-4" style={{ color: col.color }}>
                                                {col.emptyText}
                                            </div>
                                        ) : (
                                            <div className="d-grid gap-3">
                                                {ordenesColumna.map(orden => (
                                                    <OrderCard
                                                        key={orden.id}
                                                        orden={orden}
                                                        loading={loadingId === orden.id}
                                                        onAceptar={() => col.onAceptar(orden)}
                                                        onCancelar={() => col.onCancelar(orden)}
                                                        onEntregar={() => col.onEntregar ? col.onEntregar(orden) : () => {}}
                                                        onCobrar={() => {}}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
                </>
            )}

            {perfilAbierto && (
                <PerfilModal
                    usuario={usuario}
                    onClose={() => setPerfilAbierto(false)}
                    onGuardado={() => setPerfilAbierto(false)}
                />
            )}
        </div>

    );
};

export default WaiterDashboard;
