import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

const ConfirmModal = ({
  open,
  title = 'Confirmar',
  subtitle = 'Esta acción no se puede deshacer.',
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onClose,
  confirmVariant = 'danger', // bootstrap
  icon = <AlertTriangle size={28} className="text-warning" />,
}) => {
  if (!open) return null;

  return (
    <Modal
      onClose={onClose}
      closeOnBackdrop
      showCloseButton={false}
      size="sm"
      className="border-0 shadow-lg"
      bodyClassName="p-0"
      footerClassName="p-0 border-0 bg-transparent"
      footer={(
        <div className="p-4 pt-0">
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary flex-fill"
              style={{ borderRadius: '0.85rem', padding: '0.9rem 1rem' }}
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button
              className={`btn btn-${confirmVariant} flex-fill fw-bold`}
              style={{ borderRadius: '0.85rem', padding: '0.9rem 1rem' }}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      )}
    >
      <div style={{ overflow: 'hidden', borderRadius: '1.5rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #fff4e6 0%, #fff7f0 100%)',
            padding: '1.6rem 1.4rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(255, 221, 178, 0.45)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
            }}
          >
            {icon}
          </div>
          <h5 className="fw-bold mb-2">{title}</h5>
          <p className="text-muted small mb-0">{subtitle}</p>
        </div>

        <div className="p-4 pb-0">
          {description ? (
            <div className="text-center mb-3">
              {typeof description === 'string'
                ? <div className="text-muted small">{description}</div>
                : description}
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;

