// AdminLayout.jsx
// Main layout wrapper for the BiteSwift Admin Dashboard
// Dark, authoritative design — feels like a command center

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Radio,
  Store,
  Bike,
  ShoppingBag,
  BarChart2,
  DollarSign,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Shield,
  AlertCircle,
  Wallet,
  FileText,
} from "lucide-react";

const navItems = [
  { label: "Control Tower", icon: Radio, path: "/admin/dashboard" },
  { label: "Merchants", icon: Store, path: "/admin/merchants" },
  { label: "Fleet", icon: Bike, path: "/admin/fleet" },
  { label: "Marketplace", icon: ShoppingBag, path: "/admin/marketplace" },
  { label: "Finance", icon: DollarSign, path: "/admin/finance" },
  { label: "Wallet", icon: Wallet, path: "/admin/wallet" },
  { label: "Requests", icon: FileText, path: "/admin/requests" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminLayout({ children }) {
  // Desktop: sidebar collapsed/expanded. Mobile: sidebar hidden/shown as overlay
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-[#0A0A0A] font-sans overflow-hidden">

      {/* ── Mobile overlay backdrop ──────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-10 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-20
          ${sidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full lg:translate-x-0 lg:w-20"}
          transition-all duration-300 ease-in-out
          bg-[#111111] border-r border-white/5
          flex flex-col shrink-0
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#F97316] rounded-lg flex items-center justify-center shrink-0">
              <Shield size={15} className="text-white" />
            </div>
            {/* Always show text on mobile sidebar, hide on collapsed desktop */}
            <div className={`${!sidebarOpen ? "lg:hidden" : ""}`}>
              <span className="text-white font-bold text-base tracking-tight">
                Bite<span className="text-[#F97316]">Swift</span>
              </span>
              <p className="text-[10px] text-white/30 tracking-widest uppercase">Admin</p>
            </div>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={closeSidebar}
            className="lg:hidden p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Live indicator */}
        <div className={`mx-3 mt-4 mb-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2 flex items-center gap-2 ${!sidebarOpen ? "lg:hidden" : ""}`}>
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />
          <span className="text-xs text-green-400 font-medium">Platform Live</span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(({ label, icon: Icon, path }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => { if (window.innerWidth < 1024) closeSidebar(); }}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                  ${active
                    ? "bg-[#F97316] text-white"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <Icon size={17} className="shrink-0" />
                <span className={`text-sm font-medium ${!sidebarOpen ? "lg:hidden" : ""}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all w-full"
          >
            <LogOut size={17} className="shrink-0" />
            <span className={`text-sm font-medium ${!sidebarOpen ? "lg:hidden" : ""}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* ── Main Area ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Navbar */}
        <header className="h-16 bg-[#111111] border-b border-white/5 flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white/40 hover:text-white transition-colors p-1"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="relative hidden md:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                type="text"
                placeholder="Search merchants, riders, orders..."
                className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60 placeholder-white/20 w-72 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/40"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Alert badge */}
            <button className="relative p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              <AlertCircle size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F97316] rounded-full" />
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-2 pr-2 md:pr-3 py-1.5 rounded-xl hover:bg-white/5 transition-all"
              >
                <div className="w-8 h-8 bg-[#F97316] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                  BS
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-white">BiteSwift Admin</p>
                  <p className="text-xs text-white/30">Super Admin</p>
                </div>
                <ChevronDown size={13} className="text-white/30 hidden md:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-2xl w-48 py-2 z-50">
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-xs font-semibold text-white">BiteSwift Admin</p>
                    <p className="text-xs text-white/30">admin@biteswift.com</p>
                  </div>
                  <Link to="/admin/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-white/50 hover:text-white hover:bg-white/5">
                    <Settings size={13} /> Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 w-full"
                  >
                    <LogOut size={13} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#0D0D0D]">
          {children}
        </main>
      </div>
    </div>
  );
}