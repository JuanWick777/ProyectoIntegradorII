import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import SectionHeader from './ui/SectionHeader';
import PromoCard from './ui/PromoCard';

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
                                    Valor {form.tipoDescuento === 'PORCENTAJE' ? '(%)' : '($)'} *
                                </label>
                                <input
                                    className="form-control"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={form.valorDescuento}
                                    onKeyDown={(e) => {
                                        if (['+', '-', 'e', 'E'].includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
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
                                onKeyDown={(e) => {
                                    if (['+', '-'].includes(e.key)) e.preventDefault();
                                }}
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
                            disabled={saving || !form.titulo?.trim() || !form.valorDescuento || Number(form.valorDescuento) <= 0}
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
        <div className="bg-white rounded-4 shadow-sm p-4">
            <SectionHeader
                title="🏷️ Gestión de Promociones"
                subtitle="El mesero puede aplicar el código en el pedido del cliente"
                actions={(
                    <button
                        className="btn btn-primary fw-bold px-4 shadow-sm"
                        style={{ borderRadius: '2rem' }}
                        onClick={() => setModal({})}
                    >
                        <i className="bi bi-plus-circle me-2"></i>Nueva Promoción
                    </button>
                )}
            />

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" />
                </div>
            ) : promos.length === 0 ? (
                <div
                    className="text-center py-5 rounded-4 border border-dashed border-secondary"
                    style={{ background: '#fafafa', borderStyle: 'dashed' }}
                >
                    <div style={{ fontSize: 48 }}>🏷️</div>
                    <p className="text-muted mt-2">No hay promociones. ¡Crea la primera!</p>
                </div>
            ) : (
                <div className="row g-3">
                    {promos.map(p => (
                        <PromoCard
                            key={p.id}
                            promo={p}
                            onEdit={setModal}
                            onDelete={handleDelete}
                        />
                    ))}
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
