import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';

// Páginas
import ClientePage from './pages/ClientePage';
import MeseroPage from './pages/MeseroPage';
import KitchenDashboard from './components/KitchenDashboard';
import MenuAdmin from './components/MenuAdmin';
import AdminLogin from './components/AdminLogin';
import MeseroLogin from './components/mesero/MeseroLogin';

function App() {
  const { usuario, token, fetchCurrentUser } = useAppStore();

  const rol = (usuario?.rol || '').toUpperCase();

  useEffect(() => {
    if (token) {
      fetchCurrentUser().catch(() => {});
    }
  }, [token, fetchCurrentUser]);

  return (
    <Routes>

      {/* LOGIN GENERAL */}
      <Route path="/" element={<MeseroLogin />} />

      {/* CLIENTE */}
      <Route path="/cliente" element={<ClientePage />} />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          rol === 'ADMIN'
            ? <MenuAdmin />
            : <Navigate to="/" />
        }
      />

      {/* MESERO */}
      <Route
        path="/mesero"
        element={
          rol === 'MESERO'
            ? <MeseroPage />
            : <Navigate to="/" />
        }
      />

      {/* COCINA */}
      <Route
        path="/cocina"
        element={
          ['COCINERO', 'CHEF', 'PARRILLERO', 'BARISTA', 'REPOSTERO'].includes(rol)
            ? <KitchenDashboard />
            : <Navigate to="/" />
        }
      />

      {/* DEFAULT */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default App;