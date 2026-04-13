import React, { useState, useEffect } from 'react';
import { Tag, Edit2, Plus, Save, Trash2, AlertTriangle, Check } from 'lucide-react';
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
                        <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                            {isNew ? <><Tag size={20} /> Nueva Promoción</> : <><Edit2 size={20} /> Editar Promoción</>}
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
                            className="btn fw-bold px-4 d-flex align-items-center gap-2"
                            style={{ background: '#e67e22', color: 'white', borderRadius: '0.75rem' }}
                            onClick={() => onSave(form)}
                            disabled={saving || !form.titulo?.trim() || !form.valorDescuento || Number(form.valorDescuento) <= 0}
                        >
                            {saving
                                ? <><span className="spinner-border spinner-border-sm" />Guardando...</>
                                : isNew ? <><Plus size={18} /> Crear</> : <><Save size={18} /> Guardar</>}
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
    const [confirmDel, setConfirmDel] = useState(null);

    const cargar = async () => {
        setLoading(true);
        try {
            const data = await fetchAdminPromociones();
            setPromos(data || []);
        } catch {
            mostrarToast('Error al cargar promociones');
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
                mostrarToast('Promoción actualizada');
            } else {
                await createPromocion(payload);
                mostrarToast('Promoción creada');
            }
            setModal(null);
            await cargar();
        } catch {
            mostrarToast('Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const promo = promos.find(p => p.id === id) || { id, titulo: 'esta promoción' };
        setConfirmDel(promo);
    };

    const confirmarEliminar = async () => {
        if (!confirmDel) return;
        await deletePromocion(confirmDel.id);
        mostrarToast('Promoción eliminada');
        setConfirmDel(null);
        await cargar();
    };

    return (
        <div className="bg-white rounded-4 shadow-sm p-4">
            <SectionHeader
                title="Gestión de Promociones"
                subtitle="El mesero puede aplicar el código en el pedido del cliente"
                actions={(
                    <button
                        className="btn btn-primary fw-bold px-4 shadow-sm d-flex align-items-center gap-2"
                        style={{ borderRadius: '2rem' }}
                        onClick={() => setModal({})}
                    >
                        <Plus size={18} />Nueva Promoción
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
                    <Tag size={48} className="mx-auto mb-3" style={{ color: '#a8a9ad' }} />
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

            {confirmDel && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.35)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-sm">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1.5rem', overflow: 'hidden' }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #fff4e6 0%, #fff7f0 100%)',
                                padding: '1.6rem 1.4rem',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: '50%',
                                    background: 'rgba(255, 221, 178, 0.45)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 14,
                                }}>
                                    <AlertTriangle size={28} className="text-warning" />
                                </div>
                                <h5 className="fw-bold mb-2">¿Eliminar promoción?</h5>
                                <p className="text-muted small mb-0">Esta acción no se puede deshacer.</p>
                            </div>
                            <div className="p-4">
                                <div className="text-center mb-3">
                                    <div className="fw-semibold">{confirmDel.titulo}</div>
                                    <div className="text-muted small">Se borrará definitivamente esta promoción.</div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-outline-secondary flex-fill"
                                        style={{ borderRadius: '0.85rem', padding: '0.9rem 1rem' }}
                                        onClick={() => setConfirmDel(null)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        className="btn btn-danger flex-fill fw-bold"
                                        style={{ borderRadius: '0.85rem', padding: '0.9rem 1rem' }}
                                        onClick={confirmarEliminar}
                                    >
                                        Sí, eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromocionesAdmin;
