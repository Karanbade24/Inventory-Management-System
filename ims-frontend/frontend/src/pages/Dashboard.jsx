import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { IconBuilding, IconLayers, IconBox, IconArrowRight, IconCart, IconDocument } from "../components/icons.jsx";

export default function Dashboard() {
  const [vendorCount, setVendorCount] = useState(null);
  const [categoryCount, setCategoryCount] = useState(null);
  const [typeCount, setTypeCount] = useState(null);

  useEffect(() => {
    api
      .getVendors()
      .then((list) => setVendorCount((list || []).length))
      .catch(() => setVendorCount(null));

    api
      .getAllMaterialTypes()
      .then(({ categories, types }) => {
        setCategoryCount(categories.length);
        setTypeCount(types.length);
      })
      .catch(() => {
        setCategoryCount(null);
        setTypeCount(null);
      });
  }, []);

  return (
    <>
      <div className="hero-banner">
        <div className="hero-banner__badge">● System Operational</div>
        <h1>Inventory Management System</h1>
        <p className="hero-banner__lede">
          Track what's coming in from every vendor, and pull it back up by name and date the
          moment a reconciliation or reorder decision calls for it.
        </p>
        <div className="hero-banner__actions">
          <Link className="btn" to="/purchase">
            <IconCart /> Record New Purchase <IconArrowRight />
          </Link>
          <Link className="btn btn--ghost-inverse" to="/reports">
            <IconDocument /> Generate Purchase Report
          </Link>
        </div>
      </div>

      <div className="dashboard-grid">
        <Link className="stat-card stat-card--blue" to="/vendors">
          <div className="stat-card__icon">
            <IconBuilding />
          </div>
          <div className="stat-card__label">Registered Vendors</div>
          <div className="stat-card__value">{vendorCount ?? "—"}</div>
          <div className="stat-card__link">View directory →</div>
        </Link>

        <Link className="stat-card stat-card--purple" to="/categories">
          <div className="stat-card__icon">
            <IconLayers />
          </div>
          <div className="stat-card__label">Material Categories</div>
          <div className="stat-card__value">{categoryCount ?? "—"}</div>
          <div className="stat-card__link">Browse categories →</div>
        </Link>

        <Link className="stat-card stat-card--green" to="/categories">
          <div className="stat-card__icon">
            <IconBox />
          </div>
          <div className="stat-card__label">Material Specifications</div>
          <div className="stat-card__value">{typeCount ?? "—"}</div>
          <div className="stat-card__link">Inspect catalog →</div>
        </Link>
      </div>
    </>
  );
}
