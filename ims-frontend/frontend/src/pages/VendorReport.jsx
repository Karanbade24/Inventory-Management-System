import { useEffect, useMemo, useState } from "react";
import { api } from "../api.js";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${y}-${m}-${d}`;
}

function fieldClass(field, errors, touched, value) {
  if (touched[field] && errors[field]) return "field has-error";
  if (touched[field] && !errors[field] && String(value).trim() !== "") return "field has-success";
  return "field";
}

export default function VendorReport() {
  const [vendors, setVendors] = useState([]);
  const [vendorName, setVendorName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState(todayISO());

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [results, setResults] = useState(null);
  const [ranQuery, setRanQuery] = useState(null); // {vendorName, fromDate, toDate} snapshot for the summary
  const [requestError, setRequestError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    api
      .getVendors()
      .then((list) => setVendors(list || []))
      .catch(() => setVendors([]));
  }, []);

  const selectedVendor = useMemo(
    () => vendors.find((v) => v.vendorName === (ranQuery?.vendorName || "")),
    [vendors, ranQuery]
  );

  function validate(values) {
    const nextErrors = {};
    if (!values.vendorName) {
      nextErrors.vendorName = "Choose a vendor to generate a report.";
    }
    if (!values.fromDate) {
      nextErrors.fromDate = "From date is a required field.";
    }
    if (!values.toDate) {
      nextErrors.toDate = "To date is a required field.";
    }
    if (values.toDate && values.toDate > todayISO()) {
      nextErrors.toDate = "To date can't be in the future.";
    }
    if (values.fromDate && values.toDate && values.fromDate > values.toDate) {
      nextErrors.fromDate = "From date must be on or before the to date.";
      nextErrors.toDate = "To date must be on or after the from date.";
    }
    return nextErrors;
  }

  function markTouched(field, values) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(values));
  }

  async function handleSearch(event) {
    event.preventDefault();
    setRequestError("");

    const values = { vendorName, fromDate, toDate };
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouched({ vendorName: true, fromDate: true, toDate: true });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const rows = await api.getVendorWisePurchaseReport(values);
      setResults(rows || []);
      setRanQuery(values);
    } catch (err) {
      setRequestError(err.message || "Could not generate the report. Please try again.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="panel">
        <h1 className="panel-title">Purchase Reports</h1>
        <p className="panel-subtitle">Generate vendor-wise purchase reports by date range.</p>

        <div className="subpanel">
          <div className="subpanel-title">Report Filters</div>

          {requestError && <div className="banner">{requestError}</div>}

          <form onSubmit={handleSearch} className="report-filters" noValidate>
            <div className={fieldClass("vendorName", errors, touched, vendorName)}>
              <label htmlFor="reportVendor">Vendor</label>
              <select
                id="reportVendor"
                value={vendorName}
                onChange={(e) => {
                  setVendorName(e.target.value);
                  setErrors(validate({ vendorName: e.target.value, fromDate, toDate }));
                }}
                onBlur={() => markTouched("vendorName", { vendorName, fromDate, toDate })}
              >
                <option value="">-- Select Vendor --</option>
                {vendors.map((v) => (
                  <option key={v.vendorId} value={v.vendorName}>
                    {v.vendorName}
                  </option>
                ))}
              </select>
              {touched.vendorName && errors.vendorName && (
                <span className="error-text">{errors.vendorName}</span>
              )}
            </div>

            <div className={fieldClass("fromDate", errors, touched, fromDate)}>
              <label htmlFor="fromDate">From Date</label>
              <input
                id="fromDate"
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setErrors(validate({ vendorName, fromDate: e.target.value, toDate }));
                }}
                onBlur={() => markTouched("fromDate", { vendorName, fromDate, toDate })}
              />
              {touched.fromDate && errors.fromDate && (
                <span className="error-text">{errors.fromDate}</span>
              )}
            </div>

            <div className={fieldClass("toDate", errors, touched, toDate)}>
              <label htmlFor="toDate">To Date</label>
              <input
                id="toDate"
                type="date"
                value={toDate}
                min={fromDate || undefined}
                max={todayISO()}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setErrors(validate({ vendorName, fromDate, toDate: e.target.value }));
                }}
                onBlur={() => markTouched("toDate", { vendorName, fromDate, toDate })}
              />
              {touched.toDate && errors.toDate && <span className="error-text">{errors.toDate}</span>}
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Generating…" : "Generate Report"}
            </button>
          </form>
        </div>
      </div>

      {searched && !loading && results && (
        <div className="panel">
          <div className="report-summary">
            <div>
              <h3>Vendor purchase report</h3>
              <div className="meta-line">
                {ranQuery?.vendorName} &nbsp;|&nbsp; {formatDate(ranQuery?.fromDate)} to{" "}
                {formatDate(ranQuery?.toDate)}
                {selectedVendor && (
                  <>
                    <br />
                    Address: {selectedVendor.vendorAddress} &nbsp;|&nbsp; Contact Number:{" "}
                    {selectedVendor.contactNumber} &nbsp;|&nbsp; Contact person:{" "}
                    {selectedVendor.contactPerson}
                  </>
                )}
              </div>
            </div>
            <span className="record-count">
              {results.length} {results.length === 1 ? "Record" : "Records"}
            </span>
          </div>

          {results.length === 0 ? (
            <div className="empty-state">
              No purchases found for <strong>{ranQuery?.vendorName}</strong> in this date range.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Material Category</th>
                  <th>Material Type</th>
                  <th>Brand</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Price</th>
                  <th>Purchase Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row) => (
                  <tr key={row.purchaseId || row.transactionId}>
                    <td>{row.materialCategoryName || row.materialCategoryId}</td>
                    <td>{row.materialTypeName || row.materialTypeId}</td>
                    <td>{row.brandName}</td>
                    <td>{row.quantity}</td>
                    <td>{row.materialUnitName || row.unitId}</td>
                    <td>{Number(row.purchaseAmount).toFixed(2)}</td>
                    <td>{String(row.purchaseDate).slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  );
}
