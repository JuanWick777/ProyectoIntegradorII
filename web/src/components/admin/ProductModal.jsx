import React, { useMemo, useState } from 'react';
import {
    EMPTY_NEW,
    getProductImage,
    getProductDisponibilidad,
    MAPA_COCINAS_POR_CATEGORIA,
    COCINAS
} from './adminConstants';
import Modal from '../ui/Modal';
import FormInput from '../ui/FormInput';
import { Plus, Edit, Save } from 'lucide-react';

const ProductModal = ({ product, onSave, onClose, saving, categorias = [] }) => {
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
            : {
                ...EMPTY_NEW,
                categoria_id: categorias?.[0]?.id ?? '',
            }
    );

    React.useEffect(() => {
        if (!product?.id && !form.categoria_id && categorias.length > 0) {
            setForm(prev => ({
                ...prev,
                categoria_id: categorias[0].id
            }));
        }
    }, [categorias, product, form.categoria_id]);

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
        <Modal
            title={isNew ? <><Plus size={18} className="me-2" />Nuevo Platillo</> : <><Edit size={18} className="me-2" />Editar Platillo</>}
            onClose={onClose}
            className="border-0"
            bodyClassName="pt-2"
            footerClassName="justify-end gap-2"
            footer={(
                <>
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
                        ) : isNew ? <><Plus size={16} className="me-2" />Crear</> : <><Save size={16} className="me-2" />Guardar</>}
                    </button>
                </>
            )}
        >
            <FormInput
                id="nombre"
                label="Nombre *"
                value={form.nombre}
                onChange={(e) => set('nombre', e.target.value)}
                placeholder="Ej. Hamburguesa Doble"
            />

            <div className="row g-3 mb-3">
                <div className="col-6">
                    <FormInput
                        id="precio"
                        label="Precio ($) *"
                        type="number"
                        value={form.precio}
                        onChange={(e) => set('precio', e.target.value)}
                        placeholder="0.00"
                    />
                </div>
                <div className="col-6">
                    <FormInput
                        id="disponibilidad"
                        label="Disponibilidad"
                        as="select"
                        value={form.disponibilidad}
                        onChange={(e) => set('disponibilidad', e.target.value)}
                        options={[
                            { value: 'DISPONIBLE', label: 'Disponible' },
                            { value: 'AGOTADO', label: 'Agotado' },
                        ]}
                    />
                </div>
            </div>

            <div className="row g-3 mb-3">
                <div className="col-6">
                    <FormInput
                        id="categoria"
                        label="Categoría"
                        as="select"
                        value={form.categoria_id}
                        onChange={handleCategoriaChange}
                        options={categorias.map((c) => ({ value: c.id, label: c.nombre }))}
                    />
                </div>
                <div className="col-6">
                    <FormInput
                        id="cocina"
                        label="Cocina"
                        as="select"
                        value={form.kitchen_id}
                        onChange={(e) => set('kitchen_id', Number(e.target.value))}
                        options={cocinasDisponibles.map((c) => ({ value: c.id, label: c.nombre }))}
                    />
                </div>
            </div>

            <FormInput
                id="descripcion"
                label="Descripción"
                as="textarea"
                rows={2}
                value={form.descripcion}
                onChange={(e) => set('descripcion', e.target.value)}
                placeholder="Ingredientes, detalles..."
            />

            <div className="mb-3">
                <FormInput
                    id="imagen"
                    label="Imagen"
                    type="file"
                    onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setForm((prev) => ({
                            ...prev,
                            imagenFile: f,
                            imagenRemoved: false,
                            imagenUrl: prev.imagenUrl
                        }));
                    }}
                    className="form-control-sm"
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
        </Modal>
    );
};

export default ProductModal;
