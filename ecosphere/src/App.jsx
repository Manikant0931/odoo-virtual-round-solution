import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EsgProvider } from "./context/EsgContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Environmental from "./pages/Environmental";
import Social from "./pages/Social";
import Governance from "./pages/Governance";
import Gamification from "./pages/Gamification";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <EsgProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/environmental" element={<Environmental />} />
            <Route path="/social" element={<Social />} />
            <Route path="/governance" element={<Governance />} />
            <Route path="/gamification" element={<Gamification />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </EsgProvider>
  );
}
