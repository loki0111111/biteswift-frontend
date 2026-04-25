import api from "./api";

// ── Wallet Service ────────────────────────────────────────────────────────────
// All API calls related to wallets and payments
// Response structure: { data: { ... } }

// ── Business Wallet ───────────────────────────────────────────────────────────

// GET /api/wallet — get business wallet balance and info
export const getBusinessWallet = async () => {
  const response = await api.get("/wallet");
  return response.data.data;
};

// GET /api/wallet/transactions — get business transaction history
export const getBusinessTransactions = async () => {
  const response = await api.get("/wallet/transactions");
  return response.data.data;
};

// POST /api/wallet/withdraw — request a withdrawal
// Body: { amount, bankAccount, bankCode }
export const requestWithdrawal = async (withdrawalData) => {
  const response = await api.post("/wallet/withdraw", withdrawalData);
  return response.data.data;
};

// ── Admin Wallet ──────────────────────────────────────────────────────────────

// GET /api/wallet/admin — get BiteSwift admin wallet
export const getAdminWallet = async () => {
  const response = await api.get("/wallet/admin");
  return response.data.data;
};

// GET /api/wallet/all — get all wallets (businesses + riders + admin)
export const getAllWallets = async () => {
  const response = await api.get("/wallet/all");
  return response.data.data;
};

// ── Payments (Paystack) ───────────────────────────────────────────────────────

// POST /api/wallet/initialize-payment — initialize Paystack payment
// Body: { email, amount, orderId }
export const initializePayment = async ({ email, amount, orderId }) => {
  const response = await api.post("/wallet/initialize-payment", {
    email,
    amount,
    orderId,
  });
  return response.data.data;
};

// POST /api/wallet/verify-payment — verify payment and split to 3 wallets
// Body: { reference, orderId }
export const verifyPayment = async ({ reference, orderId }) => {
  const response = await api.post("/wallet/verify-payment", {
    reference,
    orderId,
  });
  return response.data.data;
};