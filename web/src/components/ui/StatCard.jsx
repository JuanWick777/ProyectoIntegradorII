import React from 'react';

const StatCard = ({
    title,
    value,
    icon,
    color,
    className = '',
}) => {
    return (
        <div className={`col-12 col-md-6 col-xl-3 ${className}`}>
            <div className="bg-white rounded-3 shadow-sm p-4 h-100 d-flex flex-column justify-content-between" style={{ minHeight: 160 }}>
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                        <div className="text-muted small" style={{ fontSize: '0.85rem' }}>{title}</div>
                        <div className="fw-bold" style={{ fontSize: '2.2rem', marginTop: 8, color: '#2C2C2C' }}>{value}</div>
                    </div>
                    <div className="rounded-3" style={{ width: 50, height: 50, background: color, display: 'grid', placeItems: 'center', fontSize: 24 }}>
                        {typeof icon === 'string' ? (
                            <i className={icon} style={{ color: 'white' }} />
                        ) : (
                            icon
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;