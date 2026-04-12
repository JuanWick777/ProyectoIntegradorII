import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import UsuarioModal from './UsuarioModal';
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

            mostrarToast(modal?.id ? '✅ Empleado actualizado' : '✅ Empleado creado');
            await cargar();
            setModal(null);
        } catch (e) {
            mostrarToast('❌ ' + (e.message || 'Error al guardar'));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteUsuario(id);
            mostrarToast('🗑️ Empleado eliminado');
            await cargar();
        } catch {
            mostrarToast('❌ No se pudo eliminar');
        }
        setConfirmDel(null);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">
                    Personal <span className="badge bg-secondary ms-2">{usuarios.length}</span>
                </h2>
                <button
                    className="btn btn-primary fw-bold"
                    style={{ borderRadius: '2rem' }}
                    onClick={() => setModal({})}
                >
                    ➕ Nuevo Empleado
                </button>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" />
                </div>
            ) : (
                <div className="card border-0 shadow-sm" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                    <table className="table table-hover mb-0">
                        <thead style={{ background: '#f0f0f8' }}>
                            <tr>
                                <th className="ps-4">Empleado</th>
                                <th>Rol</th>
                                <th>Asignación</th>
                                <th>Estado</th>
                                <th className="text-end pe-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((u) => {
                                const rol = getUserRole(u);
                                const badge = ROL_BADGE[rol] || { color: '#aaa', label: rol || '—' };
                                const email = getUserEmail(u);

                                return (
                                    <tr key={u.id}>
                                        <td className="ps-4">
                                            <div className="fw-semibold">{u.nombre}</div>
                                            <div className="text-muted small">{email}</div>
                                        </td>

                                        <td>
                                            <span
                                                className="badge fw-semibold"
                                                style={{ background: badge.color, borderRadius: '2rem', fontSize: '0.8rem' }}
                                            >
                                                {badge.label}
                                            </span>
                                        </td>

                                        <td className="text-muted small">
                                            {['cocinero', 'chef'].includes(rol) && (
                                                <div>
                                                    {u.especialidad && (
                                                        <span>
                                                            🔪{' '}
                                                            {u.especialidad.charAt(0).toUpperCase() +
                                                                u.especialidad.slice(1)}
                                                        </span>
                                                    )}
                                                    {!u.especialidad && (
                                                        <em>Sin asignar</em>
                                                    )}
                                                </div>
                                            )}

                                            {rol === 'mesero' && (
                                                <div>
                                                    {(u.mesaId ?? u.mesa_id) && (
                                                        <span>🪑 Mesa {u.mesaId ?? u.mesa_id}</span>
                                                    )}
                                                    {!(u.mesaId ?? u.mesa_id) && (
                                                        <em>Sin asignar</em>
                                                    )}
                                                </div>
                                            )}

                                            {rol === 'admin' && <em>—</em>}
                                        </td>

                                        <td>
                                            <span className={`badge ${u.activo ? 'bg-success' : 'bg-secondary'}`}>
                                                {u.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>

                                        <td className="text-end pe-4">
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                style={{ borderRadius: '0.5rem' }}
                                                onClick={() => setModal(u)}
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                style={{ borderRadius: '0.5rem' }}
                                                onClick={() => setConfirmDel(u)}
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}

                            {usuarios.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        Sin empleados registrados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

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
                            <p style={{ fontSize: 40 }}>⚠️</p>
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
