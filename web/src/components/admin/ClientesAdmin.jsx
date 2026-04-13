import React, { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import SectionHeader from '../ui/SectionHeader';
import DataTable from '../ui/DataTable';
import { Mail, Calendar, AlertTriangle, User, Search, SlidersHorizontal, Trash2, Eye } from 'lucide-react';
import { getUserEmail } from './adminConstants';
import ConfirmModal from '../ui/ConfirmModal';
import ClienteDetalleModal from '../shared/ClienteDetalleModal';

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
            const estado = c.activo ? 'activo' : 'inactivo';
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
                        <div className="rounded-circle d-flex align-items-center justify-content-center" 
                            style={{ width: 32, height: 32, background: '#e8f4f8', color: '#00a8cc' }}>
                            <User size={16} />
                        </div>
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
            render: (c) => (
                <span
                    className="badge fw-semibold"
                    style={{
                        background: c.activo ? '#52C41A' : '#CCCCCC',
                        borderRadius: '2rem',
                        fontSize: '0.8rem',
                        color: c.activo ? '#FFFFFF' : '#666666',
                    }}
                >
                    {c.activo ? 'Activo' : 'Inactivo'}
                </span>
            ),
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
                    <button
                        className="btn btn-sm btn-outline-info"
                        style={{ borderRadius: '0.5rem' }}
                        title="Ver detalles"
                        onClick={() => setModalDetalle(c)}
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        style={{ borderRadius: '0.5rem' }}
                        title="Eliminar cliente"
                        onClick={() => setConfirmDel(c)}
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
            <ClienteDetalleModal
                cliente={modalDetalle}
                onClose={() => setModalDetalle(null)}
                onEliminar={() => {
                    setConfirmDel(modalDetalle);
                    setModalDetalle(null);
                }}
            />

            {/* Modal de confirmación de eliminación */}
            <ConfirmModal
                open={!!confirmDel}
                title="¿Eliminar cliente?"
                subtitle="Esta acción no se puede deshacer."
                description={confirmDel ? (
                    <>
                        <div className="fw-semibold">{confirmDel.nombre}</div>
                        <div className="text-muted small">Se borrará toda la información del cliente.</div>
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

export default ClientesAdmin;
