import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconEye = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconEyeOff = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const IconMail = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IconLock = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconArrow = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconCheck = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
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
        Welcome back.{" "}
        <span className="text-orange-400">Your orders await.</span>
      </h2>
      <p className="text-gray-400 text-lg leading-relaxed mb-10">
        Sign in to continue ordering from your favourite local businesses — fast delivery, real-time tracking, every time.
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

    {/* Testimonial */}
    <div className="relative bg-gray-900 rounded-2xl p-6 border border-gray-800">
      <p className="text-gray-300 text-sm leading-relaxed mb-4">
        "I love how fast my orders arrive. BiteSwift is the only app I use now for everything!"
      </p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">TJ</div>
        <div>
          <div className="text-white text-sm font-semibold">Tunde Johnson</div>
          <div className="text-gray-500 text-xs">Customer, Lagos</div>
        </div>
      </div>
    </div>
  </div>
);

// ── Customer Login Page ───────────────────────────────────────────────────────
export default function CustomerLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const response = await fetch("https://biteswift-qw3s.onrender.com/api/customers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      localStorage.setItem("customerToken", data.token);
      if (rememberMe) localStorage.setItem("rememberCustomer", "true");

      navigate("/customer/browse");
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full pl-11 pr-4 py-3.5 rounded-xl border text-gray-900 text-sm placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
      errors[field]
        ? "border-red-400 bg-red-50"
        : "border-gray-200 bg-gray-50 hover:border-gray-300"
    }`;

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Side Panel */}
      <SidePanel />

      {/* Right: Login Form */}
      <div className="flex flex-col justify-center px-8 sm:px-16 py-12 bg-white">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <span className="text-xl font-bold text-gray-900">BiteSwift</span>
        </div>

        <div className="max-w-md w-full mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-500">Sign in to your account to continue ordering</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <IconMail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputClass("email")}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <a href="/customer/forgot-password" className="text-orange-500 hover:text-orange-600 text-xs font-medium transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <IconLock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`${inputClass("password")} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  rememberMe ? "bg-orange-500 border-orange-500" : "border-gray-300"
                }`}
              >
                {rememberMe && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
              <span className="text-sm text-gray-600">Remember me for 30 days</span>
            </div>

            {/* General error */}
            {errors.general && (
              <p className="text-red-500 text-sm text-center bg-red-50 py-3 rounded-xl border border-red-100">
                {errors.general}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-200"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <IconArrow size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <a href="/customer/register" className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">
              Create one free
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