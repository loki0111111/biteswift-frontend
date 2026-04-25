// RequestsPage.jsx
// Admin page to view, approve, and reject business partner requests

import { useState, useEffect } from "react";
import {
  Store,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  MessageSquare,
} from "lucide-react";

const STATUS_STYLES = {
  pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  approved: "bg-green-500/10 text-green-400 border border-green-500/20",
  rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const FILTERS = ["All", "Pending", "Approved", "Rejected"];

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [actionLoading, setActionLoading] = useState(null); // request id being acted on

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("https://biteswift-qw3s.onrender.com/api/requests");
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch requests");
      setRequests(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    setActionLoading(id + action);
    try {
      const response = await fetch(`https://biteswift-qw3s.onrender.com/api/requests/${id}/${action}`, {
        method: "PATCH",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Action failed");
      // Update local state
      setRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status: action === "approve" ? "approved" : "rejected" } : r
        )
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = requests.filter((r) => {
    const matchesFilter =
      activeFilter === "All" || r.status === activeFilter.toLowerCase();
    const matchesSearch =
      r.restaurantName.toLowerCase().includes(search.toLowerCase()) ||
      r.yourName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Partner Requests</h1>
          <p className="text-white/40 text-sm mt-0.5">
            Review and manage incoming restaurant partner applications
          </p>
        </div>
        <button
          onClick={fetchRequests}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/50 hover:text-white text-sm transition-all"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* ── Stats ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total", value: counts.all, color: "text-white" },
          { label: "Pending", value: counts.pending, color: "text-yellow-400" },
          { label: "Approved", value: counts.approved, color: "text-green-400" },
          { label: "Rejected", value: counts.rejected, color: "text-red-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#111111] border border-white/5 rounded-2xl p-4"
          >
            <p className="text-white/30 text-xs uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Filters & Search ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            placeholder="Search by restaurant, name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/40"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeFilter === f
                  ? "bg-[#F97316] text-white"
                  : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-white/10 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={fetchRequests}
            className="mt-3 text-xs text-white/40 hover:text-white underline"
          >
            Try again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-12 text-center">
          <Store size={32} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No requests found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((request) => (
            <div
              key={request._id}
              className="bg-[#111111] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">

                {/* Info */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Restaurant & Owner */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Store size={13} className="text-[#F97316] shrink-0" />
                      <span className="text-white font-semibold text-sm">{request.restaurantName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={13} className="text-white/30 shrink-0" />
                      <span className="text-white/50 text-xs">{request.yourName}</span>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-white/30 shrink-0" />
                      <span className="text-white/50 text-xs">{request.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-white/30 shrink-0" />
                      <span className="text-white/50 text-xs">{request.phoneNumber}</span>
                    </div>
                  </div>

                  {/* Location & Date */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-white/30 shrink-0" />
                      <span className="text-white/50 text-xs truncate">{request.restaurantLocation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-white/30 shrink-0" />
                      <span className="text-white/50 text-xs">
                        {new Date(request.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: status + actions */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Status badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[request.status]}`}>
                    {request.status}
                  </span>

                  {/* Message (if any) */}
                  {request.additionalMessage && (
                    <button
                      title={request.additionalMessage}
                      className="p-2 rounded-xl bg-white/5 text-white/30 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <MessageSquare size={14} />
                    </button>
                  )}

                  {/* Actions — only show if pending */}
                  {request.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(request._id, "approve")}
                        disabled={!!actionLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                      >
                        {actionLoading === request._id + "approve" ? (
                          <div className="w-3 h-3 border border-green-400/30 border-t-green-400 rounded-full animate-spin" />
                        ) : (
                          <CheckCircle size={13} />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(request._id, "reject")}
                        disabled={!!actionLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                      >
                        {actionLoading === request._id + "reject" ? (
                          <div className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                        ) : (
                          <XCircle size={13} />
                        )}
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}