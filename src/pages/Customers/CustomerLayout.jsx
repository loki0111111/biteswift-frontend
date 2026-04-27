  import { useState } from "react";
  import { useNavigate, useLocation } from "react-router-dom";

  // ── Icons ─────────────────────────────────────────────────────────────────────
  const IconHome = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
  const IconBox = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
  const IconShoppingBag = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
  const IconTag = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
  const IconHeadphones = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
  const IconSettings = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
  const IconStore = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M2 9h20" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
  const IconSearch = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
  const IconShoppingCart = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
  const IconUser = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
  const IconMenu = ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
  const IconX = ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  // ── Nav Items ─────────────────────────────────────────────────────────────────
  const navItems = [
    { label: "Home", icon: IconHome, path: "/customer/browse" },
    { label: "Products", icon: IconBox, path: "/customer/products" },
    { label: "Businesses", icon: IconStore, path: "/customer/businesses" },
    { label: "Orders", icon: IconShoppingBag, path: "/customer/orders" },
    { label: "Offers", icon: IconTag, path: "/customer/offers", comingSoon: true },
    { label: "Support", icon: IconHeadphones, path: "/customer/support" },
    { label: "Settings", icon: IconSettings, path: "/customer/settings" },
  ];

  // ── Sidebar Content ───────────────────────────────────────────────────────────
  const SidebarContent = ({ isActive, onNavigate }) => (
    <>
      <div className="px-6 py-6 border-b border-gray-100">
        <a href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-200">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <span className="text-xl font-bold text-gray-900">BiteSwift</span>
        </a>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map(({ label, icon: Icon, path, comingSoon }) => (
          <button
            key={path}
            onClick={() => { if (!comingSoon) onNavigate(path); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isActive(path)
                ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                : comingSoon
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
            {comingSoon && (
              <span className="ml-auto text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">Soon</span>
            )}
          </button>
        ))}
      </nav>


      <div className="px-4 pb-6 border-t border-gray-100 pt-4">
        <button
          onClick={() => onNavigate("/customer/account")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
            isActive("/customer/account")
              ? "bg-orange-500 text-white shadow-md shadow-orange-200"
              : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 flex-shrink-0">
            <IconUser size={16} />
          </div>
          <span>My Account</span>
        </button>
      </div>
    </>
  );

  // ── Customer Layout ───────────────────────────────────────────────────────────
  export default function CustomerLayout({ children, cartCount = 0, searchQuery = "", onSearch }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const handleNavigate = (path) => {
      navigate(path);
      setMobileMenuOpen(false);
    };

    return (
      <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">

        {/* SIDEBAR (desktop) */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 fixed top-0 left-0 h-full z-40 flex-shrink-0">
          <SidebarContent isActive={isActive} onNavigate={handleNavigate} />
        </aside>

        {/* MAIN AREA */}
        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen min-w-0 overflow-x-hidden">

          {/* TOP NAVBAR */}
          <header className="bg-white border-b border-gray-100 fixed top-0 left-0 right-0 lg:left-64 z-30">
            <div className="px-4 py-3 flex items-center gap-3">

              {/* Mobile: hamburger + logo */}
              <div className="flex items-center gap-2 flex-shrink-0 lg:hidden">
                <button
                  className="text-gray-600 hover:text-orange-500 transition-colors"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <IconX size={22} /> : <IconMenu size={22} />}
                </button>
                <a href="/" className="flex items-center gap-1.5">
                  <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">B</span>
                  </div>
                  <span className="text-base font-bold text-gray-900">BiteSwift</span>
                </a>
              </div>

              {/* Search bar — autoComplete off to prevent browser autofill */}
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <IconSearch size={16} />
                </div>
                <input type="email" name="email" style={{ display: "none" }} autoComplete="email" readOnly />
                <input type="password" name="password" style={{ display: "none" }} autoComplete="current-password" readOnly />
                <input
                  type="search"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  name="biteswift-search"
                  value={searchQuery}
                  onChange={(e) => onSearch && onSearch(e.target.value)}
                  placeholder="Search businesses or products..."
                  className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearch && onSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <IconX size={14} />
                  </button>
                )}
              </div>

              {/* Cart + Account — far right */}
              <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                <button
                  onClick={() => navigate("/customer/cart")}
                  className="relative w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 hover:bg-orange-100 transition-colors"
                >
                  <IconShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => navigate("/customer/account")}
                  className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-orange-500 hover:border-orange-200 transition-colors"
                >
                  <IconUser size={18} />
                </button>
              </div>
            </div>
          </header>

          {/* MOBILE SIDEBAR OVERLAY */}
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
              <div className="relative w-72 bg-white h-full flex flex-col shadow-2xl overflow-y-auto">
                <div className="flex justify-end px-4 pt-4">
                  <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                    <IconX size={20} />
                  </button>
                </div>
                <SidebarContent isActive={isActive} onNavigate={handleNavigate} />
              </div>
            </div>
          )}

          {/* BOTTOM NAV (mobile) */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30 flex items-center justify-around px-1 py-1.5">
            {navItems.slice(0, 5).map(({ label, icon: Icon, path, comingSoon }) => (
              <button
                key={path}
                onClick={() => !comingSoon && navigate(path)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 min-w-0 ${
                  isActive(path) ? "text-orange-500" : "text-gray-400 hover:text-orange-400"
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium truncate">{label}</span>
              </button>
            ))}
          </div>

          {/* PAGE CONTENT */}
            <main className="flex-1 pt-[57px] pb-20 lg:pb-0 min-w-0 overflow-x-hidden">
            {children}
          </main>

        </div>
      </div>
    );
  }