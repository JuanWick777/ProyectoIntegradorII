import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { User, Shield, UserCheck, ChefHat, Flame, Coffee, Cake, Settings, LogOut, Edit2 } from 'lucide-react';
import PerfilModal from '../shared/PerfilModal';

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

    const getRolDisplay = (rol) => {
        const roleIcons = {
            ADMIN: Shield,
            MESERO: UserCheck,
            COCINERO: ChefHat,
            CHEF: ChefHat,
            PARRILLERO: Flame,
            BARISTA: Coffee,
            REPOSTERO: Cake,
        };
        const IconComponent = roleIcons[rol] || User;
        const roleLabels = {
            ADMIN: 'Administrador',
            MESERO: 'Mesero',
            COCINERO: 'Cocinero',
            CHEF: 'Chef',
            PARRILLERO: 'Parrillero',
            BARISTA: 'Barista',
            REPOSTERO: 'Repostero',
        };
        return { Icon: IconComponent, label: roleLabels[rol] || 'Empleado' };
    };

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
