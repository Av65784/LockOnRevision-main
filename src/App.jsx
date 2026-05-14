import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell.jsx";
import { AuthScreen } from "./pages/AuthScreen.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Forge } from "./pages/Forge.jsx";
import { Pro } from "./pages/Pro.jsx";
import { Revision } from "./pages/Revision.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function ProtectedApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-paper text-ink">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-mint border-t-moss" />
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/revision" element={<Revision />} />
        <Route path="/forge" element={<Forge />} />
        <Route path="/pro" element={<Pro />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <AuthScreen />} />
      <Route path="/*" element={<ProtectedApp />} />
    </Routes>
  );
}
