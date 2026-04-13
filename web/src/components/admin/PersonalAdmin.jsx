import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import SectionHeader from '../ui/SectionHeader';
import DataTable from '../ui/DataTable';
import UsuarioModal from './UsuarioModal';
import { ForkKnife, Table, PlusCircle, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { normalizeRole, getUserEmail, getUserRole, ROL_BADGE } from './adminConstants';

const PersonalAdmin = ({ mostrarToast }) => {
    const { fetchUsuarios, createUsuario, updateUsuario, deleteUsuario } = useAppStore();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [saving, setSaving] = useState(false);
    const [confirmDel, setConfirmDel] = useState(null);

    const cargar = async () => {
        setLoading(true);
        try {
            const uList = await fetchUsuarios();
            setUsuarios(uList);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

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
                return (
                    <span
                        className="badge fw-semibold"
                        style={{ background: badge.color, borderRadius: '2rem', fontSize: '0.8rem' }}
                    >
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

            <DataTable
                columns={columns}
                data={usuarios}
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

            {confirmDel && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.55)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-sm">
                        <div className="modal-content border-0 shadow-lg text-center p-4" style={{ borderRadius: '1.25rem' }}>
                            <AlertTriangle size={40} className="text-warning mb-3" />
                            <h5 className="fw-bold">¿Eliminar empleado?</h5>
                            <p className="text-muted small mb-3">{confirmDel.nombre}</p>
                            <div className="d-flex gap-2 justify-content-center">
                                <button className="btn btn-secondary" onClick={() => setConfirmDel(null)}>
                                    Cancelar
                                </button>
                                <button className="btn btn-danger fw-bold" onClick={() => handleDelete(confirmDel.id)}>
                                    Sí, eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonalAdmin;
