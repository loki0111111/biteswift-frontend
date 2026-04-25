import api from "./api";

// ── Merchant Service ──────────────────────────────────────────────────────────
// All API calls related to merchants
// Response structure: { success: true, data: { ... } }

// GET /api/merchants — all merchants
export const getAllMerchants = async () => {
  const response = await api.get("/merchants");
  return response.data.data;
};