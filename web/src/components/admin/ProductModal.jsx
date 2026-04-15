import React, { useState } from 'react';
import {
    EMPTY_NEW,
    getProductImage,
    getProductDisponibilidad,
    MAPA_COCINAS_POR_CATEGORIA,
    COCINAS,
    CATEGORIAS
} from './adminConstants';

const validate = (form) => {
    const errs = {};
    if (!form.nombre?.trim()) errs.nombre = 'El nombre del platillo es obligatorio.';
    else if (form.nombre.trim().length < 2) errs.nombre = 'El nombre debe tener al menos 2 caracteres.';

    if (!form.precio && form.precio !== 0) errs.precio = 'El precio es obligatorio.';
    else if (isNaN(Number(form.precio)) || Number(form.precio) <= 0) errs.precio = 'El precio debe ser un número positivo.';

    if (!form.categoria_id) errs.categoria_id = 'Selecciona una categoría.';

    return errs;
};

const ProductModal = ({ product, onSave, onClose, saving }) => {
    const isNew = !product?.id;
    const [form, setForm] = useState(
        product
            ? {
                ...EMPTY_NEW,
                ...product,
                imagenUrl: getProductImage(product),
                disponibilidad: getProductDisponibilidad(product),
                categoria_id: product.categoria?.id ?? product.categoria_id ?? product.categoriaId ?? 1,
                kitchen_id: product.cocina?.id ?? product.kitchen_id ?? product.kitchenId ?? 1,
            }
            : EMPTY_NEW
    );

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const set = (field, val) => {
        setForm((prev) => ({ ...prev, [field]: val }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        const errs = validate({ ...form });
        setErrors((prev) => ({ ...prev, [field]: errs[field] }));
    };

    const handleSubmit = () => {
        setTouched({ nombre: true, precio: true, categoria_id: true });
        const errs = validate(form);
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;
        onSave(form);
    };

    const handleCategoriaChange = (e) => {
        const nuevaCat = Number(e.target.value);
        const permitidas = MAPA_COCINAS_POR_CATEGORIA[nuevaCat] || COCINAS.map(c => c.id);
        let nuevaCocina = form.kitchen_id;
        if (!permitidas.includes(nuevaCocina)) nuevaCocina = permitidas[0];
        setForm(prev => ({ ...prev, categoria_id: nuevaCat, kitchen_id: nuevaCocina }));
        if (errors.categoria_id) setErrors(prev => ({ ...prev, categoria_id: undefined }));
    };

    const cocinasDisponibles = COCINAS.filter(c =>
        (MAPA_COCINAS_POR_CATEGORIA[form.categoria_id] || COCINAS.map(x => x.id)).includes(c.id)
    );

    const fieldClass = (field) =>
        `form-control ${touched[field] && errors[field] ? 'is-invalid' : touched[field] && !errors[field] && form[field] !== undefined && form[field] !== '' ? 'is-valid' : ''}`;

    const imgPreview = form.imagenUrl;

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
                        {/* Nombre */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold small">
                                Nombre <span className="text-danger">*</span>
                            </label>
                            <input
                                className={fieldClass('nombre')}
                                value={form.nombre}
                                onChange={(e) => set('nombre', e.target.value)}
                                onBlur={() => handleBlur('nombre')}
                                placeholder="Ej. Hamburguesa Doble"
                            />
                            {touched.nombre && errors.nombre && (
                                <div className="invalid-feedback d-flex align-items-center gap-1">
                                    <span>⚠</span> {errors.nombre}
                                </div>
                            )}
                        </div>

                        {/* Precio y Disponibilidad */}
                        <div className="row g-3 mb-3">
                            <div className="col-6">
                                <label className="form-label fw-semibold small">
                                    Precio ($) <span className="text-danger">*</span>
                                </label>
                                <input
                                    className={fieldClass('precio')}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={form.precio}
                                    onKeyDown={(e) => {
                                        if (['+', '-', 'e', 'E'].includes(e.key)) e.preventDefault();
                                    }}
                                    onChange={(e) => set('precio', e.target.value)}
                                    onBlur={() => handleBlur('precio')}
                                    placeholder="0.00"
                                />
                                {touched.precio && errors.precio && (
                                    <div className="invalid-feedback d-flex align-items-center gap-1">
                                        <span>⚠</span> {errors.precio}
                                    </div>
                                )}
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

                        {/* Categoría y Cocina */}
                        <div className="row g-3 mb-3">
                            <div className="col-6">
                                <label className="form-label fw-semibold small">
                                    Categoría <span className="text-danger">*</span>
                                </label>
                                <select
                                    className={`form-select ${touched.categoria_id && errors.categoria_id ? 'is-invalid' : ''}`}
                                    value={form.categoria_id}
                                    onChange={handleCategoriaChange}
                                    onBlur={() => handleBlur('categoria_id')}
                                >
                                    {CATEGORIAS.map((c) => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))}
                                </select>
                                {touched.categoria_id && errors.categoria_id && (
                                    <div className="invalid-feedback d-flex align-items-center gap-1">
                                        <span>⚠</span> {errors.categoria_id}
                                    </div>
                                )}
                            </div>
                            <div className="col-6">
                                <label className="form-label fw-semibold small">Cocina</label>
                                <select
                                    className="form-select"
                                    value={form.kitchen_id}
                                    onChange={(e) => set('kitchen_id', Number(e.target.value))}
                                >
                                    {cocinasDisponibles.map((c) => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Descripción */}
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

                        {/* URL Imagen */}
                        <div className="mb-1">
                            <label className="form-label fw-semibold small">URL Imagen</label>
                            <input
                                className="form-control form-control-sm"
                                value={form.imagenUrl || ''}
                                onChange={(e) => set('imagenUrl', e.target.value)}
                                placeholder="https://..."
                            />
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
                            onClick={handleSubmit}
                            disabled={saving}
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
