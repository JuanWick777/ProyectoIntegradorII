import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

// ─────────────────────────────────────────────────────────────────────────────
// Modal de edición de perfil (Adaptado de HamburgerMenu)
// ─────────────────────────────────────────────────────────────────────────────
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

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleGuardar = async () => {
        setError(''); setOk('');

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
            setOk('✅ Perfil actualizado correctamente');
            setTimeout(() => { onGuardado(); onClose(); }, 1200);
        } catch (e) {
            setError(e.message || 'Error al guardar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.6)',
                zIndex: 2000,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '1rem',
            }}
            onClick={onClose}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'white',
                    borderRadius: '1.25rem',
                    width: '100%', maxWidth: 420,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    overflow: 'hidden',
                }}
            >
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
                    padding: '1.25rem 1.5rem',
                    display: 'flex', alignItems: 'center', gap: 12,
                }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: 'rgba(230,126,34,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 22,
                    }}>👤</div>
                    <div>
                        <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                            Mi Perfil
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                            {usuario?.rol || 'Empleado'}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            marginLeft: 'auto', background: 'none', border: 'none',
                            color: 'rgba(255,255,255,0.6)', fontSize: 22, cursor: 'pointer',
                        }}
                    >✕</button>
                </div>

                {/* Body */}
                <div style={{ padding: '1.5rem' }}>
                    {error && (
                        <div style={{
                            background: '#fff5f5', border: '1px solid #feb2b2',
                            borderRadius: '0.75rem', padding: '0.75rem 1rem',
                            color: '#c53030', fontSize: '0.875rem', marginBottom: 16,
                        }}>⚠️ {error}</div>
                    )}
                    {ok && (
                        <div style={{
                            background: '#f0fff4', border: '1px solid #9ae6b4',
                            borderRadius: '0.75rem', padding: '0.75rem 1rem',
                            color: '#276749', fontSize: '0.875rem', marginBottom: 16,
                        }}>{ok}</div>
                    )}

                    {[
                        { label: 'Nombre completo', key: 'nombre', type: 'text', placeholder: 'Tu nombre' },
                        { label: 'Correo electrónico', key: 'correo', type: 'email', placeholder: 'tu@email.com' },
                        { label: 'Nueva contraseña', key: 'contrasena', type: 'password', placeholder: 'Dejar vacío para no cambiar' },
                        { label: 'Confirmar contraseña', key: 'confirmar', type: 'password', placeholder: '••••••' },
                    ].map(field => (
                        <div key={field.key} style={{ marginBottom: 14 }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.8rem', fontWeight: 600, color: '#4a5568',
                                marginBottom: 5,
                            }}>{field.label}</label>
                            <input
                                type={field.type}
                                value={form[field.key]}
                                onChange={e => set(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                style={{
                                    width: '100%', padding: '0.6rem 0.875rem',
                                    border: '1.5px solid #e2e8f0',
                                    borderRadius: '0.65rem',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.15s',
                                }}
                                onFocus={e => e.target.style.borderColor = '#e67e22'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '0 1.5rem 1.5rem',
                    display: 'flex', gap: 10,
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1, padding: '0.7rem',
                            borderRadius: '0.75rem',
                            border: '1.5px solid #e2e8f0',
                            background: 'white',
                            color: '#718096',
                            fontWeight: 600, cursor: 'pointer',
                        }}
                    >Cancelar</button>
                    <button
                        onClick={handleGuardar}
                        disabled={loading}
                        style={{
                            flex: 2, padding: '0.7rem',
                            borderRadius: '0.75rem',
                            border: 'none',
                            background: loading ? '#cbd5e0' : 'linear-gradient(135deg, #e67e22, #d35400)',
                            color: 'white',
                            fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '0.95rem',
                        }}
                    >
                        {loading ? '⏳ Guardando...' : '💾 Guardar cambios'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper para convertir hex a rgb
function hexToRgb(hex) {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? `${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)}` : '230,126,34';
}

const AdminSidebar = ({
    navItems = [],
    activeItem = '',
    onNavItemClick,
    onLogout,
    loginPath = '/login',
    accentColor = '#e67e22',
    isPinned,
    setIsPinned
}) => {
    const { usuario, logout, fetchCurrentUser } = useAppStore();
    const [isHovered, setIsHovered] = useState(false);
    const [perfilAbierto, setPerfilAbierto] = useState(false);

    const handleLogout = async () => {
        if (onLogout) {
            await onLogout();
        } else {
            await logout();
            window.location.replace(loginPath);
        }
    };

    const rolLabel = {
        ADMIN: '🛡️ Administrador',
        MESERO: '🧑‍🍽️ Mesero',
        COCINERO: '👨‍🍳 Cocinero',
        CHEF: '👨‍🍳 Chef',
        PARRILLERO: '🔥 Parrillero',
        BARISTA: '☕ Barista',
        REPOSTERO: '🍰 Repostero',
    }[usuario?.rol] || '👤 Empleado';

    const isOpen = isPinned || isHovered;
    const sidebarWidth = isOpen ? 260 : 70;

    return (
        <>
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    width: sidebarWidth,
                    background: '#FFFFFF',
                    zIndex: 1050,
                    transition: 'width 0.28s cubic-bezier(.4,0,.2,1)',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '2px 0 8px rgba(0,0,0,.08)',
                    overflow: 'hidden'
                }}
            >
                {/* Header del Sidebar */}
                <div style={{
                    padding: isOpen ? '1.25rem' : '1.25rem 0.5rem',
                    borderBottom: `1px solid #E8E8E8`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isOpen ? 'stretch' : 'center',
                    transition: 'all 0.28s'
                }}>
                    {isOpen && (
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ color: '#2C2C2C', fontWeight: 700, fontSize: '1rem', lineHeight: 1.1, marginBottom: 4 }}>
                                Restaurant Admin
                            </div>
                            <div style={{ color: '#999999', fontSize: '0.85rem' }}>
                                Sistema de Gestión
                            </div>
                        </div>
                    )}
                </div>

                {/* Items de Navegación */}
                <div style={{ flex: 1, padding: isOpen ? '0.75rem' : '0.75rem 0.25rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => {
                                if (item.onClick) item.onClick();
                                else if (onNavItemClick) onNavItemClick(item.id);
                            }}
                            title={!isOpen ? item.label : ''}
                            style={{
                                display: 'flex', alignItems: 'center',
                                gap: isOpen ? 12 : 0,
                                justifyContent: isOpen ? 'flex-start' : 'center',
                                padding: isOpen ? '0.7rem 1rem' : '0.7rem 0',
                                borderRadius: '0.75rem',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 600, fontSize: '0.95rem',
                                background: activeItem === item.id
                                    ? '#FFF5F0'
                                    : 'transparent',
                                color: activeItem === item.id ? '#FF7043' : '#666666',
                                transition: 'all 0.15s',
                            }}
                        >
                            {typeof item.icon === 'string' ? (
                                <i className={item.icon} style={{ fontSize: 18 }}></i>
                            ) : (
                                item.icon
                            )}
                            {isOpen && <span>{item.label}</span>}
                        </button>
                    ))}
                </div>


            </div>

            {perfilAbierto && (
                <PerfilModal
                    usuario={usuario}
                    onClose={() => setPerfilAbierto(false)}
                    onGuardado={() => fetchCurrentUser().catch(() => { })}
                />
            )}
        </>
    );
};

export default AdminSidebar;
