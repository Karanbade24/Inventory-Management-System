// Thin fetch wrapper around the IMS Spring Boot backend.
// Local dev default: IMS runs standalone on :8089 (vendor :8087, material :8088).
// This differs from the Jenkins/Tomcat pipeline, which deploys WARs to a shared
// Tomcat on :8081 under /inventory, /vendor, /material — point VITE_API_BASE_URL
// at http://localhost:8081/inventory instead when testing against that build.
// CORS is enabled for http://localhost:3001 via @CrossOrigin on the
// PurchaseEntryController / ReportsController.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8089";

async function request(path, options = {}) {
  const token = localStorage.getItem("ims_access_token");
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) }
  });
  if (response.status === 401 && !path.startsWith("/auth/")) {
    localStorage.removeItem("ims_access_token"); localStorage.removeItem("ims_auth_user");
    window.dispatchEvent(new Event("ims:unauthorized"));
  }

  let body = null;
  const text = await response.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!response.ok) {
    const message =
      (body && typeof body === "object" && body.message) ||
      (typeof body === "string" && body) ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return body;
}

export const api = {
  login: (username, password) => request("/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }),
  register: (username, password) => request("/auth/register", { method: "POST", body: JSON.stringify({ username, password }) }),
  getWelcome: () => request("/welcome"),
  getVendors: () => request("/vendors"),
  getCategories: () => request("/categories"),
  getUnitAndTypeList: (purchaseBean) =>
    request("/getUnitAndTypeList", {
      method: "POST",
      body: JSON.stringify(purchaseBean)
    }),
  addPurchaseDetail: (purchaseBean) =>
    request("/addPurchaseDetail", {
      method: "POST",
      body: JSON.stringify(purchaseBean)
    }),
  getVendorWisePurchaseReport: (reportRequest) =>
    request("/report/controller/getPurchaseDetails", {
      method: "POST",
      body: JSON.stringify(reportRequest)
    }),
  // There's no single "all material types" endpoint on the backend — only
  // one scoped to a category (getUnitAndTypeList). The Materials page needs
  // every type across every category up front, so fetch the category list
  // first, then fan out one call per category and merge the results.
  async getAllMaterialTypes() {
    const categories = await request("/categories");
    const results = await Promise.all(
      (categories || []).map((c) =>
        request("/getUnitAndTypeList", {
          method: "POST",
          body: JSON.stringify({ materialCategoryId: c.categoryId })
        }).catch(() => ({ materialTypeList: [] }))
      )
    );
    const types = results.flatMap((r) => r?.materialTypeList || []);
    return { categories: categories || [], types };
  }
};
