import React, { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import SectionHeader from '../ui/SectionHeader';
import DataTable from '../ui/DataTable';
import UsuarioModal from './UsuarioModal';
import { PlusCircle, Edit2, Trash2, AlertTriangle, Shield, UserCheck, User, ChefHat, Search, SlidersHorizontal } from 'lucide-react';
import { normalizeRole, getUserEmail, getUserRole, ROL_BADGE, isUserActive } from './adminConstants';
import ConfirmModal from '../ui/ConfirmModal';
import { PrimaryButton, SecondaryButton, DangerButton } from '../ui/Button';

const PersonalAdmin = ({ mostrarToast }) => {
    const { fetchUsuarios, fetchMesas, createUsuario, updateUsuario, deleteUsuario } = useAppStore();
    const [usuarios, setUsuarios] = useState([]);
    const [mesas, setMesas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [saving, setSaving] = useState(false);
    const [confirmDel, setConfirmDel] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('todos');
    const [statusFilter, setStatusFilter] = useState('todos');
    const [sortBy, setSortBy] = useState('nombre');

    const cargar = async () => {
        setLoading(true);
        try {
            const [uList, mesasList] = await Promise.all([
                fetchUsuarios(),
                fetchMesas().catch(() => []),
            ]);
            const empleadosList = (uList || []).filter((u) => u.rol && u.rol.toLowerCase() !== 'cliente');
            setUsuarios(empleadosList);
            setMesas(mesasList || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    const roleOptions = useMemo(() => (
        [{ value: 'todos', label: 'Todos los roles' }]
            .concat(Object.entries(ROL_BADGE).map(([key, value]) => ({ value: key, label: value.label })))
    ), []);

    const sortedUsuarios = useMemo(() => {
        const filtered = usuarios.filter((u) => {
            const nombre = (u.nombre || '').toString().toLowerCase();
            const email = getUserEmail(u).toLowerCase();
            const rol = getUserRole(u);
            const estado = isUserActive(u) ? 'activo' : 'inactivo';
            const query = searchQuery.toLowerCase().trim();

            if (query && !(nombre.includes(query) || email.includes(query))) return false;
            if (roleFilter !== 'todos' && rol !== roleFilter) return false;
            if (statusFilter !== 'todos' && estado !== statusFilter) return false;
            return true;
        });

        return filtered.sort((a, b) => {
            const aValue = (sortBy === 'rol' ? getUserRole(a) : (a.nombre || '')).toString().toLowerCase();
            const bValue = (sortBy === 'rol' ? getUserRole(b) : (b.nombre || '')).toString().toLowerCase();
            return aValue.localeCompare(bValue);
        });
    }, [usuarios, searchQuery, roleFilter, statusFilter, sortBy]);

    const mesasOcupadasMap = useMemo(() => {
        const ocupadas = new Map();

        usuarios.forEach((usuario) => {
            const rol = getUserRole(usuario);
            if (rol !== 'mesero') return;

            const mesaIds = Array.isArray(usuario.mesaIds) ? usuario.mesaIds : [];
            mesaIds.forEach((mesaId) => {
                if (!mesaId) return;
                ocupadas.set(mesaId, {
                    usuarioId: usuario.id,
                    nombre: usuario.nombre || 'Mesero asignado',
                });
            });
        });

        return ocupadas;
    }, [usuarios]);

    const handleSave = async (form) => {
        if (saving) return;
        setSaving(true);
        try {
            const payload = {
                nombre: form.nombre,
                email: form.email,
                password: form.password || undefined,
                rol: normalizeRole(form.rol),
                mesaIds: normalizeRole(form.rol) === 'mesero' ? form.mesaIds : [],
            };

            if (modal?.id) await updateUsuario(modal.id, payload);
            else await createUsuario(payload);

            mostrarToast(modal?.id ? 'Empleado actualizado' : 'Empleado creado');
            await cargar();
            setModal(null);
        } catch (e) {
            const message = e?.message || '';
            if (message.includes('correo') || message.includes('email') || message.includes('duplicate') || message.includes('duplicado')) {
                mostrarToast('Ese correo ya esta registrado para otro empleado.');
            } else {
                mostrarToast(message ? `No se pudo guardar el empleado: ${message}` : 'No se pudo guardar el empleado.');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const usuario = usuarios.find((item) => item.id === id);
        const rol = getUserRole(usuario);
        if (rol === 'superuser' || rol === 'superadmin') {
            mostrarToast('No se puede eliminar a un SUPERADMIN');
            setConfirmDel(null);
            return;
        }

        try {
            await deleteUsuario(id);
            mostrarToast('Empleado eliminado');
            await cargar();
        } catch (e) {
            mostrarToast(e?.message ? `No se pudo eliminar el empleado: ${e.message}` : 'No se pudo eliminar el empleado.');
        }
        setConfirmDel(null);
    };

    const columns = [
        {
            key: 'empleado',
            label: 'Empleado',
            className: 'ps-4',
            render: (u) => (
                <div>
                    <div className="fw-semibold">{u.nombre}</div>
                    <div className="text-muted small">{getUserEmail(u)}</div>
                </div>
            ),
        },
        {
            key: 'rol',
            label: 'Rol',
            render: (u) => {
                const rol = getUserRole(u);
                const badge = ROL_BADGE[rol] || { color: '#aaa', label: rol || '-' };
                const ROLE_ICONS = {
                    admin: Shield,
                    superuser: Shield,
                    superadmin: Shield,
                    mesero: UserCheck,
                    cocinero: ChefHat,
                    chef: ChefHat,
                    cliente: User,
                };
                const IconComponent = ROLE_ICONS[rol] || User;

                return (
                    <span
                        className="badge fw-semibold d-inline-flex align-items-center gap-1"
                        style={{ background: badge.color, borderRadius: '2rem', fontSize: '0.8rem' }}
                    >
                        <IconComponent size={14} />
                        {badge.label}
                    </span>
                );
            },
        },
        {
            key: 'estado',
            label: 'Estado',
            render: (u) => {
                const activo = isUserActive(u);
                return (
                    <span
                        className="badge fw-semibold"
                        style={{
                            background: activo ? '#52C41A' : '#CCCCCC',
                            borderRadius: '2rem',
                            fontSize: '0.8rem',
                            color: activo ? '#FFFFFF' : '#666666',
                        }}
                    >
                        {activo ? 'Activo' : 'Inactivo'}
                    </span>
                );
            },
        },
        {
            key: 'mesas',
            label: 'Mesas asignadas',
            render: (u) => {
                const rol = getUserRole(u);
                if (rol !== 'mesero') return <span className="text-muted small">No aplica</span>;
                const asignadas = u.mesasAsignadas || [];
                return asignadas.length > 0 ? (
                    <span className="text-muted small">
                        {asignadas.map((n) => `Mesa ${n}`).join(', ')}
                    </span>
                ) : (
                    <span className="text-danger small">Sin mesas</span>
                );
            },
        },
        {
            key: 'acciones',
            label: 'Acciones',
            className: 'text-end pe-4',
            render: (u) => {
                const rol = getUserRole(u);
                const esSuperadmin = rol === 'superuser' || rol === 'superadmin';

                return (
                <div>
                    <SecondaryButton
                        type="button"
                        size="sm"
                        className="me-2"
                        style={{ borderRadius: '0.5rem' }}
                        onClick={() => setModal(u)}
                    >
                        <Edit2 size={16} className="me-1" />Editar
                    </SecondaryButton>
                    <DangerButton
                        type="button"
                        size="sm"
                        style={{ borderRadius: '0.5rem' }}
                        disabled={esSuperadmin}
                        title={esSuperadmin ? 'No se puede eliminar a un SUPERADMIN' : 'Eliminar empleado'}
                        onClick={() => setConfirmDel(u)}
                    >
                        <Trash2 size={16} />
                    </DangerButton>
                </div>
            )},
        },
    ];

    return (
        <div className="bg-white rounded-4 shadow-sm p-4">
            <SectionHeader
                title="Personal"
                subtitle="Administracion de empleados y roles"
                badge={usuarios.length}
                actions={(
                    <PrimaryButton
                        type="button"
                        className="fw-bold shadow-sm"
                        style={{ borderRadius: '2rem' }}
                        onClick={() => setModal({})}
                    >
                        <PlusCircle size={18} className="me-2" />Nuevo Empleado
                    </PrimaryButton>
                )}
            />

            <div className="row g-3 mb-4 align-items-center">
                <div className="col-12 col-md-5">
                    <div className="input-group shadow-sm" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                        <span className="input-group-text bg-white border-end-0" style={{ borderRadius: '1rem 0 0 1rem' }}>
                            <Search size={18} />
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0"
                            style={{ borderRadius: '0 1rem 1rem 0' }}
                            placeholder="Buscar personal por nombre o email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value.slice(0, 80))}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    <div className="form-floating">
                        <select
                            className="form-select"
                            id="roleFilter"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            style={{ borderRadius: '1rem' }}
                        >
                            {roleOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="roleFilter">Rol</label>
                    </div>
                </div>
                <div className="col-12 col-md-2">
                    <div className="form-floating">
                        <select
                            className="form-select"
                            id="statusFilter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ borderRadius: '1rem' }}
                        >
                            <option value="todos">Todos</option>
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                        <label htmlFor="statusFilter">Estado</label>
                    </div>
                </div>
                <div className="col-12 col-md-2">
                    <div className="form-floating">
                        <select
                            className="form-select"
                            id="sortBy"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{ borderRadius: '1rem' }}
                        >
                            <option value="nombre">Nombre</option>
                            <option value="rol">Rol</option>
                        </select>
                        <label htmlFor="sortBy">Ordenar</label>
                    </div>
                </div>
                <div className="col-12 text-muted small">
                    <div className="d-flex align-items-center gap-2">
                        <SlidersHorizontal size={16} />
                        <span>{sortedUsuarios.length} resultados</span>
                    </div>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={sortedUsuarios}
                emptyMessage="Sin empleados registrados"
                loading={loading}
            />

            {modal !== null && (
                <UsuarioModal
                    usuario={modal?.id ? modal : null}
                    mesas={mesas}
                    mesasOcupadasMap={mesasOcupadasMap}
                    onSave={handleSave}
                    onClose={() => setModal(null)}
                    saving={saving}
                />
            )}

            <ConfirmModal
                open={!!confirmDel}
                title="Eliminar empleado?"
                subtitle="Esta accion no se puede deshacer."
                description={confirmDel ? (
                    <>
                        <div className="fw-semibold">{confirmDel.nombre}</div>
                        <div className="text-muted small">Se borrará toda la información del empleado.</div>
                    </>
                ) : null}
                confirmText="Si, eliminar"
                cancelText="Cancelar"
                onClose={() => setConfirmDel(null)}
                onConfirm={() => handleDelete(confirmDel.id)}
                icon={<AlertTriangle size={28} className="text-warning" />}
            />
        </div>
    );
};

export default PersonalAdmin;
