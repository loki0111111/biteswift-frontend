import { useState } from "react";

const year = new Date().getFullYear()

const BUSINESS_TYPES = [
  "Restaurant", "Grocery", "Pharmacy", "Fashion", "Electronics", "Beauty", "Other"
];

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconUser = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconPhone = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.98-.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const IconMail = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IconStore = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const IconMessage = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const IconArrow = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconCheck = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconMapPin = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconClock = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconHeadphones = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);
const IconBriefcase = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);

// ── Success State ─────────────────────────────────────────────────────────────
const SuccessState = ({ onReset }) => (
  <div className="flex flex-col items-center justify-center text-center py-12">
    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-500 mb-6">
      <IconCheck size={40} />
    </div>
    <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Message Sent!</h2>
    <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-8">
      Thanks for reaching out! Our team will review your request and get back to you within <strong>24–48 hours</strong> with your login credentials.
    </p>
    <div className="flex flex-col sm:flex-row gap-3">
      <a
        href="/"
        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-200 text-sm"
      >
        Back to Home
      </a>
      <button
        onClick={onReset}
        className="px-6 py-3 border border-gray-200 hover:border-gray-300 text-gray-600 font-semibold rounded-xl transition-all duration-200 text-sm"
      >
        Send Another
      </button>
    </div>
  </div>
);

// ── Contact Page ──────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [form, setForm] = useState({
    restaurantName: "",
    ownerName: "",
    email: "",
    phone: "",
    location: "",
    businessType: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.restaurantName.trim()) newErrors.restaurantName = "Business name is required";
    if (!form.ownerName.trim()) newErrors.ownerName = "Your name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.businessType) newErrors.businessType = "Please select a business type";
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
      const response = await fetch("https://biteswift-qw3s.onrender.com/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantName: form.restaurantName,
          yourName: form.ownerName,
          email: form.email,
          phoneNumber: form.phone,
          restaurantLocation: form.location,
          businessType: form.businessType,
          additionalMessage: form.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSubmitted(true);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setForm({ restaurantName: "", ownerName: "", email: "", phone: "", location: "", businessType: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── NAVBAR ───────────────────────────────────────────────────────────── */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900">BiteSwift</span>
          </a>
          <a
            href="/login"
            className="text-sm font-semibold text-gray-600 hover:text-orange-500 transition-colors"
          >
            Already a partner? Log in →
          </a>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            🤝 Partner With Us
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            Let's grow your business together
          </h1>
          <p className="text-orange-100 text-lg max-w-xl mx-auto">
            Fill out the form below and our team will reach out within 24–48 hours to set up your BiteSwift account.
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left: Info cards */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">What happens next?</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                After submitting, here's what to expect from the BiteSwift team.
              </p>
            </div>

            {/* Steps */}
            {[
              { step: "01", title: "We review your request", desc: "Our team reviews your business details within 24 hours." },
              { step: "02", title: "We reach out to you", desc: "A BiteSwift representative contacts you via email or phone." },
              { step: "03", title: "Account setup", desc: "We create your dashboard account and send you your login credentials." },
              { step: "04", title: "You go live!", desc: "Upload your menu, set delivery zones, and start receiving orders." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-500 font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <div className="text-gray-900 font-semibold text-sm mb-0.5">{item.title}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}

            {/* Divider */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Contact us directly</h3>
              {[
                { icon: <IconMail size={16} />, text: "partners@biteswift.com" },
                { icon: <IconPhone size={16} />, text: "+234 800 BITESWIFT" },
                { icon: <IconMapPin size={16} />, text: "Lagos, Nigeria" },
                { icon: <IconClock size={16} />, text: "Mon – Fri, 9am – 6pm WAT" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-gray-500 text-sm">
                  <div className="text-orange-500">{item.icon}</div>
                  {item.text}
                </div>
              ))}
            </div>

            {/* Support card */}
            <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white">
                  <IconHeadphones size={16} />
                </div>
                <span className="text-gray-900 font-semibold text-sm">Need help?</span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">
                Our support team is available to answer any questions about partnering with BiteSwift.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              {submitted ? (
                <SuccessState onReset={handleReset} />
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Reach out to us</h2>
                    <p className="text-gray-500 text-sm">All fields marked <span className="text-orange-500">*</span> are required.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Restaurant Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Business Name <span className="text-orange-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <IconStore size={16} />
                          </div>
                          <input
                            type="text"
                            name="restaurantName"
                            value={form.restaurantName}
                            onChange={handleChange}
                            placeholder="e.g. Mama Ada's Kitchen"
                            className={`w-full pl-10 pr-4 py-3.5 rounded-xl border text-gray-900 text-sm placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                              errors.restaurantName ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                            }`}
                          />
                        </div>
                        {errors.restaurantName && <p className="text-red-500 text-xs mt-1">{errors.restaurantName}</p>}
                      </div>

                      {/* Owner Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Your Name <span className="text-orange-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <IconUser size={16} />
                          </div>
                          <input
                            type="text"
                            name="ownerName"
                            value={form.ownerName}
                            onChange={handleChange}
                            placeholder="Your full name"
                            className={`w-full pl-10 pr-4 py-3.5 rounded-xl border text-gray-900 text-sm placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                              errors.ownerName ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                            }`}
                          />
                        </div>
                        {errors.ownerName && <p className="text-red-500 text-xs mt-1">{errors.ownerName}</p>}
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Email */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address <span className="text-orange-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <IconMail size={16} />
                          </div>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@business.com"
                            className={`w-full pl-10 pr-4 py-3.5 rounded-xl border text-gray-900 text-sm placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                              errors.email ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                            }`}
                          />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number <span className="text-orange-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <IconPhone size={16} />
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+234 800 000 0000"
                            className={`w-full pl-10 pr-4 py-3.5 rounded-xl border text-gray-900 text-sm placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                              errors.phone ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                            }`}
                          />
                        </div>
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    {/* Row 3: Location + Business Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Location */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Business Location <span className="text-orange-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <IconMapPin size={16} />
                          </div>
                          <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="e.g. 12 Adeola Odeku St, Lagos"
                            className={`w-full pl-10 pr-4 py-3.5 rounded-xl border text-gray-900 text-sm placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                              errors.location ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                            }`}
                          />
                        </div>
                        {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                      </div>

                      {/* Business Type */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Business Type <span className="text-orange-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <IconBriefcase size={16} />
                          </div>
                          <select
                            name="businessType"
                            value={form.businessType}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3.5 rounded-xl border text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 appearance-none ${
                              errors.businessType ? "border-red-400 bg-red-50 text-gray-900" : "border-gray-200 bg-gray-50"
                            } ${!form.businessType ? "text-gray-400" : "text-gray-900"}`}
                          >
                            <option value="" disabled>Select business type</option>
                            {BUSINESS_TYPES.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        {errors.businessType && <p className="text-red-500 text-xs mt-1">{errors.businessType}</p>}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Additional Message{" "}
                        <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-4 text-gray-400">
                          <IconMessage size={16} />
                        </div>
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Tell us a bit about your business, your current delivery setup, or any questions you have..."
                          className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                        />
                      </div>
                    </div>

                    {/* General Error */}
                    {errors.general && (
                      <p className="text-red-500 text-sm text-center bg-red-50 py-3 rounded-xl border border-red-100">
                        {errors.general}
                      </p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-200 text-sm"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending your request...
                        </>
                      ) : (
                        <>
                          Send Request to BiteSwift
                          <IconArrow size={18} />
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-gray-400">
                      We typically respond within 24–48 hours on business days.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-200 py-8 px-6 text-center">
        <p className="text-gray-400 text-sm">© {year} BiteSwift. All rights reserved.</p>
      </footer>
    </div>
  );
}