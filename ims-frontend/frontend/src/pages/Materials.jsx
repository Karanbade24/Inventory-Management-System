import { useEffect, useMemo, useState } from "react";
import { api } from "../api.js";

export default function Materials() {
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getAllMaterialTypes()
      .then(({ categories: cats, types: allTypes }) => {
        setCategories(cats);
        setTypes(allTypes);
      })
      .catch(() => setError("Couldn't load materials from the IMS service."))
      .finally(() => setLoading(false));
  }, []);

  const categoryNameById = useMemo(() => {
    const map = new Map();
    categories.forEach((c) => map.set(c.categoryId, c.categoryName));
    return map;
  }, [categories]);

  const filteredTypes = useMemo(() => {
    if (categoryFilter === "all") return types;
    return types.filter((t) => t.categoryId === categoryFilter);
  }, [types, categoryFilter]);

  return (
    <>
      <div className="page-heading">
        <h1>Materials</h1>
        <p>Material categories, material types and available units from the material microservice.</p>
      </div>

      {error && <div className="banner">{error}</div>}

      <div className="panel">
        <div className="subpanel-title" style={{ textAlign: "center", marginBottom: 20 }}>
          Material Categories
        </div>
        {loading ? (
          <div className="empty-state">Loading categories…</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Category ID</th>
                <th>Category Name</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.categoryId}>
                  <td>{c.categoryId}</td>
                  <td>{c.categoryName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="panel">
        <div className="subpanel-title" style={{ textAlign: "center", marginBottom: 20 }}>
          Material Types
        </div>

        <div className="list-filters">
          <div className="field" style={{ maxWidth: 240 }}>
            <label htmlFor="categoryFilter">Filter by Category</label>
            <select
              id="categoryFilter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Loading material types…</div>
        ) : filteredTypes.length === 0 ? (
          <div className="empty-state">No material types found for this category.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Type ID</th>
                <th>Type Name</th>
                <th>Category ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredTypes.map((t) => (
                <tr key={t.typeId}>
                  <td>{t.typeId}</td>
                  <td>{t.typeName}</td>
                  <td>
                    {t.categoryId}
                    {categoryNameById.get(t.categoryId) ? ` — ${categoryNameById.get(t.categoryId)}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
