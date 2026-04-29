import api from "./api";

// GET /api/auth/admin/riders — fetch all riders
export const getAllRiders = async () => {
  const response = await api.get("/auth/admin/riders");
  return response.data.data;
};

// POST /api/auth/admin/riders — add a new rider (sends setup email)
// Body: { fullName, phoneNumber, email, vehicleType }
export const addRider = async (riderData) => {
  const response = await api.post("/auth/admin/riders", riderData);
  return response.data.data;
};

// PATCH /api/auth/admin/riders/:id/deactivate
export const deactivateRider = async (riderId) => {
  const response = await api.patch(`/auth/admin/riders/${riderId}/deactivate`);
  return response.data.data;
};

// PATCH /api/auth/admin/riders/:id/reactivate
export const reactivateRider = async (riderId) => {
  const response = await api.patch(`/auth/admin/riders/${riderId}/reactivate`);
  return response.data.data;
};

// GET /api/deliveries/all — fetch all deliveries (admin view)
export const getAllDeliveries = async () => {
  const response = await api.get("/deliveries/all");
  return response.data.data;
};