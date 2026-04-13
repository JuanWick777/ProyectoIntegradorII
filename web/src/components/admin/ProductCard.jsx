import React from 'react';
import {
    getProductImage,
    getProductName,
    getProductDesc,
    getProductPrice,
    getProductDisponibilidad
} from './adminConstants';
import Badge from '../ui/Badge';

const ProductCard = ({ product, onEdit }) => {
    const disponibilidad = getProductDisponibilidad(product);
    const stockAgotado = disponibilidad === 'AGOTADO';
    const imagen = getProductImage(product);
    const nombre = getProductName(product);
    const descripcion = getProductDesc(product);
    const precio = getProductPrice(product);

    return (
        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
            <div style={{ height: 140, background: '#f0f0f0', overflow: 'hidden', position: 'relative' }}>
                {imagen ? (
                    <img
                        src={imagen}
                        alt={nombre}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 text-muted" style={{ fontSize: 48 }}>
                        🍽️
                    </div>
                )}
                {stockAgotado && (
                    <Badge className="position-absolute top-0 end-0 m-2" variant="danger">
                        ⚠️ Agotado
                    </Badge>
                )}
            </div>

            <div className="card-body d-flex flex-column p-3">
                <h6 className="fw-bold mb-1" style={{ fontSize: '0.95rem' }}>
                    {nombre}
                </h6>
                <p
                    className="text-muted small mb-2"
                    style={{
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    {descripcion || <em>Sin descripción</em>}
                </p>

                <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-success fs-5">${Number(precio).toFixed(2)}</span>
                    <span className={`small fw-bold ${stockAgotado ? 'text-danger' : 'text-success'}`}>
                        {disponibilidad}
                    </span>
                </div>

                <button
                    className="btn btn-outline-primary btn-sm mt-2 w-100 fw-semibold"
                    style={{ borderRadius: '0.6rem' }}
                    onClick={() => onEdit(product)}
                >
                    ✏️ Editar
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
