import { useCallback, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';

// Páginas
import ClientePage from './pages/ClientePage';
import MeseroPage from './pages/MeseroPage';
import KitchenDashboard from './components/KitchenDashboard';
import MenuAdmin from './components/MenuAdmin';
import AdminLogin from './components/AdminLogin';
import MeseroLogin from './components/mesero/MeseroLogin';

// Componente que interpreta los query params de la raíz "/"
function RootHandler() {
  const params = new URLSearchParams(window.location.search);

  // QR de mesa  → /?mesa=3       → cliente
  if (params.get('mesa'))         return <ClientePage />;

  // QR de cocina → /?cocina=true  → login de mesero/cocina
  if (params.get('cocina'))       return <MeseroLogin />;

  // QR de mesero → /?mesero=true  → login de mesero/cocina
  if (params.get('mesero'))       return <MeseroLogin />;

  // Panel admin  → /?admin=menu   → manejado por la ruta /admin
  if (params.get('admin'))        return <Navigate to="/admin" replace />;

  // Sin params → login de ADMIN
  return <Navigate to="/admin/login" replace />;
}

function App() {
  const { usuario, token, fetchCurrentUser, logoutLocal } = useAppStore();
  const navigate = useNavigate();
  const rol = (usuario?.rol || '').toUpperCase();

  const handleSessionExpired = useCallback(() => {
    const path = window.location.pathname;
    logoutLocal();

    if (path.startsWith('/mesero') || path.startsWith('/cocina') || path.startsWith('/login')) {
      navigate('/login', { replace: true });
      return;
    }

    navigate('/admin/login', { replace: true });
  }, [logoutLocal, navigate]);

  useEffect(() => {
    window.addEventListener('session-expired', handleSessionExpired);
    return () => window.removeEventListener('session-expired', handleSessionExpired);
  }, [handleSessionExpired]);

  useEffect(() => {
    if (!token) return;

    fetchCurrentUser().catch(() => {
      handleSessionExpired();
    });
  }, [token, fetchCurrentUser, handleSessionExpired]);

  return (
    <Routes>

      {/* RAÍZ — interpreta query params o redirige a login admin */}
      <Route path="/" element={<RootHandler />} />

      {/* ── ADMIN ──────────────────────────────────────────── */}
      <Route
        path="/admin/login"
        element={
          rol === 'ADMIN'
            ? <Navigate to="/admin" replace />
            : <AdminLogin onLoginExitoso={() => navigate('/admin', { replace: true })} />
        }
      />
      <Route
        path="/admin"
        element={
          rol === 'ADMIN'
            ? <MenuAdmin />
            : <Navigate to="/admin/login" replace />
        }
      />

      {/* ── PERSONAL (mesero / cocina) ─────────────────────── */}
      <Route path="/login" element={<MeseroLogin />} />

      <Route
        path="/mesero"
        element={
          rol === 'MESERO'
            ? <MeseroPage />
            : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/cocina"
        element={
          ['COCINERO', 'CHEF', 'PARRILLERO', 'BARISTA', 'REPOSTERO'].includes(rol)
            ? <KitchenDashboard />
            : <Navigate to="/login" replace />
        }
      />

      {/* ── CLIENTE ────────────────────────────────────────── */}
      <Route path="/cliente" element={<ClientePage />} />

      {/* DEFAULT */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />

    </Routes>
  );
}

export default App;