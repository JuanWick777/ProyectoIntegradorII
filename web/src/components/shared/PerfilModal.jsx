import React, { useEffect, useState } from 'react';
import { AlertTriangle, Check, Loader, User, X, Eye, EyeOff } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import Modal from '../ui/Modal';
import AlertMessage from '../ui/AlertMessage';
import { PrimaryButton, SecondaryButton } from '../ui/Button';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (form) => {
  const errs = {};
  if (!form.nombre?.trim()) errs.nombre = 'El nombre es obligatorio.';
  if (form.correo && !EMAIL_REGEX.test(form.correo.trim()))
    errs.correo = 'Formato de correo inválido.';
  if (form.contrasena && form.contrasena.length < 6)
    errs.contrasena = 'La contraseña debe tener al menos 6 caracteres.';
  if (form.contrasena && form.contrasena !== form.confirmar)
    errs.confirmar = 'Las contraseñas no coinciden.';
  return errs;
};

const PerfilModal = ({ usuario, onClose, onGuardado }) => {
  const { actualizarPerfil } = useAppStore();

  const [form, setForm] = useState({
    nombre: usuario?.nombre || usuario?.nombreCompleto || '',
    correo: usuario?.correo || '',
    contrasena: '',
    confirmar: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setForm({
      nombre: usuario?.nombre || usuario?.nombreCompleto || '',
      correo: usuario?.correo || '',
      contrasena: '',
      confirmar: '',
    });
    setErrors({});
    setTouched({});
    setError('');
    setOk('');
    setLoading(false);
  }, [usuario]);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate(form);
    setErrors((prev) => ({ ...prev, [field]: errs[field] }));
  };

  const handleGuardar = async () => {
    setTouched({ nombre: true, correo: true, contrasena: true, confirmar: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setError('');
    setOk('');
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

  const fc = (field) =>
    `form-control ${touched[field] && errors[field] ? 'is-invalid' : touched[field] && !errors[field] && form[field] ? 'is-valid' : ''}`;

  const errMsg = (field) =>
    touched[field] && errors[field] ? (
      <div className="invalid-feedback d-flex align-items-center gap-1 mt-1">
        <span>⚠</span> {errors[field]}
      </div>
    ) : null;

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
          background: '#f97316',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          color: 'white',
        }}
      >
        <div
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: '#ffffff', display: 'flex', alignItems: 'center',
            justifyContent: 'center', border: '2px solid #f97316',
          }}
        >
          <User size={20} style={{ color: '#f97316' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>Mi Perfil</div>
          <div style={{ color: '#ffffff', fontSize: '0.8rem', opacity: 0.8 }}>
            {usuario?.rol || 'Empleado'}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', lineHeight: 1, opacity: 0.8 }}
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
        {ok && (
          <div style={{
            background: '#f0fff4', border: '1px solid #9ae6b4', borderRadius: '0.75rem',
            padding: '0.75rem 1rem', color: '#276749', fontSize: '0.875rem',
            marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 8,
          }}>
            <Check size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{ok}</span>
          </div>
        )}

        {/* Nombre */}
        <div className="mb-3">
          <label htmlFor="perfil-nombre" className="form-label fw-semibold small">
            Nombre completo <span className="text-danger">*</span>
          </label>
          <input
            id="perfil-nombre"
            className={fc('nombre')}
            value={form.nombre}
            onChange={(e) => {
              // Bloquear números en el nombre
              if (/\d/.test(e.target.value.slice(-1))) return;
              set('nombre', e.target.value);
            }}
            onBlur={() => handleBlur('nombre')}
            placeholder="Tu nombre"
          />
          {errMsg('nombre')}
        </div>

        {/* Correo */}
        <div className="mb-3">
          <label htmlFor="perfil-correo" className="form-label fw-semibold small">
            Correo electrónico
          </label>
          <input
            id="perfil-correo"
            type="email"
            className={fc('correo')}
            value={form.correo}
            onChange={(e) => set('correo', e.target.value)}
            onBlur={() => handleBlur('correo')}
            placeholder="tu@email.com"
          />
          {errMsg('correo')}
        </div>

        {/* Nueva contraseña */}
        <div className="mb-3">
          <label htmlFor="perfil-contrasena" className="form-label fw-semibold small">
            Nueva contraseña
            <span className="text-muted ms-1 fw-normal">(dejar vacío para no cambiar)</span>
          </label>
          <div className="input-group">
            <input
              id="perfil-contrasena"
              type={showPass ? 'text' : 'password'}
              className={`form-control ${touched.contrasena && errors.contrasena ? 'is-invalid' : ''}`}
              style={{ borderRight: 0 }}
              value={form.contrasena}
              onChange={(e) => {
                set('contrasena', e.target.value);
                if (touched.confirmar) {
                  setErrors((prev) => ({
                    ...prev,
                    confirmar: e.target.value !== form.confirmar ? 'Las contraseñas no coinciden.' : undefined,
                  }));
                }
              }}
              onBlur={() => handleBlur('contrasena')}
              placeholder="Dejar vacío para no cambiar"
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              style={{ borderLeft: 0 }}
              onClick={() => setShowPass((v) => !v)}
              tabIndex={-1}
              aria-label={showPass ? 'Ocultar' : 'Mostrar'}
            >
              {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errMsg('contrasena')}
          {form.contrasena && !errors.contrasena && (
            <div className="form-text">
              Seguridad: {form.contrasena.length >= 8 ? '🟢 Buena' : '🟡 Mínima (6 caracteres)'}
            </div>
          )}
        </div>

        {/* Confirmar contraseña */}
        <div className="mb-0">
          <label htmlFor="perfil-confirmar" className="form-label fw-semibold small">
            Confirmar contraseña
          </label>
          <div className="input-group">
            <input
              id="perfil-confirmar"
              type={showConfirm ? 'text' : 'password'}
              className={`form-control ${touched.confirmar && errors.confirmar ? 'is-invalid' : touched.confirmar && form.contrasena && form.confirmar && !errors.confirmar ? 'is-valid' : ''}`}
              style={{ borderRight: 0 }}
              value={form.confirmar}
              onChange={(e) => {
                set('confirmar', e.target.value);
                if (touched.confirmar) {
                  setErrors((prev) => ({
                    ...prev,
                    confirmar: form.contrasena !== e.target.value ? 'Las contraseñas no coinciden.' : undefined,
                  }));
                }
              }}
              onBlur={() => handleBlur('confirmar')}
              placeholder="••••••"
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              style={{ borderLeft: 0 }}
              onClick={() => setShowConfirm((v) => !v)}
              tabIndex={-1}
              aria-label={showConfirm ? 'Ocultar' : 'Mostrar'}
            >
              {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errMsg('confirmar')}
        </div>
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
