import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import MesaIngreso from '../components/cliente/MesaIngreso';
import FidelidadModal from '../components/cliente/FidelidadModal';
import MenuCliente from '../components/cliente/MenuCliente';
import Carrito from '../components/cliente/Carrito';
import OrderTracker from '../components/cliente/OrderTracker';

const ClientePage = () => {
    const { numeroMesa, ordenActual, fetchProducts } = useAppStore();

    // Leemos la URL al iniciar para saber si venimos de un QR (Bypass)
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const mesaParam = params.get('mesa');
    const mesaActiva = numeroMesa || (mesaParam ? parseInt(mesaParam, 10) : null);

    const [vista, setVista] = useState(() => {
        return mesaActiva ? 'menu' : 'ingreso';
    });

    const [ordenId, setOrdenId] = useState(ordenActual?.orden_id || null);

    useEffect(() => {
        if (mesaParam && !numeroMesa) {
            useAppStore.getState().setNumeroMesa(parseInt(mesaParam, 10));
        }
        if (vista === 'menu' || vista === 'fidelidad') {
            fetchProducts();
        }
    }, [vista, fetchProducts, mesaParam, numeroMesa]);

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
