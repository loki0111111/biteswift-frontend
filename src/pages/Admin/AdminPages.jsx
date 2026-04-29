// AdminPages.jsx
// Contains: MerchantsPage, FleetPage, MarketplacePage, FinancePage, AdminAnalyticsPage, AdminSettings, AdminWalletPage

import { useState, useEffect } from "react";
import {
  Store, CheckCircle, XCircle, Search,
  Bike, Phone, TrendingUp,
  ArrowUpRight, ArrowDownRight, Eye, Settings,
  Save, Shield, Plus, Filter, X, AlertCircle,
  Loader, Wallet, ArrowDownLeft, Building2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import { getAllRiders, getAllDeliveries, addRider, deactivateRider, reactivateRider } from "../../services/riderService";
import { getAdminWallet } from "../../services/walletService";
import { getAdminAnalytics } from "../../services/analyticsService";
import { getAllMerchants } from "../../services/merchantService";
import { getFinanceOverview, getFinanceMerchants } from "../../services/financeService";
import { getSettings, updateSettings } from "../../services/settingsService";

// ── Shared helpers ────────────────────────────────────────────────────────────
function DarkBadge({ label, color }) {
  const colors = {
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    gray: "bg-white/5 text-white/30 border-white/10",
  };
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${colors[color]}`}>{label}</span>;
}

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
      <button onClick={onRetry} className="text-xs bg-[#F97316] text-white px-4 py-2 rounded-xl font-semibold hover:bg-orange-600 transition-colors">Try Again</button>
    </div>
  );
}

// ── Merchant status helpers ───────────────────────────────────────────────────
const normalizeMerchantStatus = (status) => {
  const map = { active: "Active", inactive: "Offline", pending: "Pending", busy: "Busy" };
  return map[status?.toLowerCase()] || "Offline";
};
const merchantStatusColor = { Active: "green", Busy: "orange", Offline: "gray", Pending: "yellow" };

// ============================================================
// MERCHANTS PAGE — connected to real backend
// ============================================================
export function MerchantsPage() {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const fetchMerchants = async () => {
    setLoading(true); setError("");
    try {
      const data = await getAllMerchants();
      setMerchants(data || []);
    } catch (err) {
      setError("Failed to load merchants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMerchants(); }, []);

  if (loading) return <PageLoader />;
  if (error) return <PageError message={error} onRetry={fetchMerchants} />;

  const filtered = merchants.filter((m) => {
    const matchSearch = m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase());
    const status = normalizeMerchantStatus(m.status);
    const matchFilter = filter === "All" || status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-5">
      <div><h1 className="text-xl font-bold text-white">Merchants</h1><p className="text-sm text-white/30 mt-0.5">Manage all registered restaurants and businesses</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Merchants", value: merchants.length },
          { label: "Active", value: merchants.filter(m => m.status?.toLowerCase() === "active").length },
          { label: "Pending Approval", value: merchants.filter(m => m.status?.toLowerCase() === "pending").length },
          { label: "Offline", value: merchants.filter(m => m.status?.toLowerCase() === "inactive").length },
        ].map((s) => (
          <div key={s.label} className="bg-[#111111] border border-white/5 rounded-2xl p-4">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-white/30 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input type="text" placeholder="Search merchants..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/70 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={13} className="text-white/20" />
          {["All", "Active", "Busy", "Pending", "Offline"].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${filter === s ? "bg-[#F97316] text-white" : "bg-white/5 text-white/40 hover:bg-white/10"}`}>{s}</button>
          ))}
        </div>
      </div>
      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/5">{["Merchant", "Contact", "Business Type", "Orders", "Revenue", "Status", "Joined", "Actions"].map((h) => (<th key={h} className="text-left text-xs font-semibold text-white/30 px-5 py-3">{h}</th>))}</tr></thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-white/30 text-sm">No merchants found</td></tr>
              ) : filtered.map((m) => {
                const status = normalizeMerchantStatus(m.status);
                return (
                  <tr key={m._id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#F97316]/20 rounded-xl flex items-center justify-center"><Store size={14} className="text-[#F97316]" /></div>
                        <div><p className="text-xs font-semibold text-white">{m.name}</p><p className="text-xs text-white/30">{m.location}</p></div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><p className="text-xs text-white/60">{m.email}</p><p className="text-xs text-white/30">{m.phone}</p></td>
                    <td className="px-5 py-4 text-xs text-white/50 capitalize">{m.businessType || "N/A"}</td>
                    <td className="px-5 py-4 text-xs font-semibold text-white">{m.ordersCount ?? 0}</td>
                    <td className="px-5 py-4 text-xs font-bold text-white">₦{Number(m.revenue ?? 0).toLocaleString()}</td>
                    <td className="px-5 py-4"><DarkBadge label={status} color={merchantStatusColor[status]} /></td>
                    <td className="px-5 py-4 text-xs text-white/40">{m.joinedDate ? new Date(m.joinedDate).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}</td>
                    <td className="px-5 py-4">
                      <button className="p-1.5 bg-white/5 text-white/30 rounded-lg hover:bg-white/10 transition-all"><Eye size={14} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FLEET PAGE — connected to real backend (unchanged)
// ============================================================
const getRiderStatus = (r) => {
  const map = { Available: "Available", "On Delivery": "Delivering", Offline: "Offline", Deactivated: "Deactivated" };
  return map[r.riderStatus] || "Offline";
};

const getRiderStatusColor = (r) => {
  const map = { Available: "green", "On Delivery": "blue", Offline: "gray", Deactivated: "red" };
  return map[r.riderStatus] || "gray";
};

const getDeliveryStatusColor = (s) => ({ "assigned": "yellow", "picked-up": "orange", "in-transit": "blue", "delivered": "green", "failed": "red" }[s] || "gray");

function AddRiderModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ fullName: "", phoneNumber: "", email: "", vehicleType: "Motorcycle" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Name is required";
    if (!form.phoneNumber.trim()) e.phoneNumber = "Phone is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true); setServerError("");
    try {
      await addRider(form);
      onClose();        // close first
      onSuccess();      // then refresh
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to add rider. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <h2 className="text-sm font-bold text-white">Add New Rider</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40"><X size={14} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {serverError && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle size={14} className="text-red-400" />
              <p className="text-red-400 text-xs">{serverError}</p>
            </div>
          )}
          {[
            { label: "Full Name", name: "fullName", type: "text", placeholder: "e.g. Chukwu Emeka" },
            { label: "Phone Number", name: "phoneNumber", type: "tel", placeholder: "e.g. 08012345678" },
            { label: "Email Address", name: "email", type: "email", placeholder: "e.g. emeka@gmail.com" },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="text-xs font-semibold text-white/40 block mb-1.5">{label}</label>
              <input
                type={type} name={name} value={form[name]}
                onChange={handleChange} placeholder={placeholder}
                className={`w-full px-3 py-2.5 bg-white/5 border rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500/30 ${errors[name] ? "border-red-500/50" : "border-white/10"}`}
              />
              {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold text-white/40 block mb-1.5">Vehicle Type</label>
            <select name="vehicleType" value={form.vehicleType} onChange={handleChange} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 appearance-none">
              <option value="Motorcycle">Motorcycle</option>
              <option value="Bicycle">Bicycle</option>
              <option value="Car">Car</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
            <AlertCircle size={14} className="text-blue-400 shrink-0" />
            <p className="text-blue-400 text-xs">Rider will receive an email to set up their own password.</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-white/10 rounded-xl text-white/40 font-semibold text-sm hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-[#F97316] hover:bg-orange-600 disabled:bg-orange-500/50 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
              {loading ? <><Loader size={14} className="animate-spin" /> Adding...</> : "Add Rider"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeactivateModal({ rider, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 max-w-sm w-full text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4"><AlertCircle size={20} className="text-red-400" /></div>
        <h3 className="text-sm font-bold text-white mb-2">Deactivate Rider?</h3>
        <p className="text-white/40 text-xs mb-6">Are you sure you want to deactivate <span className="text-white font-semibold">{rider.fullName}</span>? They will no longer receive deliveries.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 border border-white/10 rounded-xl text-white/40 font-semibold text-sm hover:bg-white/5">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
            {loading ? <><Loader size={14} className="animate-spin" /> Deactivating...</> : "Yes, Deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function FleetPage() {
  const [riders, setRiders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("riders");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [deactivating, setDeactivating] = useState(false);

  const fetchData = async () => {
    setLoading(true); setError("");
    try {
      const [ridersData, deliveriesData] = await Promise.all([getAllRiders(), getAllDeliveries()]);
      setRiders(ridersData || []);
      setDeliveries(deliveriesData || []);
    } catch (err) {
      setError("Failed to load fleet data. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDeactivate = async () => {
    if (!deactivateTarget) return;
    setDeactivating(true);
    try {
      const updated = await deactivateRider(deactivateTarget._id);
      setRiders((prev) => prev.map((r) => r._id === updated._id ? updated : r));
      setDeactivateTarget(null);
    } catch (err) {
      alert("Failed to deactivate rider. Please try again.");
    } finally {
      setDeactivating(false);
    }
  };

  const handleReactivate = async (riderId) => {
    try {
      const updated = await reactivateRider(riderId);
      setRiders((prev) => prev.map((r) => r._id === updated._id ? updated : r));
    } catch (err) {
      alert("Failed to reactivate rider. Please try again.");
    }
  };

  const getRiderStatus = (r) => {
    const map = { Available: "Available", "On Delivery": "Delivering", Offline: "Offline", Deactivated: "Deactivated" };
    return map[r.riderStatus] || "Offline";
  };

  const getRiderStatusColor = (r) => {
    const map = { Available: "green", "On Delivery": "blue", Offline: "gray", Deactivated: "red" };
    return map[r.riderStatus] || "gray";
  };

  const filteredRiders = riders.filter((r) =>
    r.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    r.phoneNumber?.toLowerCase().includes(search.toLowerCase()) ||
    r.email?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDeliveries = deliveries.filter((d) =>
    d.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    d.deliveryAddress?.toLowerCase().includes(search.toLowerCase()) ||
    d.riderId?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Total Riders", value: riders.length },
    { label: "Available Now", value: riders.filter(r => r.riderStatus === "Available").length },
    { label: "Delivering", value: riders.filter(r => r.riderStatus === "On Delivery").length },
    { label: "Deactivated", value: riders.filter(r => r.riderStatus === "Deactivated").length },
  ];

  if (loading) return <PageLoader />;
  if (error) return <PageError message={error} onRetry={fetchData} />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Fleet Management</h1>
          <p className="text-sm text-white/30 mt-0.5">Manage riders and track all deliveries</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={14} /> Add Rider
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#111111] border border-white/5 rounded-2xl p-4">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-white/30 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1 bg-[#111111] border border-white/5 rounded-2xl p-1 w-fit">
        {["riders", "deliveries"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`text-xs px-4 py-2 rounded-xl font-medium transition-all capitalize ${activeTab === tab ? "bg-[#F97316] text-white" : "text-white/40 hover:text-white"}`}>
            {tab} ({tab === "riders" ? riders.length : deliveries.length})
          </button>
        ))}
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-2xl p-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input type="text" placeholder={activeTab === "riders" ? "Search by name, phone or email..." : "Search by customer, address or rider..."} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/70 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
        </div>
      </div>

      {activeTab === "riders" && (
        filteredRiders.length === 0 ? (
          <div className="bg-[#111111] border border-white/5 rounded-2xl p-12 text-center">
            <Bike size={32} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">{search ? "No riders match your search" : "No riders added yet"}</p>
            {!search && <button onClick={() => setShowAddModal(true)} className="mt-4 text-xs bg-[#F97316] text-white px-4 py-2 rounded-xl font-semibold hover:bg-orange-600">Add First Rider</button>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRiders.map((r) => (
              <div key={r._id} className="bg-[#111111] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {r.fullName?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{r.fullName}</p>
                      <div className="flex items-center gap-1 text-xs text-white/30"><Phone size={11} /><span>{r.phoneNumber}</span></div>
                    </div>
                  </div>
                  <DarkBadge label={getRiderStatus(r)} color={getRiderStatusColor(r)} />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/3 rounded-xl p-3">
                    <p className="text-xs text-white/30">Vehicle</p>
                    <p className="text-sm font-semibold text-white mt-0.5 capitalize">{r.vehicleType}</p>
                  </div>
                  <div className="bg-white/3 rounded-xl p-3">
                    <p className="text-xs text-white/30">Email</p>
                    <p className="text-xs font-semibold text-white mt-0.5 truncate">{r.email}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-white/5">
                  {r.riderStatus !== "Deactivated"
                    ? <button onClick={() => setDeactivateTarget(r)} className="w-full text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-2 rounded-xl font-semibold hover:bg-red-500/20">Deactivate Rider</button>
                    : <button onClick={() => handleReactivate(r._id)} className="w-full text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-2 rounded-xl font-semibold hover:bg-green-500/20">Reactivate Rider</button>
                  }
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === "deliveries" && (
        <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
          {filteredDeliveries.length === 0
            ? <div className="p-12 text-center"><p className="text-white/30 text-sm">{search ? "No deliveries match your search" : "No deliveries found"}</p></div>
            : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-white/5">{["Customer", "Rider", "Address", "Restaurant", "Status", "Assigned At"].map((h) => (<th key={h} className="text-left text-xs font-semibold text-white/30 px-5 py-3">{h}</th>))}</tr></thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredDeliveries.map((d) => (
                      <tr key={d._id} className="hover:bg-white/3 transition-colors">
                        <td className="px-5 py-4"><p className="text-xs font-semibold text-white">{d.customerName}</p><p className="text-xs text-white/30">{d.customerPhone}</p></td>
                        <td className="px-5 py-4"><p className="text-xs font-semibold text-white">{d.riderId?.fullName || "Unassigned"}</p><p className="text-xs text-white/30 capitalize">{d.riderId?.vehicleType || ""}</p></td>
                        <td className="px-5 py-4"><p className="text-xs text-white/60 max-w-[160px] truncate">{d.deliveryAddress}</p></td>
                        <td className="px-5 py-4"><p className="text-xs text-white/60">{d.businessId?.restaurantName || "N/A"}</p></td>
                        <td className="px-5 py-4"><DarkBadge label={d.status} color={getDeliveryStatusColor(d.status)} /></td>
                        <td className="px-5 py-4"><p className="text-xs text-white/40">{d.assignedAt ? new Date(d.assignedAt).toLocaleString() : "N/A"}</p></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        </div>
      )}

      {showAddModal && <AddRiderModal onClose={() => setShowAddModal(false)} onSuccess={fetchData} />}
      {deactivateTarget && (
        <DeactivateModal
          rider={deactivateTarget}
          onConfirm={handleDeactivate}
          onCancel={() => setDeactivateTarget(null)}
          loading={deactivating}
        />
      )}
    </div>
  );
}
// ============================================================
// MARKETPLACE PAGE (static — no backend needed)
// ============================================================
const sessionData = [{ time: "8am", sessions: 120 }, { time: "10am", sessions: 340 }, { time: "12pm", sessions: 890 }, { time: "2pm", sessions: 720 }, { time: "4pm", sessions: 540 }, { time: "6pm", sessions: 980 }, { time: "8pm", sessions: 1120 }, { time: "10pm", sessions: 640 }];
const trendingItems = [{ name: "Jollof Rice", orders: 842, change: "+12%", up: true }, { name: "Suya", orders: 631, change: "+8%", up: true }, { name: "Egusi Soup", orders: 519, change: "-3%", up: false }, { name: "Fried Rice", orders: 487, change: "+5%", up: true }, { name: "Pounded Yam", orders: 401, change: "+1%", up: true }];
const categoryData = [{ name: "African", value: 42 }, { name: "Continental", value: 23 }, { name: "Grills", value: 18 }, { name: "Soups", value: 17 }];
const PIE_COLORS = ["#F97316", "#3b82f6", "#22c55e", "#a855f7"];

export function MarketplacePage() {
  return (
    <div className="space-y-5">
      <div><h1 className="text-xl font-bold text-white">Marketplace Analytics</h1><p className="text-sm text-white/30 mt-0.5">Customer app health, sessions, and trending items</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[{ label: "Active Sessions", value: "1,284", change: "+18%", up: true }, { label: "App Conversion Rate", value: "34.2%", change: "+2.1%", up: true }, { label: "Avg Session Duration", value: "4m 32s", change: "-0.3s", up: false }, { label: "New Users Today", value: "142", change: "+22%", up: true }].map((s) => (
          <div key={s.label} className="bg-[#111111] border border-white/5 rounded-2xl p-4">
            <span className={`flex items-center gap-1 text-xs font-semibold ${s.up ? "text-green-400" : "text-red-400"}`}>{s.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}{s.change}</span>
            <p className="text-xl font-bold text-white mt-2">{s.value}</p><p className="text-xs text-white/30 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-white mb-4">Active Sessions Today</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={sessionData}><CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" /><XAxis dataKey="time" tick={{ fontSize: 11, fill: "#ffffff30" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 11, fill: "#ffffff30" }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: "#1A1A1A", border: "1px solid #ffffff15", borderRadius: "12px", fontSize: "12px", color: "#fff" }} /><Line type="monotone" dataKey="sessions" stroke="#F97316" strokeWidth={2.5} dot={false} /></LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">Trending Items</h2>
          <div className="space-y-3">{trendingItems.map((item, i) => (<div key={item.name} className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="text-xs font-bold text-white/20 w-4">{i + 1}</span><span className="text-sm text-white">{item.name}</span></div><div className="flex items-center gap-3"><span className="text-xs text-white/30">{item.orders} orders</span><span className={`text-xs font-semibold ${item.up ? "text-green-400" : "text-red-400"}`}>{item.change}</span></div></div>))}</div>
        </div>
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">Orders by Category</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart><Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>{categoryData.map((entry, index) => <Cell key={entry.name} fill={PIE_COLORS[index]} />)}</Pie><Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-white/50">{v}</span>} /><Tooltip contentStyle={{ background: "#1A1A1A", border: "1px solid #ffffff15", borderRadius: "12px", fontSize: "12px", color: "#fff" }} /></PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FINANCE PAGE — connected to real backend
// ============================================================
export function FinancePage() {
  const [overview, setOverview] = useState(null);
  const [merchantBreakdown, setMerchantBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFinance = async () => {
    setLoading(true); setError("");
    try {
      const [overviewData, merchantsData] = await Promise.all([
        getFinanceOverview(),
        getFinanceMerchants(),
      ]);
      setOverview(overviewData);
      setMerchantBreakdown(merchantsData || []);
    } catch (err) {
      setError("Failed to load finance data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFinance(); }, []);

  if (loading) return <PageLoader />;
  if (error) return <PageError message={error} onRetry={fetchFinance} />;

  const totalGMV = Number(overview?.totalGMV ?? 0);
  const platformCommission = Number(overview?.platformCommission ?? 0);
  const riderPayouts = Number(overview?.riderPayouts ?? 0);
  const operationalCosts = Number(overview?.operationalCosts ?? 0);

  return (
    <div className="space-y-5">
      <div><h1 className="text-xl font-bold text-white">Revenue and Finance</h1><p className="text-sm text-white/30 mt-0.5">Platform wide financial overview</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total GMV", value: `₦${totalGMV.toLocaleString()}`, sub: "Gross Merchandise Value" },
          { label: "Platform Commission", value: `₦${platformCommission.toLocaleString()}`, sub: "BiteSwift earnings" },
          { label: "Rider Payouts", value: `₦${riderPayouts.toLocaleString()}`, sub: "Total paid to riders" },
          { label: "Operational Costs", value: `₦${operationalCosts.toLocaleString()}`, sub: "Platform expenses" },
        ].map((s) => (
          <div key={s.label} className="bg-[#111111] border border-white/5 rounded-2xl p-5">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-white/30 mt-1">{s.label}</p>
            <p className="text-xs text-white/20 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5"><h2 className="text-sm font-bold text-white">Revenue Breakdown by Merchant</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/5">{["Merchant", "Total Sales", "BiteSwift Cut", "Rider Fees", "Net to Merchant"].map((h) => (<th key={h} className="text-left text-xs font-semibold text-white/30 px-5 py-3">{h}</th>))}</tr></thead>
            <tbody className="divide-y divide-white/5">
              {merchantBreakdown.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-white/30 text-sm">No merchant finance data yet</td></tr>
              ) : merchantBreakdown.map((row) => (
                <tr key={row._id} className="hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3.5 text-xs font-semibold text-white">{row.name}</td>
                  <td className="px-5 py-3.5 text-xs text-white/60">₦{Number(row.totalSales).toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-xs text-green-400 font-semibold">₦{Number(row.biteswiftCut).toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-xs text-orange-400">₦{Number(row.riderFees).toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-white">₦{Number(row.netToMerchant).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN ANALYTICS PAGE — connected to real backend (unchanged)
// ============================================================
const STATUS_COLORS = ["#F97316", "#3b82f6", "#22c55e", "#a855f7", "#ef4444"];

export function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    setLoading(true); setError("");
    try { const result = await getAdminAnalytics(); setData(result); }
    catch (err) { setError("Failed to load analytics. Please try again."); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchAnalytics(); }, []);

  if (loading) return <PageLoader />;
  if (error) return <PageError message={error} onRetry={fetchAnalytics} />;
  if (!data) return null;

  const revenueChart = (data.revenueByDay || []).map((d) => ({
    date: new Date(d._id).toLocaleDateString("en-NG", { month: "short", day: "numeric" }),
    revenue: d.revenue, orders: d.orders,
  }));
  const ordersStatusChart = (data.ordersByStatus || []).map((s) => ({
    name: s._id.charAt(0).toUpperCase() + s._id.slice(1), value: s.count,
  }));

  return (
    <div className="space-y-5">
      <div><h1 className="text-xl font-bold text-white">Platform Analytics</h1><p className="text-sm text-white/30 mt-0.5">Platform wide performance and growth metrics</p></div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[{ label: "Total Businesses", value: data.totalBusinesses }, { label: "Total Customers", value: data.totalCustomers }, { label: "Total Riders", value: data.totalRiders }, { label: "Total Orders", value: data.totalOrders }, { label: "Total Revenue", value: `₦${Number(data.totalRevenue).toLocaleString()}` }].map((s) => (
          <div key={s.label} className="bg-[#111111] border border-white/5 rounded-2xl p-4"><p className="text-2xl font-bold text-white">{s.value}</p><p className="text-xs text-white/30 mt-1">{s.label}</p></div>
        ))}
      </div>
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-white mb-4">Revenue Over Time</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={revenueChart}><CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" /><XAxis dataKey="date" tick={{ fontSize: 11, fill: "#ffffff30" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 11, fill: "#ffffff30" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}K`} /><Tooltip contentStyle={{ background: "#1A1A1A", border: "1px solid #ffffff15", borderRadius: "12px", fontSize: "12px", color: "#fff" }} formatter={(v) => [`₦${Number(v).toLocaleString()}`, "Revenue"]} /><Line type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2.5} dot={false} /></LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">Orders by Status</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart><Pie data={ordersStatusChart} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>{ordersStatusChart.map((entry, index) => <Cell key={entry.name} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />)}</Pie><Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-white/50">{v}</span>} /><Tooltip contentStyle={{ background: "#1A1A1A", border: "1px solid #ffffff15", borderRadius: "12px", fontSize: "12px", color: "#fff" }} /></PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">Top Businesses</h2>
          <div className="space-y-3">
            {(data.topBusinesses || []).map((b, i) => (
              <div key={b._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3"><span className="text-xs font-bold text-white/20 w-4">{i + 1}</span><div><p className="text-sm text-white font-semibold">{b.name}</p><p className="text-xs text-white/30">{b.totalOrders} orders</p></div></div>
                <span className="text-xs font-bold text-[#F97316]">₦{Number(b.totalRevenue).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-white mb-4">Orders Per Day</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={revenueChart}><CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" /><XAxis dataKey="date" tick={{ fontSize: 11, fill: "#ffffff30" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 11, fill: "#ffffff30" }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: "#1A1A1A", border: "1px solid #ffffff15", borderRadius: "12px", fontSize: "12px", color: "#fff" }} /><Bar dataKey="orders" fill="#F97316" radius={[6, 6, 0, 0]} /></BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN SETTINGS PAGE — connected to real backend
// ============================================================
export function AdminSettings() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Local editable state for platform settings
  const [commissionRate, setCommissionRate] = useState("");
  const [deliverySmall, setDeliverySmall] = useState("");
  const [deliveryMedium, setDeliveryMedium] = useState("");
  const [deliveryLarge, setDeliveryLarge] = useState("");
  const [maxRiderRadius, setMaxRiderRadius] = useState("");
  const [orderTimeout, setOrderTimeout] = useState("");

  const fetchSettings = async () => {
    setLoading(true); setError("");
    try {
      const data = await getSettings();
      setSettings(data);
      setCommissionRate(data.commissionRate ?? "");
      setDeliverySmall(data.deliveryFees?.Small ?? "");
      setDeliveryMedium(data.deliveryFees?.Medium ?? "");
      setDeliveryLarge(data.deliveryFees?.Large ?? "");
      setMaxRiderRadius(data.maxRiderRadius ?? "");
      setOrderTimeout(data.orderTimeout ?? "");
    } catch (err) {
      setError("Failed to load settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleSavePlatform = async () => {
    setSaving(true);
    try {
      await updateSettings({
        commissionRate: Number(commissionRate),
        deliveryFees: {
          Small: Number(deliverySmall),
          Medium: Number(deliveryMedium),
          Large: Number(deliveryLarge),
        },
        maxRiderRadius: Number(maxRiderRadius),
        orderTimeout: Number(orderTimeout),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div><h1 className="text-xl font-bold text-white">Admin Settings</h1><p className="text-sm text-white/30 mt-0.5">Platform configuration and admin account management</p></div>
      <div className="flex gap-1 bg-[#111111] border border-white/5 rounded-2xl p-1 w-fit">
        {["Profile", "Platform", "Security"].map((t) => (<button key={t} onClick={() => setActiveTab(t)} className={`text-xs px-4 py-2 rounded-xl font-medium transition-all ${activeTab === t ? "bg-[#F97316] text-white" : "text-white/40 hover:text-white"}`}>{t}</button>))}
      </div>

      {activeTab === "Profile" && (
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2"><Shield size={15} className="text-orange-400" /><h2 className="text-sm font-bold text-white">Admin Profile</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Full Name", "Email Address", "Phone Number", "Role"].map((label) => (
              <div key={label}><label className="text-xs font-semibold text-white/40 block mb-1">{label}</label><input type="text" defaultValue={label === "Full Name" ? "BiteSwift Admin" : label === "Email Address" ? "admin@biteswift.com" : label === "Phone Number" ? "08000000000" : "Super Admin"} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" /></div>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-[#F97316] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-orange-600"><Save size={14} />Save Changes</button>
        </div>
      )}

      {activeTab === "Platform" && (
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2"><Settings size={15} className="text-orange-400" /><h2 className="text-sm font-bold text-white">Platform Settings</h2></div>
          {loading ? <PageLoader /> : error ? <PageError message={error} onRetry={fetchSettings} /> : (
            <>
              <div><label className="text-xs font-semibold text-white/40 block mb-1">Commission Rate (₦)</label><input type="number" value={commissionRate} onChange={(e) => setCommissionRate(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs font-semibold text-white/40 block mb-1">Delivery Fee Small (₦)</label><input type="number" value={deliverySmall} onChange={(e) => setDeliverySmall(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" /></div>
                <div><label className="text-xs font-semibold text-white/40 block mb-1">Delivery Fee Medium (₦)</label><input type="number" value={deliveryMedium} onChange={(e) => setDeliveryMedium(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" /></div>
                <div><label className="text-xs font-semibold text-white/40 block mb-1">Delivery Fee Large (₦)</label><input type="number" value={deliveryLarge} onChange={(e) => setDeliveryLarge(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-white/40 block mb-1">Max Rider Radius (km)</label><input type="number" value={maxRiderRadius} onChange={(e) => setMaxRiderRadius(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" /></div>
                <div><label className="text-xs font-semibold text-white/40 block mb-1">Order Timeout (mins)</label><input type="number" value={orderTimeout} onChange={(e) => setOrderTimeout(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" /></div>
              </div>
              <button onClick={handleSavePlatform} disabled={saving} className="flex items-center gap-2 bg-[#F97316] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-orange-600 disabled:bg-orange-500/50">
                {saving ? <><Loader size={14} className="animate-spin" />Saving...</> : <><Save size={14} />{saved ? "Saved!" : "Save Changes"}</>}
              </button>
            </>
          )}
        </div>
      )}

      {activeTab === "Security" && (
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2"><Shield size={15} className="text-orange-400" /><h2 className="text-sm font-bold text-white">Security</h2></div>
          {["Current Password", "New Password", "Confirm New Password"].map((label) => (
            <div key={label}><label className="text-xs font-semibold text-white/40 block mb-1">{label}</label><input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" /></div>
          ))}
          <button className="flex items-center gap-2 bg-[#F97316] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-orange-600">Update Password</button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ADMIN WALLET PAGE — connected to real backend (unchanged)
// ============================================================
export function AdminWalletPage() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWallet = async () => {
    setLoading(true); setError("");
    try { const result = await getAdminWallet(); setWallet(result); }
    catch (err) { setError("Failed to load wallet data. Please try again."); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchWallet(); }, []);

  if (loading) return <PageLoader />;
  if (error) return <PageError message={error} onRetry={fetchWallet} />;
  if (!wallet) return null;

  const transactions = wallet.transactions || [];
  const balance = Number(wallet.balance || 0);
  const totalCredit = transactions.filter(t => t.type === "credit").reduce((sum, t) => sum + Number(t.amount), 0);
  const totalDebit = transactions.filter(t => t.type === "debit").reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div className="space-y-5">
      <div><h1 className="text-xl font-bold text-white">BiteSwift Wallet</h1><p className="text-sm text-white/30 mt-0.5">Platform commission earnings and withdrawal history</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-gradient-to-br from-[#F97316] to-[#ea580c] rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-6"><Wallet size={18} className="text-white/80" /><span className="text-sm text-white/70">Available Balance</span></div>
            <p className="text-4xl font-bold mb-1">₦{balance.toLocaleString()}</p>
            <p className="text-xs text-white/50 mb-6">Updated just now</p>
            <button className="bg-white text-[#F97316] text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-white/90 transition-colors">Withdraw Funds</button>
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-[#111111] border border-white/5 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2"><TrendingUp size={14} className="text-green-400" /><p className="text-xs text-white/30">Total Commission Earned</p></div>
            <p className="text-xl font-bold text-white">₦{totalCredit.toLocaleString()}</p>
            <p className="text-xs text-green-400 font-medium mt-1">All time</p>
          </div>
          <div className="bg-[#111111] border border-white/5 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2"><ArrowUpRight size={14} className="text-red-400" /><p className="text-xs text-white/30">Total Withdrawn</p></div>
            <p className="text-xl font-bold text-white">₦{totalDebit.toLocaleString()}</p>
            <p className="text-xs text-white/20 mt-1">All time</p>
          </div>
        </div>
      </div>
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center"><Building2 size={18} className="text-white/40" /></div>
            <div><p className="text-xs text-white/30">Linked Business Account</p><p className="text-sm font-bold text-white">GTBank 9910</p><p className="text-xs text-white/30">BiteSwift Technologies Ltd</p></div>
          </div>
          <button className="text-xs font-semibold text-[#F97316] hover:underline">Change</button>
        </div>
      </div>
      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5"><h2 className="text-sm font-bold text-white">Transaction History</h2></div>
        {transactions.length === 0 ? (
          <div className="p-12 text-center"><p className="text-white/30 text-sm">No transactions yet</p></div>
        ) : (
          <div className="divide-y divide-white/5">
            {transactions.map((t, i) => (
              <div key={t.reference || i} className="flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${t.type === "credit" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                    {t.type === "credit" ? <ArrowDownLeft size={15} className="text-green-400" /> : <ArrowUpRight size={15} className="text-red-400" />}
                  </div>
                  <div><p className="text-sm font-medium text-white">{t.description}</p><p className="text-xs text-white/30">{new Date(t.createdAt).toLocaleString()}</p></div>
                </div>
                <span className={`text-sm font-bold ${t.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                  {t.type === "credit" ? "+" : ""}₦{Number(t.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}