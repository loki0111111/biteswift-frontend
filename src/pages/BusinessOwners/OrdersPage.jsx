// OrdersPage.jsx — Connected to real backend
// GET /api/orders — fetch all orders
// PATCH /api/orders/:id/status — update order status

import { useState, useEffect } from "react";
import {
  Search, Filter, X, ChevronRight, Package,
  MapPin, Phone, Clock, CheckCircle, RefreshCw,
} from "lucide-react";

const BASE_URL = "https://biteswift-qw3s.onrender.com";
const getToken = () => localStorage.getItem("token");

// ── Status Config ──────────────────────────────────────────────────────────

const statusColors = {
  Confirmed: "bg-blue-100 text-blue-700",   
  Delivered: "bg-green-100 text-green-700",
  "In Transit": "bg-orange-100 text-orange-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
  "Looking for Rider": "bg-blue-100 text-blue-700",
};

function StatusBadge({ status }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[status] || "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
}

// ── Skeleton Row ───────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[...Array(7)].map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-3 bg-gray-100 rounded-lg w-full" />
        </td>
      ))}
    </tr>
  );
}

// ── Timeline ───────────────────────────────────────────────────────────────
function getTimelineSteps(status) {
  return [
    { label: "Order Placed", done: true },
    { label: "Confirmed by Restaurant", done: ["Confirmed", "Looking for Rider", "In Transit", "Delivered"].includes(status) },
    { label: "Rider Picked Up", done: ["In Transit", "Delivered"].includes(status) },
    { label: "Delivered", done: status === "Delivered" },
  ];
}

// ── Order Detail Drawer ────────────────────────────────────────────────────
function OrderDrawer({ order, onConfirm, onClose, confirming }) {
  if (!order) return null;
  const timelineSteps = getTimelineSteps(order.status);

  // Support both real API shape and any field naming
  const customerName = order.customer?.name || order.customerName || order.customer || "Customer";
  const customerPhone = order.customer?.phone || order.customerPhone || order.phone || "";
  const deliveryAddress = order.customer?.address || order.deliveryAddress || order.address || "";
  const orderItems = order.items || [];
  const totalAmount = order.totalAmount || order.total || 0;
  const orderId = order._id || order.id || "";
  const createdAt = order.createdAt ? new Date(order.createdAt) : null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900">#{orderId.slice(-8).toUpperCase()}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {createdAt
                ? `${createdAt.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })} at ${createdAt.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}`
                : ""}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex items-center gap-2">
            <StatusBadge status={order.status} />
          </div>

          {/* Customer */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</p>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-8 h-8 bg-[#F97316] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                {customerName[0]}
              </div>
              <span className="font-semibold">{customerName}</span>
            </div>
            {customerPhone && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Phone size={13} /><span>{customerPhone}</span>
              </div>
            )}
            {deliveryAddress && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin size={13} /><span>{deliveryAddress}</span>
              </div>
            )}
          </div>

          {/* Items */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Order Items</p>
            <div className="space-y-2">
              {orderItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2 py-2 border-b border-gray-100">
                  <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                    <Package size={13} className="text-orange-400" />
                  </div>
                  <span className="text-sm text-gray-700">
                    {typeof item === "string" ? item : `${item.name} x${item.quantity}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-[#111111] rounded-2xl p-4 flex items-center justify-between">
            <span className="text-sm text-white/60">Total Amount</span>
            <span className="text-lg font-bold text-white">
              ₦{Number(totalAmount).toLocaleString()}
            </span>
          </div>

          {/* Timeline */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Order Timeline</p>
            <div className="space-y-3">
              {timelineSteps.map((step) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${step.done ? "bg-green-500" : "bg-gray-200"}`} />
                  <span className={`text-xs ${step.done ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 space-y-2">
          {order.status === "Pending" && (
            <button
              onClick={() => onConfirm(order._id || order.id)}
              disabled={confirming}
              className="w-full bg-[#F97316] text-white text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors disabled:opacity-60"
            >
              <CheckCircle size={16} />
              {confirming ? "Confirming..." : "Confirm Order"}
            </button>
          )}

          {order.status === "Looking for Rider" && (
            <div className="w-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
              <Clock size={16} className="animate-spin" />
              Looking for a Rider...
            </div>
          )}

          <button onClick={onClose} className="w-full bg-gray-100 text-gray-600 text-sm font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors">
            Close
          </button>
        </div>
      </div>
    </>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statuses = ["All", "Pending", "Confirmed", "Looking for Rider", "In Transit", "Delivered", "Cancelled"];

  // ── Fetch orders ─────────────────────────────────────────────────────────
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      const raw = Array.isArray(data) ? data : data.orders || data.data || [];
const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;
setOrders(raw.map(o => ({ ...o, status: capitalize(o.status) })));
    } catch (err) {
      setError("Could not load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // ── Confirm order → status: "confirmed" (backend maps this to "Looking for Rider") ──
  const handleConfirm = async (orderId) => {
    setConfirming(true);
    try {
      const res = await fetch(`${BASE_URL}/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status: "confirmed" }),
      });
      if (!res.ok) throw new Error("Failed to confirm order");

      // Update UI immediately without waiting for a refetch
      setOrders((prev) =>
        prev.map((o) =>
          (o._id === orderId || o.id === orderId)
            ? { ...o, status: "Looking for Rider" }
            : o
        )
      );
      setSelectedOrder((prev) =>
        prev && (prev._id === orderId || prev.id === orderId)
          ? { ...prev, status: "Looking for Rider" }
          : prev
      );
    } catch (err) {
      alert("Could not confirm order. Please try again.");
    } finally {
      setConfirming(false);
    }
  };

  // ── Filter logic ─────────────────────────────────────────────────────────
  const filtered = orders.filter((o) => {
    const customerName = o.customer?.name || o.customerName || o.customer || "";
    const orderId = o._id || o.id || "";
    const matchSearch =
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      orderId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and track all customer orders</p>
        </div>
        <button onClick={fetchOrders} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all" title="Refresh orders">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-3 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchOrders} className="font-semibold underline ml-4">Retry</button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" placeholder="Search by customer or order ID..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-gray-400 shrink-0" />
          {statuses.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${statusFilter === s ? "bg-[#F97316] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Showing <span className="font-semibold text-gray-700">{filtered.length}</span> orders
      </p>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Order ID", "Customer", "Items", "Total", "Status", "Date", ""].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
              </tbody>
            </table>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package size={40} className="text-gray-200 mb-3" />
            <p className="text-sm font-semibold text-gray-400">No orders found</p>
            <p className="text-xs text-gray-300 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Order ID", "Customer", "Items", "Total", "Status", "Date", ""].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((order) => {
                  const orderId = order._id || order.id || "";
                  const customerName = order.customer?.name || order.customerName || order.customer || "Customer";
                  const customerPhone = order.customer?.phone || order.customerPhone || order.phone || "";
                  const orderItems = order.items || [];
                  const itemsText = orderItems.map(i => typeof i === "string" ? i : `${i.name} x${i.quantity}`).join(", ").substring(0, 35);
                  const total = Number(order.totalAmount || order.total || 0).toLocaleString();
                  const createdAt = order.createdAt ? new Date(order.createdAt) : null;

                  return (
                    <tr key={orderId} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                      <td className="px-5 py-3.5 text-xs font-bold text-[#F97316]">#{orderId.slice(-8).toUpperCase()}</td>
                      <td className="px-5 py-3.5">
                        <p className="text-xs font-semibold text-gray-800">{customerName}</p>
                        {customerPhone && <p className="text-xs text-gray-400">{customerPhone}</p>}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-500">{itemsText}...</td>
                      <td className="px-5 py-3.5 text-xs font-bold text-gray-800">₦{total}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                      <td className="px-5 py-3.5">
                        {createdAt ? (
                          <>
                            <p className="text-xs text-gray-600">{createdAt.toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</p>
                            <p className="text-xs text-gray-400">{createdAt.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}</p>
                          </>
                        ) : null}
                      </td>
                      <td className="px-5 py-3.5"><ChevronRight size={14} className="text-gray-300" /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <OrderDrawer
        order={selectedOrder}
        onConfirm={handleConfirm}
        onClose={() => setSelectedOrder(null)}
        confirming={confirming}
      />
    </div>
  );
}