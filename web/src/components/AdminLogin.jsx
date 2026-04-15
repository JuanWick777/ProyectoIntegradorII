import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Shield, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import AlertMessage from './ui/AlertMessage';
import LoadingSpinner from './ui/LoadingSpinner';
import AuthLayout from './auth/AuthLayout';
import AuthCard from './auth/AuthCard';
import { PrimaryButton } from './ui/Button';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AdminLogin = ({ onLoginExitoso }) => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [serverError, setServerError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAppStore();

    const set = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = (f) => {
        const errs = {};
        if (!f.email?.trim()) errs.email = 'El correo es obligatorio.';
        else if (!EMAIL_REGEX.test(f.email.trim())) errs.email = 'Formato de correo inválido.';
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

        setServerError(null);
        setLoading(true);
        try {
            const user = await login(form.email, form.password);
            const rol = (user?.rol || '').toUpperCase();
            if (rol !== 'ADMIN') throw new Error('No tienes permisos de administrador');
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
                icon={<Shield size={32} />}
                title="Acceso Administrativo"
                subtitle="Gestión de Restaurante"
            >
                <AlertMessage message={serverError} />

                <form onSubmit={handleSubmit} noValidate>
                    {/* Email */}
                    <div className="mb-3">
                        <label htmlFor="admin-email" className="form-label fw-semibold small d-flex align-items-center gap-1">
                            <Mail size={16} /> Correo electrónico <span className="text-danger">*</span>
                        </label>
                        <input
                            id="admin-email"
                            type="email"
                            className={fc('email')}
                            value={form.email}
                            onChange={(e) => set('email', e.target.value)}
                            onBlur={() => handleBlur('email')}
                            placeholder="admin@rest.com"
                            style={{ borderRadius: '0.75rem' }}
                            autoComplete="email"
                        />
                        {touched.email && errors.email && (
                            <div className="invalid-feedback d-flex align-items-center gap-1">
                                <span>⚠</span> {errors.email}
                            </div>
                        )}
                    </div>

                    {/* Contraseña */}
                    <div className="mb-4">
                        <label htmlFor="admin-password" className="form-label fw-semibold small d-flex align-items-center gap-1">
                            <Lock size={16} /> Contraseña <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                            <input
                                id="admin-password"
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

                    <PrimaryButton
                        type="submit"
                        className="w-100 fw-bold py-2 mt-1"
                        style={{ borderRadius: '0.75rem', border: 'none' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <LoadingSpinner size="sm" className="me-2" />
                        ) : (
                            <LogIn size={18} className="me-2" />
                        )}
                        Ingresar
                    </PrimaryButton>
                </form>
            </AuthCard>
        </AuthLayout>
    );
};

export default AdminLogin;