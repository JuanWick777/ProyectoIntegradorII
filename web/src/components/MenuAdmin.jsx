import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import AdminSidebar from './admin/AdminSidebar';
import PersonalAdmin from './admin/PersonalAdmin';
import ClientesAdmin from './admin/ClientesAdmin';
import MesasAdmin from './admin/MesasAdmin';
import ProductCard from './admin/ProductCard';
import ProductModal from './admin/ProductModal';
import PromocionesAdmin from './PromocionesAdmin';
import QRCodeGenerator from './QRCodeGenerator';
import StatCard from './ui/StatCard';
import { LayoutDashboard, Utensils, ChefHat, Users, User, QrCode, Tag, PlusCircle, LogOut, Check, Heart } from 'lucide-react';
import { getProductCategoryName, getProductName } from './admin/adminConstants';
import ConfirmModal from './ui/ConfirmModal';
import { PrimaryButton, SecondaryButton, OutlineButton } from './ui/Button';

const MenuAdmin = () => {
    const {
        products,
        categorias,
        updateProduct,
        createProduct,
        fetchAdminProducts,
        fetchCategorias,
        fetchUsuarios,
        fetchOrders,
        uploadPlatilloImage,
        deletePlatilloImage,
        deleteProduct,
        logout,
        usuario
    } = useAppStore();
    const [modalProduct, setModalProduct] = useState(null);
    const [saving, setSaving] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('Todos');
    const [toast, setToast] = useState('');
    const [vistaActual, setVistaActual] = useState('dashboard');
    const [isSidebarPinned, setIsSidebarPinned] = useState(true);
    const [usuarios, setUsuarios] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loadingDashboard, setLoadingDashboard] = useState(true);
    const [confirmDelProduct, setConfirmDelProduct] = useState(null);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                await fetchAdminProducts().catch(() => console.error('Error cargando productos'));
                await fetchCategorias().catch(() => console.error('Error cargando categorías'));

                setLoadingDashboard(true);
                const [u, o] = await Promise.all([
                    fetchUsuarios().catch(() => []),
                    fetchOrders().catch(() => [])
                ]);
                setUsuarios(u || []);
                setOrders(o || []);
            } catch (e) {
                console.error('Error cargando datos:', e);
            } finally {
                setLoadingDashboard(false);
            }
        };

        cargarDatos();
    }, []);

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
                imagenUrlFinal = up?.path || up?.url || null;
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
                estado: form.disponibilidad || 'DISPONIBLE',
                imagenUrl: imagenUrlFinal,
                categoriaId: form.categoria_id,
            };

            if (form.id) {
                await updateProduct(form.id, payload);
                mostrarToast('Producto actualizado');
            } else {
                await createProduct(payload);
                mostrarToast('Producto creado');
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

    const categoriasFiltro = ['Todos', ...new Set(productsNormalizados.map((p) => p.categoriaTexto || 'Otros'))];

    const productsFiltrados = productsNormalizados.filter((p) => {
        const coincideCat =
            filtroCategoria === 'Todos' || (p.categoriaTexto || 'Otros') === filtroCategoria;
        const coincideBusqueda = getProductName(p).toLowerCase().includes(busqueda.toLowerCase());
        return coincideCat && coincideBusqueda;
    });

    const totalPlatillos = products.length;
    const totalCocineros = usuarios.filter((u) => ['cocinero', 'chef'].includes((u.rol || '').toLowerCase())).length;
    const totalMeseros = usuarios.filter((u) => (u.rol || '').toLowerCase() === 'mesero').length;
    const totalClientes = usuarios.filter((u) => (u.rol || '').toLowerCase() === 'cliente').length;

    const handleLogout = async () => {
        await logout();
        window.location.replace('/admin/login');
    };

    const eliminarPlatillo = async (product) => {
        if (!product?.id) return;
        try {
            const imagenPathOrUrl =
                product?.urlImagen ??
                product?.url_imagen ??
                product?.imagen_url ??
                product?.imagenUrl ??
                null;

            // Intentar eliminar imagen (si existe) antes de eliminar el platillo
            if (imagenPathOrUrl) {
                try {
                    await deletePlatilloImage(imagenPathOrUrl);
                } catch {
                    // Si falla el borrado de imagen, no bloqueamos la eliminación
                }
            }

            await deleteProduct(product.id);
            mostrarToast('Platillo eliminado');
            await fetchAdminProducts();
        } catch (e) {
            mostrarToast('❌ No se pudo eliminar: ' + (e?.message || ''));
        } finally {
            setConfirmDelProduct(null);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F5F5' }}>
            <AdminSidebar
                loginPath="/admin/login"
                accentColor="#FF7043"
                isPinned={isSidebarPinned}
                setIsPinned={setIsSidebarPinned}
                navItems={[
                    { id: 'dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
                    { id: 'menu', icon: <Utensils size={18} />, label: 'Platillos' },
                    { id: 'mesas', icon: <Utensils size={18} />, label: 'Mesas' },
                    { id: 'personal', icon: <Users size={18} />, label: 'Personal' },
                    { id: 'clientes', icon: <Heart size={18} />, label: 'Clientes' },
                    { id: 'promociones', icon: <Tag size={18} />, label: 'Promociones' },
                    { id: 'qr', icon: <QrCode size={18} />, label: 'QR' },
                ]}
                activeItem={vistaActual}
                onNavItemClick={setVistaActual}
            />
            <div style={{
                flex: 1,
                marginLeft: isSidebarPinned ? 260 : 70,
                transition: 'margin-left 0.28s cubic-bezier(.4,0,.2,1)'
            }}>

                {/* ── NAVBAR SUPERIOR ────────────────────────────────────── */}
                <nav
                    className="navbar sticky-top shadow-sm px-4 py-3"
                    style={{
                        background: '#FFFFFF',
                        borderBottom: '1px solid #E8E8E8',
                        display: 'flex', alignItems: 'center'
                    }}
                >
                    <div className="d-flex gap-3 align-items-center ms-auto">
                        {/* Perfil del usuario */}
                        <div className="d-flex align-items-center gap-2" style={{ borderRight: '1px solid #E8E8E8', paddingRight: 16 }}>
                            <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 40, height: 40, background: '#FFF5F0', color: '#FF7043', fontSize: 14 }}>
                                {(usuario?.nombre || 'AD').split(' ').slice(0, 2).map(p => p[0]).join('')}
                            </div>
                            <div style={{ lineHeight: 1.2 }}>
                                <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{usuario?.nombre || 'Admin'}</div>
                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Administrador</div>
                            </div>
                        </div>

                        {/* Cerrar sesión */}
                        <button
                            className="btn btn-link text-decoration-none text-dark fw-bold"
                            style={{ fontSize: '0.9rem' }}
                            onClick={handleLogout}
                        >
                            <LogOut size={18} className="me-2" />Cerrar sesión
                        </button>
                    </div>
                </nav>

                <div className="container-fluid px-4 py-4">
                    {vistaActual === 'dashboard' ? (
                        <>
                            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
                                <div>
                                    <p className="text-muted mb-2">Dashboard</p>
                                    <h1 className="fw-bold mb-0">¡Bienvenido de nuevo, Admin!</h1>
                                </div>
                                <div className="text-muted">
                                    Aquí está un resumen de tu restaurante
                                </div>
                            </div>

                            <div className="row g-3">
                                {loadingDashboard ? (
                                    [1, 2, 3, 4].map((index) => (
                                        <div key={index} className="col-12 col-md-6 col-xl-3">
                                            <div className="bg-white rounded-3 shadow-sm p-4 h-100 animate-pulse" style={{ minHeight: 140 }} />
                                        </div>
                                    ))
                                ) : (
                                    [
                                        { title: 'Total de Platillos', value: totalPlatillos, icon: <Utensils size={20} color="white" />, color: '#FFB3A5' },
                                        { title: 'Total de Cocineros', value: totalCocineros, icon: <ChefHat size={20} color="white" />, color: '#B3D9FF' },
                                        { title: 'Total de Meseros', value: totalMeseros, icon: <Users size={20} color="white" />, color: '#B3F0D6' },
                                        { title: 'Total de Clientes', value: totalClientes, icon: <User size={20} color="white" />, color: '#D9C7F0' },
                                    ].map((card) => (
                                        <StatCard
                                            key={card.title}
                                            title={card.title}
                                            value={card.value}
                                            icon={card.icon}
                                            color={card.color}
                                        />
                                    ))
                                )}
                            </div>
                        </>
                    ) : vistaActual === 'personal' ? (
                        <PersonalAdmin mostrarToast={mostrarToast} />
                    ) : vistaActual === 'mesas' ? (
                        <MesasAdmin />
                    ) : vistaActual === 'clientes' ? (
                        <ClientesAdmin mostrarToast={mostrarToast} />
                    ) : vistaActual === 'promociones' ? (
                        <PromocionesAdmin mostrarToast={mostrarToast} />
                    ) : vistaActual === 'qr' ? (
                        <QRCodeGenerator />
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
                                    placeholder="Buscar platillo..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                />

                                <PrimaryButton
                                    type="button"
                                    className="fw-bold"
                                    style={{ borderRadius: '2rem' }}
                                    onClick={() => setModalProduct({})}
                                >
                                    <PlusCircle size={18} className="me-2" />Nuevo Platillo
                                </PrimaryButton>
                            </div>

                            <div className="d-flex gap-2 flex-wrap mb-4">
                                {categoriasFiltro.map((cat) => (
                                    filtroCategoria === cat ? (
                                        <PrimaryButton
                                            key={cat}
                                            size="sm"
                                            className="fw-bold"
                                            style={{ borderRadius: '2rem', minWidth: 80 }}
                                            onClick={() => setFiltroCategoria(cat)}
                                        >
                                            {cat}
                                        </PrimaryButton>
                                    ) : (
                                        <OutlineButton
                                            key={cat}
                                            size="sm"
                                            className="fw-bold"
                                            style={{ borderRadius: '2rem', minWidth: 80, opacity: 0.95 }}
                                            onClick={() => setFiltroCategoria(cat)}
                                        >
                                            {cat}
                                        </OutlineButton>
                                    )
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
                                            <ProductCard
                                                product={p}
                                                onEdit={setModalProduct}
                                                onDelete={(prod) => setConfirmDelProduct(prod)}
                                            />
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
                        categorias={categorias}
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

                <ConfirmModal
                    open={!!confirmDelProduct}
                    title="¿Eliminar platillo?"
                    subtitle="Esta acción no se puede deshacer."
                    description={confirmDelProduct ? (
                        <>
                            <div className="fw-semibold">{confirmDelProduct.nombre}</div>
                            <div className="text-muted small">Se eliminará este platillo del menú.</div>
                        </>
                    ) : null}
                    confirmText="Sí, eliminar"
                    cancelText="Cancelar"
                    onClose={() => setConfirmDelProduct(null)}
                    onConfirm={() => eliminarPlatillo(confirmDelProduct)}
                />
            </div>
        </div>
    );
};

export default MenuAdmin;
