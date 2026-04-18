import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, AlertTriangle, Loader, RefreshCw, Armchair, Users } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { PrimaryButton, SecondaryButton, DangerButton } from '../ui/Button';
import AlertMessage from '../ui/AlertMessage';
import SectionHeader from '../ui/SectionHeader';

const ESTADO_MESA = {
    LIBRE: {
        label: 'Libre',
        className: 'bg-success',
    },
    OCUPADA: {
        label: 'Ocupada',
        className: 'bg-warning text-dark',
    },
    RESERVADA: {
        label: 'Reservada',
        className: 'bg-info text-dark',
    },
    INACTIVA: {
        label: 'Inactiva',
        className: 'bg-secondary',
    },
};

const normalizarEstadoMesa = (estado) => String(estado || 'LIBRE').trim().toUpperCase();

const MesasAdmin = () => {
    const { fetchMesas, crearMesa, eliminarMesa, actualizarEstadoMesa } = useAppStore();
    const [mesas, setMesas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [nuevoNumero, setNuevoNumero] = useState('');
    const [nuevaCapacidad, setNuevaCapacidad] = useState('4');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [creando, setCreando] = useState(false);
    const [eliminando, setEliminando] = useState(null);
    const [actualizando, setActualizando] = useState(null);
    const [campoError, setCampoError] = useState('');
    const [capacidadesEditables, setCapacidadesEditables] = useState({});

    const resumen = useMemo(() => {
        return mesas.reduce((acc, mesa) => {
            const estado = normalizarEstadoMesa(mesa.estado);
            acc[estado] = (acc[estado] || 0) + 1;
            return acc;
        }, {});
    }, [mesas]);

    useEffect(() => {
        cargarMesas();
    }, []);

    const cargarMesas = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await fetchMesas();
            const mesasData = data || [];
            setMesas(mesasData);
            setCapacidadesEditables(
                Object.fromEntries(mesasData.map((mesa) => [mesa.id, String(mesa.capacidad || 4)]))
            );
        } catch (err) {
            setError('Error al cargar las mesas: ' + (err.message || 'Error desconocido'));
        } finally {
            setLoading(false);
        }
    };

    const handleCrearMesa = async (e) => {
        e.preventDefault();
        const numero = parseInt(nuevoNumero, 10);
        const capacidad = parseInt(nuevaCapacidad, 10);

        if (!nuevoNumero) {
            setCampoError('El numero de mesa es obligatorio.');
            return;
        }
        if (!numero || numero < 1) {
            setCampoError('Ingresa un numero de mesa valido (mayor a 0).');
            return;
        }
        if (numero > 999) {
            setCampoError('El numero de mesa no puede ser mayor a 999.');
            return;
        }
        if (!capacidad || capacidad < 1) {
            setCampoError('Ingresa una capacidad valida para la mesa.');
            return;
        }

        try {
            setError('');
            setCampoError('');
            setSuccess('');
            setCreando(true);
            await crearMesa({ numero, capacidad });
            setNuevoNumero('');
            setNuevaCapacidad('4');
            setSuccess(`Mesa ${numero} creada correctamente`);
            await cargarMesas();
        } catch (err) {
            if (err.status === 409) {
                setCampoError(`Ya existe una mesa con el numero ${numero}.`);
            } else {
                setError('Error al crear la mesa: ' + (err.message || 'Error desconocido'));
            }
        } finally {
            setCreando(false);
        }
    };

    const handleCambiarEstado = async (mesa, estado) => {
        try {
            setError('');
            setSuccess('');
            setActualizando(mesa.id);
            await actualizarEstadoMesa(mesa.id, { estado });
            setSuccess(`Mesa ${mesa.numero} actualizada a ${ESTADO_MESA[estado]?.label || estado}`);
            await cargarMesas();
        } catch (err) {
            setError('Error al actualizar la mesa: ' + (err.message || 'Error desconocido'));
        } finally {
            setActualizando(null);
        }
    };

    const handleCambiarCapacidad = async (mesa) => {
        const capacidad = parseInt(capacidadesEditables[mesa.id], 10);
        if (!capacidad || capacidad < 1) {
            setError('La capacidad debe ser mayor a 0.');
            return;
        }

        try {
            setError('');
            setSuccess('');
            setActualizando(mesa.id);
            await actualizarEstadoMesa(mesa.id, { capacidad });
            setSuccess(`Capacidad de mesa ${mesa.numero} actualizada a ${capacidad}`);
            await cargarMesas();
        } catch (err) {
            setError('Error al actualizar la capacidad: ' + (err.message || 'Error desconocido'));
        } finally {
            setActualizando(null);
        }
    };

    const handleEliminarMesa = async (id, numero) => {
        if (!window.confirm(`Eliminar mesa ${numero}? Esta accion no se puede deshacer.`)) {
            return;
        }

        try {
            setError('');
            setSuccess('');
            setEliminando(id);
            await eliminarMesa(id);
            setSuccess(`Mesa ${numero} eliminada correctamente`);
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
                title="Gestion de Mesas"
                subtitle={`Total: ${mesas.length} mesa${mesas.length !== 1 ? 's' : ''}`}
            />

            <div className="row g-3 mb-4">
                {Object.entries(ESTADO_MESA).map(([estado, config]) => (
                    <div key={estado} className="col-6 col-md-3">
                        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '1rem' }}>
                            <div className="card-body d-flex align-items-center gap-3">
                                <div
                                    className={`rounded-circle d-flex align-items-center justify-content-center text-white ${config.className.includes('text-dark') ? 'text-dark' : ''}`}
                                    style={{ width: 42, height: 42 }}
                                >
                                    <Armchair size={20} />
                                </div>
                                <div>
                                    <div className="text-muted small">{config.label}</div>
                                    <div className="fw-bold fs-4">{resumen[estado] || 0}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row mb-4">
                <div className="col-12 mb-3 d-flex gap-2 flex-wrap">
                    <PrimaryButton
                        type="button"
                        onClick={() => setShowCreateForm((prev) => !prev)}
                    >
                        <Plus size={16} className="me-2" />
                        {showCreateForm ? 'Ocultar formulario' : 'Agregar mesa'}
                    </PrimaryButton>
                    <SecondaryButton
                        type="button"
                        onClick={cargarMesas}
                        disabled={loading}
                    >
                        <RefreshCw size={16} className="me-2" />
                        Actualizar
                    </SecondaryButton>
                </div>

                {showCreateForm && (
                    <div className="col-md-8 col-xl-6">
                        <div className="card border-0 shadow-sm" style={{ borderRadius: '1rem' }}>
                            <div className="card-body">
                                <h5 className="card-title fw-bold mb-3">Agregar Nueva Mesa</h5>
                                <form onSubmit={handleCrearMesa} noValidate>
                                    <div className="row g-3 align-items-end">
                                        <div className="col-md-5">
                                            <label className="form-label fw-semibold small text-secondary">
                                                Numero de Mesa <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                className={`form-control ${campoError ? 'is-invalid' : nuevoNumero && !campoError ? 'is-valid' : ''}`}
                                                placeholder="Ej. 1"
                                                min="1"
                                                max="999"
                                                value={nuevoNumero}
                                                onKeyDown={(e) => {
                                                    if (['+', '-', 'e', 'E', '.'].includes(e.key)) e.preventDefault();
                                                }}
                                                onChange={(e) => {
                                                    setNuevoNumero(e.target.value);
                                                    setCampoError('');
                                                }}
                                                disabled={creando}
                                            />
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold small text-secondary">
                                                Capacidad <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Ej. 4"
                                                min="1"
                                                max="20"
                                                value={nuevaCapacidad}
                                                onKeyDown={(e) => {
                                                    if (['+', '-', 'e', 'E', '.'].includes(e.key)) e.preventDefault();
                                                }}
                                                onChange={(e) => {
                                                    setNuevaCapacidad(e.target.value);
                                                    setCampoError('');
                                                }}
                                                disabled={creando}
                                            />
                                        </div>

                                        <div className="col-md-3">
                                            <PrimaryButton
                                                type="submit"
                                                disabled={creando || !nuevoNumero || !nuevaCapacidad}
                                                className="w-100"
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

                                        {campoError && (
                                            <div className="col-12">
                                                <div className="invalid-feedback d-flex align-items-center gap-1 mt-1" style={{ display: 'flex !important' }}>
                                                    <span>!</span> {campoError}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>

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

            <div className="card border-0 shadow-sm" style={{ borderRadius: '1rem' }}>
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
                                        <th className="fw-bold text-secondary">Numero</th>
                                        <th className="fw-bold text-secondary">Capacidad</th>
                                        <th className="fw-bold text-secondary">Estado</th>
                                        <th className="fw-bold text-secondary">Cambiar estado</th>
                                        <th className="fw-bold text-secondary">Actualizar capacidad</th>
                                        <th className="fw-bold text-secondary text-center">Accion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mesas.map((mesa) => {
                                        const estado = normalizarEstadoMesa(mesa.estado);
                                        const estadoConfig = ESTADO_MESA[estado] || ESTADO_MESA.LIBRE;

                                        return (
                                            <tr key={mesa.id}>
                                                <td className="text-muted">#{mesa.id}</td>
                                                <td className="fw-bold fs-5">Mesa {mesa.numero}</td>
                                                <td>
                                                    <span className="badge text-bg-light border d-inline-flex align-items-center gap-1" style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}>
                                                        <Users size={14} />
                                                        {mesa.capacidad || 0} personas
                                                    </span>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge ${estadoConfig.className}`}
                                                        style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                                                    >
                                                        {estadoConfig.label}
                                                    </span>
                                                </td>
                                                <td style={{ minWidth: 180 }}>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={estado}
                                                        onChange={(e) => handleCambiarEstado(mesa, e.target.value)}
                                                        disabled={actualizando === mesa.id}
                                                    >
                                                        {Object.entries(ESTADO_MESA).map(([key, config]) => (
                                                            <option key={key} value={key}>
                                                                {config.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td style={{ minWidth: 220 }}>
                                                    <div className="d-flex gap-2">
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm"
                                                            min="1"
                                                            max="20"
                                                            value={capacidadesEditables[mesa.id] || ''}
                                                            onKeyDown={(e) => {
                                                                if (['+', '-', 'e', 'E', '.'].includes(e.key)) e.preventDefault();
                                                            }}
                                                            onChange={(e) =>
                                                                setCapacidadesEditables((prev) => ({
                                                                    ...prev,
                                                                    [mesa.id]: e.target.value,
                                                                }))
                                                            }
                                                            disabled={actualizando === mesa.id}
                                                        />
                                                        <SecondaryButton
                                                            size="sm"
                                                            onClick={() => handleCambiarCapacidad(mesa)}
                                                            disabled={actualizando === mesa.id}
                                                        >
                                                            Guardar
                                                        </SecondaryButton>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <DangerButton
                                                        size="sm"
                                                        onClick={() => handleEliminarMesa(mesa.id, mesa.numero)}
                                                        disabled={eliminando === mesa.id || actualizando === mesa.id}
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
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
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
