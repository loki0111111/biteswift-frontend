// DashboardPages.jsx
// DeliveriesPage — connected to real backend
// WalletPage — connected to real backend
// AnalyticsPage — connected to real backend
// SettingsPage — connected to GET/PATCH /api/auth/profile

// ============================================================
// SINGLE UNIFIED IMPORT — fixes all useWalletState / useWalletEffect errors
// ============================================================

import { useState, useEffect } from "react";
import { Truck, ChevronRight, User, RefreshCw, X, Wallet, ArrowDownLeft, ArrowUpRight as ArrowUpRightW, Building2, RefreshCw as RefreshWallet, Bell as BellS, Shield, Store as StoreS, Save } from "lucide-react";
import {
  BarChart, Bar,
  XAxis as AnalXAxis, YAxis as AnalYAxis,
  CartesianGrid as AnalGrid, Tooltip as AnalTooltip,
  ResponsiveContainer as AnalContainer,
  LineChart as AnalLine, Line as AnalLineEl,
} from "recharts";
import { RefreshCw as AnalRefresh } from "lucide-react";

const BASE_URL = "https://biteswift-qw3s.onrender.com";
const getToken = () => localStorage.getItem("token");

const BUSINESS_TYPES = [
  "Restaurant", "Grocery", "Pharmacy", "Fashion", "Electronics", "Beauty", "Other"
];

const statusColors = {
  Delivered: "bg-green-100 text-green-700",
  "In Transit": "bg-orange-100 text-orange-700",
  "Picked Up": "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

const statusFlow = ["Pending", "Picked Up", "In Transit", "Delivered"];

// ── Skeleton Card ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-gray-100 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-100 rounded w-1/3" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
          <div className="h-3 bg-gray-100 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

// ── Assign Rider Modal ─────────────────────────────────────────────────────
function AssignRiderModal({ delivery, availableRiders, onAssign, onClose, assigning }) {
  const [selectedRider, setSelectedRider] = useState("");

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">Assign a Rider</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
              <X size={18} />
            </button>
          </div>

          {availableRiders.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No riders available right now.</p>
          ) : (
            <div className="space-y-2 mb-5">
              {availableRiders.map((rider) => {
                const riderId = rider._id || rider.id;
                const riderName = rider.name || rider.fullName || "Rider";
                return (
                  <button
                    key={riderId}
                    onClick={() => setSelectedRider(riderId)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      selectedRider === riderId
                        ? "border-[#F97316] bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="w-8 h-8 bg-[#111111] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {riderName[0]}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-800">{riderName}</p>
                      {rider.phone && <p className="text-xs text-gray-400">{rider.phone}</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={() => selectedRider && onAssign(delivery._id || delivery.id, selectedRider)}
            disabled={!selectedRider || assigning}
            className="w-full bg-[#F97316] text-white text-sm font-semibold py-3 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {assigning ? "Assigning..." : "Assign Rider"}
          </button>
        </div>
      </div>
    </>
  );
}

// ============================================================
// DeliveriesPage — CONNECTED TO BACKEND
// ============================================================
export function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [availableRiders, setAvailableRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState(null);
  const [assigningDelivery, setAssigningDelivery] = useState(null);

  const fetchDeliveries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/deliveries`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch deliveries");
      const data = await res.json();
      setDeliveries(Array.isArray(data) ? data : data.deliveries || data.data || []);
    } catch (err) {
      setError("Could not load deliveries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRiders = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/deliveries/riders/available`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setAvailableRiders(Array.isArray(data) ? data : data.riders || data.data || []);
    } catch (err) {
      console.error("Could not load available riders");
    }
  };

  useEffect(() => {
    fetchDeliveries();
    fetchAvailableRiders();
  }, []);

  const handleAssign = async (deliveryId, riderId) => {
    setAssigning(true);
    try {
      const res = await fetch(`${BASE_URL}/api/deliveries/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ orderId: deliveryId, riderId }),
      });
      if (!res.ok) throw new Error("Failed to assign rider");
      await fetchDeliveries();
      await fetchAvailableRiders();
      setAssigningDelivery(null);
    } catch (err) {
      alert("Could not assign rider. Please try again.");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Deliveries</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track all active and completed deliveries</p>
        </div>
        <button
          onClick={fetchDeliveries}
          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
          title="Refresh"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-3 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchDeliveries} className="font-semibold underline ml-4">Retry</button>
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
        ) : deliveries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
            <Truck size={40} className="text-gray-200 mb-3" />
            <p className="text-sm font-semibold text-gray-400">No deliveries yet</p>
            <p className="text-xs text-gray-300 mt-1">Deliveries will appear once orders are confirmed</p>
          </div>
        ) : (
          deliveries.map((d) => {
            const deliveryId = d._id || d.id;
            const riderName = d.rider?.name || d.rider?.fullName || d.riderName || "Not Assigned";
            const riderPhone = d.rider?.phone || d.riderPhone || "";
            const orderId = d.order?._id || d.orderId || d.order || "";
            const address = d.deliveryAddress || d.address || "";
            const currentStatus = d.status || "Pending";

            return (
              <div key={deliveryId} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                      <Truck size={18} className="text-orange-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-gray-800">
                          #{deliveryId.toString().slice(-6).toUpperCase()}
                        </span>
                        <ChevronRight size={12} className="text-gray-300" />
                        <span className="text-xs text-[#F97316] font-semibold">
                          {orderId ? `#${orderId.toString().slice(-6).toUpperCase()}` : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                        <User size={12} />
                        <span>{riderName}</span>
                        {riderPhone && <><span className="text-gray-300">|</span><span>{riderPhone}</span></>}
                      </div>
                      {address && <p className="text-xs text-gray-400">{address}</p>}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[currentStatus] || "bg-gray-100 text-gray-500"}`}>
                      {currentStatus}
                    </span>
                    {d.eta && <p className="text-xs text-gray-400 mt-1.5">ETA: {d.eta}</p>}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1">
                  {statusFlow.map((step, i) => {
                    const current = statusFlow.indexOf(currentStatus);
                    const done = i <= current;
                    return (
                      <div key={step} className="flex items-center flex-1">
                        <div className={`flex-1 h-1 rounded-full ${done ? "bg-[#F97316]" : "bg-gray-100"}`} />
                        {i === statusFlow.length - 1 && (
                          <div className={`w-2.5 h-2.5 rounded-full ml-1 ${done ? "bg-[#F97316]" : "bg-gray-200"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1">
                  {statusFlow.map((step) => (
                    <span key={step} className="text-[10px] text-gray-400">{step}</span>
                  ))}
                </div>

                {currentStatus === "Pending" && riderName === "Not Assigned" && (
                  <button
                    onClick={() => { setAssigningDelivery(d); fetchAvailableRiders(); }}
                    className="mt-3 text-xs font-semibold text-[#F97316] hover:underline"
                  >
                    Assign a Rider →
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {assigningDelivery && (
        <AssignRiderModal
          delivery={assigningDelivery}
          availableRiders={availableRiders}
          onAssign={handleAssign}
          onClose={() => setAssigningDelivery(null)}
          assigning={assigning}
        />
      )}
    </div>
  );
}


// ============================================================
// WalletPage — CONNECTED TO BACKEND
// ============================================================
export function WalletPage() {
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/wallet`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch wallet");
      const json = await res.json();
      setWalletData(json.data ?? json);
    } catch (err) {
      setError("Could not load wallet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) return;
      const json = await res.json();
      setProfile(json.data ?? json);
    } catch (err) {
      console.error("Could not load profile");
    }
  };

  const fetchTransactions = async () => {
    setTxLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/wallet/transactions`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : data.transactions || data.data || []);
    } catch (err) {
      console.error("Could not load transactions");
    } finally {
      setTxLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
    fetchProfile();
    fetchTransactions();
  }, []);

  const totalEarned = walletData?.totalEarned ?? walletData?.totalCredit ?? 0;
  const totalOrders = walletData?.totalOrders ?? transactions.length ?? 0;

  const bankName = profile?.bankName || null;
  const accountNumber = profile?.bankAccountNumber || null;
  const accountName = profile?.accountName || null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Wallet</h1>
          <p className="text-sm text-gray-500 mt-0.5">Your earnings and transaction history</p>
        </div>
        <button onClick={() => { fetchWallet(); fetchProfile(); fetchTransactions(); }}
          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all" title="Refresh">
          <RefreshWallet size={16} />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-3 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchWallet} className="font-semibold underline ml-4">Retry</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-[#111111] rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-6">
            <Wallet size={18} className="text-orange-400" />
            <span className="text-sm text-white/60">Total Revenue</span>
          </div>
          {loading ? (
            <div className="h-10 bg-white/10 rounded-xl w-48 animate-pulse mb-6" />
          ) : (
            <p className="text-4xl font-bold mb-1">₦{Number(totalEarned).toLocaleString()}</p>
          )}
          <p className="text-xs text-white/40 mb-6">Paid directly to your linked bank account</p>
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <p className="text-xs text-white/70">Payments are automatically sent to your bank via Paystack</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400 mb-1">Total Earned</p>
            {loading
              ? <div className="h-7 bg-gray-100 rounded-lg w-32 animate-pulse" />
              : <p className="text-xl font-bold text-gray-900">₦{Number(totalEarned).toLocaleString()}</p>
            }
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400 mb-1">Total Orders</p>
            {loading
              ? <div className="h-7 bg-gray-100 rounded-lg w-32 animate-pulse" />
              : <p className="text-xl font-bold text-gray-900">{Number(totalOrders).toLocaleString()}</p>
            }
          </div>
        </div>
      </div>

      {/* Linked Bank Account */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <Building2 size={18} className="text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Linked Bank Account</p>
              {bankName ? (
                <>
                  <p className="text-sm font-bold text-gray-800">
                    {bankName} •••• {accountNumber?.slice(-4)}
                  </p>
                  <p className="text-xs text-gray-500">{accountName}</p>
                </>
              ) : (
                <p className="text-sm font-semibold text-red-400">No bank account linked yet</p>
              )}
            </div>
          </div>
          <button
            onClick={() => window.location.href = "/dashboard/settings"}
            className="text-xs font-semibold text-[#F97316] hover:underline"
          >
            {bankName ? "Change" : "Add Bank"}
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-800">Transaction History</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {txLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-4 animate-pulse">
                <div className="w-9 h-9 bg-gray-100 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
                <div className="h-4 bg-gray-100 rounded w-20" />
              </div>
            ))
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-sm text-gray-400">No transactions yet</p>
            </div>
          ) : (
            transactions.map((t, i) => {
              const isCredit = t.type === "credit";
              const amount = t.amount || t.value || 0;
              const label = t.label || t.description || t.narration || "Transaction";
              const date = t.date || t.createdAt
                ? new Date(t.date || t.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
                : "";
              const time = t.time || (t.createdAt
                ? new Date(t.createdAt).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })
                : "");

              return (
                <div key={t._id || t.id || i} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isCredit ? "bg-green-50" : "bg-red-50"}`}>
                      {isCredit
                        ? <ArrowDownLeft size={15} className="text-green-500" />
                        : <ArrowUpRightW size={15} className="text-red-500" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{label}</p>
                      <p className="text-xs text-gray-400">{date}{time ? ` at ${time}` : ""}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${isCredit ? "text-green-600" : "text-red-500"}`}>
                    {isCredit ? "+" : "-"}₦{Number(amount).toLocaleString()}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}


// ============================================================
// AnalyticsPage — CONNECTED TO BACKEND
// ============================================================
export function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/analytics/business`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      setError("Could not load analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, []);

  const totalRevenue = analytics?.totalRevenue ?? analytics?.revenue ?? 0;
  const totalOrders = analytics?.totalOrders ?? analytics?.orders ?? 0;
  const avgOrderValue = analytics?.avgOrderValue ?? analytics?.averageOrderValue ?? 0;
  const deliveryRate = analytics?.deliveryRate ?? analytics?.onTimeDeliveryRate ?? 0;
  const weeklyRevenue = analytics?.weeklyRevenue ?? analytics?.revenueByWeek ?? [];
  const dailyOrders = analytics?.dailyOrders ?? analytics?.ordersByDay ?? [];

  const SkeletonStat = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
      <div className="h-3 bg-gray-100 rounded w-2/3 mb-2" />
      <div className="h-7 bg-gray-100 rounded w-1/2 mb-1" />
      <div className="h-3 bg-gray-100 rounded w-1/3" />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Business performance and trends</p>
        </div>
        <button onClick={fetchAnalytics}
          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all" title="Refresh">
          <AnalRefresh size={16} />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-3 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchAnalytics} className="font-semibold underline ml-4">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonStat key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Revenue", value: `₦${Number(totalRevenue).toLocaleString()}` },
            { label: "Total Orders", value: Number(totalOrders).toLocaleString() },
            { label: "Avg Order Value", value: `₦${Number(avgOrderValue).toLocaleString()}` },
            { label: "Delivery Rate", value: `${Number(deliveryRate).toFixed(1)}%` },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-xs text-gray-400 mb-1">{s.label}</p>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-bold text-gray-800 mb-4">Weekly Revenue (₦)</h2>
        {loading ? (
          <div className="h-52 bg-gray-50 rounded-xl animate-pulse" />
        ) : weeklyRevenue.length === 0 ? (
          <div className="h-52 flex items-center justify-center text-sm text-gray-400">No revenue data yet</div>
        ) : (
          <AnalContainer width="100%" height={220}>
            <BarChart data={weeklyRevenue}>
              <AnalGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <AnalXAxis dataKey="week" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <AnalYAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
              <AnalTooltip formatter={(v) => [`₦${v.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: "12px", border: "1px solid #f0f0f0", fontSize: "12px" }} />
              <Bar dataKey="revenue" fill="#F97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </AnalContainer>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-bold text-gray-800 mb-4">Daily Orders This Week</h2>
        {loading ? (
          <div className="h-48 bg-gray-50 rounded-xl animate-pulse" />
        ) : dailyOrders.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-sm text-gray-400">No order data yet</div>
        ) : (
          <AnalContainer width="100%" height={200}>
            <AnalLine data={dailyOrders}>
              <AnalGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <AnalXAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <AnalYAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <AnalTooltip contentStyle={{ borderRadius: "12px", border: "1px solid #f0f0f0", fontSize: "12px" }} />
              <AnalLineEl type="monotone" dataKey="orders" stroke="#111111" strokeWidth={2.5} dot={{ fill: "#111111", r: 4, strokeWidth: 0 }} />
            </AnalLine>
          </AnalContainer>
        )}
      </div>
    </div>
  );
}


// ============================================================
// SettingsPage — CONNECTED TO BACKEND
// ============================================================
export function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    businessType: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [notifications, setNotifications] = useState({
    newOrder: true,
    orderDelivered: true,
    lowStock: false,
    weeklyReport: true,
  });


  const [savingNotifications, setSavingNotifications] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);
  
  const saveNotifications = async () => {
    setSavingNotifications(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/notification-preferences`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(notifications),
      });
      if (!res.ok) throw new Error("Failed");
      setNotifSaved(true);
      setTimeout(() => setNotifSaved(false), 2000);
    } catch {
      alert("Failed to save preferences. Please try again.");
    } finally {
      setSavingNotifications(false);
    }
  };

  const [banks, setBanks] = useState([]);
  const [bankDetails, setBankDetails] = useState({
    bankAccountNumber: "",
    bankCode: "",
    bankName: "",
    accountName: "",
  });
  const [resolving, setResolving] = useState(false);
  const [savingBank, setSavingBank] = useState(false);
  const [bankSaved, setBankSaved] = useState(false);
  const [bankError, setBankError] = useState(null);
  const [hasBankDetails, setHasBankDetails] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [activeTab, setActiveTab] = useState("Business Profile");

  const tabs = ["Business Profile", "Bank Details", "Notifications", "Security"];

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error("Failed to load profile");
        const json = await res.json();
        const data = json.data ?? json;
        setProfile({
          name: data.restaurantName || data.name || "",
          email: data.email || "",
          phone: data.phoneNumber || data.phone || "",
          address: data.restaurantLocation || data.address || "",
          businessType: data.businessType || "",
          image: data.image || "",
        });

        if (data.notificationPreferences) {
          setNotifications(data.notificationPreferences);
        }

        if (data.bankAccountNumber) {
          setBankDetails({
            bankAccountNumber: data.bankAccountNumber,
            bankCode: data.bankCode || "",
            bankName: data.bankName || "",
            accountName: data.accountName || "",
          });
          setHasBankDetails(true);
        }
      } catch (err) {
        setError("Could not load profile. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    const fetchBanks = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/wallet/banks`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const json = await res.json();
        setBanks(json.data || []);
      } catch (err) {
        console.error("Could not load banks list");
      }
    };

    fetchProfile();
    fetchBanks();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      let res;
      if (imageFile) {
        const formData = new FormData();
        formData.append("restaurantName", profile.name);
        formData.append("phoneNumber", profile.phone);
        formData.append("restaurantLocation", profile.address);
        formData.append("businessType", profile.businessType);
        formData.append("image", imageFile);
        res = await fetch(`${BASE_URL}/api/auth/profile`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${getToken()}` },
          body: formData,
        });
      } else {
        res = await fetch(`${BASE_URL}/api/auth/profile`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            restaurantName: profile.name,
            phoneNumber: profile.phone,
            restaurantLocation: profile.address,
            businessType: profile.businessType,
          }),
        });
      }
      if (!res.ok) throw new Error("Failed to save profile");
      const json = await res.json();
      const data = json.data ?? json;
      if (data.image) {
        setProfile((prev) => ({ ...prev, image: data.image }));
        setImageFile(null);
        setImagePreview(null);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setSaveError("Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const resolveAccount = async (accountNumber, bankCode) => {
    if (accountNumber.length !== 10 || !bankCode) return;
    setResolving(true);
    setBankError(null);
    try {
      const res = await fetch(
        `${BASE_URL}/api/wallet/resolve-account?account_number=${accountNumber}&bank_code=${bankCode}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setBankDetails((prev) => ({ ...prev, accountName: json.data.account_name }));
    } catch (err) {
      setBankError("Could not verify account. Check the details and try again.");
      setBankDetails((prev) => ({ ...prev, accountName: "" }));
    } finally {
      setResolving(false);
    }
  };

  const handleAccountNumberChange = (accountNumber) => {
    setBankDetails((prev) => ({ ...prev, bankAccountNumber: accountNumber, accountName: "" }));
    if (accountNumber.length === 10 && bankDetails.bankCode) {
      resolveAccount(accountNumber, bankDetails.bankCode);
    }
  };

  const handleBankChange = (bankCode) => {
    const selectedBank = banks.find((b) => b.code === bankCode);
    setBankDetails((prev) => ({
      ...prev,
      bankCode,
      bankName: selectedBank?.name || "",
      accountName: "",
    }));
    if (bankDetails.bankAccountNumber.length === 10) {
      resolveAccount(bankDetails.bankAccountNumber, bankCode);
    }
  };

  const handleSaveBankDetails = async () => {
    if (!bankDetails.bankCode || !bankDetails.bankAccountNumber || !bankDetails.accountName) {
      setBankError("Please complete all bank details and verify your account first.");
      return;
    }
    setSavingBank(true);
    setBankError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/wallet/save-bank-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(bankDetails),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setBankSaved(true);
      setHasBankDetails(true);
      setTimeout(() => setBankSaved(false), 3000);
    } catch (err) {
      setBankError(err.message || "Failed to save bank details. Please try again.");
    } finally {
      setSavingBank(false);
    }
  };

  const SkeletonField = () => (
    <div className="animate-pulse">
      <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
      <div className="h-10 bg-gray-100 rounded-xl w-full" />
    </div>
  );

  const currentImage = imagePreview || (profile.image
    ? (profile.image.startsWith("http") ? profile.image : `${BASE_URL}${profile.image}`)
    : null);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account settings</p>
      </div>

      <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1 w-fit flex-wrap">
        {tabs.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`text-xs px-4 py-2 rounded-xl font-medium transition-all ${activeTab === t ? "bg-[#F97316] text-white" : "text-gray-500 hover:text-gray-800"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Business Profile Tab ─────────────────────────────────── */}
      {activeTab === "Business Profile" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <StoreS size={16} className="text-orange-400" />
            <h2 className="text-sm font-bold text-gray-800">Business Profile</h2>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex items-center gap-5 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 bg-white flex items-center justify-center overflow-hidden shrink-0">
              {currentImage ? (
                <img src={currentImage} alt="Business" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <StoreS size={28} className="text-gray-300" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800 mb-0.5">Business Logo / Image</p>
              <p className="text-xs text-gray-400 mb-3">This will appear on your business listing. JPG or PNG, max 5MB.</p>
              <label className="cursor-pointer inline-flex items-center gap-2 bg-[#F97316] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors">
                {imageFile ? "Change Image" : currentImage ? "Update Image" : "Upload Image"}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
              {imageFile && (
                <p className="text-xs text-green-600 mt-2 font-medium">✓ {imageFile.name} selected — click Save to upload</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              [...Array(5)].map((_, i) => <SkeletonField key={i} />)
            ) : (
              <>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Business Name</label>
                  <input type="text" value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Email Address</label>
                  <input type="email" value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Phone Number</label>
                  <input type="tel" value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Business Address</label>
                  <input type="text" value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Business Type</label>
                  <select value={profile.businessType}
                    onChange={(e) => setProfile({ ...profile, businessType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 appearance-none bg-white"
                  >
                    <option value="" disabled>Select business type</option>
                    {BUSINESS_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          {saveError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl">
              {saveError}
            </div>
          )}

          <button onClick={handleSave} disabled={saving || loading}
            className="flex items-center gap-2 bg-[#F97316] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-60"
          >
            <Save size={14} />
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      )}

      {/* ── Bank Details Tab ─────────────────────────────────────── */}
      {activeTab === "Bank Details" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Building2 size={16} className="text-orange-400" />
            <h2 className="text-sm font-bold text-gray-800">Bank Details</h2>
          </div>

          {hasBankDetails && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-3 rounded-xl">
              ✓ Bank details saved. Payments will be tracked to your account automatically.
            </div>
          )}

          <p className="text-xs text-gray-400">
            Add your bank account details so your earnings can be tracked and paid out to you.
          </p>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Select Bank</label>
            <select
              value={bankDetails.bankCode}
              onChange={(e) => handleBankChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 bg-white appearance-none"
            >
              <option value="">-- Select your bank --</option>
              {banks.map((bank) => (
                <option key={bank.code} value={bank.code}>{bank.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Account Number</label>
            <input
              type="text"
              maxLength={10}
              placeholder="Enter 10-digit account number"
              value={bankDetails.bankAccountNumber}
              onChange={(e) => handleAccountNumberChange(e.target.value.replace(/\D/g, ""))}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Account Name</label>
            <div className="relative">
              <input
                type="text"
                readOnly
                placeholder={resolving ? "Verifying account..." : "Will appear automatically after entering account number"}
                value={bankDetails.accountName}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-700 focus:outline-none"
              />
              {resolving && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-orange-400/30 border-t-orange-400 rounded-full animate-spin" />
              )}
            </div>
            {bankDetails.accountName && !resolving && (
              <p className="text-xs text-green-600 mt-1 font-medium">✓ Account verified — {bankDetails.accountName}</p>
            )}
          </div>

          {bankError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl">
              {bankError}
            </div>
          )}

          <button
            onClick={handleSaveBankDetails}
            disabled={savingBank || resolving || !bankDetails.accountName}
            className="flex items-center gap-2 bg-[#F97316] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-60"
          >
            <Save size={14} />
            {savingBank ? "Saving..." : bankSaved ? "Saved!" : hasBankDetails ? "Update Bank Details" : "Save Bank Details"}
          </button>
        </div>
      )}

      {/* ── Notifications Tab ────────────────────────────────────── */}
      {activeTab === "Notifications" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <BellS size={16} className="text-orange-400" />
            <h2 className="text-sm font-bold text-gray-800">Notification Preferences</h2>
          </div>
          <div className="space-y-4">
            {[
              { key: "newOrder", label: "New Order Received", desc: "Get notified when a customer places an order" },
              { key: "orderDelivered", label: "Order Delivered", desc: "Get notified when an order is delivered" },
              { key: "lowStock", label: "Low Stock Alert", desc: "Get notified when menu items are running low" },
              { key: "weeklyReport", label: "Weekly Report", desc: "Receive a weekly summary of your performance" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [key]: !notifications[key] })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${notifications[key] ? "bg-[#F97316]" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notifications[key] ? "left-6" : "left-1"}`} />
                </button>
              </div>
            ))}
          </div>
              {/* 👇 Add this button */}
              <button
                onClick={saveNotifications}
                disabled={savingNotifications}
                className="mt-5 flex items-center gap-2 bg-[#F97316] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-60"
              >
                <Save size={14} />
                {savingNotifications ? "Saving..." : notifSaved ? "Saved!" : "Save Preferences"}
              </button>
        </div>
      )}


      

      {/* ── Security Tab ─────────────────────────────────────────── */}
      {activeTab === "Security" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Shield size={16} className="text-orange-400" />
            <h2 className="text-sm font-bold text-gray-800">Security Settings</h2>
          </div>
          <div className="space-y-4">
            {["Current Password", "New Password", "Confirm New Password"].map((label) => (
              <div key={label}>
                <label className="text-xs font-semibold text-gray-600 block mb-1">{label}</label>
                <input type="password" placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                />
              </div>
            ))}
            <button className="flex items-center gap-2 bg-[#F97316] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-orange-600 transition-colors">
              Update Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}