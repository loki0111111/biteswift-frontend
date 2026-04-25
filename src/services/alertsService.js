import api from "./api";

// ── Alerts Service ────────────────────────────────────────────────────────────
// All API calls related to live alerts
// Response structure: { success: true, count: N, data: [ ... ] }

// GET /api/alerts — get live platform alerts
export const getAlerts = async () => {
  const response = await api.get("/alerts");
  return response.data.data;
};

// GET /api/orders/intervals — order count grouped by 30-min intervals today
export const getOrderIntervals = async () => {
  const response = await api.get("/orders/intervals");
  return response.data.data;
};