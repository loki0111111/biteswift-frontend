// DashboardHome.jsx — Connected to real backend
// GET /api/analytics/business/dashboard

import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  ShoppingBag, Clock, CheckCircle, TrendingUp,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, RefreshCw,
} from "lucide-react";

const BASE_URL = "https://biteswift-qw3s.onrender.com";
const getToken = () => localStorage.getItem("token");

// ── Status config ──────────────────────────────────────────────────────────
const statusConfig = {
  Delivered:        "bg-green-100 text-green-700",
  delivered:        "bg-green-100 text-green-700",
  "In Transit":     "bg-orange-100 text-orange-700",
  "in-transit":     "bg-orange-100 text-orange-700",
  Pending:          "bg-yellow-100 text-yellow-700",
  pending:          "bg-yellow-100 text-yellow-700",
  Cancelled:        "bg-red-100 text-red-700",
  cancelled:        "bg-red-100 text-red-700",
  confirmed:        "bg-blue-100 text-blue-700",
  "Looking for Rider": "bg-blue-100 text-blue-700",
};

const PIE_COLORS = ["#22c55e", "#F97316", "#facc15", "#ef4444", "#3b82f6", "#a855f7"];

function StatusBadge({ status }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusConfig[status] || "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-2">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-bold text-gray-800">{payload[0].value} orders</p>
      </div>
    );
  }
  return null;
}

// ── Skeleton components ────────────────────────────────────────────────────
function SkeletonKPI() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-9 h-9 bg-gray-100 rounded-xl" />
        <div className="w-12 h-3 bg-gray-100 rounded" />
      </div>
      <div className="w-24 h-7 bg-gray-100 rounded mb-2" />
      <div className="w-20 h-3 bg-gray-100 rounded" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-5 py-3.5">
          <div className="h-3 bg-gray-100 rounded w-full" />
        </td>
      ))}
    </tr>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function DashboardHome() {
  const [period, setPeriod] = useState("This Week");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [businessName, setBusinessName] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/analytics/business/dashboard`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      const json = await res.json();
      setData(json.data ?? json);
    } catch (err) {
      setError("Could not load dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessName = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) return;
      const json = await res.json();
      const data = json.data ?? json;
      setBusinessName(data.restaurantName || data.name || "Business Owner");
    } catch (_) {}
  };

  useEffect(() => {
    fetchDashboard();
    fetchBusinessName();
  }, []);

  // ── Extract values safely ────────────────────────────────────────────────
  const totalOrders         = data?.totalOrders ?? 0;
  const pendingDeliveries   = data?.pendingDeliveries ?? 0;
  const completedDeliveries = data?.completedDeliveries ?? 0;
  const totalRevenue        = data?.totalRevenue ?? 0;

  const ordersOverTime = (data?.revenueByDay ?? []).map((d) => ({
    day: d._id ? new Date(d._id).toLocaleDateString("en-NG", { weekday: "short" }) : d.day || d.date || "",
    orders: d.orders ?? d.count ?? 0,
  }));

  const deliveryStatusData = (data?.ordersByStatus ?? []).map((s) => ({
    name: s._id ?? s.status ?? "Unknown",
    value: s.count ?? s.total ?? 0,
  }));

  const recentOrders = data?.recentOrders ?? [];

  const kpiCards = [
    { label: "Total Orders",          value: Number(totalOrders).toLocaleString(),          icon: ShoppingBag, color: "bg-orange-50 text-orange-500", border: "border-orange-200" },
    { label: "Pending Deliveries",    value: Number(pendingDeliveries).toLocaleString(),    icon: Clock,       color: "bg-yellow-50 text-yellow-500", border: "border-yellow-200" },
    { label: "Completed Deliveries",  value: Number(completedDeliveries).toLocaleString(), icon: CheckCircle, color: "bg-green-50 text-green-500",  border: "border-green-200"  },
    { label: "Revenue",               value: `₦${Number(totalRevenue).toLocaleString()}`,  icon: TrendingUp,  color: "bg-blue-50 text-blue-500",    border: "border-blue-200"   },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Good morning, {businessName || <span className="inline-block w-32 h-5 bg-gray-200 rounded animate-pulse align-middle" />} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Here is what is happening with your business today.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchDashboard} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all" title="Refresh">
            <RefreshCw size={15} />
          </button>
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
            {["Today", "This Week", "This Month"].map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${period === p ? "bg-[#F97316] text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-3 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchDashboard} className="font-semibold underline ml-4">Retry</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? [...Array(4)].map((_, i) => <SkeletonKPI key={i} />)
          : kpiCards.map(({ label, value, icon: Icon, color, border }) => (
            <div key={label} className={`bg-white rounded-2xl border ${border} p-5 hover:shadow-md transition-shadow`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl ${color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))
        }
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Line chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-gray-800">Orders Over Time</h2>
              <p className="text-xs text-gray-400 mt-0.5">Daily order volume this week</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal size={18} />
            </button>
          </div>
          {loading ? (
            <div className="h-48 bg-gray-50 rounded-xl animate-pulse" />
          ) : ordersOverTime.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm text-gray-400">No order data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={ordersOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="orders" stroke="#F97316" strokeWidth={2.5}
                  dot={{ fill: "#F97316", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: "#F97316" }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="mb-5">
            <h2 className="text-sm font-bold text-gray-800">Delivery Status</h2>
            <p className="text-xs text-gray-400 mt-0.5">Breakdown by status</p>
          </div>
          {loading ? (
            <div className="h-48 bg-gray-50 rounded-xl animate-pulse" />
          ) : deliveryStatusData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm text-gray-400">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={deliveryStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {deliveryStatusData.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={8} formatter={(value) => <span className="text-xs text-gray-600">{value}</span>} />
                <Tooltip formatter={(value) => [value, ""]} contentStyle={{ borderRadius: "12px", border: "1px solid #f0f0f0", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-bold text-gray-800">Recent Orders</h2>
            <p className="text-xs text-gray-400 mt-0.5">Latest incoming orders</p>
          </div>
          <a href="/dashboard/orders" className="text-xs font-semibold text-[#F97316] hover:underline">View all</a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {["Order ID", "Customer", "Items", "Total", "Status", "Time"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">No recent orders yet</td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const orderId = order._id || order.id || "";
                  const customerName = order.customer?.name || order.customerName || order.customer || "Customer";
                  const items = (order.items || [])
                    .map(i => typeof i === "string" ? i : `${i.name} x${i.quantity}`)
                    .join(", ")
                    .substring(0, 40);
                  const total = Number(order.totalAmount || order.total || 0).toLocaleString();
                  const timeAgo = order.createdAt
                    ? new Date(order.createdAt).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })
                    : "";

                  return (
                    <tr key={orderId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5 text-xs font-bold text-[#F97316]">#{orderId.slice(-8).toUpperCase()}</td>
                      <td className="px-5 py-3.5 text-xs font-medium text-gray-800">{customerName}</td>
                      <td className="px-5 py-3.5 text-xs text-gray-500 max-w-[160px] truncate">{items}</td>
                      <td className="px-5 py-3.5 text-xs font-semibold text-gray-800">₦{total}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                      <td className="px-5 py-3.5 text-xs text-gray-400">{timeAgo}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}