import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertTriangle, Loader } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { PrimaryButton, DangerButton } from '../ui/Button';
import AlertMessage from '../ui/AlertMessage';
import SectionHeader from '../ui/SectionHeader';

const MesasAdmin = () => {
    const { fetchMesas, crearMesa, eliminarMesa } = useAppStore();
    const [mesas, setMesas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [nuevoNumero, setNuevoNumero] = useState('');
    const [creando, setCreando] = useState(false);
    const [eliminando, setEliminando] = useState(null);

    useEffect(() => {
        cargarMesas();
    }, []);

    const cargarMesas = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await fetchMesas();
            setMesas(data || []);
        } catch (err) {
            setError('Error al cargar las mesas: ' + (err.message || 'Error desconocido'));
        } finally {
            setLoading(false);
        }
    };

    const handleCrearMesa = async (e) => {
        e.preventDefault();
        const numero = parseInt(nuevoNumero, 10);

        if (!numero || numero < 1) {
            setError('Ingresa un número de mesa válido.');
            return;
        }

        try {
            setError('');
            setSuccess('');
            setCreando(true);
            await crearMesa(numero);
            setNuevoNumero('');
            setSuccess(`✓ Mesa ${numero} creada correctamente`);
            await cargarMesas();
        } catch (err) {
            if (err.status === 409) {
                setError(`Ya existe una mesa con el número ${numero}`);
            } else {
                setError('Error al crear la mesa: ' + (err.message || 'Error desconocido'));
            }
        } finally {
            setCreando(false);
        }
    };

    const handleEliminarMesa = async (id, numero) => {
        if (!window.confirm(`¿Eliminar mesa ${numero}? Esta acción no se puede deshacer.`)) {
            return;
        }

        try {
            setError('');
            setSuccess('');
            setEliminando(id);
            await eliminarMesa(id);
            setSuccess(`✓ Mesa ${numero} eliminada correctamente`);
            await cargarMesas();
        } catch (err) {
            setError('Error al eliminar la mesa: ' + (err.message || 'Error desconocido'));
        } finally {
            setEliminando(null);
        }
    };

    return (
        <div className="container-fluid py-4">
            <SectionHeader
                title="Gestión de Mesas"
                subtitle={`Total: ${mesas.length} mesa${mesas.length !== 1 ? 's' : ''}`}
            />

            {/* Formulario de agregar mesa */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title fw-bold mb-3">Agregar Nueva Mesa</h5>
                            <form onSubmit={handleCrearMesa}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold small text-secondary">
                                        Número de Mesa
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="1"
                                            min="1"
                                            max="999"
                                            value={nuevoNumero}
                                            onChange={(e) => setNuevoNumero(e.target.value)}
                                            disabled={creando}
                                        />
                                        <PrimaryButton
                                            type="submit"
                                            disabled={creando || !nuevoNumero}
                                        >
                                            {creando ? (
                                                <>
                                                    <Loader size={16} className="me-2" style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                                                    Creando...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus size={16} className="me-2" style={{ display: 'inline-block' }} />
                                                    Crear
                                                </>
                                            )}
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mensajes */}
            {error && (
                <AlertMessage
                    message={error}
                    className="mb-3 py-3 px-3 d-flex align-items-center gap-2"
                    icon={<AlertTriangle size={18} className="flex-shrink-0" />}
                    showBootstrapIcon={false}
                />
            )}
            {success && (
                <div className="alert alert-success mb-3 py-3 px-3 d-flex align-items-center gap-2" role="alert">
                    <span>{success}</span>
                </div>
            )}

            {/* Lista de mesas */}
            <div className="row">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            {loading ? (
                                <div className="text-center py-5">
                                    <Loader className="text-secondary" size={32} style={{ animation: 'spin 1s linear infinite' }} />
                                    <p className="text-secondary mt-2">Cargando mesas...</p>
                                </div>
                            ) : mesas.length === 0 ? (
                                <div className="text-center py-5">
                                    <p className="text-secondary">No hay mesas registradas</p>
                                    <p className="text-muted small">Crea una nueva mesa usando el formulario arriba</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead style={{ background: '#f8f9fa' }}>
                                            <tr>
                                                <th className="fw-bold text-secondary">ID</th>
                                                <th className="fw-bold text-secondary">Número</th>
                                                <th className="fw-bold text-secondary">Estado</th>
                                                <th className="fw-bold text-secondary text-center">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mesas.map((mesa) => (
                                                <tr key={mesa.id}>
                                                    <td className="text-muted">#{mesa.id}</td>
                                                    <td className="fw-bold fs-5">Mesa {mesa.numero}</td>
                                                    <td>
                                                        <span
                                                            className={`badge ${
                                                                mesa.estado === 'libre'
                                                                    ? 'bg-success'
                                                                    : 'bg-warning text-dark'
                                                            }`}
                                                            style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                                                        >
                                                            {mesa.estado === 'libre' ? '✓ Libre' : '✗ Ocupada'}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <DangerButton
                                                            size="sm"
                                                            onClick={() =>
                                                                handleEliminarMesa(mesa.id, mesa.numero)
                                                            }
                                                            disabled={eliminando === mesa.id}
                                                            title="Eliminar mesa"
                                                            style={{ minWidth: '40px' }}
                                                        >
                                                            {eliminando === mesa.id ? (
                                                                <Loader
                                                                    size={16}
                                                                    style={{ animation: 'spin 1s linear infinite' }}
                                                                />
                                                            ) : (
                                                                <Trash2 size={16} />
                                                            )}
                                                        </DangerButton>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default MesasAdmin;
