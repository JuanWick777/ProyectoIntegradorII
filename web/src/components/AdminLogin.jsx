import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Shield, Mail, Lock, LogIn } from 'lucide-react';
import FormInput from './ui/FormInput';
import AlertMessage from './ui/AlertMessage';
import LoadingSpinner from './ui/LoadingSpinner';
import AuthLayout from './auth/AuthLayout';
import AuthCard from './auth/AuthCard';
import { PrimaryButton } from './ui/Button';

const AdminLogin = ({ onLoginExitoso }) => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAppStore();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const user = await login(credentials.email, credentials.password);
            const rol = (user?.rol || '').toUpperCase();

            if (rol !== 'ADMIN') {
                throw new Error('No tienes permisos de administrador');
            }

            if (onLoginExitoso) {
                onLoginExitoso();
            }
        } catch (err) {
            console.error('ERROR LOGIN:', err);
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <AuthCard
                icon={<Shield size={32} />}
                title="Acceso Administrativo"
                subtitle="Gestión de Restaurante"
            >
                <AlertMessage message={error} />

                <form onSubmit={handleSubmit}>
                    <FormInput
                        id="admin-email"
                        type="email"
                        value={credentials.email}
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        placeholder="admin@rest.com"
                        required
                        style={{ borderRadius: '0.75rem' }}
                        label={<><Mail size={16} className="me-2" />Correo electrónico</>}
                    />

                    <FormInput
                        id="admin-password"
                        type="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        placeholder="••••••"
                        required
                        style={{ borderRadius: '0.75rem' }}
                        wrapperClassName="mb-4"
                        label={<><Lock size={16} className="me-2" />Contraseña</>}
                    />

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