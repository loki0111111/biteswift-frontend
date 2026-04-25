import { useNavigate } from "react-router-dom";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconArrow = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconUser = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconUserPlus = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);
const IconCheck = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconZap = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

// ── Decorative Side Panel ─────────────────────────────────────────────────────
const SidePanel = () => (
  <div className="hidden lg:flex flex-col justify-between h-full bg-gray-950 p-12 relative overflow-hidden">
    {/* Background pattern */}
    <div className="absolute inset-0 opacity-10">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-orange-400"
          style={{
            width: `${(i + 1) * 120}px`,
            height: `${(i + 1) * 120}px`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>

    {/* Logo */}
    <div className="relative flex items-center gap-3">
      <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
        <span className="text-white font-bold text-xl">B</span>
      </div>
      <span className="text-white text-2xl font-bold">BiteSwift</span>
    </div>

    {/* Center content */}
    <div className="relative">
      <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
        Order from the best{" "}
        <span className="text-orange-400">businesses near you.</span>
      </h2>
      <p className="text-gray-400 text-lg leading-relaxed mb-10">
        From food to everyday essentials — BiteSwift connects you to hundreds of local businesses with fast, reliable delivery.
      </p>

      {/* Perks */}
      <div className="space-y-4">
        {[
          "Track your orders in real-time",
          "Fast delivery to your doorstep",
          "Browse hundreds of local businesses",
          "Secure and easy checkout",
        ].map((perk) => (
          <div key={perk} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 flex-shrink-0">
              <IconCheck size={12} />
            </div>
            <span className="text-gray-300 text-sm">{perk}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Stats */}
    <div className="relative grid grid-cols-2 gap-4">
      {[
        { value: "50K+", label: "Orders Delivered" },
        { value: "98%", label: "Success Rate" },
        { value: "500+", label: "Businesses" },
        { value: "4.9★", label: "Avg Rating" },
      ].map((stat) => (
        <div key={stat.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="text-orange-400 font-extrabold text-2xl">{stat.value}</div>
          <div className="text-gray-500 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
);

// ── Customer Auth Entry Page ──────────────────────────────────────────────────
export default function CustomerAuthPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Side Panel */}
      <SidePanel />

      {/* Right: Auth Options */}
      <div className="flex flex-col justify-center px-8 sm:px-16 py-12 bg-white">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <span className="text-xl font-bold text-gray-900">BiteSwift</span>
        </div>

        <div className="max-w-md w-full mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <IconZap size={12} />
            <span>Fast delivery, every time</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
              Welcome to BiteSwift
            </h1>
            <p className="text-gray-500 text-base leading-relaxed">
              Order from your favourite local businesses. Are you a returning customer or visiting for the first time?
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {/* Returning customer */}
            <button
              onClick={() => navigate("/customer/login")}
              className="w-full group flex items-center justify-between p-6 rounded-2xl border-2 border-gray-200 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-50 bg-white transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center text-orange-500 transition-colors duration-200">
                  <IconUser size={22} />
                </div>
                <div className="text-left">
                  <div className="text-gray-900 font-bold text-base">Sign In</div>
                  <div className="text-gray-400 text-sm">I already have an account</div>
                </div>
              </div>
              <div className="text-gray-300 group-hover:text-orange-500 transition-colors duration-200">
                <IconArrow size={20} />
              </div>
            </button>

            {/* New customer */}
            <button
              onClick={() => navigate("/customer/register")}
              className="w-full group flex items-center justify-between p-6 rounded-2xl border-2 border-gray-200 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-50 bg-white transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center text-orange-500 transition-colors duration-200">
                  <IconUserPlus size={22} />
                </div>
                <div className="text-left">
                  <div className="text-gray-900 font-bold text-base">Create Account</div>
                  <div className="text-gray-400 text-sm">I'm new here, sign me up</div>
                </div>
              </div>
              <div className="text-gray-300 group-hover:text-orange-500 transition-colors duration-200">
                <IconArrow size={20} />
              </div>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs">are you a business?</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Partner link */}
          <p className="text-center text-sm text-gray-500">
            Want to list your business on BiteSwift?{" "}
            <a href="/contact" className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">
              Partner With Us
            </a>
          </p>

          {/* Back to home */}
          <p className="text-center text-xs text-gray-400 mt-6">
            <a href="/" className="hover:text-gray-600 transition-colors">← Back to BiteSwift.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}