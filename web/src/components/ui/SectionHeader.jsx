import React from 'react';

const SectionHeader = ({
    title,
    subtitle,
    actions,
    badge,
    className = '',
}) => {
    return (
        <div className={`d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 ${className}`}>
            <div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                    <h2 className="fw-bold mb-1">{title}</h2>
                    {badge ? (
                        <span className="badge bg-secondary">{badge}</span>
                    ) : null}
                </div>
                {subtitle ? (
                    <p className="text-muted small mb-0">{subtitle}</p>
                ) : null}
            </div>

            {actions ? (
                <div className="d-flex flex-wrap gap-2 align-items-center">
                    {actions}
                </div>
            ) : null}
        </div>
    );
};

export default SectionHeader;
