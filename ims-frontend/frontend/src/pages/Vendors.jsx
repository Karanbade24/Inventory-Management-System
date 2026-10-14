import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getVendors()
      .then((list) => setVendors(list || []))
      .catch(() => setError("Couldn't load vendors from the IMS service."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-heading">
        <h1>Vendors</h1>
        <p>Vendor records available in the system, supplied by the vendor microservice.</p>
      </div>

      <div className="panel">
        {error && <div className="banner">{error}</div>}
        {loading ? (
          <div className="empty-state">Loading vendors…</div>
        ) : vendors.length === 0 ? (
          <div className="empty-state">No vendors found.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Vendor ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Contact Person</th>
                <th>Contact Number</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v.vendorId}>
                  <td>{v.vendorId}</td>
                  <td>{v.vendorName}</td>
                  <td>{v.vendorAddress}</td>
                  <td>{v.contactPerson}</td>
                  <td>{v.contactNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
