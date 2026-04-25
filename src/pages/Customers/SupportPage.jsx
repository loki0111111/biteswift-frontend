import { useState } from "react";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconChevronDown = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconSend = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const IconCheck = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconMessageCircle = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

// ── FAQ Data ──────────────────────────────────────────────────────────────────
const faqs = [
  {
    category: "Orders",
    items: [
      {
        q: "How do I place an order?",
        a: "Browse businesses or products, add items to your cart, then proceed to checkout. Enter your delivery address and preferred payment method to complete your order.",
      },
      {
        q: "Can I cancel or modify my order after placing it?",
        a: "You can cancel an order within 2 minutes of placing it, as long as the business hasn't started preparing it. Once preparation begins, cancellations are no longer possible. To cancel, go to Orders and tap the order you'd like to cancel.",
      },
      {
        q: "How do I track my order?",
        a: "Go to the Orders page and tap on your active order. You'll see a live tracking stepper showing the current stage: Order Placed → Preparing → Out for Delivery → Delivered.",
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        q: "What payment methods are accepted?",
        a: "We currently accept Debit Card and Bank Transfer. More payment options are coming soon.",
      },
      {
        q: "Why was I charged a service fee?",
        a: "A flat ₦600 service fee is added to every order. This helps BiteSwift maintain the platform and keep delivery costs low for everyone.",
      },
      {
        q: "How is the rider fee calculated?",
        a: "The rider fee is based on the largest item size in your cart — ₦500 for Small, ₦1,000 for Medium, and ₦1,500 for Large. If your cart has mixed sizes, the highest size applies.",
      },
    ],
  },
  {
    category: "Delivery",
    items: [
      {
        q: "How long does delivery take?",
        a: "Delivery times vary by business and your location. Estimated delivery time is shown on each business page. Most orders arrive within 30–60 minutes.",
      },
      {
        q: "What happens if my order is late?",
        a: "If your order is significantly delayed, you'll receive a notification. You can also contact support via the form below and we'll look into it right away.",
      },
    ],
  },
  {
    category: "Account",
    items: [
      {
        q: "How do I update my delivery address?",
        a: "Go to My Account → Saved Addresses to add, edit, or remove delivery addresses.",
      },
      {
        q: "How do I delete my account?",
        a: "Go to My Account → scroll to the bottom → tap Delete Account. Please note this action is permanent and cannot be undone.",
      },
    ],
  },
];

// ── FAQ Item ──────────────────────────────────────────────────────────────────
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 py-4 text-left group"
      >
        <span className={`text-sm font-semibold transition-colors ${open ? "text-orange-500" : "text-gray-800 group-hover:text-orange-500"}`}>
          {q}
        </span>
        <span className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180 text-orange-400" : ""}`}>
          <IconChevronDown size={16} />
        </span>
      </button>
      {open && (
        <p className="text-sm text-gray-500 leading-relaxed pb-4 pr-6">{a}</p>
      )}
    </div>
  );
};

// ── Support Page ──────────────────────────────────────────────────────────────
export default function SupportPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.subject || !form.message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full">

      {/* HERO */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-8 px-4 sm:px-6">
        <h1 className="text-xl sm:text-3xl font-extrabold text-white mb-1">Support 🎧</h1>
        <p className="text-orange-100 text-sm">Find answers to common questions or reach out to our team.</p>
      </div>

      <div className="px-4 sm:px-6 py-8 max-w-3xl mx-auto space-y-8">

        {/* FAQs */}
        <div>
          <h2 className="text-lg font-extrabold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((section) => (
              <div key={section.category} className="bg-white rounded-2xl border border-gray-100 px-4 sm:px-5">
                <div className="py-3 border-b border-gray-100">
                  <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">{section.category}</span>
                </div>
                {section.items.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-lg font-extrabold text-gray-900 mb-4">Contact Us</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-4">
                  <IconCheck size={28} />
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-1">Message sent!</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  Thanks for reaching out. Our support team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-5 px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="e.g. My order hasn't arrived"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe your issue in detail..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all resize-none"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !form.name || !form.email || !form.subject || !form.message}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-bold rounded-xl transition-all duration-200"
                >
                  {loading ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : (
                    <IconSend size={15} />
                  )}
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}