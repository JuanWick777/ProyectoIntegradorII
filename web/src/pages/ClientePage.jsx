import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import MesaIngreso from '../components/cliente/MesaIngreso';
import FidelidadModal from '../components/cliente/FidelidadModal';
import MenuCliente from '../components/cliente/MenuCliente';
import Carrito from '../components/cliente/Carrito';
import OrderTracker from '../components/cliente/OrderTracker';

const ClientePage = () => {
    const { numeroMesa, ordenActual, fetchProducts, validarMesa, setNumeroMesa } = useAppStore();

    // Leemos la URL al iniciar para saber si venimos de un QR (Bypass)
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const mesaParam = params.get('mesa');
    const mesaActiva = numeroMesa || (mesaParam ? parseInt(mesaParam, 10) : null);

    const [vista, setVista] = useState(() => {
        return mesaActiva ? 'menu' : 'ingreso';
    });

    const [ordenId, setOrdenId] = useState(ordenActual?.orden_id || null);
    const [mesaError, setMesaError] = useState(null);
    const [validandoMesa, setValidandoMesa] = useState(false);

    const validarMesaQR = async (mesa) => {
        setValidandoMesa(true);
        try {
            const result = await validarMesa(mesa);
            setNumeroMesa(result.numero);
        } catch (err) {
            if (err.status === 404) {
                setMesaError('La mesa no existe o no está disponible.');
            } else if (err.status === 409) {
                setMesaError('Esta mesa está ocupada. Por favor, llama al mesero.');
            } else {
                setMesaError('Error validando la mesa. Intenta de nuevo.');
            }
            setVista('ingreso');
        } finally {
            setValidandoMesa(false);
        }
    };(
                <>
                    <MesaIngreso onMesaValida={handleMesaValida} />
                    {mesaError && (
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
                                        <span style={{ fontSize: '2rem' }}>⚠️</span>
                                    </div>
                                    <h5 className="card-title fw-bold text-dark mb-2">Mesa No Válida</h5>
                                    <p className="card-text text-secondary mb-4">{mesaError}</p>
                                    <button
                                        className="btn btn-primary fw-bold py-2 px-4"
                                        onClick={() => setMesaError(null)}
                                        style={{ borderRadius: '0.75rem' }}
                                    >
                                        Intentar de Nuevo
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )

    useEffect(() => {
        if (mesaParam && !numeroMesa && !validandoMesa) {
            validarMesaQR(parseInt(mesaParam, 10));
        }
        if (vista === 'menu' || vista === 'fidelidad') {
            fetchProducts();
        }
    }, [vista, fetchProducts, mesaParam, numeroMesa, validandoMesa, validarMesa, setNumeroMesa]);

    const handleMesaValida = () => setVista('fidelidad');
    const handleContinuarMenu = () => setVista('menu');
    const handleVerCarrito = () => setVista('carrito');
    const handleVolverMenu = () => setVista('menu');
    // El backend devuelve .id (no .orden_id)
    const handlePedidoEnviado = (ord) => { setOrdenId(ord.id || ord.orden_id); setVista('tracker'); };
    const handleNuevoPedido = () => { setOrdenId(null); setVista('menu'); };

    switch (vista) {
        case 'ingreso':
            return <MesaIngreso onMesaValida={handleMesaValida} />;

        case 'fidelidad':
            return (
                <>
                    <MenuCliente numeroMesa={mesaActiva} onVerCarrito={handleVerCarrito} />
                    <FidelidadModal onContinue={handleContinuarMenu} />
                </>
            );

        case 'menu':
            return <MenuCliente numeroMesa={mesaActiva} onVerCarrito={handleVerCarrito} />;

        case 'carrito':
            return <Carrito onBack={handleVolverMenu} onPedidoEnviado={handlePedidoEnviado} />;

        case 'tracker':
            return <OrderTracker ordenId={ordenId} onNuevoPedido={handleNuevoPedido} />;

        default:
            return <MesaIngreso onMesaValida={handleMesaValida} />;
    }
};

export default ClientePage;
