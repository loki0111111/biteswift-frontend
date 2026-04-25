// AdminHome.jsx — Control Tower
// The real-time command center for BiteSwift admins

import { useState, useEffect } from "react";
import {
  ShoppingBag, Bike, Store, TrendingUp,
  CheckCircle, AlertTriangle, Activity,
  Loader, AlertCircle,
} from "lucide-react";
import {
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area,
} from "recharts";
import { getAdminAnalytics } from "../../services/analyticsService";
import { getAllRiders } from "../../services/riderService";
import { getAlerts, getOrderIntervals } from "../../services/alertsService";

// ── Helpers ───────────────────────────────────────────────────────────────
const alertColors = {
  warning: "border-yellow-500/30 bg-yellow-500/5 text-yellow-400",
  error: "border-red-500/30 bg-red-500/5 text-red-400",
  critical: "border-red-500/30 bg-red-500/5 text-red-400",
  info: "border-blue-500/30 bg-blue-500/5 text-blue-400",
};

const alertIcons = {
  warning: <AlertTriangle size={14} />,
  error: <AlertTriangle size={14} />,
  critical: <AlertTriangle size={14} />,
  info: <Activity size={14} />,
};

function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Loader size={28} className="animate-spin text-[#F97316]" />
      <p className="text-white/30 text-sm">Loading...</p>
    </div>
  );
}

function PageError({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
        <AlertCircle size={20} className="text-red-400" />
      </div>
      <p className="text-white/60 text-sm text-center max-w-xs">{message}</p>
      <button
        onClick={onRetry}
        className="text-xs bg-[#F97316] text-white px-4 py-2 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1A1A] border border-white/10 rounded-xl px-3 py-2">
        <p className="text-xs text-white/40">{label}</p>
        <p className="text-sm font-bold text-white">{payload[0].value} orders</p>
      </div>
    );
  }
  return null;
}

function getLiveDate() {
  return new Date().toLocaleDateString("en-NG", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function AdminHome() {
  const [analytics, setAnalytics] = useState(null);
  const [riders, setRiders] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [orderIntervals, setOrderIntervals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [analyticsData, ridersData, alertsData, intervalsData] = await Promise.all([
        getAdminAnalytics(),
        getAllRiders(),
        getAlerts(),
        getOrderIntervals(),
      ]);
      setAnalytics(analyticsData);
      setRiders(ridersData || []);
      setAlerts(alertsData || []);
      // map count -> orders for the chart
      setOrderIntervals((intervalsData || []).map((d) => ({ time: d.time, orders: d.count })));
    } catch (err) {
      setError("Failed to load Control Tower data. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const dismissAlert = (index) => {
    setAlerts((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) return <PageLoader />;
  if (error) return <PageError message={error} onRetry={fetchData} />;

  // ── Derived values ────────────────────────────────────────────────────────
  const totalOrders = analytics?.totalOrders ?? 0;
  const totalRevenue = analytics?.totalRevenue ?? 0;
  const totalRiders = analytics?.totalRiders ?? 0;
  const totalBusinesses = analytics?.totalBusinesses ?? 0;
  const topBusinesses = analytics?.topBusinesses ?? [];

  const activeRiders = riders.filter((r) => r.isActive && !r.isAvailable);
  const idleRiders = riders.filter((r) => r.isActive && r.isAvailable);
  const displayRiders = [...activeRiders, ...idleRiders].slice(0, 5);

  const kpis = [
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString(),
      sub: "All time",
      icon: ShoppingBag,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      border: "border-orange-400/20",
    },
    {
      label: "Total Riders",
      value: totalRiders.toLocaleString(),
      sub: `${activeRiders.length} delivering now`,
      icon: Bike,
      color: "text-green-400",
      bg: "bg-green-400/10",
      border: "border-green-400/20",
    },
    {
      label: "Active Merchants",
      value: totalBusinesses.toLocaleString(),
      sub: "Registered on platform",
      icon: Store,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20",
    },
    {
      label: "Total Revenue",
      value: `₦${Number(totalRevenue).toLocaleString()}`,
      sub: "Gross platform revenue",
      icon: TrendingUp,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20",
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Control Tower</h1>
          <p className="text-sm text-white/30 mt-0.5">Live platform overview — {getLiveDate()}</p>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-green-400 font-semibold">All Systems Operational</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, sub, icon: Icon, color, bg, border }) => (
          <div key={label} className={`bg-[#111111] rounded-2xl border ${border} p-5 hover:border-white/20 transition-all`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl ${bg}`}>
                <Icon size={17} className={color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-white/30 mt-1">{label}</p>
            <p className="text-xs text-white/20 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Live chart + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Live order volume chart */}
        <div className="lg:col-span-2 bg-[#111111] rounded-2xl border border-white/5 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-white">Live Order Volume</h2>
              <p className="text-xs text-white/30 mt-0.5">Orders per 30 min interval today</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#F97316] rounded-full animate-pulse" />
              <span className="text-xs text-white/40">Live</span>
            </div>
          </div>
          {orderIntervals.length === 0 ? (
            <div className="flex items-center justify-center h-[200px]">
              <p className="text-white/20 text-sm">No orders recorded today yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={orderIntervals}>
                <defs>
                  <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#ffffff30" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#ffffff30" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="orders" stroke="#F97316" strokeWidth={2} fill="url(#orderGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Alerts panel */}
        <div className="bg-[#111111] rounded-2xl border border-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Live Alerts</h2>
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-semibold">
              {alerts.length} active
            </span>
          </div>
          <div className="space-y-2">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle size={28} className="text-green-400/40 mb-2" />
                <p className="text-xs text-white/30">No active alerts</p>
              </div>
            ) : (
              alerts.map((alert, i) => {
                const colorClass = alertColors[alert.severity] || alertColors.info;
                const icon = alertIcons[alert.severity] || alertIcons.info;
                return (
                  <div key={i} className={`border rounded-xl p-3 ${colorClass}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        {icon}
                        <div>
                          <p className="text-xs font-medium leading-tight">{alert.message}</p>
                          {alert.data?.customerName && (
                            <p className="text-xs opacity-60 mt-0.5">{alert.data.customerName}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => dismissAlert(i)}
                        className="text-white/20 hover:text-white/60 text-xs shrink-0 mt-0.5"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Top Merchants + Rider Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Top merchants */}
        <div className="bg-[#111111] rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h2 className="text-sm font-bold text-white">Top Merchants</h2>
          </div>
          <div className="divide-y divide-white/5">
            {topBusinesses.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-white/30 text-sm">No merchant data available</p>
              </div>
            ) : (
              topBusinesses.map((m, i) => (
                <div key={m._id} className="flex items-center justify-between px-5 py-3 hover:bg-white/3 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white/20 w-4">{i + 1}</span>
                    <div className="w-8 h-8 bg-[#F97316]/20 rounded-xl flex items-center justify-center">
                      <Store size={14} className="text-[#F97316]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{m.name}</p>
                      <p className="text-xs text-white/30">{m.totalOrders} orders</p>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-white">₦{Number(m.totalRevenue).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Rider status */}
        <div className="bg-[#111111] rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Fleet Status</h2>
            <a href="/admin/fleet" className="text-xs text-[#F97316] hover:underline font-semibold">View all</a>
          </div>
          <div className="divide-y divide-white/5">
            {displayRiders.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-white/30 text-sm">No active riders right now</p>
              </div>
            ) : (
              displayRiders.map((r) => {
                const isDelivering = r.isActive && !r.isAvailable;
                return (
                  <div key={r._id} className="flex items-center justify-between px-5 py-3 hover:bg-white/3 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {r.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{r.name}</p>
                        <p className="text-xs text-white/30 capitalize">{r.vehicleType}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isDelivering ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/30"
                    }`}>
                      {isDelivering ? "Delivering" : "Idle"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}