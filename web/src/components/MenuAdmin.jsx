import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import AdminSidebar from './admin/AdminSidebar';
import PersonalAdmin from './admin/PersonalAdmin';
import ProductCard from './admin/ProductCard';
import ProductModal from './admin/ProductModal';
import PromocionesAdmin from './PromocionesAdmin';
import QRCodeGenerator from './QRCodeGenerator';
import { getProductCategoryName, getProductName } from './admin/adminConstants';

const MenuAdmin = () => {
    const { products, updateProduct, createProduct, fetchAdminProducts, uploadPlatilloImage, deletePlatilloImage, logout } = useAppStore();
    const [modalProduct, setModalProduct] = useState(null);
    const [saving, setSaving] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('Todos');
    const [toast, setToast] = useState('');
    const [vistaActual, setVistaActual] = useState('menu');
    const [isSidebarPinned, setIsSidebarPinned] = useState(true);

    useEffect(() => {
        fetchAdminProducts();
    }, [fetchAdminProducts]);

    const mostrarToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const handleSave = async (form) => {
        setSaving(true);
        try {
            const imagenUrlAnterior = form.imagenUrl || null;
            const debeEliminarAnterior = Boolean(form.imagenRemoved) || (form.imagenFile instanceof File);

            let imagenUrlFinal = form.imagenRemoved ? null : (form.imagenUrl || null);
            if (form.imagenFile instanceof File) {
                const up = await uploadPlatilloImage(form.imagenFile);
                imagenUrlFinal = up?.url || up?.path || null;
            }

            if (debeEliminarAnterior && imagenUrlAnterior) {
                try {
                    await deletePlatilloImage(imagenUrlAnterior);
                } catch {
                    // si falla el borrado no bloqueamos el guardado del platillo
                }
            }

            // Payload normalizado con los nombres que espera PlatilloAdminController
            const payload = {
                nombre: form.nombre,
                precio: parseFloat(form.precio),
                descripcion: form.descripcion,
                disponibilidad: form.disponibilidad || 'DISPONIBLE',
                imagenUrl: imagenUrlFinal,
                categoriaId: form.categoria_id,
                kitchenId: form.kitchen_id,
            };

            if (form.id) {
                await updateProduct(form.id, payload);
                mostrarToast('✅ Producto actualizado');
            } else {
                await createProduct(payload);
                mostrarToast('✅ Producto creado');
            }

            await fetchAdminProducts();
            setModalProduct(null);
        } catch (e) {
            mostrarToast('❌ Error al guardar: ' + (e?.message || ''));
        } finally {
            setSaving(false);
        }
    };

    const productsNormalizados = (products || []).map((p) => ({
        ...p,
        categoriaTexto: getProductCategoryName(p),
    }));

    const categorias = ['Todos', ...new Set(productsNormalizados.map((p) => p.categoriaTexto || 'Otros'))];

    const productsFiltrados = productsNormalizados.filter((p) => {
        const coincideCat =
            filtroCategoria === 'Todos' || (p.categoriaTexto || 'Otros') === filtroCategoria;
        const coincideBusqueda = getProductName(p).toLowerCase().includes(busqueda.toLowerCase());
        return coincideCat && coincideBusqueda;
    });

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6fb' }}>
            <AdminSidebar
                loginPath="/admin/login"
                accentColor="#0f3460"
                isPinned={isSidebarPinned}
                setIsPinned={setIsSidebarPinned}
                navItems={[
                    { id: 'menu', icon: '🍽️', label: 'Gestión del Menú' },
                    { id: 'personal', icon: '👥', label: 'Personal' },
                    { id: 'promociones', icon: '🏷️', label: 'Promociones' },
                    { id: 'qr', icon: '🖨️', label: 'Códigos QR' },
                    { id: 'historial', icon: '📜', label: 'Historial' }
                ]}
                activeItem={vistaActual}
                onNavItemClick={setVistaActual}
            />

            {/* MAIN CONTENT AREA */}
            <div style={{
                flex: 1,
                marginLeft: isSidebarPinned ? 260 : 70,
                transition: 'margin-left 0.28s cubic-bezier(.4,0,.2,1)'
            }}>

                {/* ── NAVBAR SUPERIOR ────────────────────────────────────── */}
                <nav
                    className="navbar sticky-top shadow-sm px-4 py-2"
                    style={{
                        background: 'linear-gradient(90deg,#ffffff,#f8f9fa)',
                        borderBottom: '1px solid #e2e8f0',
                        display: 'flex', alignItems: 'center'
                    }}
                >
                    <div className="d-flex align-items-center gap-2 me-auto">
                        <span style={{ fontSize: 22 }}>🍴</span>
                        <span className="fw-bold text-dark fs-5">Panel Administrador</span>
                    </div>

                    <div className="d-flex gap-3 align-items-center">
                        <button
                            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
                            style={{ borderRadius: '0.75rem', fontWeight: 600 }}
                            onClick={() => setVistaActual('historial')}
                        >
                            <span style={{ fontSize: 16 }}>📜</span> Historial
                        </button>
                        <span
                            className="badge fw-semibold px-3 py-2"
                            style={{ background: 'rgba(15,52,96,0.1)', color: '#0f3460', borderRadius: '2rem', fontSize: '0.8rem' }}
                        >
                            {{ menu: '🍽️ Menú', personal: '👥 Personal', qr: '🖨️ QRs', promociones: '🏷️ Promociones', historial: '📜 Historial' }[vistaActual]}
                        </span>
                    </div>
                </nav>

                <div className="container-fluid px-4 py-4">
                    {vistaActual === 'personal' ? (
                        <PersonalAdmin mostrarToast={mostrarToast} />
                    ) : vistaActual === 'promociones' ? (
                        <PromocionesAdmin mostrarToast={mostrarToast} />
                    ) : vistaActual === 'qr' ? (
                        <QRCodeGenerator />
                    ) : vistaActual === 'historial' ? (
                        <div className="text-center py-5 text-muted">
                            <p style={{ fontSize: 48 }}>📜</p>
                            <h4 className="fw-bold text-dark">Historial de Órdenes</h4>
                            <p>Plataforma de historial en construcción</p>
                        </div>
                    ) : (
                        <>
                            <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
                                <h2 className="fw-bold mb-0 me-auto">
                                    Gestión del Menú
                                    <span className="badge bg-secondary ms-2 fs-6">
                                        {products.length} productos
                                    </span>
                                </h2>

                                <input
                                    className="form-control form-control-sm"
                                    style={{ maxWidth: 220, borderRadius: '2rem' }}
                                    placeholder="🔍 Buscar platillo..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                />

                                <button
                                    className="btn btn-primary fw-bold"
                                    style={{ borderRadius: '2rem' }}
                                    onClick={() => setModalProduct({})}
                                >
                                    ➕ Nuevo Platillo
                                </button>
                            </div>

                            <div className="d-flex gap-2 flex-wrap mb-4">
                                {categorias.map((cat) => (
                                    <button
                                        key={cat}
                                        className={`btn btn-sm ${filtroCategoria === cat ? 'btn-dark' : 'btn-outline-secondary'
                                            }`}
                                        style={{ borderRadius: '2rem' }}
                                        onClick={() => setFiltroCategoria(cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {productsFiltrados.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <p style={{ fontSize: 48 }}>🍽️</p>
                                    <p className="fw-semibold">Sin productos que mostrar</p>
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {productsFiltrados.map((p) => (
                                        <div key={p.id} className="col-6 col-md-4 col-lg-3 col-xl-2">
                                            <ProductCard product={p} onEdit={setModalProduct} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {modalProduct !== null && (
                    <ProductModal
                        product={modalProduct?.id ? modalProduct : null}
                        onSave={handleSave}
                        onClose={() => setModalProduct(null)}
                        saving={saving}
                    />
                )}

                {toast && (
                    <div
                        className="position-fixed bottom-0 end-0 m-4 alert alert-dark shadow-lg fw-semibold"
                        style={{ borderRadius: '1rem', zIndex: 9999, minWidth: 220 }}
                    >
                        {toast}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuAdmin;