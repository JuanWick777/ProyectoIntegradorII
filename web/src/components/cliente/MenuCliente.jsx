import React, { useState, useMemo, useEffect } from 'react';
import { UtensilsCrossed, Search, Tag } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import ProductCard from './ProductCard';
import { PrimaryButton, SecondaryButton, OutlineButton } from '../ui/Button';

const MenuCliente = ({ numeroMesa, onVerCarrito }) => {
    const { products, loadingProducts, carrito, fetchPromociones, cartError, clearCartError } = useAppStore();
    const [categoriaActiva, setCategoriaActiva] = useState('todos');
    const [busqueda, setBusqueda] = useState('');
    const [promos, setPromos] = useState([]);

    useEffect(() => {
        fetchPromociones().then((data) => setPromos(data || [])).catch(() => {});
    }, []);

    useEffect(() => {
        if (!cartError) return;
        const timeout = setTimeout(() => clearCartError(), 3000);
        return () => clearTimeout(timeout);
    }, [cartError, clearCartError]);

    const getCategoriaNombre = (product) => {
        if (!product) return 'Otros';
        if (typeof product.categoria === 'string') return product.categoria;
        if (product.categoria?.nombre) return product.categoria.nombre;
        return 'Otros';
    };

    const categorias = useMemo(() => {
        const cats = [...new Set(products.map(getCategoriaNombre))].sort();
        return ['todos', ...cats];
    }, [products]);

    const productosFiltrados = useMemo(() => {
        let lista = products;
        if (categoriaActiva !== 'todos') {
            lista = lista.filter((product) => getCategoriaNombre(product) === categoriaActiva);
        }
        if (busqueda.trim()) {
            const query = busqueda.toLowerCase();
            lista = lista.filter(
                (product) =>
                    product.nombre?.toLowerCase().includes(query) ||
                    product.descripcion?.toLowerCase().includes(query)
            );
        }
        return lista;
    }, [products, categoriaActiva, busqueda]);

    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const totalPrecio = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    if (loadingProducts) {
        return (
            <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center gap-3">
                <div className="spinner-border text-primary" style={{ width: 48, height: 48 }} role="status" />
                <p className="text-muted fw-semibold">Cargando menu...</p>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100" style={{ background: '#ffffff', paddingBottom: totalItems > 0 ? 90 : 16 }}>
            <header
                className="sticky-top shadow-sm px-3 py-3"
                style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', zIndex: 50 }}
            >
                <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
                    <div className="d-flex align-items-start gap-3">
                        <div
                            className="rounded-3 d-flex align-items-center justify-content-center"
                            style={{ width: 48, height: 48, background: '#f97316', color: '#ffffff' }}
                        >
                            <UtensilsCrossed size={24} />
                        </div>
                        <div>
                            <span
                                className="badge fw-bold px-2 py-1 small mb-2"
                                style={{ background: '#fff7ed', color: '#f97316', border: '1px solid #fdba74' }}
                            >
                                Mesa #{numeroMesa}
                            </span>
                            <h1 className="fw-bold mb-1" style={{ fontSize: '1.25rem', color: '#111827' }}>
                                Nuestro menu
                            </h1>
                            <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                                Elige tus platillos y arma tu pedido
                            </div>
                        </div>
                    </div>
                </div>

                <div className="position-relative mb-3">
                    <Search
                        size={18}
                        className="position-absolute top-50 translate-middle-y ms-2 text-muted"
                        style={{ left: 8, zIndex: 1, marginTop: '-0.5rem' }}
                    />
                    <input
                        type="search"
                        className="form-control bg-light border-0 shadow-sm ps-5"
                        placeholder="Buscar platillo o bebida..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        style={{ borderRadius: '2rem', height: 42 }}
                    />
                </div>

                <div className="d-flex gap-2 overflow-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                    {categorias.map((categoria) =>
                        categoriaActiva === categoria ? (
                            <PrimaryButton
                                key={categoria}
                                size="sm"
                                className="fw-semibold"
                                style={{ borderRadius: '2rem', minWidth: 80 }}
                                onClick={() => setCategoriaActiva(categoria)}
                            >
                                {categoria === 'todos' ? (
                                    <>
                                        <UtensilsCrossed size={14} className="me-1" style={{ display: 'inline' }} /> Todo
                                    </>
                                ) : (
                                    categoria
                                )}
                            </PrimaryButton>
                        ) : (
                            <OutlineButton
                                key={categoria}
                                size="sm"
                                className="fw-semibold"
                                style={{ borderRadius: '2rem', minWidth: 80, opacity: 0.95 }}
                                onClick={() => setCategoriaActiva(categoria)}
                            >
                                {categoria === 'todos' ? (
                                    <>
                                        <UtensilsCrossed size={14} className="me-1" style={{ display: 'inline' }} /> Todo
                                    </>
                                ) : (
                                    categoria
                                )}
                            </OutlineButton>
                        )
                    )}
                </div>
            </header>

            {promos.length > 0 && (
                <div style={{ padding: '0.75rem 0.75rem 0.25rem', background: '#ffffff' }}>
                    <p className="fw-bold mb-2 text-dark d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
                        <Tag size={18} /> Promociones del dia
                    </p>
                    <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none' }}>
                        {promos.map((promo) => (
                            <div
                                key={promo.id}
                                style={{
                                    minWidth: 180,
                                    flexShrink: 0,
                                    background: '#fff7ed',
                                    border: '1px solid #fdba74',
                                    borderRadius: '0.875rem',
                                    padding: '0.75rem 1rem',
                                    color: '#9a3412',
                                }}
                            >
                                <div className="fw-bold" style={{ fontSize: '0.88rem', lineHeight: 1.2 }}>{promo.titulo}</div>
                                {promo.descripcion && (
                                    <div style={{ fontSize: '0.73rem', opacity: 0.88, marginTop: 3 }}>{promo.descripcion}</div>
                                )}
                                <div className="fw-bold mt-2" style={{ fontSize: '1.1rem' }}>
                                    {promo.tipoDescuento === 'PORCENTAJE'
                                        ? `${promo.valorDescuento}% OFF`
                                        : `$${promo.valorDescuento} OFF`}
                                </div>
                                {promo.codigoPromo && (
                                    <div
                                        style={{
                                            marginTop: 4,
                                            background: 'rgba(249, 115, 22, 0.12)',
                                            borderRadius: '0.4rem',
                                            padding: '2px 7px',
                                            display: 'inline-block',
                                            fontFamily: 'monospace',
                                            fontSize: '0.8rem',
                                            letterSpacing: '0.06em',
                                        }}
                                    >
                                        {promo.codigoPromo}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <main className="flex-grow-1 p-3">
                {cartError && (
                    <div className="alert alert-warning mb-3" role="alert">
                        {cartError}
                    </div>
                )}
                {productosFiltrados.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <Search size={48} style={{ color: '#cbd5e0' }} className="mx-auto d-block mb-3" />
                        <p className="fw-semibold">Sin resultados para "{busqueda}"</p>
                        <SecondaryButton
                            type="button"
                            className="text-primary px-0"
                            style={{ background: 'transparent', borderColor: 'transparent' }}
                            onClick={() => {
                                setBusqueda('');
                                setCategoriaActiva('todos');
                            }}
                        >
                            Ver todo el menu
                        </SecondaryButton>
                    </div>
                ) : (
                    <div className="row g-3">
                        {productosFiltrados.map((product) => (
                            <div key={product.id} className="col-6 col-sm-4 col-lg-3">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {totalItems > 0 && (
                <div className="cart-footer-bar">
                    <PrimaryButton
                        className="w-100 fw-bold d-flex align-items-center justify-content-between"
                        fullWidth
                        onClick={onVerCarrito}
                        style={{ borderRadius: '0.75rem' }}
                    >
                        <span
                            className="badge bg-white text-primary rounded-circle"
                            style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            {totalItems}
                        </span>
                        <span>Ver mi pedido</span>
                        <span className="fw-bold">${totalPrecio.toFixed(2)}</span>
                    </PrimaryButton>
                </div>
            )}
        </div>
    );
};

export default MenuCliente;
