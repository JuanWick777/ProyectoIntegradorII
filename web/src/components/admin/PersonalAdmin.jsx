import React, { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import SectionHeader from '../ui/SectionHeader';
import DataTable from '../ui/DataTable';
import UsuarioModal from './UsuarioModal';
import { ForkKnife, Table, PlusCircle, Edit2, Trash2, AlertTriangle, Shield, UserCheck, User, ChefHat, Coffee, Flame, Cake, Search, SlidersHorizontal } from 'lucide-react';
import { normalizeRole, getUserEmail, getUserRole, ROL_BADGE } from './adminConstants';
import ConfirmModal from '../ui/ConfirmModal';

const PersonalAdmin = ({ mostrarToast }) => {
    const { fetchUsuarios, createUsuario, updateUsuario, deleteUsuario } = useAppStore();
    const [usuarios, setUsuarios] = useState([]);
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
            const uList = await fetchUsuarios();
            // Filtrar solo empleados (excluyendo clientes)
            const empleadosList = uList.filter((u) => u.rol && u.rol.toLowerCase() !== 'cliente');
            setUsuarios(empleadosList);
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
            const estado = u.activo ? 'activo' : 'inactivo';
            const query = searchQuery.toLowerCase().trim();

            if (query && !(nombre.includes(query) || email.includes(query))) {
                return false;
            }
            if (roleFilter !== 'todos' && rol !== roleFilter) {
                return false;
            }
            if (statusFilter !== 'todos' && estado !== statusFilter) {
                return false;
            }
            return true;
        });

        return filtered.sort((a, b) => {
            const aValue = (sortBy === 'rol' ? getUserRole(a) : (a.nombre || '')).toString().toLowerCase();
            const bValue = (sortBy === 'rol' ? getUserRole(b) : (b.nombre || '')).toString().toLowerCase();
            if (aValue < bValue) return -1;
            if (aValue > bValue) return 1;
            return 0;
        });
    }, [usuarios, searchQuery, roleFilter, statusFilter, sortBy]);

    const handleSave = async (form) => {
        setSaving(true);
        try {
            const rol = normalizeRole(form.rol);

            const payload = {
                nombre: form.nombre,
                email: form.email,
                password: form.password || undefined,
                rol,
                especialidad: form.especialidad || null,
                mesaId: form.mesaId || null,
            };

            if (modal?.id) await updateUsuario(modal.id, payload);
            else await createUsuario(payload);

            mostrarToast(modal?.id ? 'Empleado actualizado' : 'Empleado creado');
            await cargar();
            setModal(null);
        } catch (e) {
            mostrarToast(e.message ? `Error al guardar: ${e.message}` : 'Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteUsuario(id);
            mostrarToast('Empleado eliminado');
            await cargar();
        } catch {
            mostrarToast('No se pudo eliminar');
        }
        setConfirmDel(null);
    };

    const columns = [
        {
            key: 'empleado',
            label: 'Empleado',
            className: 'ps-4',
            render: (u) => {
                const email = getUserEmail(u);
                return (
                    <div>
                        <div className="fw-semibold">{u.nombre}</div>
                        <div className="text-muted small">{email}</div>
                    </div>
                );
            },
        },
        {
            key: 'rol',
            label: 'Rol',
            render: (u) => {
                const rol = getUserRole(u);
                const badge = ROL_BADGE[rol] || { color: '#aaa', label: rol || '—' };
                const ROLE_ICONS = {
                    admin: Shield,
                    mesero: UserCheck,
                    cocinero: ChefHat,
                    chef: ChefHat,
                    parrillero: Flame,
                    barista: Coffee,
                    repostero: Cake,
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
            key: 'asignacion',
            label: 'Asignación',
            render: (u) => {
                const rol = getUserRole(u);
                if (['cocinero', 'chef'].includes(rol)) {
                    return (
                        <div className="text-muted small">
                            {u.especialidad ? (
                                <span>
                                    <ForkKnife size={16} className="me-1" />
                                    {u.especialidad.charAt(0).toUpperCase() + u.especialidad.slice(1)}
                                </span>
                            ) : (
                                <em>Sin asignar</em>
                            )}
                        </div>
                    );
                } else if (rol === 'mesero') {
                    return (
                        <div className="text-muted small">
                            {(u.mesaId ?? u.mesa_id) ? (
                                <span><Table size={16} className="me-1" />Mesa {u.mesaId ?? u.mesa_id}</span>
                            ) : (
                                <em>Sin asignar</em>
                            )}
                        </div>
                    );
                } else {
                    return <em>—</em>;
                }
            },
        },
        {
            key: 'estado',
            label: 'Estado',
            render: (u) => (
                <span
                    className="badge fw-semibold"
                    style={{
                        background: u.activo ? '#52C41A' : '#CCCCCC',
                        borderRadius: '2rem',
                        fontSize: '0.8rem',
                        color: u.activo ? '#FFFFFF' : '#666666',
                    }}
                >
                    {u.activo ? 'Activo' : 'Inactivo'}
                </span>
            ),
        },
        {
            key: 'acciones',
            label: 'Acciones',
            className: 'text-end pe-4',
            render: (u) => (
                <div>
                    <button
                        className="btn btn-sm btn-outline-primary me-2"
                        style={{ borderRadius: '0.5rem' }}
                        onClick={() => setModal(u)}
                    >
                        <Edit2 size={16} className="me-1" />Editar
                    </button>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        style={{ borderRadius: '0.5rem' }}
                        onClick={() => setConfirmDel(u)}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="bg-white rounded-4 shadow-sm p-4">
            <SectionHeader
                title="Personal"
                subtitle="Administración de empleados y roles"
                badge={usuarios.length}
                actions={(
                    <button
                        className="btn btn-primary fw-bold shadow-sm"
                        style={{ borderRadius: '2rem' }}
                        onClick={() => setModal({})}
                    >
                        <PlusCircle size={18} className="me-2" />Nuevo Empleado
                    </button>
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
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                        <label htmlFor="roleFilter">Todos los roles</label>
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
                            <option value="todos">Todos los estados</option>
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
                        <label htmlFor="sortBy">Ordenar por</label>
                    </div>
                </div>
                <div className="col-12 col-md-12 text-muted small">
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
                    onSave={handleSave}
                    onClose={() => setModal(null)}
                    saving={saving}
                />
            )}

            <ConfirmModal
                open={!!confirmDel}
                title="¿Eliminar empleado?"
                subtitle="Esta acción no se puede deshacer."
                description={confirmDel ? (
                    <>
                        <div className="fw-semibold">{confirmDel.nombre}</div>
                        <div className="text-muted small">Se borrará toda la información del empleado.</div>
                    </>
                ) : null}
                confirmText="Sí, eliminar"
                cancelText="Cancelar"
                onClose={() => setConfirmDel(null)}
                onConfirm={() => handleDelete(confirmDel.id)}
                icon={<AlertTriangle size={28} className="text-warning" />}
            />
        </div>
    );
};

export default PersonalAdmin;
