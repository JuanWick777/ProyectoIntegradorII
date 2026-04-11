import React, { useMemo, useState } from 'react';
import {
    EMPTY_NEW,
    getProductImage,
    getProductDisponibilidad,
    MAPA_COCINAS_POR_CATEGORIA,
    COCINAS,
    CATEGORIAS
} from './adminConstants';

const ProductModal = ({ product, onSave, onClose, saving }) => {
    const isNew = !product?.id;
    const [form, setForm] = useState(
        product
            ? {
                ...EMPTY_NEW,
                ...product,
                imagenUrl: getProductImage(product),
                imagenFile: null,
                imagenRemoved: false,
                disponibilidad: getProductDisponibilidad(product),
                categoria_id: product.categoria?.id ?? product.categoria_id ?? product.categoriaId ?? EMPTY_NEW.categoria_id,
                kitchen_id: product.cocina?.id ?? product.kitchen_id ?? product.kitchenId ?? EMPTY_NEW.kitchen_id,
            }
            : EMPTY_NEW
    );

    const set = (field, val) => setForm((prev) => ({ ...prev, [field]: val }));
    const imgPreview = useMemo(() => {
        if (form.imagenFile instanceof File) {
            return URL.createObjectURL(form.imagenFile);
        }
        return form.imagenUrl;
    }, [form.imagenFile, form.imagenUrl]);

    const handleCategoriaChange = (e) => {
        const nuevaCat = Number(e.target.value);
        const permitidas = MAPA_COCINAS_POR_CATEGORIA[nuevaCat] || COCINAS.map(c => c.id);

        let nuevaCocina = form.kitchen_id;
        if (!permitidas.includes(nuevaCocina)) {
            nuevaCocina = permitidas[0];
        }

        setForm(prev => ({
            ...prev,
            categoria_id: nuevaCat,
            kitchen_id: nuevaCocina
        }));
    };

    const cocinasDisponibles = COCINAS.filter(c =>
        (MAPA_COCINAS_POR_CATEGORIA[form.categoria_id] || COCINAS.map(x => x.id)).includes(c.id)
    );

    return (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.55)' }} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1.25rem' }}>
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">
                            {isNew ? '➕ Nuevo Platillo' : '✏️ Editar Platillo'}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose} />
                    </div>

                    <div className="modal-body pt-2">
                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Nombre *</label>
                            <input
                                className="form-control"
                                value={form.nombre}
                                onChange={(e) => set('nombre', e.target.value)}
                                placeholder="Ej. Hamburguesa Doble"
                            />
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-6">
                                <label className="form-label fw-semibold small">Precio ($) *</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    step="0.01"
                                    value={form.precio}
                                    onChange={(e) => set('precio', e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="col-6">
                                <label className="form-label fw-semibold small">Disponibilidad</label>
                                <select
                                    className="form-select"
                                    value={form.disponibilidad}
                                    onChange={(e) => set('disponibilidad', e.target.value)}
                                >
                                    <option value="DISPONIBLE">🟢 Disponible</option>
                                    <option value="AGOTADO">🔴 Agotado</option>
                                </select>
                            </div>
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-6">
                                <label className="form-label fw-semibold small">Categoría</label>
                                <select
                                    className="form-select"
                                    value={form.categoria_id}
                                    onChange={handleCategoriaChange}
                                >
                                    {CATEGORIAS.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-6">
                                <label className="form-label fw-semibold small">Cocina</label>
                                <select
                                    className="form-select"
                                    value={form.kitchen_id}
                                    onChange={(e) => set('kitchen_id', Number(e.target.value))}
                                >
                                    {cocinasDisponibles.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Descripción</label>
                            <textarea
                                className="form-control"
                                rows="2"
                                value={form.descripcion}
                                onChange={(e) => set('descripcion', e.target.value)}
                                placeholder="Ingredientes, detalles..."
                            />
                        </div>

                        <div className="mb-1">
                            <label className="form-label fw-semibold small">Imagen</label>
                            <input
                                className="form-control form-control-sm"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const f = e.target.files?.[0] || null;
                                    setForm((prev) => ({
                                        ...prev,
                                        imagenFile: f,
                                        imagenRemoved: false,
                                        imagenUrl: prev.imagenUrl
                                    }));
                                }}
                            />
                            <div className="d-flex gap-2 mt-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => setForm((prev) => ({ ...prev, imagenFile: null }))}
                                    disabled={saving}
                                >
                                    Quitar selección
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => setForm((prev) => ({
                                        ...prev,
                                        imagenFile: null,
                                        imagenRemoved: true,
                                        imagenUrl: null
                                    }))}
                                    disabled={saving || (!form.imagenUrl && !(form.imagenFile instanceof File))}
                                >
                                    Eliminar imagen
                                </button>
                            </div>
                            {imgPreview && (
                                <img
                                    src={imgPreview}
                                    alt="preview"
                                    style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: '0.5rem', marginTop: 6 }}
                                    onError={e => e.target.style.display = 'none'}
                                />
                            )}
                        </div>
                    </div>

                    <div className="modal-footer border-0 pt-0">
                        <button className="btn btn-secondary" onClick={onClose} disabled={saving}>
                            Cancelar
                        </button>
                        <button
                            className="btn btn-primary fw-bold px-4"
                            style={{ borderRadius: '0.75rem' }}
                            onClick={() => onSave(form)}
                            disabled={saving || !form.nombre?.trim() || !form.precio || Number(form.precio) <= 0}
                        >
                            {saving ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Guardando...
                                </>
                            ) : isNew ? '➕ Crear' : '💾 Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
