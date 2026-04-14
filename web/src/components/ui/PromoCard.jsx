import React from 'react';
import { SecondaryButton, DangerButton } from './Button';

const PromoCard = ({
    promo,
    onEdit,
    onDelete,
    className = '',
}) => {
    const badge = {
        PORCENTAJE: { color: '#0d6efd', label: '% OFF' },
        MONTO_FIJO: { color: '#198754', label: '$ OFF' },
    }[promo.tipoDescuento] || { color: '#0d6efd', label: '% OFF' };

    return (
        <div className={`col-12 col-md-6 col-xl-4 ${className}`}>
            <div
                className="card border-0 shadow-sm h-100"
                style={{
                    borderRadius: '1.25rem',
                    borderLeft: `4px solid ${promo.activa ? badge.color : '#adb5bd'}`,
                    opacity: promo.activa ? 1 : 0.82,
                    overflow: 'hidden',
                }}
            >
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold mb-0">{promo.titulo}</h6>
                        <span
                            className="badge"
                            style={{ background: badge.color, fontSize: '0.78rem' }}
                        >
                            {promo.tipoDescuento === 'PORCENTAJE'
                                ? `${promo.valorDescuento}% OFF`
                                : `$${promo.valorDescuento} OFF`}
                        </span>
                    </div>

                    {promo.descripcion && (
                        <p className="text-muted small mb-2">{promo.descripcion}</p>
                    )}

                    {promo.codigoPromo && (
                        <div
                            className="mb-2 px-2 py-1 rounded-2 d-inline-flex align-items-center gap-1"
                            style={{ background: '#f8f9fa', border: '1px solid #dee2e6' }}
                        >
                            <span style={{ fontSize: '0.7rem', color: '#6c757d' }}>Código:</span>
                            <span
                                className="fw-bold"
                                style={{ fontFamily: 'monospace', fontSize: '0.85rem', letterSpacing: '0.05em' }}
                            >
                                {promo.codigoPromo}
                            </span>
                        </div>
                    )}

                    <div className="d-flex align-items-center justify-content-between mt-3">
                        <span
                            className="badge"
                            style={{
                                background: promo.activa ? 'rgba(25,135,84,0.15)' : 'rgba(173,181,189,0.3)',
                                color: promo.activa ? '#198754' : '#6c757d',
                            }}
                        >
                            {promo.activa ? '● Activa' : '○ Inactiva'}
                        </span>
                        <div className="d-flex gap-2">
                            <SecondaryButton
                                type="button"
                                size="sm"
                                style={{ borderRadius: '0.5rem' }}
                                onClick={() => onEdit(promo)}
                            >
                                <i className="bi bi-pencil"></i>
                            </SecondaryButton>
                            <DangerButton
                                type="button"
                                size="sm"
                                style={{ borderRadius: '0.5rem' }}
                                onClick={() => onDelete(promo.id)}
                            >
                                <i className="bi bi-trash"></i>
                            </DangerButton>
                        </div>
                    </div>

                    {(promo.fechaInicio || promo.fechaFin) && (
                        <div className="mt-2" style={{ fontSize: '0.72rem', color: '#6c757d' }}>
                            <i className="bi bi-calendar me-1"></i>{promo.fechaInicio || '?'} → {promo.fechaFin || 'Sin fin'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PromoCard;