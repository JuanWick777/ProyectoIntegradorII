import React, { useState } from 'react';
import { User, Edit2, X, Shield, ChefHat, Flame, Coffee, Cake, LogOut } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import PerfilModal from './PerfilModal';

// ─────────────────────────────────────────────────────────────────────────────
// Menú hamburguesa principal (reutilizable)
// Props:
//   navItems: [{ id, icon, label, onClick? }]  → items del menú (opcional)
//   activeItem: string                          → id del item activo
//   onLogout: () => void                        → callback al cerrar sesión
//   loginPath: string                           → ruta al login (/admin/login o /login)
//   accentColor: string                         → color acento (default #e67e22)
// ─────────────────────────────────────────────────────────────────────────────
const HamburgerMenu = ({
    navItems = [],
    activeItem = '',
    onNavItemClick,
    onLogout,
    loginPath = '/login',
    accentColor = '#e67e22',
} = {}) => {

    const { usuario, logout, fetchCurrentUser } = useAppStore();

    const [abierto, setAbierto] = useState(false);
    const [perfilAbierto, setPerfilAbierto] = useState(false);
    const rolLabel = {
        ADMIN: { icon: Shield, label: 'Administrador' },
        MESERO: { icon: User, label: 'Mesero' },
        COCINERO: { icon: ChefHat, label: 'Cocinero' },
        CHEF: { icon: ChefHat, label: 'Chef' },
        PARRILLERO: { icon: Flame, label: 'Parrillero' },
        BARISTA: { icon: Coffee, label: 'Barista' },
        REPOSTERO: { icon: Cake, label: 'Repostero' },
    }[usuario?.rol] || { icon: User, label: 'Empleado' };
    
    const RolIcon = rolLabel.icon
    const handleLogout = async () => {
        setAbierto(false);
        if (onLogout) {
            await onLogout();
        } else {
            await logout();
            window.location.replace(loginPath);
        }
    };

    return (
        <>
            {/* ── Botón hamburguesa (se renderiza inline, el padre lo posiciona) */}
            <button
                onClick={() => setAbierto(true)}
                style={{
                    background: 'none', border: 'none',
                    color: accentColor, fontSize: 28,
                    cursor: 'pointer', padding: '4px 8px',
                    borderRadius: '0.5rem', lineHeight: 1,
                    transition: 'transform 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                title="Menú"
            >☰</button>

            {/* ── Overlay */}
            {abierto && (
                <div
                    onClick={() => setAbierto(false)}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.45)',
                        zIndex: 1040,
                        backdropFilter: 'blur(2px)',
                    }}
                />
            )}

            {/* ── Panel lateral */}
            <div style={{
                position: 'fixed', top: 0, left: 0,
                height: '100vh', width: 270,
                background: 'linear-gradient(180deg,#1a1a2e 0%,#0f3460 100%)',
                zIndex: 1050,
                transform: abierto ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.28s cubic-bezier(.4,0,.2,1)',
                display: 'flex', flexDirection: 'column',
                boxShadow: '4px 0 24px rgba(0,0,0,.35)',
            }}>
                {/* Header del panel - Cierre */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1rem',
                    borderBottom: `1px solid rgba(${hexToRgb(accentColor)},0.2)`,
                }}>
                    <User size={20} style={{ color: accentColor }} />
                    <button
                        onClick={() => setAbierto(false)}
                        style={{
                            background: 'none', border: 'none',
                            color: 'rgba(255,255,255,0.5)', fontSize: 18,
                            cursor: 'pointer', lineHeight: 1, flexShrink: 0,
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Header del panel */}
                <div style={{
                    padding: '1.25rem',
                    borderBottom: `2px solid rgba(${hexToRgb(accentColor)},0.35)`,
                }}>
                    {/* Info del usuario */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <div style={{
                            width: 42, height: 42,
                            borderRadius: '50%',
                            background: `rgba(${hexToRgb(accentColor)},0.2)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 20, flexShrink: 0,
                        }}>
                            <RolIcon size={14} style={{ display: 'inline', marginRight: 4 }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                color: 'white', fontWeight: 700,
                                fontSize: '0.9rem', lineHeight: 1.2,
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                                {usuario?.nombre || 'Usuario'}
                            </div>
                            <div style={{ color: accentColor, fontSize: '0.75rem' }}>
                                {rolLabel.label}
                            </div>
                        </div>
                    </div>

                    {/* Botón editar perfil */}
                    <button
                        onClick={() => { setAbierto(false); setPerfilAbierto(true); }}
                        style={{
                            width: '100%',
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '0.55rem 0.875rem',
                            borderRadius: '0.65rem',
                            border: `1px solid rgba(${hexToRgb(accentColor)},0.35)`,
                            background: `rgba(${hexToRgb(accentColor)},0.12)`,
                            color: accentColor,
                            fontWeight: 600, fontSize: '0.85rem',
                            cursor: 'pointer',
                        }}
                    >
                        <Edit2 size={16} /> Editar mi perfil
                    </button>
                </div>

                {/* Items de navegación */}
                {navItems.length > 0 && (
                    <div style={{ flex: 1, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setAbierto(false);
                                    if (item.onClick) item.onClick();
                                    else if (onNavItemClick) onNavItemClick(item.id);
                                }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '0.7rem 1rem',
                                    borderRadius: '0.75rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 600, fontSize: '0.9rem',
                                    background: activeItem === item.id
                                        ? `rgba(${hexToRgb(accentColor)},0.2)`
                                        : 'transparent',
                                    color: activeItem === item.id ? accentColor : 'rgba(255,255,255,0.82)',
                                    borderLeft: activeItem === item.id
                                        ? `3px solid ${accentColor}`
                                        : '3px solid transparent',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <span style={{ fontSize: 18 }}>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Separador vacío si no hay items */}
                {navItems.length === 0 && <div style={{ flex: 1 }} />}

                {/* Botón Cerrar Sesión */}
                <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '0.7rem 1rem',
                            borderRadius: '0.75rem',
                            border: '1px solid rgba(220,53,69,0.4)',
                            cursor: 'pointer',
                            fontWeight: 600, fontSize: '0.9rem',
                            background: 'rgba(220,53,69,0.12)',
                            color: '#ff6b6b',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,53,69,0.28)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(220,53,69,0.12)'}
                    >
                        <LogOut size={18} />
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* Modal de perfil */}
            {perfilAbierto && (
                <PerfilModal
                    usuario={usuario}
                    onClose={() => setPerfilAbierto(false)}
                    onGuardado={() => fetchCurrentUser().catch(() => {})}
                />
            )}
        </>
    );
};

// Helper para convertir hex a rgb
function hexToRgb(hex) {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : '230,126,34';
}

export default HamburgerMenu;
