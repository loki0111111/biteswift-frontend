import api from "./api";

// ── Settings Service ──────────────────────────────────────────────────────────
// All API calls related to platform settings
// Response structure: { success: true, data: { ... } }

// GET /api/settings — get current platform settings
export const getSettings = async () => {
  const response = await api.get("/settings");
  return response.data.data;
};

// PATCH /api/settings — update platform settings
export const updateSettings = async (data) => {
  const response = await api.patch("/settings", data);
  return response.data.data;
};