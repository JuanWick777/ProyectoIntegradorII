import React from 'react';

const SIZE_STYLES = {
  sm: { maxWidth: '28rem' },
  md: { maxWidth: '42rem' },
  lg: { maxWidth: '56rem' },
  xl: { maxWidth: '72rem' },
};

const Modal = ({
  title,
  children,
  footer,
  onClose,
  closeOnBackdrop = true,
  showCloseButton = true,
  size = 'md',
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  ...props
}) => {
  const containerStyle = SIZE_STYLES[size] || SIZE_STYLES.md;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        padding: '1rem',
      }}
      onClick={closeOnBackdrop ? onClose : undefined}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          width: '100%',
          ...containerStyle,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '1.25rem',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }}
          className={className}
          {...props}
        >
          {(title || showCloseButton) && (
            <div
              className={headerClassName}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              {title ? (
                <h5 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>{title}</h5>
              ) : (
                <div />
              )}
              {showCloseButton && (
                <button
                  type="button"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#6b7280',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                  }}
                  onClick={onClose}
                  aria-label="Cerrar modal"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          <div className={bodyClassName} style={{ padding: '1.5rem' }}>
            {children}
          </div>

          {footer && (
            <div
              className={footerClassName}
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
              }}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
