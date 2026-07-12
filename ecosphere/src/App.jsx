import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { EsgProvider, useEsg } from "./context/EsgContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Environmental from "./pages/Environmental";
import Social from "./pages/Social";
import Governance from "./pages/Governance";
import Gamification from "./pages/Gamification";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

function RequireAuth({ children }) {
  const { state } = useEsg();
  if (!state.auth?.userId) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <EsgProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/environmental" element={<Environmental />} />
            <Route path="/social" element={<Social />} />
            <Route path="/governance" element={<Governance />} />
            <Route path="/gamification" element={<Gamification />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </EsgProvider>
  );
}
