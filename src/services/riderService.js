import api from "./api";

// ── Rider Service ─────────────────────────────────────────────────────────────
// All API calls related to riders and deliveries
// Response structure: { data: [...] }

// GET /api/riders — fetch all riders
export const getAllRiders = async () => {
  const response = await api.get("/riders");
  return response.data.data;
};

// POST /api/riders — add a new rider
// Body: { name, phone, email, password, vehicleType }
export const addRider = async (riderData) => {
  const response = await api.post("/riders", riderData);
  return response.data.data;
};

// PATCH /api/riders/:id/deactivate — deactivate a rider
export const deactivateRider = async (riderId) => {
  const response = await api.patch(`/riders/${riderId}/deactivate`);
  return response.data.data;
};

// GET /api/deliveries/all — fetch all deliveries (admin view)
export const getAllDeliveries = async () => {
  const response = await api.get("/deliveries/all");
  return response.data.data;
};

// GET /api/deliveries/riders/available — fetch available riders
export const getAvailableRiders = async () => {
  const response = await api.get("/deliveries/riders/available");
  return response.data.data;
};