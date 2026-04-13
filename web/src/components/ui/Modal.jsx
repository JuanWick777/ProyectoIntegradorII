import React from 'react';

const SIZE_CLASSES = {
  sm: 'max-w-xl',
  md: 'max-w-2xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
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
  const containerClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={closeOnBackdrop ? onClose : undefined}
      role="dialog"
      aria-modal="true"
    >
      <div className={`w-full ${containerClass}`} onClick={(e) => e.stopPropagation()}>
        <div className={`bg-white rounded-[1.25rem] shadow-2xl overflow-hidden ${className}`} {...props}>
          {(title || showCloseButton) && (
            <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-200 ${headerClassName}`}>
              {title ? <h5 className="text-lg font-semibold text-gray-900">{title}</h5> : <div />}
              {showCloseButton && (
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-900 transition"
                  onClick={onClose}
                  aria-label="Cerrar modal"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          <div className={`px-6 py-4 ${bodyClassName}`}>
            {children}
          </div>

          {footer && (
            <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${footerClassName}`}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
