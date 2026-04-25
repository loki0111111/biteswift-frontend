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
const IconUser = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconPhone = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
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

    <div className="relative flex items-center gap-3">
      <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
        <span className="text-white font-bold text-xl">B</span>
      </div>
      <span className="text-white text-2xl font-bold">BiteSwift</span>
    </div>

    <div className="relative">
      <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
        Order from the best{" "}
        <span className="text-orange-400">businesses near you.</span>
      </h2>
      <p className="text-gray-400 text-lg leading-relaxed mb-10">
        Create your free account and start ordering from hundreds of businesses — fast delivery, real-time tracking, every time.
      </p>

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

// ── Success State ─────────────────────────────────────────────────────────────
const SuccessState = ({ email, onGoToLogin }) => (
  <div className="flex flex-col items-center justify-center text-center py-8">
    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-500 mb-6">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
    <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Check your email! 📧</h2>
    <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-2">
      We sent a verification link to
    </p>
    <p className="text-orange-500 font-semibold text-sm mb-6">{email}</p>
    <p className="text-gray-400 text-xs leading-relaxed max-w-sm mb-8">
      Click the link in the email to verify your account. The link expires in 24 hours.
    </p>
    <button
      onClick={onGoToLogin}
      className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-orange-200"
    >
      Go to Login
      <IconArrow size={18} />
    </button>
  </div>
);

// ── Customer Register Page ────────────────────────────────────────────────────
export default function CustomerRegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    else if (form.fullName.trim().length < 2) newErrors.fullName = "Enter a valid full name";

    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email";

    if (!form.phone) newErrors.phone = "Phone number is required";
    else if (!/^(\+?234|0)[789]\d{9}$/.test(form.phone.replace(/\s/g, "")))
      newErrors.phone = "Enter a valid Nigerian phone number";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

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
      const response = await fetch("https://biteswift-qw3s.onrender.com/api/customers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setSubmitted(true);
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
      <SidePanel />

      <div className="flex flex-col justify-center px-8 sm:px-16 py-12 bg-white overflow-y-auto">
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <span className="text-xl font-bold text-gray-900">BiteSwift</span>
        </div>

        <div className="max-w-md w-full mx-auto">
          {submitted ? (
            <SuccessState email={form.email} onGoToLogin={() => navigate("/customer/login")} />
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Create your account</h1>
                <p className="text-gray-500">Start ordering from businesses near you</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <IconUser size={18} />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={inputClass("fullName")}
                    />
                  </div>
                  {errors.fullName && <p className="text-red-500 text-xs mt-1.5">{errors.fullName}</p>}
                </div>

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

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <IconPhone size={18} />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="08012345678"
                      className={inputClass("phone")}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <IconLock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min. 6 characters"
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

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <IconLock size={18} />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      className={`${inputClass("confirmPassword")} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5">{errors.confirmPassword}</p>}
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
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <IconArrow size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-400 text-xs">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <a href="/customer/login" className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">
                  Sign in
                </a>
              </p>

              <p className="text-center text-xs text-gray-400 mt-6">
                <a href="/" className="hover:text-gray-600 transition-colors">← Back to BiteSwift.com</a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}