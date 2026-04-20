import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import AlertMessage from '../ui/AlertMessage';
import LoadingSpinner from '../ui/LoadingSpinner';
import AuthLayout from '../auth/AuthLayout';
import AuthCard from '../auth/AuthCard';
import { PrimaryButton } from '../ui/Button';
import AvisoPrivacidadModal from '../shared/AvisoPrivacidadModal';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLES_COCINA = ['COCINERO', 'CHEF', 'PARRILLERO', 'BARISTA', 'REPOSTERO'];

function resolveDestinoPorRol(rol) {
    if (rol === 'ADMIN') return '/admin';
    if (rol === 'MESERO') return '/mesero';
    if (ROLES_COCINA.includes(rol)) return '/cocina';
    return null;
}

const MeseroLogin = ({
    onLoginExitoso,
    titulo = 'Acceso al sistema',
    icono = <ChefHat size={32} />,
    demoEmail = 'admin@rest.com',
    rolesPermitidos = ['ADMIN', 'MESERO', ...ROLES_COCINA]
}) => {
    const { login } = useAppStore();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const [avisoAbierto, setAvisoAbierto] = useState(false);

    const set = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = (f) => {
        const errs = {};
        if (!f.email?.trim()) errs.email = 'El correo es obligatorio.';
        else if (!EMAIL_REGEX.test(f.email.trim())) errs.email = 'Formato de correo invalido (ej. usuario@rest.com).';
        if (!f.password) errs.password = 'La contrasena es obligatoria.';
        else if (f.password.length < 6) errs.password = 'Minimo 6 caracteres.';
        return errs;
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        const errs = validate(form);
        setErrors((prev) => ({ ...prev, [field]: errs[field] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setTouched({ email: true, password: true });
        const errs = validate(form);
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setServerError('');
        setLoading(true);
        try {
            const user = await login(form.email.trim().toLowerCase(), form.password);
            const rol = (user?.rol || '').toUpperCase();

            if (!rolesPermitidos.includes(rol)) {
                throw new Error('No tienes permisos para acceder a este portal');
            }

            const destino = resolveDestinoPorRol(rol);
            if (!destino) {
                throw new Error('Rol no reconocido en el sistema');
            }

            navigate(destino, { replace: true });

            if (onLoginExitoso) onLoginExitoso(user);
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
                subtitle="Administrador, mesero y cocina"
            >
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                        <label htmlFor="staff-email" className="form-label fw-semibold small d-flex align-items-center gap-1">
                            <Mail size={16} /> Correo electronico <span className="text-danger">*</span>
                        </label>
                        <input
                            id="staff-email"
                            type="email"
                            className={fc('email')}
                            value={form.email}
                            maxLength={150}
                            onChange={(e) => set('email', e.target.value.slice(0, 150))}
                            onBlur={() => handleBlur('email')}
                            placeholder={demoEmail}
                            style={{ borderRadius: '0.75rem' }}
                            autoFocus
                            autoComplete="email"
                            disabled={loading}
                        />
                        {touched.email && errors.email && (
                            <div className="invalid-feedback d-flex align-items-center gap-1">
                                <span>!</span> {errors.email}
                            </div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="staff-password" className="form-label fw-semibold small d-flex align-items-center gap-1">
                            <Lock size={16} /> Contrasena <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                            <input
                                id="staff-password"
                                type={showPassword ? 'text' : 'password'}
                                className={fc('password')}
                                value={form.password}
                                maxLength={255}
                                onChange={(e) => set('password', e.target.value.slice(0, 255))}
                                onBlur={() => handleBlur('password')}
                                placeholder="******"
                                style={{ borderRadius: '0.75rem 0 0 0.75rem', borderRight: 0 }}
                                autoComplete="current-password"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                style={{ borderRadius: '0 0.75rem 0.75rem 0', borderLeft: 0 }}
                                onClick={() => setShowPassword((v) => !v)}
                                tabIndex={-1}
                                aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                                disabled={loading}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {touched.password && errors.password && (
                            <div className="invalid-feedback d-flex align-items-center gap-1" style={{ display: 'flex !important' }}>
                                <span>!</span> {errors.password}
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
                            : <><LogIn size={18} className="me-2" />Iniciar sesion</>}
                    </PrimaryButton>

                    <div className="text-center mt-3">
                        <button
                            type="button"
                            className="btn btn-link p-0 small text-decoration-none"
                            onClick={() => setAvisoAbierto(true)}
                            style={{ color: '#f97316' }}
                        >
                            Aviso de privacidad
                        </button>
                    </div>
                </form>
            </AuthCard>
            <AvisoPrivacidadModal abierto={avisoAbierto} onClose={() => setAvisoAbierto(false)} />
        </AuthLayout>
    );
};

export default MeseroLogin;
