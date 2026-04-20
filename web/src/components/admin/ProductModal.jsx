import React, { useMemo, useState } from 'react';
import {
    EMPTY_NEW,
    getProductDisponibilidad,
    getProductImage,
} from './adminConstants';

const MAX_NOMBRE_LENGTH = 150;
const MAX_DESCRIPCION_LENGTH = 500;
const MAX_PRECIO = 999999.99;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const getStoredImagePath = (p) =>
    p?.urlImagen ?? p?.url_imagen ?? p?.imagen_url ?? p?.imagenUrl ?? '';

const validate = (form) => {
    const errs = {};

    if (!form.nombre?.trim()) errs.nombre = 'El nombre del platillo es obligatorio.';
    else if (form.nombre.trim().length < 2) errs.nombre = 'El nombre debe tener al menos 2 caracteres.';
    else if (form.nombre.trim().length > MAX_NOMBRE_LENGTH) errs.nombre = `El nombre no puede exceder ${MAX_NOMBRE_LENGTH} caracteres.`;

    if (!form.precio && form.precio !== 0) errs.precio = 'El precio es obligatorio.';
    else if (Number.isNaN(Number(form.precio)) || Number(form.precio) <= 0) errs.precio = 'El precio debe ser un numero positivo.';
    else if (Number(form.precio) > MAX_PRECIO) errs.precio = `El precio no puede ser mayor a ${MAX_PRECIO}.`;

    if (!form.categoria_id) errs.categoria_id = 'Selecciona una categoria.';

    if ((form.descripcion || '').trim().length > MAX_DESCRIPCION_LENGTH) {
        errs.descripcion = `La descripcion no puede exceder ${MAX_DESCRIPCION_LENGTH} caracteres.`;
    }

    if (form.imagenFile instanceof File) {
        if (!form.imagenFile.type.startsWith('image/')) {
            errs.imagenFile = 'Selecciona un archivo de imagen valido.';
        } else if (form.imagenFile.size > MAX_IMAGE_SIZE) {
            errs.imagenFile = 'La imagen no puede superar 5 MB.';
        }
    }

    return errs;
};

const ProductModal = ({ product, onSave, onClose, saving, categorias = [] }) => {
    const isNew = !product?.id;
    const [form, setForm] = useState(
        product
            ? {
                ...EMPTY_NEW,
                ...product,
                imagenUrl: getStoredImagePath(product),
                imagenFile: null,
                imagenRemoved: false,
                disponibilidad: getProductDisponibilidad(product),
                categoria_id: product.categoria?.id ?? product.categoria_id ?? product.categoriaId ?? '',
            }
            : {
                ...EMPTY_NEW,
                categoria_id: categorias?.[0]?.id ?? '',
            }
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
        if (saving) return;
        setTouched({
            nombre: true,
            precio: true,
            categoria_id: true,
            descripcion: true,
            imagenFile: true,
        });
        const errs = validate(form);
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        onSave({
            ...form,
            nombre: form.nombre.trim(),
            descripcion: (form.descripcion || '').trim(),
            precio: String(form.precio).trim(),
        });
    };

    const handleCategoriaChange = (e) => {
        const value = e.target.value;
        set('categoria_id', value ? Number(value) : '');
    };

    const fieldClass = (field) =>
        `form-control ${touched[field] && errors[field] ? 'is-invalid' : touched[field] && !errors[field] && form[field] !== undefined && form[field] !== '' ? 'is-valid' : ''}`;

    const imgPreview = useMemo(() => {
        if (form.imagenFile instanceof File) {
            return URL.createObjectURL(form.imagenFile);
        }
        return getProductImage({ imagenUrl: form.imagenUrl });
    }, [form.imagenFile, form.imagenUrl]);

    return (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.55)' }} onClick={saving ? undefined : onClose}>
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1.25rem' }}>
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">
                            {isNew ? 'Nuevo Platillo' : 'Editar Platillo'}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose} disabled={saving} />
                    </div>

                    <div className="modal-body pt-2">
                        <div className="mb-3">
                            <label className="form-label fw-semibold small">
                                Nombre <span className="text-danger">*</span>
                            </label>
                            <input
                                className={fieldClass('nombre')}
                                value={form.nombre}
                                maxLength={MAX_NOMBRE_LENGTH}
                                onChange={(e) => set('nombre', e.target.value.slice(0, MAX_NOMBRE_LENGTH))}
                                onBlur={() => handleBlur('nombre')}
                                placeholder="Ej. Hamburguesa Doble"
                                disabled={saving}
                            />
                            {touched.nombre && errors.nombre && (
                                <div className="invalid-feedback">{errors.nombre}</div>
                            )}
                        </div>

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
                                    disabled={saving}
                                />
                                {touched.precio && errors.precio && (
                                    <div className="invalid-feedback">{errors.precio}</div>
                                )}
                            </div>
                            <div className="col-6">
                                <label className="form-label fw-semibold small">Estado</label>
                                <select
                                    className="form-select"
                                    value={form.disponibilidad}
                                    onChange={(e) => set('disponibilidad', e.target.value)}
                                    disabled={saving}
                                >
                                    <option value="DISPONIBLE">Disponible</option>
                                    <option value="AGOTADO">Agotado</option>
                                    <option value="INACTIVO">Inactivo</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold small">
                                Categoria <span className="text-danger">*</span>
                            </label>
                            <select
                                className={`form-select ${touched.categoria_id && errors.categoria_id ? 'is-invalid' : ''}`}
                                value={form.categoria_id}
                                onChange={handleCategoriaChange}
                                onBlur={() => handleBlur('categoria_id')}
                                disabled={saving}
                            >
                                <option value="">Selecciona una categoria</option>
                                {categorias.map((c) => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>
                            {touched.categoria_id && errors.categoria_id && (
                                <div className="invalid-feedback">{errors.categoria_id}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Descripcion</label>
                            <textarea
                                className={`form-control ${touched.descripcion && errors.descripcion ? 'is-invalid' : ''}`}
                                rows="2"
                                value={form.descripcion}
                                maxLength={MAX_DESCRIPCION_LENGTH}
                                onChange={(e) => set('descripcion', e.target.value.slice(0, MAX_DESCRIPCION_LENGTH))}
                                onBlur={() => handleBlur('descripcion')}
                                placeholder="Ingredientes, detalles..."
                                disabled={saving}
                            />
                            {touched.descripcion && errors.descripcion && (
                                <div className="invalid-feedback">{errors.descripcion}</div>
                            )}
                            <div className="form-text text-end">{(form.descripcion || '').length}/{MAX_DESCRIPCION_LENGTH}</div>
                        </div>

                        <div className="mb-1">
                            <label className="form-label fw-semibold small">Imagen</label>
                            <input
                                className="form-control form-control-sm"
                                type="file"
                                accept="image/png,image/jpeg,image/webp,image/gif"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    const nextForm = {
                                        ...form,
                                        imagenFile: file,
                                        imagenRemoved: false,
                                    };
                                    setForm(nextForm);
                                    setTouched((prev) => ({ ...prev, imagenFile: true }));
                                    const nextErrors = validate(nextForm);
                                    setErrors((prev) => ({ ...prev, imagenFile: nextErrors.imagenFile }));
                                }}
                                disabled={saving}
                            />
                            {touched.imagenFile && errors.imagenFile && (
                                <div className="text-danger small mt-2">{errors.imagenFile}</div>
                            )}

                            <div className="d-flex gap-2 mt-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => setForm((prev) => ({ ...prev, imagenFile: null }))}
                                    disabled={saving || !(form.imagenFile instanceof File)}
                                >
                                    Quitar seleccion
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => setForm((prev) => ({
                                        ...prev,
                                        imagenFile: null,
                                        imagenRemoved: true,
                                        imagenUrl: null,
                                    }))}
                                    disabled={saving || (!form.imagenUrl && !(form.imagenFile instanceof File))}
                                >
                                    Eliminar imagen
                                </button>
                            </div>

                            {imgPreview && !form.imagenRemoved && (
                                <img
                                    src={imgPreview}
                                    alt="preview"
                                    style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: '0.5rem', marginTop: 8 }}
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
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
                            ) : isNew ? 'Crear' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
