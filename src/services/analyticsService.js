import api from "./api";

// ── Analytics Service ─────────────────────────────────────────────────────────
// All API calls related to analytics
// Response structure: { data: { ... } }

// GET /api/analytics/business — business analytics (for restaurant dashboard)
export const getBusinessAnalytics = async () => {
  const response = await api.get("/analytics/business");
  return response.data.data;
};

// GET /api/analytics/admin — admin analytics (for BiteSwift admin dashboard)
export const getAdminAnalytics = async () => {
  const response = await api.get("/analytics/admin");
  return response.data.data;
};