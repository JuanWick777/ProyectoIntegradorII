import { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';

// Páginas por rol
import ClientePage from './pages/ClientePage';
import MeseroPage from './pages/MeseroPage';
import KitchenDashboard from './components/KitchenDashboard';
import QRCodeGenerator from './components/QRCodeGenerator';
import MenuAdmin from './components/MenuAdmin';
import AdminLogin from './components/AdminLogin';

function App() {
  const { setNumeroMesa, fetchCurrentUser, usuario, token } = useAppStore();

  const [hydrated, setHydrated] = useState(false);

  /*useEffect(() => {
    setHydrated(useAppStore.persist?.hasHydrated?.() ?? true);
    const unsub = useAppStore.persist?.onFinishHydration?.(() => setHydrated(true));
    return () => unsub?.();
  }, []);

  if (!hydrated) return null;*/

  const params = new URLSearchParams(window.location.search);
  const esCocina = Boolean(params.get('cocina'));
  const esMesero = Boolean(params.get('mesero'));
  const adminView = params.get('admin');
  const mesaParam = params.get('mesa');

  const rol = (usuario?.rol || '').toUpperCase();
  const esAdmin = rol === 'ADMIN';

  useEffect(() => {
    if (mesaParam && !esCocina) {
      setNumeroMesa(parseInt(mesaParam, 10));
    }

    const esStaff =
      esCocina ||
      esMesero ||
      Boolean(adminView) ||
      (!mesaParam && !esCocina && !esMesero);

    if (esStaff && token) {
      fetchCurrentUser().catch(() => {});
    }
  }, [mesaParam, esCocina, esMesero, adminView, setNumeroMesa, fetchCurrentUser, token]);

  if (esMesero) return <MeseroPage />;
  if (esCocina) return <KitchenDashboard />;

  if (adminView === 'qr') {
    if (!esAdmin) return <AdminLogin onLoginExitoso={() => fetchCurrentUser()} />;
    return <QRCodeGenerator />;
  }

  if (adminView === 'menu') {
    if (!esAdmin) return <AdminLogin onLoginExitoso={() => fetchCurrentUser()} />;
    return <MenuAdmin />;
  }

  if (mesaParam) return <ClientePage />;

  if (!esAdmin) {
    return <AdminLogin onLoginExitoso={() => fetchCurrentUser()} />;
  }

  return <MenuAdmin />;
}

export default App;