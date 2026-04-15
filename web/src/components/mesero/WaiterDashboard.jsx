import React, { useState, useEffect, useCallback } from 'react';
import { ClipboardList, Clock, CheckCircle, ChefHat, UtensilsCrossed, Handshake, RefreshCw, User, Check, AlertTriangle, History, LogOut } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import OrderCard from './OrderCard';
import HamburgerMenu from '../shared/HamburgerMenu';
import { PrimaryButton, SecondaryButton } from '../ui/Button';
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
            // Seguridad: las canceladas no deben mostrarse en el dashboard
            setOrdenes((data || []).filter(o => o?.estado !== 'cancelada'));
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
    const ordenesFiltradas = filtro === 'todos'
        ? ordenes
        : ordenes.filter(o => o.estado === filtro);

    // Contadores por estado
    const contar = (estado) => ordenes.filter(o => o.estado === estado).length;
    const pendientes = contar('pendiente_confirmacion');

    // Mostrar solo lo útil en la barra, el resto al menú
    const filtrosVisibles = FILTROS.filter((f) =>
        f.key === 'todos' || f.key === filtro || contar(f.key) > 0
    );
    const filtrosOcultos = FILTROS.filter((f) => !filtrosVisibles.some((v) => v.key === f.key));
    const navItemsFiltrosOcultos = filtrosOcultos.map((f) => ({
        id: f.key,
        icon: <f.Icon size={18} />,
        label: `${f.label}${contar(f.key) > 0 ? ` (${contar(f.key)})` : ''}`,
    }));

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
                            <Clock size={16} /> Turno: Mañana
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

                <div className="mt-3 d-flex flex-wrap align-items-center gap-2">
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
                        Entregadas
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

            {vista === 'historial' ? (
                <div className="container-fluid px-3 py-3">
                    <div className="row g-3">
                        <div className="col-12">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <History size={18} style={{ color: '#6c757d' }} />
                                <h5 className="fw-bold mb-0">Historial de pedidos</h5>
                                <span className="text-muted small ms-2">{ordenes.filter(o => ['cerrada', 'entregada'].includes(o.estado)).length} pedidos</span>
                            </div>
                        </div>

                        <div className="col-12">
                            {ordenes.filter(o => ['cerrada', 'entregada'].includes(o.estado)).length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <p style={{ fontSize: 48 }}>📦</p>
                                    <p className="fw-semibold">Sin historial por ahora</p>
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {ordenes.filter(o => ['cerrada', 'entregada'].includes(o.estado)).map(orden => (
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
            ) : vista === 'entregadas' ? (
                <div className="container-fluid px-3 py-3">
                    <div className="row g-3">
                        <div className="col-12">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <History size={18} style={{ color: '#6c757d' }} />
                                <h5 className="fw-bold mb-0">Entregadas</h5>
                                <span className="text-muted small ms-2">{ordenes.filter(o => o.estado === 'entregada').length} pedidos</span>
                            </div>
                        </div>

                        <div className="col-12">
                            {ordenes.filter(o => o.estado === 'entregada').length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <p style={{ fontSize: 48 }}>📦</p>
                                    <p className="fw-semibold">No hay entregas recientes</p>
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {ordenes.filter(o => o.estado === 'entregada').map(orden => (
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
            {/* ── Filtros ─────────────────────────────────── */}
            <div
                className="border-bottom bg-white px-3 py-2"
                style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
            >
                <div className="d-inline-flex gap-2">
                    {filtrosVisibles.map(f => (
                        <button
                            key={f.key}
                            className={`btn btn-sm btn-filter ${filtro === f.key ? 'active-filter' : ''} d-flex align-items-center gap-1`}
                            style={{ fontSize: '0.8rem' }}
                            onClick={() => setFiltro(f.key)}
                        >
                            <f.Icon size={16} /> {f.label}
                            {f.key !== 'todos' && contar(f.key) > 0 && (
                                <span className="badge rounded-pill bg-danger ms-1" style={{ fontSize: '0.65rem' }}>
                                    {contar(f.key)}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Barra de Promo (mesero aplica código) ──── */}
            <div style={{ background: '#fff8f0', borderBottom: '1px solid #f0c080' }}>
                <div 
                    role="button"
                    style={{ padding: '0.6rem 1rem', display: 'block', width: '100%', textAlign: 'left', fontWeight: 'bold', color: '#e67e22', fontSize: '0.85rem' }}
                    onClick={() => { setPromoPanel(v => !v); setPromoMsg(null); }}
                >
                    {promoPanel ? '▲' : '▼'} 🏷️ Aplicar Promo
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

            {/* ── Grid de órdenes ─────────────────────────── */}
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
                ) : ordenesFiltradas.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <UtensilsCrossed size={56} className="mx-auto mb-3" style={{ color: '#a8a9ad' }} />
                        <p className="fw-semibold fs-5">Sin órdenes {filtro !== 'todos' ? 'en este estado' : 'activas'}</p>
                        <p className="small">Las nuevas órdenes aparecerán automáticamente.</p>
                    </div>
                ) : (
                    <div className="row g-3">
                        {ordenesFiltradas.map(orden => (
                            <div key={orden.id} className="col-12 col-md-6 col-xl-4">
                                <OrderCard
                                    orden={orden}
                                    loading={loadingId === orden.id}
                                    onAceptar={() => accionEstado(orden.id, 'confirmada')}
                                    onCancelar={() => accionEstado(orden.id, 'cancelada')}
                                    onEntregar={() => accionEstado(orden.id, 'entregada')}
                                    onCobrar={() => accionEstado(orden.id, 'cerrada')}
                                />
                            </div>
                        ))}
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
