import { Link, Navigate, useLocation } from "react-router-dom";

export default function PurchaseSuccess() {
  const location = useLocation();
  const purchase = location.state?.purchase;

  if (!purchase) {
    // Someone landed here directly without submitting an order — send them
    // back to the entry form instead of showing a receipt with no data.
    return <Navigate to="/purchase" replace />;
  }

  return (
    <div className="panel" style={{ textAlign: "center" }}>
      <div className="stamp">✓ Purchase Recorded</div>
      <h1 className="panel-title">Order saved to the purchase ledger</h1>
      <p className="panel-subtitle">
        This entry is now searchable from the vendor report for <strong>{purchase.vendorName}</strong>.
      </p>

      <div className="receipt" style={{ textAlign: "left" }}>
        <div className="receipt__row">
          <span className="receipt__label">Transaction ID</span>
          <span className="receipt__value">{purchase.transactionId || "—"}</span>
        </div>
        <div className="receipt__row">
          <span className="receipt__label">Vendor</span>
          <span className="receipt__value">{purchase.vendorName}</span>
        </div>
        <div className="receipt__row">
          <span className="receipt__label">Material</span>
          <span className="receipt__value">
            {purchase.materialCategoryName || purchase.materialCategoryId} /{" "}
            {purchase.materialTypeName || purchase.materialTypeId}
          </span>
        </div>
        <div className="receipt__row">
          <span className="receipt__label">Brand</span>
          <span className="receipt__value">{purchase.brandName}</span>
        </div>
        <div className="receipt__row">
          <span className="receipt__label">Quantity</span>
          <span className="receipt__value">
            {purchase.quantity} {purchase.materialUnitName || purchase.unitId}
          </span>
        </div>
        <div className="receipt__row">
          <span className="receipt__label">Amount</span>
          <span className="receipt__value">{Number(purchase.purchaseAmount).toFixed(2)}</span>
        </div>
        <div className="receipt__row">
          <span className="receipt__label">Purchase Date</span>
          <span className="receipt__value">{String(purchase.purchaseDate).slice(0, 10)}</span>
        </div>
        <div className="receipt__row">
          <span className="receipt__label">Status</span>
          <span className="receipt__value">{purchase.status || "SUCCESS"}</span>
        </div>
      </div>

      <div className="success-actions">
        <Link className="btn btn--ghost" to="/reports">
          View Vendor Report
        </Link>
        <Link className="btn" to="/purchase">
          Record Another Purchase
        </Link>
      </div>
    </div>
  );
}
