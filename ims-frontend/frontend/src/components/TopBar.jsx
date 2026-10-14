import { useLocation } from "react-router-dom";
import { IconRefresh } from "./icons.jsx";

const PAGE_LABELS = {
  "/": "Dashboard",
  "/vendors": "Vendors",
  "/categories": "Categories",
  "/purchase": "Purchase Entry",
  "/purchase-success": "Purchase Entry",
  "/records": "Purchase Records",
  "/reports": "Reports"
};

export default function TopBar() {
  const location = useLocation();
  const currentLabel = PAGE_LABELS[location.pathname] || "Dashboard";

  return (
    <header className="topbar">
      <div className="topbar__breadcrumb">
        IMS / <span className="current">{currentLabel}</span>
      </div>
      <div className="topbar__title">Inventory Management System</div>
      <div className="topbar__status">
        <span className="topbar__status-dot" />
        Online
        <IconRefresh />
      </div>
    </header>
  );
}
