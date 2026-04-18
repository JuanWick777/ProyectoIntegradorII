import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Users, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { PrimaryButton } from '../ui/Button';
import AlertMessage from '../ui/AlertMessage';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * MesaIngreso.jsx — Pantalla de entrada del cliente
 *
 * Valida el número de mesa contra la API:
 *   - Mesa libre  → llama onMesaValida(mesaId)
 *   - Mesa ocupada (409) → muestra error y bloquea acceso
 *   - Mesa no encontrada (404) → muestra error específico
 */
const MesaIngreso = ({ onMesaValida }) => {
    const { validarMesa, setNumeroMesa, fetchMesas } = useAppStore();

    const [mesas, setMesas] = useState([]);
    const [selectMethod, setSelectMethod] = useState('dropdown'); // 'dropdown' o 'manual'
    const [selectedMesa, setSelectedMesa] = useState('');
    const [inputNumero, setInputNumero] = useState('');
    const [loadingMesas, setLoadingMesas] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

        let numero = null;
        if (selectMethod === 'dropdown') {
            numero = parseInt(selectedMesa, 10);
            if (!numero || numero < 1) {
                setError('Selecciona una mesa válida.');
                return;
            }
        } else {
            numero = parseInt(inputNumero, 10);
            if (!numero || numero < 1) {
                setError('Ingresa un número de mesa válido.');
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
                setError('⛔ Esta mesa está ocupada. Por favor, llama al mesero.');
            } else if (err.status === 404) {
                setError('🔍 Mesa no encontrada. Verifica el número e intenta de nuevo.');
            } else {
                setError('Error de conexión. Revisa que el servidor esté disponible.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center"
            style={{ background: 'linear-gradient(135deg, #FF7A00 0%, #E06900 100%)' }}
        >
            <div className="container" style={{ maxWidth: 420 }}>
                {/* Logo / Encabezado */}
                <div className="text-center mb-4">
                    <div
                        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                        style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.2)' }}
                    >
                        <UtensilsCrossed size={40} className="text-white" />
                    </div>
                    <h1 className="text-white fw-bold fs-2 mb-1">Bienvenido</h1>
                    <p className="text-white-50 mb-0">Ingresa el número de tu mesa para comenzar</p>
                </div>

                {/* Tarjeta de ingreso */}
                <div className="card border-0 shadow-lg" style={{ borderRadius: '1.25rem' }}>
                    <div className="card-body p-4">
                        {loadingMesas ? (
                            <div className="text-center py-5">
                                <LoadingSpinner size="md" className="mb-3" />
                                <p className="text-secondary">Cargando mesas disponibles...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} noValidate>
                                {/* Selector de método */}
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
                                        Mesas Disponibles
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
                                        Ingreso Manual
                                    </label>
                                </div>

                                {/* Contenido según método */}
                                {selectMethod === 'dropdown' ? (
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold text-secondary small text-uppercase ls-wide">
                                            Selecciona tu Mesa
                                        </label>
                                        <select
                                            className={`form-select form-select-lg bg-light fw-bold text-center ${error ? 'is-invalid' : ''}`}
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
                                        <label className="form-label fw-semibold text-secondary small text-uppercase ls-wide">
                                            Número de Mesa
                                        </label>
                                        <div className="input-group input-group-lg">
                                            <span className="input-group-text border-end-0 bg-light">
                                                <Users size={20} className="text-secondary" />
                                            </span>
                                            <input
                                                type="number"
                                                className={`form-control border-start-0 bg-light fs-3 text-center fw-bold ${error ? 'is-invalid' : ''}`}
                                                placeholder="1"
                                                min="1"
                                                max="99"
                                                value={inputNumero}
                                                onChange={(e) => {
                                                    setInputNumero(e.target.value);
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
                                        'Ver Menú →'
                                    )}
                                </PrimaryButton>
                            </form>
                        )}
                    </div>
                </div>

                <p className="text-white-50 text-center mt-3 small">
                    ¿No encuentras tu número? Pide ayuda al mesero.
                </p>
            </div>
        </div>
    );
};

export default MesaIngreso;
