import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Users, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { PrimaryButton } from '../ui/Button';
import AlertMessage from '../ui/AlertMessage';
import LoadingSpinner from '../ui/LoadingSpinner';
import AvisoPrivacidadModal from '../shared/AvisoPrivacidadModal';

const MesaIngreso = ({ onMesaValida }) => {
    const { validarMesa, setNumeroMesa, fetchMesas } = useAppStore();

    const [mesas, setMesas] = useState([]);
    const [selectMethod, setSelectMethod] = useState('dropdown');
    const [selectedMesa, setSelectedMesa] = useState('');
    const [inputNumero, setInputNumero] = useState('');
    const [loadingMesas, setLoadingMesas] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [avisoAbierto, setAvisoAbierto] = useState(false);

    const mesasDisponibles = mesas.filter((mesa) => mesa.qrActivo !== false && mesa.cuentaAbierta !== true);

    useEffect(() => {
        cargarMesas();
    }, []);

    const cargarMesas = async () => {
        try {
            const data = await fetchMesas();
            setMesas(data || []);
        } catch (err) {
            console.error('Error cargando mesas:', err);
            setError('No se pudieron cargar las mesas. Intenta de nuevo.');
        } finally {
            setLoadingMesas(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        let numero = null;
        if (selectMethod === 'dropdown') {
            numero = parseInt(selectedMesa, 10);
            if (!numero || numero < 1) {
                setError('Selecciona una mesa valida.');
                return;
            }
        } else {
            numero = parseInt(inputNumero, 10);
            if (!numero || numero < 1) {
                setError('Ingresa un numero de mesa valido.');
                return;
            }
            if (numero > 999) {
                setError('El numero de mesa no puede ser mayor a 999.');
                return;
            }
        }

        setLoading(true);
        setError('');

        try {
            const mesa = await validarMesa(numero);
            setNumeroMesa(mesa.numero);
            onMesaValida(mesa);
        } catch (err) {
            if (err.status === 409) {
                setError('Esta mesa esta ocupada. Por favor, llama al mesero.');
            } else if (err.status === 404) {
                setError('Mesa no encontrada. Verifica el numero e intenta de nuevo.');
            } else {
                setError('Error de conexion. Revisa que el servidor este disponible.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100" style={{ background: '#ffffff' }}>
            <header
                className="sticky-top shadow-sm py-3 px-3"
                style={{
                    background: '#ffffff',
                    borderBottom: '1px solid #e5e7eb',
                    zIndex: 20,
                }}
            >
                <div className="d-flex align-items-start gap-3">
                    <div
                        className="rounded-3 d-flex align-items-center justify-content-center"
                        style={{ width: 48, height: 48, background: '#f97316', color: '#ffffff' }}
                    >
                        <UtensilsCrossed size={24} />
                    </div>
                    <div>
                        <h1 className="fw-bold mb-1" style={{ fontSize: '1.25rem', color: '#111827' }}>
                            Portal del cliente
                        </h1>
                        <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                            Ingresa tu mesa para comenzar el pedido
                        </div>
                    </div>
                </div>
            </header>

            <div className="container py-5" style={{ maxWidth: 460 }}>
                <div className="text-center mb-4">
                    <div
                        className="d-inline-flex align-items-center justify-content-center rounded-4 mb-3"
                        style={{ width: 82, height: 82, background: '#fff7ed', color: '#f97316' }}
                    >
                        <UtensilsCrossed size={42} />
                    </div>
                    <h2 className="fw-bold fs-3 mb-1" style={{ color: '#111827' }}>
                        Bienvenido
                    </h2>
                    <p className="text-muted mb-0">
                        Selecciona o escribe el numero de tu mesa para ver el menu.
                    </p>
                </div>

                <div className="card border-0 shadow-sm" style={{ borderRadius: '1.25rem', background: '#fffaf5' }}>
                    <div className="card-body p-4">
                        {loadingMesas ? (
                            <div className="text-center py-5">
                                <LoadingSpinner size="md" className="mb-3" />
                                <p className="text-secondary">Cargando mesas disponibles...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="btn-group w-100 mb-4" role="group">
                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="selectMethod"
                                        id="methodDropdown"
                                        value="dropdown"
                                        checked={selectMethod === 'dropdown'}
                                        onChange={(e) => {
                                            setSelectMethod(e.target.value);
                                            setError('');
                                        }}
                                    />
                                    <label className="btn btn-outline-primary" htmlFor="methodDropdown">
                                        Mesas disponibles
                                    </label>

                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="selectMethod"
                                        id="methodManual"
                                        value="manual"
                                        checked={selectMethod === 'manual'}
                                        onChange={(e) => {
                                            setSelectMethod(e.target.value);
                                            setError('');
                                        }}
                                    />
                                    <label className="btn btn-outline-primary" htmlFor="methodManual">
                                        Ingreso manual
                                    </label>
                                </div>

                                {selectMethod === 'dropdown' ? (
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold text-secondary small text-uppercase">
                                            Selecciona tu mesa
                                        </label>
                                        <select
                                            className={`form-select form-select-lg bg-white fw-bold text-center ${error ? 'is-invalid' : ''}`}
                                            value={selectedMesa}
                                            onChange={(e) => {
                                                setSelectedMesa(e.target.value);
                                                setError('');
                                            }}
                                            disabled={loading}
                                            style={{ borderRadius: '0.75rem' }}
                                        >
                                            <option value="">-- Elige una mesa --</option>
                                            {mesasDisponibles.length > 0 ? (
                                                mesasDisponibles.map((mesa) => (
                                                    <option key={mesa.id} value={mesa.numero}>
                                                        Mesa {mesa.numero}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>No hay mesas disponibles</option>
                                            )}
                                        </select>
                                    </div>
                                ) : (
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold text-secondary small text-uppercase">
                                            Numero de mesa
                                        </label>
                                        <div className="input-group input-group-lg">
                                            <span className="input-group-text border-end-0 bg-white">
                                                <Users size={20} className="text-secondary" />
                                            </span>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                className={`form-control border-start-0 bg-white fs-3 text-center fw-bold ${error ? 'is-invalid' : ''}`}
                                                placeholder="1"
                                                value={inputNumero}
                                                onChange={(e) => {
                                                    setInputNumero(e.target.value.replace(/\D/g, '').slice(0, 3));
                                                    setError('');
                                                }}
                                                disabled={loading}
                                                style={{ letterSpacing: '0.15em' }}
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                )}

                                <AlertMessage
                                    message={error ? <small>{error}</small> : ''}
                                    className="mt-3 mb-3 py-2 px-3 d-flex align-items-center gap-2"
                                    icon={<AlertTriangle size={18} className="flex-shrink-0" />}
                                    showBootstrapIcon={false}
                                />

                                <PrimaryButton
                                    type="submit"
                                    fullWidth
                                    className="fw-bold py-3 fs-5"
                                    style={{ borderRadius: '0.75rem' }}
                                    disabled={
                                        loading ||
                                        (selectMethod === 'dropdown'
                                            ? (!selectedMesa || mesasDisponibles.length === 0)
                                            : !inputNumero)
                                    }
                                >
                                    {loading ? (
                                        <span>
                                            <LoadingSpinner size="sm" className="me-2" />
                                            Verificando...
                                        </span>
                                    ) : (
                                        'Ver menu'
                                    )}
                                </PrimaryButton>
                            </form>
                        )}
                    </div>
                </div>

                <p className="text-muted text-center mt-3 small">
                    Si no encuentras tu numero, pide ayuda al mesero.
                </p>
                <div className="text-center">
                    <button
                        type="button"
                        className="btn btn-link p-0 small text-decoration-none"
                        onClick={() => setAvisoAbierto(true)}
                        style={{ color: '#f97316' }}
                    >
                        Aviso de privacidad
                    </button>
                </div>
            </div>
            <AvisoPrivacidadModal abierto={avisoAbierto} onClose={() => setAvisoAbierto(false)} />
        </div>
    );
};

export default MesaIngreso;
