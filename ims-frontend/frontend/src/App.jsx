import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import TopBar from "./components/TopBar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Vendors from "./pages/Vendors.jsx";
import Materials from "./pages/Materials.jsx";
import PurchaseEntry from "./pages/PurchaseEntry.jsx";
import PurchaseSuccess from "./pages/PurchaseSuccess.jsx";
import PurchaseRecords from "./pages/PurchaseRecords.jsx";
import VendorReport from "./pages/VendorReport.jsx";

function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-body">
        <TopBar />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/vendors" element={<Vendors />} />
                <Route path="/categories" element={<Materials />} />
                <Route path="/purchase" element={<PurchaseEntry />} />
                <Route path="/purchase-success" element={<PurchaseSuccess />} />
                <Route path="/records" element={<PurchaseRecords />} />
                <Route path="/reports" element={<VendorReport />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
