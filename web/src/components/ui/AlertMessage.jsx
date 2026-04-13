import React from 'react';

const AlertMessage = ({
  variant = 'danger',
  message,
  icon,
  showBootstrapIcon = true,
  className = '',
  style,
}) => {
  if (!message) return null;

  return (
    <div
      className={`alert alert-${variant} py-2 small ${className}`.trim()}
      style={{ borderRadius: '0.75rem', ...(style || {}) }}
      role="alert"
    >
      {icon ? (
        <span className="me-2 d-inline-flex align-items-center">{icon}</span>
      ) : showBootstrapIcon ? (
        <i className="bi bi-exclamation-triangle me-2"></i>
      ) : null}
      {message}
    </div>
  );
};

export default AlertMessage;

