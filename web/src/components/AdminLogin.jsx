import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Shield, Mail, Lock, LogIn } from 'lucide-react';

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
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center"
            style={{ background: '#F5F5F5' }}
        >
            <div className="card border-0 shadow-lg p-4" style={{ width: '100%', maxWidth: 400, borderRadius: '1.25rem' }}>
                <div className="card-body">
                    <div className="text-center mb-4">
                        <div
                            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                            style={{ width: 64, height: 64, background: '#FFF5F0', color: '#FF7043', fontSize: 28 }}
                        >
                            <Shield size={32} />
                        </div>
                        <h1 className="fs-4 fw-bold mb-0">Acceso Administrativo</h1>
                        <p className="text-muted small mt-1">Gestión de Restaurante</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger py-2 small" style={{ borderRadius: '0.75rem' }}>
                            <i className="bi bi-exclamation-triangle me-2"></i>{error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold small">
                                <Mail size={16} className="me-2" />
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                style={{ borderRadius: '0.75rem' }}
                                value={credentials.email}
                                onChange={handleChange}
                                placeholder="admin@rest.com"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold small">
                                <Lock size={16} className="me-2" />
                                Contraseña
                            </label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                style={{ borderRadius: '0.75rem' }}
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder="••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 fw-bold py-2 mt-1"
                            style={{ background: '#FF7043', borderRadius: '0.75rem', border: 'none' }}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner-border spinner-border-sm me-2" />
                            ) : (
                                <LogIn size={18} className="me-2" />
                            )}
                            Ingresar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;