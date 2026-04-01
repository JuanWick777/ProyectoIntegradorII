import React, { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import MeseroLogin from '../components/mesero/MeseroLogin';
import WaiterDashboard from '../components/mesero/WaiterDashboard';


const MeseroPage = () => {
    const { usuario, fetchCurrentUser, logoutLocal } = useAppStore();


    // Al montar, intentar reanudar sesión existente (cookie de sesión Spring)
    useEffect(() => {
        fetchCurrentUser().catch(() => { });
    }, [fetchCurrentUser]);

    const handleLogout = () => {
        logoutLocal();
    };


    // Sin sesión → Login
    if (!usuario) {
        return <MeseroLogin onLoginExitoso={() => fetchCurrentUser()} />;
    }

    // Con sesión → Dashboard
    return <WaiterDashboard usuario={usuario} onLogout={handleLogout} />;
};

export default MeseroPage;
