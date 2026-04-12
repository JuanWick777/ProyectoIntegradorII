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
                    background: 'linear-gradient(180deg,#1a1a2e 0%,#0f3460 100%)',
                    zIndex: 1050,
                    transition: 'width 0.28s cubic-bezier(.4,0,.2,1)',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '4px 0 24px rgba(0,0,0,.15)',
                    overflow: 'hidden'
                }}
            >
                {/* Header del Sidebar */}
                <div style={{
                    padding: isOpen ? '1.25rem' : '1.25rem 0.5rem',
                    borderBottom: `2px solid rgba(${hexToRgb(accentColor)},0.35)`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isOpen ? 'stretch' : 'center',
                    transition: 'all 0.28s'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        marginBottom: isOpen ? 12 : 0,
                        justifyContent: isOpen ? 'flex-start' : 'center'
                    }}>
                        <div style={{
                            width: 42, height: 42, borderRadius: '50%',
                            background: `rgba(${hexToRgb(accentColor)},0.2)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 20, flexShrink: 0,
                        }}>
                            {usuario?.fotoPerfil ? (
                                <img src={usuario.fotoPerfil} alt="perfil" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                                '👤'
                            )}
                        </div>

                        {isOpen && (
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    color: 'white', fontWeight: 700,
                                    fontSize: '0.9rem', lineHeight: 1.2,
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}>
                                    {usuario?.nombre || 'Usuario'}
                                </div>
                                <div style={{ color: accentColor, fontSize: '0.75rem' }}>
                                    {rolLabel}
                                </div>
                            </div>
                        )}

                        {isOpen && (
                            <button
                                onClick={() => setIsPinned(!isPinned)}
                                title={isPinned ? "Desanclar" : "Anclar"}
                                style={{
                                    background: 'none', border: 'none',
                                    color: isPinned ? accentColor : 'rgba(255,255,255,0.5)',
                                    fontSize: 18, cursor: 'pointer', lineHeight: 1, flexShrink: 0,
                                }}
                            >
                                📌
                            </button>
                        )}
                    </div>

                    {isOpen && (
                        <button
                            onClick={() => setPerfilAbierto(true)}
                            style={{
                                width: '100%',
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '0.55rem 0.875rem',
                                borderRadius: '0.65rem',
                                border: `1px solid rgba(${hexToRgb(accentColor)},0.35)`,
                                background: `rgba(${hexToRgb(accentColor)},0.12)`,
                                color: 'white',
                                fontWeight: 600, fontSize: '0.85rem',
                                cursor: 'pointer',
                            }}
                        >
                            <span>✏️</span> Editar perfil
                        </button>
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
                                fontWeight: 600, fontSize: '0.9rem',
                                background: activeItem === item.id
                                    ? `rgba(${hexToRgb(accentColor)},0.2)`
                                    : 'transparent',
                                color: activeItem === item.id ? 'white' : 'rgba(255,255,255,0.82)',
                                borderLeft: activeItem === item.id
                                    ? `3px solid ${accentColor}`
                                    : '3px solid transparent',
                                transition: 'all 0.15s',
                            }}
                        >
                            <span style={{ fontSize: 20 }}>{item.icon}</span>
                            {isOpen && <span>{item.label}</span>}
                        </button>
                    ))}
                </div>

                {/* Logout */}
                <div style={{ padding: isOpen ? '0.75rem' : '0.75rem 0.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <button
                        onClick={handleLogout}
                        title={!isOpen ? 'Cerrar Sesión' : ''}
                        style={{
                            width: '100%',
                            display: 'flex', alignItems: 'center',
                            gap: isOpen ? 12 : 0,
                            justifyContent: isOpen ? 'flex-start' : 'center',
                            padding: isOpen ? '0.7rem 1rem' : '0.7rem 0',
                            borderRadius: '0.75rem',
                            border: '1px solid rgba(220,53,69,0.4)',
                            cursor: 'pointer',
                            fontWeight: 600, fontSize: '0.9rem',
                            background: 'rgba(220,53,69,0.12)',
                            color: '#ff6b6b',
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,53,69,0.28)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(220,53,69,0.12)'}
                    >
                        <span style={{ fontSize: 20, transform: isOpen ? 'none' : 'translateX(3px)' }}>🚪</span>
                        {isOpen && 'Cerrar Sesión'}
                    </button>
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
