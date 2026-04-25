import api from "./api";

// ── Finance Service ───────────────────────────────────────────────────────────
// All API calls related to finance
// Response structure: { success: true, data: { ... } }

// GET /api/finance/overview — platform finance overview
export const getFinanceOverview = async () => {
  const response = await api.get("/finance/overview");
  return response.data.data;
};

// GET /api/finance/merchants — revenue breakdown per merchant
export const getFinanceMerchants = async () => {
  const response = await api.get("/finance/merchants");
  return response.data.data;
};