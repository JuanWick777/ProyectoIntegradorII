import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { AlertTriangle, UtensilsCrossed, Check } from 'lucide-react';
import { getProductDisponibilidad, getProductImage } from '../admin/adminConstants';

const ProductCard = ({ product }) => {
    const { carrito, agregarAlCarrito, decrementarCantidad } = useAppStore();
    const [added, setAdded] = useState(false);
    const imagen = getProductImage(product);
    const estado = getProductDisponibilidad(product).toUpperCase();
    const noDisponible = ['AGOTADO', 'INACTIVO'].includes(estado);

    const itemEnCarrito = carrito.find(i => i.id === product.id);
    const cantidad = itemEnCarrito?.cantidad || 0;

    const handleAgregar = () => {
        if (noDisponible) return;
        agregarAlCarrito(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 800);
    };

    return (
        <div className={`card h-100 border-0 shadow-sm kds-ticket ${noDisponible ? 'opacity-60' : ''}`}
            style={{ borderRadius: '1rem', overflow: 'hidden' }}>

            <div
                className="position-relative"
                style={{
                    height: 130,
                    background: imagen
                        ? `url(${imagen}) center/cover`
                        : 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {!imagen && (
                    <UtensilsCrossed size={48} style={{ color: 'rgba(0,0,0,0.2)' }} />
                )}

                {noDisponible && (
                    <Badge className="position-absolute top-0 end-0 m-2" variant="danger">
                        {estado === 'INACTIVO' ? 'Inactivo' : 'Agotado'}
                    </Badge>
                )}
            </div>

            <div className="card-body d-flex flex-column p-2 pb-3">
                <h6 className="fw-bold mb-1 lh-sm" style={{ fontSize: '0.85rem' }}>
                    {product.nombre}
                </h6>

                {product.descripcion && (
                    <p className="text-muted mb-1" style={{ fontSize: '0.72rem', lineHeight: 1.3 }}>
                        {product.descripcion.length > 55
                            ? product.descripcion.slice(0, 55) + '...'
                            : product.descripcion}
                    </p>
                )}

                {product.alergenos && product.alergenos !== 'ninguno' && (
                    <div className="mb-2">
                        <Badge variant="warning" className="text-dark" pill={false}>
                            <AlertTriangle size={14} className="me-1" />{product.alergenos}
                        </Badge>
                    </div>
                )}

                <div className="mt-auto">
                    <p className="fw-bold text-primary mb-2" style={{ fontSize: '1rem' }}>
                        ${Number(product.precio).toFixed(2)}
                    </p>

                    {cantidad === 0 ? (
                        <Button
                            onClick={handleAgregar}
                            fullWidth
                            variant={added ? 'success' : 'primary'}
                            size="sm"
                            disabled={noDisponible}
                            className="rounded-xl d-flex align-items-center justify-content-center gap-1"
                        >
                            {added ? <><Check size={16} /> Agregado</> : noDisponible ? 'No disponible' : '+ Agregar'}
                        </Button>
                    ) : (
                        <div className="d-flex align-items-center justify-content-between bg-light rounded-pill px-2">
                            <button
                                className="btn btn-sm p-0 fw-bold fs-5 text-danger border-0 bg-transparent"
                                style={{ width: 32, height: 32 }}
                                onClick={() => decrementarCantidad(product.id)}
                            >
                                -
                            </button>
                            <span className="fw-bold text-primary">{cantidad}</span>
                            <button
                                className="btn btn-sm p-0 fw-bold fs-5 text-primary border-0 bg-transparent"
                                style={{ width: 32, height: 32 }}
                                onClick={handleAgregar}
                                disabled={noDisponible}
                            >
                                +
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
