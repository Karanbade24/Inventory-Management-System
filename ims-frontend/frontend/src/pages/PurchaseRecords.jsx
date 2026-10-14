import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoISO(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

const DEFAULT_FROM = daysAgoISO(90);
const DEFAULT_TO = todayISO();

function statusTagClass(status) {
  const s = (status || "").toUpperCase();
  if (s === "PENDING") return "tag tag--pending";
  if (s === "REJECTED" || s === "FAILED") return "tag tag--rejected";
  return "tag"; // SUCCESS / ACCEPTED / default
}

export default function PurchaseRecords() {
  const [vendors, setVendors] = useState([]);
  const [vendorName, setVendorName] = useState(""); // "" = All Vendors
  const [fromDate, setFromDate] = useState(DEFAULT_FROM);
  const [toDate, setToDate] = useState(DEFAULT_TO);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getVendors()
      .then((list) => setVendors(list || []))
      .catch(() => setVendors([]));
  }, []);

  const loadRecords = useCallback(
    async (values) => {
      if (!values.fromDate || !values.toDate) return;
      if (values.fromDate > values.toDate) {
        setError("From date must be on or before the to date.");
        return;
      }
      setError("");
      setLoading(true);
      try {
        if (values.vendorName) {
          const results = await api.getVendorWisePurchaseReport(values);
          setRows((results || []).map((r) => ({ ...r, vendorName: values.vendorName })));
        } else {
          // No "all vendors" endpoint on the backend — fan out one report
          // call per known vendor and merge, same approach used on the
          // Materials page for aggregating types across categories.
          const perVendor = await Promise.all(
            vendors.map((v) =>
              api
                .getVendorWisePurchaseReport({ ...values, vendorName: v.vendorName })
                .then((results) => (results || []).map((r) => ({ ...r, vendorName: v.vendorName })))
                .catch(() => [])
            )
          );
          setRows(perVendor.flat());
        }
      } catch (err) {
        setError(err.message || "Could not load purchase records.");
        setRows([]);
      } finally {
        setLoading(false);
      }
    },
    [vendors]
  );

  useEffect(() => {
    if (vendors.length === 0 && vendorName === "") return; // wait for vendor list on first "All Vendors" load
    loadRecords({ vendorName, fromDate, toDate });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendors, vendorName, fromDate, toDate]);

  function handleReset() {
    setVendorName("");
    setFromDate(DEFAULT_FROM);
    setToDate(DEFAULT_TO);
  }

  return (
    <>
      <div className="page-heading">
        <h1>Purchase Records</h1>
        <p>Browse recorded purchases across every vendor, with optional filters.</p>
      </div>

      <div className="panel">
        <div className="list-filters" style={{ marginBottom: 24 }}>
          <div className="field" style={{ maxWidth: 220 }}>
            <label htmlFor="recordsVendor">Vendor</label>
            <select
              id="recordsVendor"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
            >
              <option value="">All Vendors</option>
              {vendors.map((v) => (
                <option key={v.vendorId} value={v.vendorName}>
                  {v.vendorName}
                </option>
              ))}
            </select>
          </div>
          <div className="field" style={{ maxWidth: 170 }}>
            <label htmlFor="recordsFrom">From</label>
            <input
              id="recordsFrom"
              type="date"
              value={fromDate}
              max={toDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="field" style={{ maxWidth: 170 }}>
            <label htmlFor="recordsTo">To</label>
            <input
              id="recordsTo"
              type="date"
              value={toDate}
              min={fromDate}
              max={todayISO()}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn--ghost" onClick={handleReset}>
            Reset
          </button>
        </div>

        {error && <div className="banner">{error}</div>}

        {loading ? (
          <div className="empty-state">Loading purchase records…</div>
        ) : rows.length === 0 ? (
          <div className="empty-state">No purchase records found for this filter.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Category</th>
                <th>Type</th>
                <th>Brand</th>
                <th>Unit</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.transactionId}-${row.purchaseId}`}>
                  <td>{row.vendorName}</td>
                  <td>{row.materialCategoryName || row.materialCategoryId}</td>
                  <td>{row.materialTypeName || row.materialTypeId}</td>
                  <td>{row.brandName}</td>
                  <td>{row.materialUnitName || row.unitId}</td>
                  <td>{row.quantity}</td>
                  <td>{Number(row.purchaseAmount).toFixed(2)}</td>
                  <td>{String(row.purchaseDate).slice(0, 10)}</td>
                  <td>
                    <span className={statusTagClass(row.status)}>{row.status || "SUCCESS"}</span>
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
