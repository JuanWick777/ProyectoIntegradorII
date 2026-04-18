import { useCallback, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';

import ClientePage from './pages/ClientePage';
import MeseroPage from './pages/MeseroPage';
import KitchenDashboard from './components/KitchenDashboard';
import MenuAdmin from './components/MenuAdmin';
import MeseroLogin from './components/mesero/MeseroLogin';

const ROLES_COCINA = ['COCINERO', 'CHEF', 'PARRILLERO', 'BARISTA', 'REPOSTERO'];

function getDashboardPathByRol(rol) {
  if (rol === 'ADMIN') return '/admin';
  if (rol === 'MESERO') return '/mesero';
  if (ROLES_COCINA.includes(rol)) return '/cocina';
  return '/login';
}

function RootHandler() {
  const params = new URLSearchParams(window.location.search);

  if (params.get('mesa')) return <ClientePage />;
  if (params.get('cocina')) return <MeseroLogin />;
  if (params.get('mesero')) return <MeseroLogin />;
  if (params.get('admin')) return <Navigate to="/admin" replace />;

  return <Navigate to="/login" replace />;
}

function App() {
  const { usuario, token, fetchCurrentUser, logoutLocal } = useAppStore();
  const navigate = useNavigate();
  const rol = (usuario?.rol || '').toUpperCase();
  const [storeHydrated, setStoreHydrated] = useState(
    typeof useAppStore.persist?.hasHydrated === 'function'
      ? useAppStore.persist.hasHydrated()
      : true
  );
  const [authReady, setAuthReady] = useState(!token);
  const restoringUser = Boolean(token) && !usuario;

  const handleSessionExpired = useCallback(() => {
    logoutLocal();
    setAuthReady(true);
    navigate('/login', { replace: true });
  }, [logoutLocal, navigate]);

  useEffect(() => {
    window.addEventListener('session-expired', handleSessionExpired);
    return () => window.removeEventListener('session-expired', handleSessionExpired);
  }, [handleSessionExpired]);

  useEffect(() => {
    if (!useAppStore.persist) return;

    const finishHydration = () => setStoreHydrated(true);
    const startHydration = () => setStoreHydrated(false);

    const unsubFinish = useAppStore.persist.onFinishHydration(finishHydration);
    const unsubStart = useAppStore.persist.onHydrate(startHydration);

    setStoreHydrated(useAppStore.persist.hasHydrated());

    return () => {
      unsubFinish?.();
      unsubStart?.();
    };
  }, []);

  useEffect(() => {
    if (!storeHydrated) return;

    if (!token) {
      setAuthReady(true);
      return;
    }

    setAuthReady(false);
    fetchCurrentUser()
      .catch(() => {
        handleSessionExpired();
      })
      .finally(() => {
        setAuthReady(true);
      });
  }, [storeHydrated, token, fetchCurrentUser, handleSessionExpired]);

  if (!storeHydrated || !authReady) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ background: '#ffffff' }}
      >
        <div className="text-center">
          <div className="spinner-border text-warning mb-3" role="status" />
          <div className="fw-semibold text-muted">
            {!storeHydrated ? 'Cargando sesion guardada...' : 'Restaurando sesion...'}
          </div>
        </div>
      </div>
    );
  }

  const renderAuthLoader = () => (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: '#ffffff' }}
    >
      <div className="text-center">
        <div className="spinner-border text-warning mb-3" role="status" />
        <div className="fw-semibold text-muted">Cargando usuario...</div>
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<RootHandler />} />

      <Route
        path="/login"
        element={
          restoringUser
            ? renderAuthLoader()
            : usuario
            ? <Navigate to={getDashboardPathByRol(rol)} replace />
            : <MeseroLogin />
        }
      />

      <Route path="/admin/login" element={<Navigate to="/login" replace />} />

      <Route
        path="/admin"
        element={
          restoringUser
            ? renderAuthLoader()
            : rol === 'ADMIN'
            ? <MenuAdmin />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/mesero"
        element={
          restoringUser
            ? renderAuthLoader()
            : rol === 'MESERO'
            ? <MeseroPage />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/cocina"
        element={
          restoringUser
            ? renderAuthLoader()
            : ROLES_COCINA.includes(rol)
            ? <KitchenDashboard />
            : <Navigate to="/login" replace />
        }
      />

      <Route path="/cliente" element={<ClientePage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
