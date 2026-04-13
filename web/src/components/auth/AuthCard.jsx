import React from 'react';

const AuthCard = ({
  icon,
  title,
  subtitle,
  children,
  maxWidth = 400,
}) => {
  return (
    <div
      className="card border-0 shadow-lg p-4"
      style={{ width: '100%', maxWidth, borderRadius: '1.25rem' }}
    >
      <div className="card-body">
        {(title || subtitle || icon) && (
          <div className="text-center mb-4">
            {icon ? (
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{
                  width: 64,
                  height: 64,
                  background: '#FFF5F0',
                  color: '#FF7043',
                  fontSize: 28,
                }}
              >
                {icon}
              </div>
            ) : null}
            {title ? <h1 className="fs-4 fw-bold mb-0">{title}</h1> : null}
            {subtitle ? <p className="text-muted small mt-1">{subtitle}</p> : null}
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default AuthCard;

