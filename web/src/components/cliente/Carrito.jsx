import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Trash2, FileText, AlertTriangle, Users, ArrowLeft } from 'lucide-react';
import AlertMessage from '../ui/AlertMessage';
import LoadingSpinner from '../ui/LoadingSpinner';
import { PrimaryButton, SecondaryButton } from '../ui/Button';

const IVA_RATE = 0.16;
const TIP_RATE = 0.10;

const Carrito = ({ onBack, onPedidoEnviado }) => {
    const {
        carrito,
        numeroMesa,
        actualizarNotaItem,
        eliminarDelCarrito,
        incrementarCantidad,
        decrementarCantidad,
        limpiarCarrito,
        addOrder,
        cartError,
        clearCartError,
        isCreatingOrder,
    } = useAppStore();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const subtotal = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const iva = subtotal * IVA_RATE;
    const propinaSugerida = subtotal * TIP_RATE;
    const total = subtotal + iva;
    const totalConPropina = total + propinaSugerida;

    const handleConfirmar = async () => {
        if (loading || isCreatingOrder || carrito.length === 0) return;
        setLoading(true);
        setError('');
        clearCartError();

        try {
            const orden = await addOrder();
            limpiarCarrito();
            onPedidoEnviado(orden);
        } catch (err) {
            if (err.status === 409) {
                setError('Esta mesa ya tiene una orden activa. Llama al mesero.');
            } else {
                setError(err.message || 'Error al enviar el pedido. Intenta de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (carrito.length === 0) {
        return (
            <div className="min-vh-100 d-flex flex-column" style={{ background: '#ffffff' }}>
                <header
                    className="sticky-top shadow-sm px-3 py-3 d-flex align-items-center gap-3"
                    style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', zIndex: 20 }}
                >
                    <SecondaryButton
                        type="button"
                        size="sm"
                        className="rounded-circle p-2"
                        style={{ minWidth: 0, width: 36, height: 36 }}
                        onClick={onBack}
                    >
                        <ArrowLeft size={16} />
                    </SecondaryButton>
                    <div>
                        <h1 className="fw-bold mb-0" style={{ fontSize: '1.1rem' }}>Mi pedido</h1>
                        <div className="text-muted small">Carrito actual de la mesa #{numeroMesa}</div>
                    </div>
                </header>
                <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-muted p-4">
                    <p style={{ fontSize: 64 }}>🛒</p>
                    <p className="fw-semibold fs-5">Tu pedido esta vacio</p>
                    <PrimaryButton
                        type="button"
                        className="mt-2"
                        fullWidth
                        style={{ borderRadius: '0.75rem', maxWidth: 320 }}
                        onClick={onBack}
                    >
                        Ver el menu
                    </PrimaryButton>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100" style={{ background: '#ffffff', paddingBottom: 200 }}>
            <header
                className="sticky-top shadow-sm px-3 py-3 d-flex align-items-center gap-3"
                style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', zIndex: 20 }}
            >
                <SecondaryButton
                    type="button"
                    size="sm"
                    className="rounded-circle p-2"
                    style={{ minWidth: 0, width: 36, height: 36 }}
                    onClick={onBack}
                >
                    <ArrowLeft size={16} />
                </SecondaryButton>
                <div className="flex-grow-1">
                    <h1 className="fw-bold mb-0" style={{ fontSize: '1.1rem' }}>Mi pedido</h1>
                    <div className="text-muted small">Revisa tus productos antes de confirmar</div>
                </div>
                <span className="badge bg-primary rounded-pill">{carrito.length} platillos</span>
            </header>

            <div className="flex-grow-1 p-3 d-flex flex-column gap-3">
                <p className="text-muted small mb-0 d-flex align-items-center gap-2">
                    <Users size={16} /> Mesa #{numeroMesa} ·
                    <span className="fw-semibold text-dark">{totalItems} items</span>
                </p>

                {(error || cartError) && (
                    <AlertMessage
                        message={error || cartError}
                        className="py-2 px-3 small d-flex gap-2 align-items-center"
                        icon={<AlertTriangle size={16} className="me-2" />}
                        showBootstrapIcon={false}
                    />
                )}

                {carrito.map((item) => (
                    <div key={item.id} className="card border-0 shadow-sm" style={{ borderRadius: '1rem', background: '#fffaf5' }}>
                        <div className="card-body p-3">
                            <div className="d-flex align-items-start justify-content-between mb-2">
                                <div className="flex-grow-1">
                                    <h6 className="fw-bold mb-0 lh-sm">{item.nombre}</h6>
                                    <span className="text-primary fw-bold">
                                        ${(item.precio * item.cantidad).toFixed(2)}
                                    </span>
                                    {item.cantidad > 1 && (
                                        <span className="text-muted small ms-1">
                                            (${Number(item.precio).toFixed(2)} c/u)
                                        </span>
                                    )}
                                </div>
                                <button
                                    className="btn btn-sm btn-outline-danger border-0 rounded-circle p-1 lh-1"
                                    onClick={() => eliminarDelCarrito(item.id)}
                                    style={{ width: 32, height: 32 }}
                                    title="Eliminar"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="d-flex align-items-center gap-3 mb-3">
                                <span className="text-muted small">Cantidad:</span>
                                <div className="d-flex align-items-center bg-white rounded-pill px-2 gap-2 border">
                                    <button
                                        className="btn btn-sm p-0 fw-bold fs-5 text-danger border-0 bg-transparent"
                                        style={{ width: 28 }}
                                        onClick={() => {
                                            if (item.cantidad === 1) eliminarDelCarrito(item.id);
                                            else decrementarCantidad(item.id);
                                        }}
                                    >
                                        −
                                    </button>
                                    <span className="fw-bold text-primary px-1">{item.cantidad}</span>
                                    <button
                                        className="btn btn-sm p-0 fw-bold fs-5 text-primary border-0 bg-transparent"
                                        style={{ width: 28 }}
                                        onClick={() => incrementarCantidad(item.id)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <label className="form-label small text-muted mb-1">
                                <FileText size={16} className="me-2" />
                                Instrucciones especiales
                            </label>
                            <textarea
                                className="form-control form-control-sm bg-white"
                                rows={2}
                                placeholder="ej. sin cebolla, termino medio, alergico a nueces..."
                                value={item.notas || ''}
                                onChange={(e) => actualizarNotaItem(item.id, e.target.value)}
                                style={{ borderRadius: '0.6rem', resize: 'none', fontSize: '0.82rem' }}
                                maxLength={200}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div
                className="position-fixed bottom-0 start-0 end-0 bg-white border-top p-3 shadow-lg"
                style={{ zIndex: 100 }}
            >
                <div className="d-flex justify-content-between text-muted small mb-1">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between text-muted small mb-1">
                    <span>IVA (16%)</span>
                    <span>${iva.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between text-muted small mb-2">
                    <span>Propina sugerida (10%)</span>
                    <span>${propinaSugerida.toFixed(2)}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between fw-bold fs-5 mb-1">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between text-muted small mb-3">
                    <span>Total con propina sugerida</span>
                    <span>${totalConPropina.toFixed(2)}</span>
                </div>

                <PrimaryButton
                    className="w-100 fw-bold py-3"
                    fullWidth
                    style={{ borderRadius: '0.75rem' }}
                    onClick={handleConfirmar}
                    disabled={loading || isCreatingOrder || carrito.length === 0}
                >
                    {loading ? (
                        <span>
                            <LoadingSpinner size="sm" className="me-2" />
                            Enviando pedido...
                        </span>
                    ) : (
                        `Confirmar pedido · $${total.toFixed(2)}`
                    )}
                </PrimaryButton>
            </div>
        </div>
    );
};

export default Carrito;
