import React from 'react';
import { Calendar, Mail, Trash2, User } from 'lucide-react';
import Modal from '../ui/Modal';
import { getUserEmail } from '../admin/adminConstants';

const ClienteDetalleModal = ({ cliente, onClose, onEliminar }) => {
  if (!cliente) return null;

  return (
    <Modal
      title={
        <div className="d-flex align-items-center gap-2">
          <User size={20} />
          <span>Detalle del cliente</span>
        </div>
      }
      onClose={onClose}
      size="lg"
      footer={(
        <div className="d-flex flex-column flex-sm-row align-items-stretch gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary flex-fill"
            onClick={onClose}
            style={{ borderRadius: '0.95rem', padding: '0.95rem 1rem' }}
          >
            Cerrar
          </button>
          <button
            type="button"
            className="btn btn-danger flex-fill fw-bold"
            onClick={onEliminar}
            style={{ borderRadius: '0.95rem', padding: '0.95rem 1rem' }}
          >
            <Trash2 size={16} className="me-2" />Eliminar cliente
          </button>
        </div>
      )}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #fff4e6 0%, #fff7f0 100%)',
          padding: '1.25rem 1.25rem',
          borderRadius: '1.25rem',
          marginBottom: 16,
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 46, height: 46, background: 'rgba(255, 221, 178, 0.8)', color: '#d97706' }}
          >
            <User size={24} />
          </div>
          <div>
            <h5 className="fw-bold mb-1">{cliente.nombre}</h5>
            <div className="text-muted small">Detalle del cliente</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div className="bg-white rounded-4 p-3 h-100 border" style={{ borderColor: '#e8eaef' }}>
            <div className="text-uppercase fw-semibold text-muted small mb-3">Contacto</div>
            <div className="d-flex align-items-center gap-2 py-2 px-3 rounded-3" style={{ background: '#f4f7fb' }}>
              <Mail size={18} className="text-secondary" />
              <span className="fw-semibold">{getUserEmail(cliente)}</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="bg-white rounded-4 p-3 h-100 border" style={{ borderColor: '#e8eaef' }}>
            <div className="text-uppercase fw-semibold text-muted small mb-3">Estado</div>
            <div>
              <span
                className="badge fw-semibold"
                style={{
                  background: cliente.activo ? '#d1fae5' : '#e2e3e5',
                  borderRadius: '2rem',
                  padding: '0.55rem 1rem',
                  fontSize: '0.9rem',
                  color: cliente.activo ? '#065f46' : '#6c757d',
                }}
              >
                {cliente.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        </div>

        {cliente.createdAt && (
          <div className="col-12">
            <div className="bg-white rounded-4 p-3 border" style={{ borderColor: '#e8eaef' }}>
              <div className="text-uppercase fw-semibold text-muted small mb-3">Fecha de registro</div>
              <div className="d-flex align-items-center gap-2 py-2 px-3 rounded-3" style={{ background: '#f4f7fb' }}>
                <Calendar size={18} className="text-secondary" />
                <span>{new Date(cliente.createdAt).toLocaleDateString('es-ES', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ClienteDetalleModal;

