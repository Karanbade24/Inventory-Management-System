import { NavLink, useNavigate } from "react-router-dom";
import {
  IconGrid,
  IconBuilding,
  IconLayers,
  IconCart,
  IconDocument,
  IconChart,
  IconBox3D
} from "./icons.jsx";
import { useAuth } from "../auth.jsx";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: <IconGrid />, end: true },
  { to: "/vendors", label: "Vendors", icon: <IconBuilding /> },
  { to: "/categories", label: "Categories", icon: <IconLayers /> },
  { to: "/purchase", label: "Purchase Entry", icon: <IconCart /> },
  { to: "/records", label: "Purchase Records", icon: <IconDocument /> },
  { to: "/reports", label: "Reports", icon: <IconChart /> }
];

export default function Sidebar() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <IconBox3D />
        </div>
        <div>
          <div className="sidebar__brand-name">Inventory</div>
          <div className="sidebar__brand-sub">Management System</div>
        </div>
      </div>

      <div className="sidebar__section-label">Menu</div>
      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `sidebar__link${isActive ? " active" : ""}`}
          >
            <span className="sidebar__link-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <span className="sidebar__status-dot" />
        Signed in as {username || "admin"}
        <br />
        <button type="button" className="sidebar__logout" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </aside>
  );
}
