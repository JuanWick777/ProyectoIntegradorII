import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, AlertTriangle, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import SectionHeader from './ui/SectionHeader';
import PromoCard from './ui/PromoCard';
import LoadingSpinner from './ui/LoadingSpinner';
import ConfirmModal from './ui/ConfirmModal';
import PromoModal from './shared/PromoModal';
import { PrimaryButton } from './ui/Button';

const TIPO_BADGE = {
    PORCENTAJE: { color: '#0d6efd', label: '% OFF' },
    MONTO_FIJO: { color: '#198754', label: '$ OFF' },
};

const PromocionesAdmin = ({ mostrarToast }) => {
    const { fetchAdminPromociones, createPromocion, updatePromocion, deletePromocion, fetchCategorias } = useAppStore();
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [saving, setSaving] = useState(false);
    const [confirmDel, setConfirmDel] = useState(null);
    const [categorias, setCategorias] = useState([]);

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

    useEffect(() => {
        cargar();
        (async () => {
            const cats = await fetchCategorias();
            setCategorias(cats || []);
        })();
    }, []);

    const handleSave = async (form) => {
        setSaving(true);
        try {
            const is2x1 = String(form.tipoDescuento || '').toUpperCase() === '2X1';
            const payload = {
                ...form,
                valorDescuento: is2x1 ? 0 : (parseFloat(form.valorDescuento) || 0),
                codigoPromo: form.codigoPromo || null,
                categoriaId: form.categoriaId ? Number(form.categoriaId) : null,
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
                    <PrimaryButton
                        type="button"
                        className="fw-bold px-4 shadow-sm d-flex align-items-center gap-2"
                        style={{ borderRadius: '2rem' }}
                        onClick={() => setModal({})}
                    >
                        <Plus size={18} />Nueva Promoción
                    </PrimaryButton>
                )}
            />

            {loading ? (
                <LoadingSpinner center />
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
                    categorias={categorias}
                    onSave={handleSave}
                    onClose={() => setModal(null)}
                    saving={saving}
                />
            )}

            <ConfirmModal
                open={!!confirmDel}
                title="¿Eliminar promoción?"
                subtitle="Esta acción no se puede deshacer."
                description={confirmDel ? (
                    <>
                        <div className="fw-semibold">{confirmDel.titulo}</div>
                        <div className="text-muted small">Se borrará definitivamente esta promoción.</div>
                    </>
                ) : null}
                confirmText="Sí, eliminar"
                cancelText="Cancelar"
                onClose={() => setConfirmDel(null)}
                onConfirm={confirmarEliminar}
                icon={<AlertTriangle size={28} className="text-warning" />}
            />
        </div>
    );
};

export default PromocionesAdmin;
