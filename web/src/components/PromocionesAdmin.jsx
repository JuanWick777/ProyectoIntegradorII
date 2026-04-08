import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

const EMPTY_PROMO = {
    titulo: '',
    descripcion: '',
    tipoDescuento: 'PORCENTAJE',
    valorDescuento: '',
    codigoPromo: '',
    activa: true,
    fechaInicio: '',
    fechaFin: '',
};

const PromoModal = ({ promo, onSave, onClose, saving }) => {
    const isNew = !promo?.id;
    const [form, setForm] = useState(promo ? { ...EMPTY_PROMO, ...promo } : EMPTY_PROMO);
    const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    return (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.55)' }} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1.25rem' }}>
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">
                            {isNew ? '🏷️ Nueva Promoción' : '✏️ Editar Promoción'}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose} />
                    </div>
                    <div className="modal-body pt-2">
                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Título *</label>
                            <input
                                className="form-control"
                                value={form.titulo}
                                onChange={e => set('titulo', e.target.value)}
                                placeholder="Ej. Promo del día"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Descripción</label>
                            <textarea
                                className="form-control"
                                rows={2}
                                value={form.descripcion}
                                onChange={e => set('descripcion', e.target.value)}
                                placeholder="Detalles visibles para el cliente..."
                            />
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-6">
                                <label className="form-label fw-semibold small">Tipo de descuento</label>
                                <select
                                    className="form-select"
                                    value={form.tipoDescuento}
                                    onChange={e => set('tipoDescuento', e.target.value)}
                                >
                                    <option value="PORCENTAJE">% Porcentaje</option>
                                    <option value="MONTO_FIJO">$ Monto fijo</option>
                                </select>
                            </div>
                            <div className="col-6">
                                <label className="form-label fw-semibold small">
                                    Valor {form.tipoDescuento === 'PORCENTAJE' ? '(%)' : '($)'}
                                </label>
                                <input
                                    className="form-control"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={form.valorDescuento}
                                    onChange={e => set('valorDescuento', e.target.value)}
                                    placeholder="Ej. 10"
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Código (opcional)</label>
                            <input
                                className="form-control"
                                value={form.codigoPromo}
                                onChange={e => set('codigoPromo', e.target.value.toUpperCase())}
                                placeholder="Ej. PROMO10"
                                style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}
                            />
                            <div className="form-text">Si no tiene código, la promo es informativa (el mesero la aplica manualmente).</div>
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-6">
                                <label className="form-label fw-semibold small">Fecha inicio</label>
                                <input type="date" className="form-control"
                                    value={form.fechaInicio || ''} onChange={e => set('fechaInicio', e.target.value)} />
                            </div>
                            <div className="col-6">
                                <label className="form-label fw-semibold small">Fecha fin</label>
                                <input type="date" className="form-control"
                                    value={form.fechaFin || ''} onChange={e => set('fechaFin', e.target.value)} />
                            </div>
                        </div>

                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="promoActiva"
                                checked={form.activa}
                                onChange={e => set('activa', e.target.checked)}
                            />
                            <label className="form-check-label fw-semibold small" htmlFor="promoActiva">
                                Promoción activa
                            </label>
                        </div>
                    </div>
                    <div className="modal-footer border-0 pt-0">
                        <button className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancelar</button>
                        <button
                            className="btn fw-bold px-4"
                            style={{ background: '#e67e22', color: 'white', borderRadius: '0.75rem' }}
                            onClick={() => onSave(form)}
                            disabled={saving || !form.titulo || !form.valorDescuento}
                        >
                            {saving
                                ? <><span className="spinner-border spinner-border-sm me-2" />Guardando...</>
                                : isNew ? '➕ Crear' : '💾 Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TIPO_BADGE = {
    PORCENTAJE: { color: '#0d6efd', label: '% OFF' },
    MONTO_FIJO: { color: '#198754', label: '$ OFF' },
};

const PromocionesAdmin = ({ mostrarToast }) => {
    const { fetchAdminPromociones, createPromocion, updatePromocion, deletePromocion } = useAppStore();
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [saving, setSaving] = useState(false);

    const cargar = async () => {
        setLoading(true);
        try {
            const data = await fetchAdminPromociones();
            setPromos(data || []);
        } catch {
            mostrarToast('❌ Error al cargar promociones');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargar(); }, []);

    const handleSave = async (form) => {
        setSaving(true);
        try {
            const payload = {
                ...form,
                valorDescuento: parseFloat(form.valorDescuento) || 0,
                codigoPromo: form.codigoPromo || null,
                fechaInicio: form.fechaInicio || null,
                fechaFin: form.fechaFin || null,
            };
            if (form.id) {
                await updatePromocion(form.id, payload);
                mostrarToast('✅ Promoción actualizada');
            } else {
                await createPromocion(payload);
                mostrarToast('✅ Promoción creada');
            }
            setModal(null);
            await cargar();
        } catch {
            mostrarToast('❌ Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar esta promoción?')) return;
        await deletePromocion(id);
        mostrarToast('🗑️ Promoción eliminada');
        await cargar();
    };

    return (
        <div>
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h2 className="fw-bold mb-0">🏷️ Gestión de Promociones</h2>
                    <p className="text-muted small mb-0">
                        El mesero puede aplicar el código en el pedido del cliente
                    </p>
                </div>
                <button
                    className="btn fw-bold px-4"
                    style={{ background: '#e67e22', color: 'white', borderRadius: '2rem' }}
                    onClick={() => setModal({})}
                >
                    ➕ Nueva Promoción
                </button>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border" style={{ color: '#e67e22' }} />
                </div>
            ) : promos.length === 0 ? (
                <div
                    className="text-center py-5 rounded-4"
                    style={{ background: '#fff', border: '2px dashed #dee2e6' }}
                >
                    <div style={{ fontSize: 48 }}>🏷️</div>
                    <p className="text-muted mt-2">No hay promociones. ¡Crea la primera!</p>
                </div>
            ) : (
                <div className="row g-3">
                    {promos.map(p => {
                        const badge = TIPO_BADGE[p.tipoDescuento] || TIPO_BADGE.PORCENTAJE;
                        return (
                            <div key={p.id} className="col-12 col-md-6 col-xl-4">
                                <div
                                    className="card border-0 shadow-sm h-100"
                                    style={{
                                        borderRadius: '1rem',
                                        borderLeft: `5px solid ${p.activa ? badge.color : '#adb5bd'}`,
                                        opacity: p.activa ? 1 : 0.65,
                                    }}
                                >
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h6 className="fw-bold mb-0">{p.titulo}</h6>
                                            <span
                                                className="badge"
                                                style={{ background: badge.color, fontSize: '0.78rem' }}
                                            >
                                                {p.tipoDescuento === 'PORCENTAJE'
                                                    ? `${p.valorDescuento}% OFF`
                                                    : `$${p.valorDescuento} OFF`}
                                            </span>
                                        </div>

                                        {p.descripcion && (
                                            <p className="text-muted small mb-2">{p.descripcion}</p>
                                        )}

                                        {p.codigoPromo && (
                                            <div
                                                className="mb-2 px-2 py-1 rounded-2 d-inline-flex align-items-center gap-1"
                                                style={{ background: '#f8f9fa', border: '1px solid #dee2e6' }}
                                            >
                                                <span style={{ fontSize: '0.7rem', color: '#6c757d' }}>Código:</span>
                                                <span
                                                    className="fw-bold"
                                                    style={{ fontFamily: 'monospace', fontSize: '0.85rem', letterSpacing: '0.05em' }}
                                                >
                                                    {p.codigoPromo}
                                                </span>
                                            </div>
                                        )}

                                        <div className="d-flex align-items-center justify-content-between mt-3">
                                            <span
                                                className="badge"
                                                style={{
                                                    background: p.activa ? 'rgba(25,135,84,0.15)' : 'rgba(173,181,189,0.3)',
                                                    color: p.activa ? '#198754' : '#6c757d',
                                                }}
                                            >
                                                {p.activa ? '● Activa' : '○ Inactiva'}
                                            </span>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-sm btn-outline-secondary"
                                                    style={{ borderRadius: '0.5rem' }}
                                                    onClick={() => setModal(p)}
                                                >✏️</button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    style={{ borderRadius: '0.5rem' }}
                                                    onClick={() => handleDelete(p.id)}
                                                >🗑️</button>
                                            </div>
                                        </div>

                                        {(p.fechaInicio || p.fechaFin) && (
                                            <div className="mt-2" style={{ fontSize: '0.72rem', color: '#6c757d' }}>
                                                📅 {p.fechaInicio || '?'} → {p.fechaFin || 'Sin fin'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {modal !== null && (
                <PromoModal
                    promo={modal}
                    onSave={handleSave}
                    onClose={() => setModal(null)}
                    saving={saving}
                />
            )}
        </div>
    );
};

export default PromocionesAdmin;
