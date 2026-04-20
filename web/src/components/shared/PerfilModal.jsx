import React, { useEffect, useState } from 'react';
import { AlertTriangle, Check, Eye, EyeOff, Loader, User, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import Modal from '../ui/Modal';
import AlertMessage from '../ui/AlertMessage';
import { PrimaryButton, SecondaryButton } from '../ui/Button';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (form) => {
    const errs = {};
    if (!form.nombre?.trim()) errs.nombre = 'El nombre es obligatorio.';
    else if (form.nombre.trim().length > 200) errs.nombre = 'El nombre no puede exceder 200 caracteres.';

    if (form.correo && !EMAIL_REGEX.test(form.correo.trim())) errs.correo = 'Formato de correo invalido.';
    else if (form.correo?.trim() && form.correo.trim().length > 150) errs.correo = 'El correo no puede exceder 150 caracteres.';

    if (form.contrasena && form.contrasena.length < 6) errs.contrasena = 'La contrasena debe tener al menos 6 caracteres.';
    else if (form.contrasena && form.contrasena.length > 255) errs.contrasena = 'La contrasena no puede exceder 255 caracteres.';

    if (form.contrasena && form.contrasena !== form.confirmar) errs.confirmar = 'Las contrasenas no coinciden.';

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
        if (loading) return;
        setTouched({ nombre: true, correo: true, contrasena: true, confirmar: true });
        const errs = validate(form);
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setError('');
        setOk('');
        setLoading(true);
        try {
            await actualizarPerfil({
                nombre: form.nombre.trim(),
                correo: form.correo.trim().toLowerCase(),
                contrasena: form.contrasena || undefined,
            });
            setOk('Perfil actualizado correctamente.');
            setTimeout(() => {
                if (onGuardado) onGuardado();
                onClose();
            }, 900);
        } catch (e) {
            setError(e?.message || 'No se pudieron guardar los cambios del perfil.');
        } finally {
            setLoading(false);
        }
    };

    const fc = (field) =>
        `form-control ${touched[field] && errors[field] ? 'is-invalid' : touched[field] && !errors[field] && form[field] ? 'is-valid' : ''}`;

    const errMsg = (field) =>
        touched[field] && errors[field] ? (
            <div className="invalid-feedback d-flex align-items-center gap-1 mt-1">
                <span>!</span> {errors[field]}
            </div>
        ) : null;

    return (
        <Modal
            onClose={loading ? undefined : onClose}
            closeOnBackdrop={!loading}
            showCloseButton={false}
            size="md"
            className="border-0"
            bodyClassName="p-0"
            footer={null}
        >
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
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #f97316',
                    }}
                >
                    <User size={20} style={{ color: '#f97316' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>Mi perfil</div>
                    <div style={{ color: '#ffffff', fontSize: '0.8rem', opacity: 0.8 }}>
                        {usuario?.rol || 'Empleado'}
                    </div>
                </div>
                <button
                    onClick={onClose}
                    style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', lineHeight: 1, opacity: 0.8 }}
                    aria-label="Cerrar"
                    type="button"
                    disabled={loading}
                >
                    <X size={18} />
                </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
                <AlertMessage
                    message={error}
                    className={error ? 'mb-3' : ''}
                    icon={<AlertTriangle size={16} />}
                    showBootstrapIcon={false}
                />
                {ok && (
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
                )}

                <div className="mb-3">
                    <label htmlFor="perfil-nombre" className="form-label fw-semibold small">
                        Nombre completo <span className="text-danger">*</span>
                    </label>
                    <input
                        id="perfil-nombre"
                        className={fc('nombre')}
                        value={form.nombre}
                        maxLength={200}
                        onChange={(e) => {
                            const nextValue = e.target.value.slice(0, 200);
                            if (/[^A-Za-zÀ-ÿ\s.'-]/.test(nextValue.slice(-1))) return;
                            set('nombre', nextValue);
                        }}
                        onBlur={() => handleBlur('nombre')}
                        placeholder="Tu nombre"
                        disabled={loading}
                    />
                    {errMsg('nombre')}
                </div>

                <div className="mb-3">
                    <label htmlFor="perfil-correo" className="form-label fw-semibold small">
                        Correo electronico
                    </label>
                    <input
                        id="perfil-correo"
                        type="email"
                        className={fc('correo')}
                        value={form.correo}
                        maxLength={150}
                        onChange={(e) => set('correo', e.target.value.slice(0, 150))}
                        onBlur={() => handleBlur('correo')}
                        placeholder="tu@email.com"
                        disabled={loading}
                    />
                    {errMsg('correo')}
                </div>

                <div className="mb-3">
                    <label htmlFor="perfil-contrasena" className="form-label fw-semibold small">
                        Nueva contrasena
                        <span className="text-muted ms-1 fw-normal">(dejar vacio para no cambiar)</span>
                    </label>
                    <div className="input-group">
                        <input
                            id="perfil-contrasena"
                            type={showPass ? 'text' : 'password'}
                            className={`form-control ${touched.contrasena && errors.contrasena ? 'is-invalid' : ''}`}
                            style={{ borderRight: 0 }}
                            value={form.contrasena}
                            maxLength={255}
                            onChange={(e) => {
                                const nextValue = e.target.value.slice(0, 255);
                                set('contrasena', nextValue);
                                if (touched.confirmar) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        confirmar: nextValue !== form.confirmar ? 'Las contrasenas no coinciden.' : undefined,
                                    }));
                                }
                            }}
                            onBlur={() => handleBlur('contrasena')}
                            placeholder="Dejar vacio para no cambiar"
                            disabled={loading}
                        />
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            style={{ borderLeft: 0 }}
                            onClick={() => setShowPass((v) => !v)}
                            tabIndex={-1}
                            aria-label={showPass ? 'Ocultar' : 'Mostrar'}
                            disabled={loading}
                        >
                            {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                    </div>
                    {errMsg('contrasena')}
                </div>

                <div className="mb-0">
                    <label htmlFor="perfil-confirmar" className="form-label fw-semibold small">
                        Confirmar contrasena
                    </label>
                    <div className="input-group">
                        <input
                            id="perfil-confirmar"
                            type={showConfirm ? 'text' : 'password'}
                            className={`form-control ${touched.confirmar && errors.confirmar ? 'is-invalid' : touched.confirmar && form.contrasena && form.confirmar && !errors.confirmar ? 'is-valid' : ''}`}
                            style={{ borderRight: 0 }}
                            value={form.confirmar}
                            maxLength={255}
                            onChange={(e) => {
                                const nextValue = e.target.value.slice(0, 255);
                                set('confirmar', nextValue);
                                if (touched.confirmar) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        confirmar: form.contrasena !== nextValue ? 'Las contrasenas no coinciden.' : undefined,
                                    }));
                                }
                            }}
                            onBlur={() => handleBlur('confirmar')}
                            placeholder="******"
                            disabled={loading}
                        />
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            style={{ borderLeft: 0 }}
                            onClick={() => setShowConfirm((v) => !v)}
                            tabIndex={-1}
                            aria-label={showConfirm ? 'Ocultar' : 'Mostrar'}
                            disabled={loading}
                        >
                            {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                    </div>
                    {errMsg('confirmar')}
                </div>
            </div>

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
