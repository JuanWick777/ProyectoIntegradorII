import React, { useEffect, useState } from 'react';
import { AlertTriangle, Check, Loader, User, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import Modal from '../ui/Modal';
import FormInput from '../ui/FormInput';
import AlertMessage from '../ui/AlertMessage';
import { PrimaryButton, SecondaryButton } from '../ui/Button';

const PerfilModal = ({ usuario, onClose, onGuardado }) => {
  const { actualizarPerfil } = useAppStore();

  const [form, setForm] = useState({
    nombre: usuario?.nombre || usuario?.nombreCompleto || '',
    correo: usuario?.correo || '',
    contrasena: '',
    confirmar: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  useEffect(() => {
    setForm({
      nombre: usuario?.nombre || usuario?.nombreCompleto || '',
      correo: usuario?.correo || '',
      contrasena: '',
      confirmar: '',
    });
    setError('');
    setOk('');
    setLoading(false);
  }, [usuario]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleGuardar = async () => {
    setError('');
    setOk('');

    if (form.contrasena && form.contrasena !== form.confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (form.contrasena && form.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await actualizarPerfil({
        nombre: form.nombre,
        correo: form.correo,
        contrasena: form.contrasena || undefined,
      });
      setOk('Perfil actualizado correctamente');
      setTimeout(() => {
        if (onGuardado) onGuardado();
        onClose();
      }, 900);
    } catch (e) {
      setError(e?.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      closeOnBackdrop
      showCloseButton={false}
      size="md"
      className="border-0"
      bodyClassName="p-0"
      footer={null}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          color: 'white',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'rgba(230,126,34,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <User size={20} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '1rem' }}>Mi Perfil</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
            {usuario?.rol || 'Empleado'}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
            lineHeight: 1,
          }}
          aria-label="Cerrar"
          type="button"
        >
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '1.5rem' }}>
        <AlertMessage
          message={error}
          className={error ? 'mb-3' : ''}
          icon={<AlertTriangle size={16} />}
          showBootstrapIcon={false}
        />
        {ok ? (
          <div
            style={{
              background: '#f0fff4',
              border: '1px solid #9ae6b4',
              borderRadius: '0.75rem',
              padding: '0.75rem 1rem',
              color: '#276749',
              fontSize: '0.875rem',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
            }}
          >
            <Check size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{ok}</span>
          </div>
        ) : null}

        <FormInput
          id="perfil-nombre"
          label="Nombre completo"
          value={form.nombre}
          onChange={(e) => set('nombre', e.target.value)}
          placeholder="Tu nombre"
        />

        <FormInput
          id="perfil-correo"
          label="Correo electrónico"
          type="email"
          value={form.correo}
          onChange={(e) => set('correo', e.target.value)}
          placeholder="tu@email.com"
        />

        <FormInput
          id="perfil-contrasena"
          label="Nueva contraseña"
          type="password"
          value={form.contrasena}
          onChange={(e) => set('contrasena', e.target.value)}
          placeholder="Dejar vacío para no cambiar"
        />

        <FormInput
          id="perfil-confirmar"
          label="Confirmar contraseña"
          type="password"
          value={form.confirmar}
          onChange={(e) => set('confirmar', e.target.value)}
          placeholder="••••••"
          wrapperClassName="mb-0"
        />
      </div>

      {/* Footer */}
      <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', gap: '1rem' }}>
        <SecondaryButton
          type="button"
          fullWidth
          onClick={onClose}
          style={{ borderRadius: '0.75rem', padding: '0.7rem' }}
          disabled={loading}
        >
          Cancelar
        </SecondaryButton>
        <PrimaryButton
          type="button"
          fullWidth
          className="fw-bold"
          onClick={handleGuardar}
          style={{ borderRadius: '0.75rem', padding: '0.7rem' }}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} className="me-2" />
              Guardando...
            </>
          ) : (
            <>
              <Check size={18} className="me-2" />
              Guardar cambios
            </>
          )}
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default PerfilModal;

