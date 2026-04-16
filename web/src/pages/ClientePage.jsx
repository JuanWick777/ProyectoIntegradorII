import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import MesaIngreso from '../components/cliente/MesaIngreso';
import FidelidadModal from '../components/cliente/FidelidadModal';
import MenuCliente from '../components/cliente/MenuCliente';
import Carrito from '../components/cliente/Carrito';
import OrderTracker from '../components/cliente/OrderTracker';

const ClientePage = () => {
    const { numeroMesa, ordenActual, fetchProducts, validarMesa, setNumeroMesa } = useAppStore();

    const mesaParam = useMemo(() => {
        const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
        return params.get('mesa');
    }, []);

    const mesaDesdeQr = mesaParam ? Number.parseInt(mesaParam, 10) : null;
    const mesaActiva = numeroMesa || mesaDesdeQr;

    const [vista, setVista] = useState(() => (mesaActiva ? 'menu' : 'ingreso'));
    const [ordenId, setOrdenId] = useState(ordenActual?.orden_id || ordenActual?.id || null);
    const [mesaError, setMesaError] = useState(null);
    const [validandoMesa, setValidandoMesa] = useState(false);
    const qrValidadoRef = useRef(false);

    const handleMesaValida = useCallback(() => {
        setVista('fidelidad');
    }, []);

    const validarMesaQR = useCallback(async (mesa) => {
        if (!mesa || Number.isNaN(mesa)) {
            setMesaError('El código QR no contiene una mesa válida.');
            setVista('ingreso');
            return;
        }

        setValidandoMesa(true);
        try {
            const result = await validarMesa(mesa);
            setNumeroMesa(result.numero);
            setVista('menu');
        } catch (err) {
            if (err.status === 404) {
                setMesaError('La mesa no existe o no esta disponible.');
            } else if (err.status === 409) {
                setMesaError('Esta mesa está ocupada. Por favor, llama al mesero.');
            } else {
                setMesaError('Error validando la mesa. Intenta de nuevo.');
            }
            setVista('ingreso');
        } finally {
            setValidandoMesa(false);
        }
    }, [setNumeroMesa, validarMesa]);

    useEffect(() => {
        if (mesaDesdeQr && !numeroMesa && !validandoMesa && !qrValidadoRef.current) {
            qrValidadoRef.current = true;
            validarMesaQR(mesaDesdeQr);
        }
    }, [mesaDesdeQr, numeroMesa, validandoMesa, validarMesaQR]);

    useEffect(() => {
        if (vista === 'menu' || vista === 'fidelidad') {
            fetchProducts();
        }
    }, [vista, fetchProducts]);

    const handleContinuarMenu = () => setVista('menu');
    const handleVerCarrito = () => setVista('carrito');
    const handleVolverMenu = () => setVista('menu');
    const handlePedidoEnviado = (ord) => {
        setOrdenId(ord.id || ord.orden_id);
        setVista('tracker');
    };
    const handleNuevoPedido = () => {
        setOrdenId(null);
        setVista('menu');
    };

    const renderMesaError = () => {
        if (!mesaError) return null;

        return (
            <div
                className="modal d-flex align-items-center justify-content-center"
                style={{
                    display: 'flex',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 9999,
                }}
            >
                <div className="card shadow-lg" style={{ maxWidth: 400, borderRadius: '1.25rem' }}>
                    <div className="card-body text-center p-4">
                        <div
                            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                            style={{
                                width: 60,
                                height: 60,
                                background: '#fff3cd',
                            }}
                        >
                            <span style={{ fontSize: '2rem' }}>!</span>
                        </div>
                        <h5 className="card-title fw-bold text-dark mb-2">Mesa no valida</h5>
                        <p className="card-text text-secondary mb-4">{mesaError}</p>
                        <button
                            className="btn btn-primary fw-bold py-2 px-4"
                            onClick={() => setMesaError(null)}
                            style={{ borderRadius: '0.75rem' }}
                        >
                            Intentar de nuevo
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    let content;
    switch (vista) {
        case 'ingreso':
            content = <MesaIngreso onMesaValida={handleMesaValida} />;
            break;

        case 'fidelidad':
            content = (
                <>
                    <MenuCliente numeroMesa={mesaActiva} onVerCarrito={handleVerCarrito} />
                    <FidelidadModal onContinue={handleContinuarMenu} />
                </>
            );
            break;

        case 'menu':
            content = <MenuCliente numeroMesa={mesaActiva} onVerCarrito={handleVerCarrito} />;
            break;

        case 'carrito':
            content = <Carrito onBack={handleVolverMenu} onPedidoEnviado={handlePedidoEnviado} />;
            break;

        case 'tracker':
            content = <OrderTracker ordenId={ordenId} numeroMesa={mesaActiva} onNuevoPedido={handleNuevoPedido} />;
            break;

        default:
            content = <MesaIngreso onMesaValida={handleMesaValida} />;
            break;
    }

    return (
        <>
            {content}
            {renderMesaError()}
        </>
    );
};

export default ClientePage;
