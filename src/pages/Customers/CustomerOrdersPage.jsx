import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconCheck = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconClock = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconTruck = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const IconPackage = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);
const IconChevronRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IconChevronDown = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconShoppingBag = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

// ── Status config ─────────────────────────────────────────────────────────────
const statusConfig = {
  placed:           { label: "Order Placed",      bg: "bg-blue-500",   light: "bg-blue-50 text-blue-600" },
  preparing:        { label: "Preparing",          bg: "bg-yellow-500", light: "bg-yellow-50 text-yellow-600" },
  out_for_delivery: { label: "Out for Delivery",   bg: "bg-orange-500", light: "bg-orange-50 text-orange-600" },
  delivered:        { label: "Delivered",          bg: "bg-green-500",  light: "bg-green-50 text-green-600" },
};

// Normalize backend status strings to our keys
const normalizeStatus = (status) => {
  if (!status) return "placed";
  const s = status.toLowerCase().replace(/\s+/g, "_");
  if (s === "out_for_delivery" || s === "outfordelivery") return "out_for_delivery";
  if (s === "delivered") return "delivered";
  if (s === "preparing" || s === "confirmed") return "preparing";
  return "placed";
};

const trackingSteps = [
  { key: "placed",           label: "Order Placed",      icon: IconPackage, desc: "Your order has been received" },
  { key: "preparing",        label: "Preparing",         icon: IconClock,   desc: "The business is preparing your order" },
  { key: "out_for_delivery", label: "Out for Delivery",  icon: IconTruck,   desc: "Your order is on its way" },
  { key: "delivered",        label: "Delivered",         icon: IconCheck,   desc: "Your order has been delivered" },
];
const stepOrder = ["placed", "preparing", "out_for_delivery", "delivered"];

const formatPrice = (price) => `₦${Number(price || 0).toLocaleString()}`;

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" }) +
    " · " + d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
const OrderSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-100 rounded-lg w-1/3" />
        <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
      </div>
      <div className="h-4 bg-gray-100 rounded-lg w-16" />
    </div>
  </div>
);

// ── Order Card ────────────────────────────────────────────────────────────────
const OrderCard = ({ order, isExpanded, onToggle }) => {
  const statusKey = normalizeStatus(order.status);
  const status = statusConfig[statusKey] || statusConfig.placed;
  const currentStepIndex = stepOrder.indexOf(statusKey);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className={`w-10 h-10 rounded-xl ${status.bg} flex items-center justify-center text-white flex-shrink-0`}>
            {statusKey === "delivered" ? <IconCheck size={18} /> :
             statusKey === "out_for_delivery" ? <IconTruck size={18} /> :
             statusKey === "preparing" ? <IconClock size={18} /> :
             <IconPackage size={18} />}
          </div>
          <div className="text-left min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-900 font-extrabold text-sm">
                #{(order._id || order.id || "").toString().slice(-8).toUpperCase()}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.light}`}>
                {status.label}
              </span>
            </div>
            <p className="text-gray-400 text-xs mt-0.5">{formatDate(order.createdAt)}</p>
            <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">
              {(order.items || []).map(i => i.name).join(", ")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-2">
          <span className="text-orange-500 font-extrabold text-sm">{formatPrice(order.totalAmount)}</span>
          <div className={`text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
            <IconChevronDown size={16} />
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100">

          {/* Tracking stepper */}
          <div className="px-4 sm:px-5 py-5">
            <h3 className="text-gray-900 font-extrabold text-sm mb-4">Order Tracking</h3>
            <div className="relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100" />
              <div className="space-y-4">
                {trackingSteps.map((step, index) => {
                  const isDone = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const StepIcon = step.icon;
                  return (
                    <div key={step.key} className="flex items-start gap-4 relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all duration-300 ${
                        isDone
                          ? isCurrent
                            ? `${statusConfig[statusKey]?.bg || "bg-orange-500"} text-white ring-4 ring-orange-100`
                            : "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-300"
                      }`}>
                        {isDone && !isCurrent ? <IconCheck size={14} /> : <StepIcon size={14} />}
                      </div>
                      <div className="pt-0.5">
                        <p className={`text-sm font-bold ${isDone ? "text-gray-900" : "text-gray-300"}`}>{step.label}</p>
                        <p className={`text-xs mt-0.5 ${isDone ? "text-gray-400" : "text-gray-200"}`}>{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="px-4 sm:px-5 pb-4 border-t border-gray-50">
            <h3 className="text-gray-900 font-extrabold text-sm my-3">Items</h3>
            <div className="space-y-2">
              {(order.items || []).map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {item.image
                      ? <img src={`https://biteswift-qw3s.onrender.com${item.image}`} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                      : <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-base">📦</div>
                    }
                    <span className="text-gray-700">{item.name}</span>
                    <span className="text-gray-400 text-xs">x{item.quantity || item.qty}</span>
                  </div>
                  <span className="text-gray-900 font-semibold">{formatPrice(item.price * (item.quantity || item.qty))}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="px-4 sm:px-5 pb-4 border-t border-gray-50">
            <div className="space-y-2 mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Product price</span>
                <span>{formatPrice(order.productAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Rider fee</span>
                <span>{formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Service fee</span>
                <span>{formatPrice(order.commission)}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-extrabold text-gray-900 pt-1 border-t border-gray-100">
                <span>Total</span>
                <span className="text-orange-500">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Delivery info */}
          <div className="px-4 sm:px-5 pb-5 border-t border-gray-50">
            <div className="mt-3 space-y-1">
              {order.deliveryAddress && (
                <p className="text-xs text-gray-400">
                  <span className="font-semibold text-gray-600">Delivery address: </span>
                  {order.deliveryAddress}
                </p>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

// ── Customer Orders Page ──────────────────────────────────────────────────────
export default function CustomerOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://biteswift-qw3s.onrender.com/api/orders/customer", {
          headers: { Authorization: `Bearer ${localStorage.getItem("customerToken")}` },
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        const list = data.data || [];
        setOrders(list);
        if (list.length > 0) setExpandedId(list[0]._id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = activeTab === "all"
    ? orders
    : activeTab === "active"
      ? orders.filter(o => normalizeStatus(o.status) !== "delivered")
      : orders.filter(o => normalizeStatus(o.status) === "delivered");

  return (
    <div className="bg-gray-50 min-h-screen">

      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-5">
        <h1 className="text-xl font-extrabold text-gray-900">My Orders</h1>
        <p className="text-gray-400 text-sm mt-0.5">Track and view all your orders</p>
      </div>

      <div className="bg-white border-b border-gray-100 px-4 sm:px-6">
        <div className="flex gap-6">
          {[
            { id: "all", label: "All Orders" },
            { id: "active", label: "Active" },
            { id: "delivered", label: "Delivered" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => <OrderSkeleton key={i} />)
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-gray-900 font-bold text-xl mb-2">Could not load orders</h3>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              isExpanded={expandedId === order._id}
              onToggle={() => setExpandedId(expandedId === order._id ? null : order._id)}
            />
          ))
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-300 mb-4 flex justify-center"><IconShoppingBag size={56} /></div>
            <h3 className="text-gray-900 font-bold text-xl mb-2">No orders yet</h3>
            <p className="text-gray-400 text-sm mb-6">
              {activeTab === "active" ? "You have no active orders right now." : "You haven't placed any orders yet."}
            </p>
            <button
              onClick={() => navigate("/customer/browse")}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 mx-auto"
            >
              Start Ordering <IconChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}