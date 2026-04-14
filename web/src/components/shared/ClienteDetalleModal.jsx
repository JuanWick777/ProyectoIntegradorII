import React from 'react';
import { Calendar, Mail, Trash2, User } from 'lucide-react';
import Modal from '../ui/Modal';
import { SecondaryButton, DangerButton } from '../ui/Button';
import { getUserEmail } from '../admin/adminConstants';

const ClienteDetalleModal = ({ cliente, onClose, onEliminar }) => {
  if (!cliente) return null;

  return (
    <Modal
      onClose={onClose}
      closeOnBackdrop
      showCloseButton={false}
      title={null}
      size="sm"
      className="border-0 shadow-lg"
      bodyClassName="p-0"
      footer={(
        <div className="p-3">
          <div className="d-flex flex-column flex-sm-row align-items-stretch gap-2">
            <SecondaryButton
              type="button"
              fullWidth
              onClick={onClose}
              style={{ borderRadius: '0.75rem', padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
            >
              Cancelar
            </SecondaryButton>
            <DangerButton
              type="button"
              fullWidth
              className="fw-bold"
              onClick={onEliminar}
              style={{ borderRadius: '0.75rem', padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
            >
              <Trash2 size={14} className="me-2" />Sí, eliminar
            </DangerButton>
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
            <User size={28} className="text-warning" />
          </div>
          <h5 className="fw-bold mb-2">Detalle del cliente</h5>
          <p className="text-muted small mb-0">Información del cliente registrado</p>
        </div>

        <div className="p-4">
          <div className="bg-white rounded-4 p-4 shadow-sm">
            <div className="text-center mb-4">
              <div className="fw-semibold fs-5">{cliente.nombre}</div>
              <div className="text-muted small">Cliente registrado</div>
            </div>

            <div className="d-flex flex-column gap-3">
              <div className="rounded-4 border border-1 border-secondary-subtle p-3">
                <div className="text-uppercase fw-semibold text-muted small mb-2">Cliente</div>
                <div className="fw-semibold mb-3 text-break">{getUserEmail(cliente)}</div>
                <div className="text-uppercase fw-semibold text-muted small mb-1">Estado</div>
                <div>
                  <span
                    className="badge fw-semibold"
                    style={{
                      background: cliente.activo ? '#d1fae5' : '#e2e3e5',
                      borderRadius: '2rem',
                      padding: '0.55rem 1rem',
                      fontSize: '0.9rem',
                      color: cliente.activo ? '#065f46' : '#6c757d',
                      display: 'inline-flex',
                      justifyContent: 'center',
                    }}
                  >
                    {cliente.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
              {cliente.createdAt && (
                <div className="rounded-4 border border-1 border-secondary-subtle p-3 text-center">
                  <div className="text-uppercase fw-semibold text-muted small mb-1">Fecha de registro</div>
                  <div className="d-flex align-items-center justify-content-center gap-2 py-2 px-3 rounded-3" style={{ background: '#f4f7fb' }}>
                    <Calendar size={18} className="text-secondary" />
                    <span>{new Date(cliente.createdAt).toLocaleDateString('es-ES', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ClienteDetalleModal;

