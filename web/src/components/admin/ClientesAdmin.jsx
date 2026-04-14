import React, { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import SectionHeader from '../ui/SectionHeader';
import DataTable from '../ui/DataTable';
import { Heart, Mail, Calendar, MapPin, AlertTriangle, User, Search, SlidersHorizontal, Trash2, Eye } from 'lucide-react';
import { getUserEmail, resolveImageUrl, isUserActive } from './adminConstants';
import { SecondaryButton, DangerButton } from '../ui/Button';

const ClientesAdmin = ({ mostrarToast }) => {
    const { fetchUsuarios, deleteUsuario } = useAppStore();
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmDel, setConfirmDel] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('todos');
    const [sortBy, setSortBy] = useState('nombre');
    const [modalDetalle, setModalDetalle] = useState(null);

    const cargar = async () => {
        setLoading(true);
        try {
            const uList = await fetchUsuarios();
            // Filtrar solo clientes
            const clientesList = uList.filter((u) => !u.rol || u.rol.toLowerCase() === 'cliente');
            setClientes(clientesList);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    const sortedClientes = useMemo(() => {
        const filtered = clientes.filter((c) => {
            const nombre = (c.nombre || '').toString().toLowerCase();
            const email = getUserEmail(c).toLowerCase();
            const estado = isUserActive(c) ? 'activo' : 'inactivo';
            const query = searchQuery.toLowerCase().trim();

            if (query && !(nombre.includes(query) || email.includes(query))) {
                return false;
            }
            if (statusFilter !== 'todos' && estado !== statusFilter) {
                return false;
            }
            return true;
        });

        return filtered.sort((a, b) => {
            const aValue = (a.nombre || '').toString().toLowerCase();
            const bValue = (b.nombre || '').toString().toLowerCase();
            if (aValue < bValue) return -1;
            if (aValue > bValue) return 1;
            return 0;
        });
    }, [clientes, searchQuery, statusFilter, sortBy]);

    const handleDelete = async (id) => {
        try {
            await deleteUsuario(id);
            mostrarToast('Cliente eliminado');
            await cargar();
        } catch {
            mostrarToast('No se pudo eliminar el cliente');
        }
        setConfirmDel(null);
    };

    const columns = [
        {
            key: 'cliente',
            label: 'Cliente',
            className: 'ps-4',
            render: (c) => {
                const email = getUserEmail(c);
                return (
                    <div className="d-flex align-items-center gap-2">
                        {(() => {
                            const fotoUrl = resolveImageUrl(c?.imagenUrl ?? c?.imagen_url ?? c?.urlImagen ?? c?.url_imagen ?? c?.foto ?? c?.photo ?? '');
                            return fotoUrl ? (
                                <img
                                    src={fotoUrl}
                                    alt={c.nombre || 'Cliente'}
                                    className="rounded-circle"
                                    style={{ width: 32, height: 32, objectFit: 'cover', border: '1px solid #dee2e6' }}
                                />
                            ) : (
                                <div className="rounded-circle d-flex align-items-center justify-content-center" 
                                    style={{ width: 32, height: 32, background: '#e8f4f8', color: '#00a8cc' }}>
                                    <User size={16} />
                                </div>
                            );
                        })()}
                        <div className="fw-semibold">{c.nombre}</div>
                    </div>
                );
            },
        },
        {
            key: 'email',
            label: 'Contacto',
            render: (c) => {
                const email = getUserEmail(c);
                return (
                    <div className="text-muted small d-flex align-items-center gap-2">
                        <Mail size={14} />
                        {email || 'N/A'}
                    </div>
                );
            },
        },
        {
            key: 'estado',
            label: 'Estado',
            render: (c) => {
                const activo = isUserActive(c);
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
            key: 'registro',
            label: 'Registrado',
            render: (c) => (
                <div className="text-muted small d-flex align-items-center gap-2">
                    <Calendar size={14} />
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString('es-ES', { 
                        year: 'numeric', month: 'short', day: 'numeric' 
                    }) : 'N/A'}
                </div>
            ),
        },
        {
            key: 'acciones',
            label: 'Acciones',
            className: 'text-end pe-4',
            render: (c) => (
                <div className="d-flex gap-2 justify-content-end">
                    <SecondaryButton
                        type="button"
                        size="sm"
                        className="me-2"
                        style={{ borderRadius: '0.5rem' }}
                        onClick={() => setModalDetalle(c)}
                    >
                        <Eye size={16} />
                    </SecondaryButton>
                    <DangerButton
                        type="button"
                        size="sm"
                        style={{ borderRadius: '0.5rem' }}
                        onClick={() => setConfirmDel(c)}
                    >
                        <Trash2 size={16} />
                    </DangerButton>
                </div>
            ),
        },
    ];

    return (
        <div className="bg-white rounded-4 shadow-sm p-4">
            <SectionHeader
                title="Clientes"
                subtitle="Administración de clientes registrados"
                badge={clientes.length}
                actions={null}
            />

            <div className="row g-3 mb-4 align-items-center">
                <div className="col-12 col-md-6">
                    <div className="input-group shadow-sm" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                        <span className="input-group-text bg-white border-end-0" style={{ borderRadius: '1rem 0 0 1rem' }}>
                            <Search size={18} />
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0"
                            style={{ borderRadius: '0 1rem 1rem 0' }}
                            placeholder="Buscar cliente por nombre o email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-3">
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
                <div className="col-12 col-md-3 text-muted small">
                    <div className="d-flex align-items-center gap-2">
                        <SlidersHorizontal size={16} />
                        <span>{sortedClientes.length} resultados</span>
                    </div>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={sortedClientes}
                emptyMessage="Sin clientes registrados"
                loading={loading}
            />

            {/* Modal de detalles del cliente */}
            {modalDetalle && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.35)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1.5rem', overflow: 'hidden' }}>
                            <div style={{ background: '#0f4c81', padding: '1.5rem 1.75rem' }}>
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <div className="d-flex align-items-center gap-3 mb-2">
                                            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 46, height: 46, background: 'rgba(255,255,255,0.18)', color: 'white' }}>
                                                <User size={24} />
                                            </div>
                                            <div>
                                                <h5 className="fw-bold text-white mb-1">{modalDetalle.nombre}</h5>
                                                <div className="text-white-50" style={{ fontSize: '0.9rem' }}>Cliente registrado</div>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" className="btn btn-close btn-close-white" onClick={() => setModalDetalle(null)} />
                                </div>
                            </div>

                            <div className="p-4" style={{ background: '#f8f9fa' }}>
                                <div className="row g-4">
                                    <div className="col-12 col-md-6">
                                        <div className="bg-white rounded-4 p-3 h-100 border" style={{ borderColor: '#e8eaef' }}>
                                            <div className="text-uppercase fw-semibold text-muted small mb-3">Email</div>
                                            <div className="d-flex align-items-center gap-2 py-2 px-3 rounded-3" style={{ background: '#f4f7fb' }}>
                                                <Mail size={18} className="text-secondary" />
                                                <span className="fw-semibold">{getUserEmail(modalDetalle)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <div className="bg-white rounded-4 p-3 h-100 border" style={{ borderColor: '#e8eaef' }}>
                                            <div className="text-uppercase fw-semibold text-muted small mb-3">Estado</div>
                                            <div>
                                                <span
                                                    className="badge fw-semibold"
                                                    style={{
                                                        background: isUserActive(modalDetalle) ? '#d1fae5' : '#e2e3e5',
                                                        borderRadius: '2rem',
                                                        padding: '0.55rem 1rem',
                                                        fontSize: '0.9rem',
                                                        color: isUserActive(modalDetalle) ? '#065f46' : '#6c757d',
                                                    }}
                                                >
                                                    {isUserActive(modalDetalle) ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {modalDetalle.createdAt && (
                                        <div className="col-12">
                                            <div className="bg-white rounded-4 p-3 border" style={{ borderColor: '#e8eaef' }}>
                                                <div className="text-uppercase fw-semibold text-muted small mb-3">Fecha de Registro</div>
                                                <div className="d-flex align-items-center gap-2 py-2 px-3 rounded-3" style={{ background: '#f4f7fb' }}>
                                                    <Calendar size={18} className="text-secondary" />
                                                    <span>{new Date(modalDetalle.createdAt).toLocaleDateString('es-ES', {
                                                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                                    })}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 border-top" style={{ background: '#ffffff' }}>
                                <div className="d-flex flex-column flex-sm-row align-items-stretch gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary flex-fill"
                                        onClick={() => setModalDetalle(null)}
                                    >
                                        Cerrar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger flex-fill fw-bold"
                                        onClick={() => {
                                            setConfirmDel(modalDetalle);
                                            setModalDetalle(null);
                                        }}
                                    >
                                        <Trash2 size={16} className="me-2" />Eliminar cliente
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmación de eliminación */}
            {confirmDel && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.35)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-sm">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1.5rem', overflow: 'hidden' }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #fff4e6 0%, #fff7f0 100%)',
                                padding: '1.6rem 1.4rem',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: '50%',
                                    background: 'rgba(255, 221, 178, 0.45)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 14,
                                }}>
                                    <AlertTriangle size={28} className="text-warning" />
                                </div>
                                <h5 className="fw-bold mb-2">¿Eliminar cliente?</h5>
                                <p className="text-muted small mb-0">Esta acción no se puede deshacer.</p>
                            </div>
                            <div className="p-4">
                                <div className="text-center mb-3">
                                    <div className="fw-semibold">{confirmDel.nombre}</div>
                                    <div className="text-muted small">Se borrará toda la información del cliente.</div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-outline-secondary flex-fill"
                                        style={{ borderRadius: '0.85rem', padding: '0.9rem 1rem' }}
                                        onClick={() => setConfirmDel(null)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        className="btn btn-danger flex-fill fw-bold"
                                        style={{ borderRadius: '0.85rem', padding: '0.9rem 1rem' }}
                                        onClick={() => handleDelete(confirmDel.id)}
                                    >
                                        Sí, eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientesAdmin;
