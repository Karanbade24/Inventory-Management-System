import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

const EMPTY_FORM = {
  vendorName: "",
  materialCategoryId: "",
  materialTypeId: "",
  brandName: "",
  unitId: "",
  quantity: "",
  purchaseAmount: "",
  purchaseDate: ""
};

const REQUIRED_FIELDS = [
  "vendorName",
  "materialCategoryId",
  "materialTypeId",
  "brandName",
  "unitId",
  "quantity",
  "purchaseAmount",
  "purchaseDate"
];

// Whole numbers only, no leading zero unless the value itself is 0.
const QUANTITY_FORMAT = /^(0|[1-9]\d*)$/;
// Up to 2 decimal places, e.g. 1500 or 1500.50.
const AMOUNT_FORMAT = /^\d+(\.\d{1,2})?$/;
// Letters, digits, spaces, and a small set of punctuation common in brand names.
const BRAND_FORMAT = /^[A-Za-z0-9][A-Za-z0-9 .&'-]{1,59}$/;

function todayMinusOne() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

// Mirrors PurchaseBean's @NotBlank / @NotNull / @Past constraints, plus the
// stricter format/range checks the story asks the React layer to enforce
// before a request is even sent.
function validateField(field, value) {
  switch (field) {
    case "vendorName":
      return value.trim() ? "" : "Vendor is a required field.";
    case "materialCategoryId":
      return value.trim() ? "" : "Material category is a required field.";
    case "materialTypeId":
      return value.trim() ? "" : "Material type is a required field.";
    case "unitId":
      return value.trim() ? "" : "Unit is a required field.";
    case "brandName":
      if (!value.trim()) return "Brand name is a required field.";
      if (!BRAND_FORMAT.test(value.trim())) {
        return "Use 2–60 letters, numbers, spaces, or . & ' - only.";
      }
      return "";
    case "quantity":
      if (value === "" || value === null) return "Quantity is a required field.";
      if (!QUANTITY_FORMAT.test(String(value))) return "Enter a whole number (no decimals).";
      if (Number(value) <= 0) return "Quantity must be greater than zero.";
      return "";
    case "purchaseAmount":
      if (value === "" || value === null) return "Purchase amount is a required field.";
      if (!AMOUNT_FORMAT.test(String(value))) return "Enter an amount like 1500 or 1500.50.";
      if (Number(value) <= 0) return "Purchase amount must be greater than zero.";
      return "";
    case "purchaseDate": {
      if (!value) return "Purchase date is a required field.";
      const todayISO = new Date().toISOString().slice(0, 10);
      if (value >= todayISO) return "Purchase date must be in the past.";
      return "";
    }
    default:
      return "";
  }
}

function validateForm(form) {
  const errors = {};
  for (const field of REQUIRED_FIELDS) {
    const message = validateField(field, form[field]);
    if (message) errors[field] = message;
  }
  return errors;
}

function fieldClass(field, errors, touched, value) {
  if (touched[field] && errors[field]) return "field has-error";
  if (touched[field] && !errors[field] && String(value).trim() !== "") return "field has-success";
  return "field";
}

export default function PurchaseEntry() {
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingCategoryOptions, setLoadingCategoryOptions] = useState(false);

  useEffect(() => {
    Promise.all([api.getVendors(), api.getCategories()])
      .then(([vendorList, categoryList]) => {
        setVendors(vendorList || []);
        setCategories(categoryList || []);
      })
      .catch(() => {
        setLoadError(
          "Couldn't load vendors and material categories from the IMS service. Confirm the backend is running."
        );
      });
  }, []);

  useEffect(() => {
    if (!form.materialCategoryId) {
      setUnits([]);
      setMaterialTypes([]);
      return;
    }
    setLoadingCategoryOptions(true);
    api
      .getUnitAndTypeList({ materialCategoryId: form.materialCategoryId })
      .then((res) => {
        setUnits(res?.unitList || []);
        setMaterialTypes(res?.materialTypeList || []);
      })
      .catch(() => {
        setUnits([]);
        setMaterialTypes([]);
      })
      .finally(() => setLoadingCategoryOptions(false));
  }, [form.materialCategoryId]);

  function updateField(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "materialCategoryId") {
        next.materialTypeId = "";
        next.unitId = "";
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  }

  function markTouched(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, form[field]) }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");

    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    setTouched(
      REQUIRED_FIELDS.reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {})
    );

    if (Object.keys(validationErrors).length > 0) {
      return; // Block submission — at least one field failed validation.
    }

    const selectedCategory = categories.find((c) => c.categoryId === form.materialCategoryId);
    const selectedType = materialTypes.find((t) => t.typeId === form.materialTypeId);
    const selectedUnit = units.find((u) => u.unitId === form.unitId);

    const payload = {
      vendorName: form.vendorName,
      materialCategoryId: form.materialCategoryId,
      materialTypeId: form.materialTypeId,
      brandName: form.brandName.trim(),
      unitId: form.unitId,
      quantity: Number(form.quantity),
      purchaseAmount: Number(form.purchaseAmount),
      purchaseDate: form.purchaseDate,
      materialCategoryName: selectedCategory?.categoryName,
      materialTypeName: selectedType?.typeName,
      materialUnitName: selectedUnit?.unitName
    };

    setSubmitting(true);
    try {
      const response = await api.addPurchaseDetail(payload);
      navigate("/purchase-success", { state: { purchase: response?.purchase || payload } });
    } catch (err) {
      setSubmitError(err.message || "Could not save this purchase. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function Feedback({ field }) {
    if (touched[field] && errors[field]) {
      return <span className="error-text">{errors[field]}</span>;
    }
    if (touched[field] && !errors[field] && String(form[field]).trim() !== "") {
      return <span className="success-text">Looks good</span>;
    }
    return null;
  }

  return (
    <>
      <div className="panel">
        <h1 className="panel-title">Purchase Entry</h1>
        <p className="panel-subtitle">Register a new material purchase</p>

        {loadError && <div className="banner">{loadError}</div>}
        {submitError && <div className="banner">{submitError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field-grid">
            <div className={fieldClass("vendorName", errors, touched, form.vendorName)}>
              <label htmlFor="vendorName">Vendor</label>
              <select
                id="vendorName"
                value={form.vendorName}
                onChange={(e) => updateField("vendorName", e.target.value)}
                onBlur={() => markTouched("vendorName")}
              >
                <option value="">-- Select Vendor --</option>
                {vendors.map((v) => (
                  <option key={v.vendorId} value={v.vendorName}>
                    {v.vendorName}
                  </option>
                ))}
              </select>
              <Feedback field="vendorName" />
            </div>

            <div
              className={fieldClass("materialCategoryId", errors, touched, form.materialCategoryId)}
            >
              <label htmlFor="materialCategoryId">Material Category</label>
              <select
                id="materialCategoryId"
                value={form.materialCategoryId}
                onChange={(e) => updateField("materialCategoryId", e.target.value)}
                onBlur={() => markTouched("materialCategoryId")}
              >
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
              <Feedback field="materialCategoryId" />
            </div>

            <div className={fieldClass("materialTypeId", errors, touched, form.materialTypeId)}>
              <label htmlFor="materialTypeId">Material Type</label>
              <select
                id="materialTypeId"
                value={form.materialTypeId}
                onChange={(e) => updateField("materialTypeId", e.target.value)}
                onBlur={() => markTouched("materialTypeId")}
                disabled={!form.materialCategoryId || loadingCategoryOptions}
              >
                <option value="">
                  {loadingCategoryOptions ? "Loading…" : "-- Select Material Type --"}
                </option>
                {materialTypes.map((t) => (
                  <option key={t.typeId} value={t.typeId}>
                    {t.typeName}
                  </option>
                ))}
              </select>
              <Feedback field="materialTypeId" />
            </div>

            <div className={fieldClass("brandName", errors, touched, form.brandName)}>
              <label htmlFor="brandName">Brand Name</label>
              <input
                id="brandName"
                type="text"
                value={form.brandName}
                onChange={(e) => updateField("brandName", e.target.value)}
                onBlur={() => markTouched("brandName")}
                placeholder="Enter brand name"
                maxLength={60}
              />
              <Feedback field="brandName" />
            </div>

            <div className={fieldClass("unitId", errors, touched, form.unitId)}>
              <label htmlFor="unitId">Unit</label>
              <select
                id="unitId"
                value={form.unitId}
                onChange={(e) => updateField("unitId", e.target.value)}
                onBlur={() => markTouched("unitId")}
                disabled={!form.materialCategoryId || loadingCategoryOptions}
              >
                <option value="">{loadingCategoryOptions ? "Loading…" : "-- Select Unit --"}</option>
                {units.map((u) => (
                  <option key={u.unitId} value={u.unitId}>
                    {u.unitName}
                  </option>
                ))}
              </select>
              <Feedback field="unitId" />
            </div>

            <div className={fieldClass("quantity", errors, touched, form.quantity)}>
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                value={form.quantity}
                onChange={(e) => updateField("quantity", e.target.value)}
                onBlur={() => markTouched("quantity")}
                placeholder="Enter quantity"
              />
              <Feedback field="quantity" />
            </div>

            <div className={fieldClass("purchaseAmount", errors, touched, form.purchaseAmount)}>
              <label htmlFor="purchaseAmount">Purchase Amount</label>
              <input
                id="purchaseAmount"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={form.purchaseAmount}
                onChange={(e) => updateField("purchaseAmount", e.target.value)}
                onBlur={() => markTouched("purchaseAmount")}
                placeholder="Enter amount"
              />
              <Feedback field="purchaseAmount" />
            </div>

            <div className={fieldClass("purchaseDate", errors, touched, form.purchaseDate)}>
              <label htmlFor="purchaseDate">Purchase Date</label>
              <input
                id="purchaseDate"
                type="date"
                max={todayMinusOne()}
                value={form.purchaseDate}
                onChange={(e) => updateField("purchaseDate", e.target.value)}
                onBlur={() => markTouched("purchaseDate")}
              />
              <span className="hint">Must be a date in the past.</span>
              <Feedback field="purchaseDate" />
            </div>
          </div>

          <div className="form-footer">
            <button type="submit" className="btn btn--full" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Purchase"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
