import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, ShoppingBag, Truck, Wallet, BarChart2,
  Settings, Menu, X, Bell, Search, ChevronDown, LogOut, Store, ShoppingCart,
} from "lucide-react";

const BASE_URL = "https://biteswift-qw3s.onrender.com";
const getToken = () => localStorage.getItem("token");

const navItems = [
  { label: "Home", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Add Products", icon: ShoppingCart, path: "/dashboard/products" },
  { label: "Orders", icon: ShoppingBag, path: "/dashboard/orders" },
  { label: "Deliveries", icon: Truck, path: "/dashboard/deliveries" },
  { label: "Wallet", icon: Wallet, path: "/dashboard/wallet" },
  { label: "Analytics", icon: BarChart2, path: "/dashboard/analytics" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState({ name: "", email: "", initials: "" });
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    console.log("Status:", res.status);
    const json = await res.json();
    console.log("RAW JSON:", json);
    const data = json.data ?? json;
    console.log("PROFILE DATA:", data);
    const name = data.businessName || data.name || "Business Owner";
    console.log("NAME EXTRACTED:", name);
    const email = data.email || "";
    const initials = name.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase();
    setProfile({ name, email, initials });
  } catch (err) {
    console.log("FETCH ERROR:", err);
  }
};
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-[#F8F7F4] font-sans overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-10 lg:hidden" onClick={closeSidebar} />
      )}

      <aside className={`fixed lg:relative inset-y-0 left-0 z-20 ${sidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full lg:translate-x-0 lg:w-20"} transition-all duration-300 ease-in-out bg-[#111111] flex flex-col shrink-0`}>
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#F97316] rounded-lg flex items-center justify-center shrink-0">
              <Store size={16} className="text-white" />
            </div>
            <span className={`text-white font-bold text-lg tracking-tight ${!sidebarOpen ? "lg:hidden" : ""}`}>
              Bite<span className="text-[#F97316]">Swift</span>
            </span>
          </div>
          <button onClick={closeSidebar} className="lg:hidden p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map(({ label, icon: Icon, path }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} onClick={() => { if (window.innerWidth < 1024) closeSidebar(); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${active ? "bg-[#F97316] text-white" : "text-white/50 hover:text-white hover:bg-white/10"}`}
              >
                <Icon size={18} className="shrink-0" />
                <span className={`text-sm font-medium ${!sidebarOpen ? "lg:hidden" : ""}`}>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 w-full">
            <LogOut size={18} className="shrink-0" />
            <span className={`text-sm font-medium ${!sidebarOpen ? "lg:hidden" : ""}`}>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-900 transition-colors p-1">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="relative hidden md:block">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search orders, items..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F97316] rounded-full" />
            </button>

            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 pl-2 pr-2 md:pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-all">
                <div className="w-8 h-8 bg-[#F97316] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {profile.initials || "?"}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-gray-800">{profile.name || "Loading..."}</p>
                  <p className="text-xs text-gray-400">Business Owner</p>
                </div>
                <ChevronDown size={14} className="text-gray-400 hidden md:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 bg-white border border-gray-100 rounded-2xl shadow-xl w-48 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-800">{profile.name}</p>
                    <p className="text-xs text-gray-400">{profile.email}</p>
                  </div>
                  <Link to="/dashboard/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                    <Settings size={14} /> Settings
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}