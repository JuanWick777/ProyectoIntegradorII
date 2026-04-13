import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Mail, Lock, LogIn } from 'lucide-react';
import FormInput from '../ui/FormInput';
import AlertMessage from '../ui/AlertMessage';
import LoadingSpinner from '../ui/LoadingSpinner';
import AuthLayout from '../auth/AuthLayout';
import AuthCard from '../auth/AuthCard';

const MeseroLogin = ({
    onLoginExitoso,
    titulo = 'Portal de Personal',
    icono = <ChefHat size={32} />,
    demoEmail = 'mesero@rest.com',
    rolesPermitidos = ['MESERO', 'COCINERO', 'CHEF', 'PARRILLERO', 'BARISTA', 'REPOSTERO']
}) => {
    const { login } = useAppStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(email, password);
            const rol = (user?.rol || '').toUpperCase();

            if (!rolesPermitidos.includes(rol)) {
                throw new Error('No tienes permisos para acceder a este portal');
            }

            if (rol === 'MESERO') {
                navigate('/mesero');
            } else if (
                rol === 'COCINERO' ||
                rol === 'CHEF' ||
                rol === 'PARRILLERO' ||
                rol === 'BARISTA' ||
                rol === 'REPOSTERO'
            ) {
                navigate('/cocina');
            } else {
                throw new Error('Rol no reconocido en el sistema');
            }

            if (onLoginExitoso) {
                onLoginExitoso();
            }

        } catch (err) {
            setError(err.message || 'Credenciales incorrectas.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <AuthCard
                icon={icono}
                title={titulo}
                subtitle="Sistema de Gestión de Restaurante"
            >
                <form onSubmit={handleSubmit}>
                    <FormInput
                        id="staff-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="mesero@rest.com"
                        required
                        autoFocus
                        style={{ borderRadius: '0.75rem' }}
                        label={<><Mail size={16} className="me-2" />Correo electrónico</>}
                    />

                    <FormInput
                        id="staff-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••"
                        required
                        style={{ borderRadius: '0.75rem' }}
                        label={<><Lock size={16} className="me-2" />Contraseña</>}
                    />

                    <AlertMessage message={error} className="mb-3" />

                    <button
                        type="submit"
                        className="btn btn-primary w-100 fw-bold py-2 mt-1"
                        style={{ background: '#FF7043', borderRadius: '0.75rem', border: 'none' }}
                        disabled={loading}
                    >
                        {loading
                            ? <><LoadingSpinner size="sm" className="me-2" />Ingresando...</>
                            : <><LogIn size={18} className="me-2" />Iniciar Sesión</>}
                    </button>
                </form>

                <p className="text-center text-muted small mt-3 mb-0">
                    Demo: <code>{demoEmail}</code> / <code>123456</code>
                </p>
            </AuthCard>
        </AuthLayout>
    );
};

export default MeseroLogin;