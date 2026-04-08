import React, { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import OrderCard from './OrderCard';
import HamburgerMenu from '../shared/HamburgerMenu';

const FILTROS = [
    { key: 'todos', label: 'Todos', icono: '📋' },
    { key: 'pendiente_confirmacion', label: 'Pendientes', icono: '🕐' },
    { key: 'confirmada', label: 'Confirmadas', icono: '✅' },
    { key: 'en_preparacion', label: 'En cocina', icono: '👨‍🍳' },
    { key: 'lista', label: 'Listas', icono: '🍽️' },
    { key: 'entregada', label: 'Entregadas', icono: '🤝' },
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
            setOrdenes(data);
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

    return (
        <div className="min-vh-100" style={{ background: '#f8f9fa' }}>

            {/* ── Header ──────────────────────────────────── */}
            <header
                className="sticky-top shadow-sm"
                style={{ background: 'linear-gradient(90deg, #1a1a2e, #0f3460)', zIndex: 100 }}
            >
                <div className="container-fluid px-3 py-2 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                        <span className="fs-5">🧑‍🍽️</span>
                        <div>
                            <div className="fw-bold text-white lh-1" style={{ fontSize: '0.95rem' }}>
                                Panel Mesero
                            </div>
                            <div className="text-white-50" style={{ fontSize: '0.72rem' }}>
                                {usuario?.nombre}
                            </div>
                        </div>
                        {pendientes > 0 && (
                            <span
                                className="badge rounded-pill ms-2 fw-bold"
                                style={{ background: '#e67e22', fontSize: '0.75rem' }}
                            >
                                {pendientes} nuevos
                            </span>
                        )}
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        {ultimaSync && (
                            <span className="text-white-50 d-none d-md-inline" style={{ fontSize: '0.7rem' }}>
                                🔄 {ultimaSync.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                        )}
                        <HamburgerMenu
                            loginPath="/login"
                            accentColor="#e67e22"
                            onLogout={onLogout}
                        />
                    </div>
                </div>
            </header>

            {/* ── Filtros ─────────────────────────────────── */}
            <div
                className="border-bottom bg-white px-3 py-2"
                style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
            >
                <div className="d-inline-flex gap-2">
                    {FILTROS.map(f => (
                        <button
                            key={f.key}
                            className={`btn btn-sm ${filtro === f.key ? 'btn-primary' : 'btn-outline-secondary'}`}
                            style={{ borderRadius: '2rem', fontSize: '0.8rem' }}
                            onClick={() => setFiltro(f.key)}
                        >
                            {f.icono} {f.label}
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
                                    setPromoMsg({ ok: true, txt: '✅ Descuento aplicado con éxito' });
                                    setPromoCodigo(''); setPromoOrdenId('');
                                    await cargarOrdenes();
                                } catch (e) {
                                    setPromoMsg({ ok: false, txt: '❌ ' + (e?.error || e?.message || 'Código inválido') });
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
                        <button
                            className="btn btn-primary"
                            onClick={() => window.location.reload()}
                        >
                            Reingresar
                        </button>
                    </div>
                ) : loading ? (
                    <div className="text-center py-5 text-muted">
                        <div className="spinner-border text-primary mb-3" />
                        <p>Cargando órdenes...</p>
                    </div>
                ) : ordenesFiltradas.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <p style={{ fontSize: 56 }}>🎉</p>
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
        </div>
    );
};

export default WaiterDashboard;
