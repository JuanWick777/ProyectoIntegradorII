import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import AlertMessage from '../ui/AlertMessage';
import LoadingSpinner from '../ui/LoadingSpinner';
import AuthLayout from '../auth/AuthLayout';
import AuthCard from '../auth/AuthCard';
import { PrimaryButton } from '../ui/Button';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MeseroLogin = ({
    onLoginExitoso,
    titulo = 'Portal de Personal',
    icono = <ChefHat size={32} />,
    demoEmail = 'mesero@rest.com',
    rolesPermitidos = ['MESERO', 'COCINERO', 'CHEF', 'PARRILLERO', 'BARISTA', 'REPOSTERO']
}) => {
    const { login } = useAppStore();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const set = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = (f) => {
        const errs = {};
        if (!f.email?.trim()) errs.email = 'El correo es obligatorio.';
        else if (!EMAIL_REGEX.test(f.email.trim())) errs.email = 'Formato de correo inválido (ej. usuario@rest.com).';
        if (!f.password) errs.password = 'La contraseña es obligatoria.';
        else if (f.password.length < 6) errs.password = 'Mínimo 6 caracteres.';
        return errs;
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        const errs = validate(form);
        setErrors((prev) => ({ ...prev, [field]: errs[field] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({ email: true, password: true });
        const errs = validate(form);
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setServerError('');
        setLoading(true);
        try {
            const user = await login(form.email, form.password);
            const rol = (user?.rol || '').toUpperCase();

            if (!rolesPermitidos.includes(rol)) {
                throw new Error('No tienes permisos para acceder a este portal');
            }

            if (rol === 'MESERO') {
                navigate('/mesero');
            } else if (['COCINERO', 'CHEF', 'PARRILLERO', 'BARISTA', 'REPOSTERO'].includes(rol)) {
                navigate('/cocina');
            } else {
                throw new Error('Rol no reconocido en el sistema');
            }

            if (onLoginExitoso) onLoginExitoso();
        } catch (err) {
            setServerError(err.message || 'Credenciales incorrectas. Verifica e intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const fc = (field) =>
        `form-control ${touched[field] && errors[field] ? 'is-invalid' : touched[field] && !errors[field] && form[field] ? 'is-valid' : ''}`;

    return (
        <AuthLayout>
            <AuthCard
                icon={icono}
                title={titulo}
                subtitle="Sistema de Gestión de Restaurante"
            >
                <form onSubmit={handleSubmit} noValidate>
                    {/* Email */}
                    <div className="mb-3">
                        <label htmlFor="staff-email" className="form-label fw-semibold small d-flex align-items-center gap-1">
                            <Mail size={16} /> Correo electrónico <span className="text-danger">*</span>
                        </label>
                        <input
                            id="staff-email"
                            type="email"
                            className={fc('email')}
                            value={form.email}
                            onChange={(e) => set('email', e.target.value)}
                            onBlur={() => handleBlur('email')}
                            placeholder={demoEmail}
                            style={{ borderRadius: '0.75rem' }}
                            autoFocus
                            autoComplete="email"
                        />
                        {touched.email && errors.email && (
                            <div className="invalid-feedback d-flex align-items-center gap-1">
                                <span>⚠</span> {errors.email}
                            </div>
                        )}
                    </div>

                    {/* Contraseña */}
                    <div className="mb-3">
                        <label htmlFor="staff-password" className="form-label fw-semibold small d-flex align-items-center gap-1">
                            <Lock size={16} /> Contraseña <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                            <input
                                id="staff-password"
                                type={showPassword ? 'text' : 'password'}
                                className={fc('password')}
                                value={form.password}
                                onChange={(e) => set('password', e.target.value)}
                                onBlur={() => handleBlur('password')}
                                placeholder="••••••"
                                style={{ borderRadius: '0.75rem 0 0 0.75rem', borderRight: 0 }}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                style={{ borderRadius: '0 0.75rem 0.75rem 0', borderLeft: 0 }}
                                onClick={() => setShowPassword((v) => !v)}
                                tabIndex={-1}
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {touched.password && errors.password && (
                            <div className="invalid-feedback d-flex align-items-center gap-1" style={{ display: 'flex !important' }}>
                                <span>⚠</span> {errors.password}
                            </div>
                        )}
                    </div>

                    <AlertMessage message={serverError} className="mb-3" />

                    <PrimaryButton
                        type="submit"
                        className="w-100 fw-bold py-2 mt-1"
                        style={{ borderRadius: '0.75rem', border: 'none' }}
                        disabled={loading}
                    >
                        {loading
                            ? <><LoadingSpinner size="sm" className="me-2" />Ingresando...</>
                            : <><LogIn size={18} className="me-2" />Iniciar Sesión</>}
                    </PrimaryButton>
                </form>

                <p className="text-center text-muted small mt-3 mb-0">
                    Demo: <code>{demoEmail}</code> / <code>123456</code>
                </p>
            </AuthCard>
        </AuthLayout>
    );
};

export default MeseroLogin;