import { useState, useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';

const BASE_URL = "https://biteswift-qw3s.onrender.com";

const IconZap = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IconTruck = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const IconChart = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);
const IconShield = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconStar = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconMenu = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const IconX = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconCheck = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconArrow = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconShoppingBag = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const IconMapPin = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconCreditCard = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const DashboardMockup = () => (
  <div className="relative w-full max-w-2xl mx-auto">
    <div className="absolute inset-0 bg-orange-400 opacity-20 blur-3xl rounded-3xl" />
    <div className="relative bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <div className="flex-1 mx-4 bg-gray-700 rounded-md h-5 flex items-center px-3">
          <span className="text-gray-400 text-xs">app.biteswift.com</span>
        </div>
      </div>
      <div className="flex h-64">
        <div className="w-14 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 gap-4">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">B</span>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`w-6 h-1.5 rounded-full ${i === 0 ? "bg-orange-500" : "bg-gray-600"}`} />
          ))}
        </div>
        <div className="flex-1 p-4 bg-gray-900 min-w-0">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "Orders", value: "1,240", color: "bg-orange-500" },
              { label: "Delivered", value: "980", color: "bg-green-500" },
              { label: "Revenue", value: "N2.4M", color: "bg-blue-500" },
            ].map((card) => (
              <div key={card.label} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className={`w-4 h-1 rounded-full ${card.color} mb-2`} />
                <div className="text-white text-sm font-semibold">{card.value}</div>
                <div className="text-gray-400 text-xs">{card.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 mb-3">
            <div className="text-gray-400 text-xs mb-2">Orders this week</div>
            <div className="flex items-end gap-1 h-12">
              {[40, 65, 45, 80, 60, 90, 75].map((h, i) => (
                <div key={i} className={`flex-1 rounded-sm ${i === 5 ? "bg-orange-500" : "bg-gray-600"}`} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            {["Chicken Shawarma — Pending", "Jollof Rice — In Transit", "Peppered Goat — Delivered"].map((order, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-800 rounded px-3 py-1.5 border border-gray-700">
                <span className="text-gray-300 text-xs truncate mr-2">{order.split("—")[0]}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                  i === 0 ? "bg-yellow-500/20 text-yellow-400" :
                  i === 1 ? "bg-blue-500/20 text-blue-400" :
                  "bg-green-500/20 text-green-400"
                }`}>{order.split("—")[1].trim()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const businessFeatures = [
  { icon: <IconTruck size={28} />, title: "Real-Time Delivery Tracking", desc: "Monitor every order from your store to the customer's door. Full visibility, zero guesswork." },
  { icon: <IconChart size={28} />, title: "Powerful Analytics", desc: "Understand your best-selling items, peak hours, and revenue trends with an intuitive dashboard." },
  { icon: <IconZap size={28} />, title: "Instant Order Management", desc: "Receive, process, and assign orders in seconds. Never miss an order or keep a customer waiting." },
  { icon: <IconShield size={28} />, title: "Secure Payouts", desc: "Your earnings land in your wallet automatically after every delivery. Fast, safe, and reliable." },
];

const customerFeatures = [
  { icon: <IconShoppingBag size={28} />, title: "Browse & Order Easily", desc: "Discover restaurants, grocery stores, pharmacies and more all in one app. Order in seconds." },
  { icon: <IconMapPin size={28} />, title: "Track Your Delivery", desc: "Know exactly where your order is at every step. Real-time updates from store to your doorstep." },
  { icon: <IconCreditCard size={28} />, title: "Safe & Secure Payments", desc: "Pay securely with your card or bank transfer via Paystack. Your money is always protected." },
  { icon: <IconStar size={28} />, title: "Wide Variety of Stores", desc: "From food to fashion, electronics to beauty BiteSwift connects you to the best local businesses." },
];

const businessSteps = [
  { number: "01", title: "Reach Out to Us", desc: "Fill out our partner form with your business details. Our team reviews and contacts you within 24 to 48 hours." },
  { number: "02", title: "We Set Up Your Account", desc: "BiteSwift creates your dashboard account and sends your login credentials directly to your email." },
  { number: "03", title: "Go Live and Start Earning", desc: "Log in, upload your menu, and start receiving orders from customers on BiteSwift right away." },
];

const customerSteps = [
  { number: "01", title: "Create an Account", desc: "Sign up in seconds with your email. No long forms, no stress just quick and easy registration." },
  { number: "02", title: "Browse and Add to Cart", desc: "Explore businesses near you, browse their products, and add your favourites to your cart." },
  { number: "03", title: "Pay and Track Your Order", desc: "Pay securely and watch your order get delivered in real-time. It's that simple." },
];

const testimonials = [
  { name: "Adaeze Okafor", role: "Owner, Mama Ada's Kitchen", text: "BiteSwift doubled our daily orders in just 3 weeks. The dashboard is so easy to use and our delivery times improved massively.", rating: 5, type: "business" },
  { name: "Chidi Eze", role: "Customer, Enugu", text: "I ordered lunch and it arrived in 25 minutes. The tracking was accurate and payment was super smooth. I use BiteSwift every day now.", rating: 5, type: "customer" },
  { name: "Fatima Bello", role: "Founder, Taste of Arewa", text: "The analytics alone are worth it. I now know exactly what to stock and when to run promotions.", rating: 5, type: "business" },
  { name: "Blessing Okonkwo", role: "Customer, Lagos", text: "Finally an app that actually works. I've ordered from 5 different stores and every delivery was on time. Love it!", rating: 5, type: "customer" },
  { name: "Emeka Nwosu", role: "Manager, Spice House Lagos", text: "Real-time tracking and instant payouts exactly what we needed. Our customers keep coming back.", rating: 5, type: "business" },
  { name: "Amina Yusuf", role: "Customer, Abuja", text: "BiteSwift has everything food, groceries, beauty products. I don't need any other delivery app.", rating: 5, type: "customer" },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("customer");
  const [businessCount, setBusinessCount] = useState(undefined);
  const [orderCount, setOrderCount] = useState(undefined);


  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    // Fetch real business count
    const fetchStats = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/public/stats`);
        if (!res.ok) return;
        const data = await res.json();
        setBusinessCount(data.businessCount ?? null);
        setOrderCount(data.orderCount ?? null);
      } catch {
        // silently fail
      }
    };
    fetchStats();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    { value: businessCount === undefined ? "..." : `${businessCount}+`, label: "Business Partners" },
    { value: orderCount === undefined ? "..." : `${orderCount.toLocaleString()}+`, label: "Orders Delivered" },
    { value: "98%", label: "Delivery Success Rate" },
    { value: "4.9★", label: "Average Rating" },
  ];
  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900">BiteSwift</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Features", "How It Works", "Testimonials"].map((link) => (
              <a key={link} href={`#${link.toLowerCase().replace(/ /g, "-")}`} className="text-gray-600 hover:text-orange-500 transition-colors text-sm font-medium">{link}</a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <a href="/login" className="text-gray-700 hover:text-orange-500 text-sm font-medium transition-colors">Partner Login</a>
            <a href="/customer/browse" className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 hover:scale-105">Order Now</a>
            <a href="/contact" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 hover:scale-105">Partner With Us</a>
          </div>
          <button className="md:hidden text-gray-700 flex-shrink-0" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
            {["Features", "How It Works", "Testimonials"].map((link) => (
              <a key={link} href={`#${link.toLowerCase().replace(/ /g, "-")}`} className="text-gray-600 text-sm font-medium" onClick={() => setMenuOpen(false)}>{link}</a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              <a href="/login" className="text-gray-700 text-sm font-medium text-center py-2">Partner Login</a>
              <a href="/customer/browse" className="bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl text-center">Order Now</a>
              <a href="/contact" className="bg-orange-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl text-center">Partner With Us</a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full opacity-50 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-200 rounded-full opacity-30 blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left w-full" data-aos="fade-right">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                <IconZap size={14} />
                <span>Nigeria's Fastest Growing Marketplace Platform</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Order Anything.{" "}<span className="text-orange-500">Delivered Swift.</span>
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                BiteSwift connects customers to their favourite local businesses food, groceries, fashion, electronics and more. Order in seconds, track in real-time.
              </p>
              <div className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start">
                {["Free to sign up", "Fast delivery", "Secure payments"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-gray-600 text-sm">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600"><IconCheck size={12} /></div>
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="/customer/register" className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-orange-200">
                  Start Ordering <IconArrow size={18} />
                </a>
                <a href="/contact" className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg">
                  List Your Business <IconArrow size={18} />
                </a>
                <a href="#how-it-works" className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-orange-300 text-gray-700 font-semibold px-8 py-4 rounded-xl transition-all duration-200">
                  See How It Works
                </a>
              </div>
            </div>
            <div className="flex-1 w-full max-w-2xl mx-auto lg:mx-0" data-aos="fade-left"><DashboardMockup /></div>
          </div>

          {/* STATS — now using real business count */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <div key={stat.label} data-aos="fade-up" data-aos-delay={i * 100} className="text-center p-4 sm:p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="text-2xl sm:text-3xl font-extrabold text-orange-500 mb-1">{stat.value}</div>
                <div className="text-gray-500 text-xs sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">Features</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">Built for everyone</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">Whether you're a customer looking for fast delivery or a business ready to grow BiteSwift has you covered.</p>
          </div>

          {/* Tab toggle */}
          <div className="flex justify-center mb-10">
            <div className="flex bg-gray-100 rounded-2xl p-1 gap-1">
              <button
                onClick={() => setActiveTab("customer")}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === "customer" ? "bg-orange-500 text-white shadow-md" : "text-gray-500 hover:text-gray-800"}`}
              >
                🛍️ For Customers
              </button>
              <button
                onClick={() => setActiveTab("business")}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === "business" ? "bg-orange-500 text-white shadow-md" : "text-gray-500 hover:text-gray-800"}`}
              >
                🏪 For Businesses
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(activeTab === "customer" ? customerFeatures : businessFeatures).map((f, i) => (
              <div key={f.title} data-aos="fade-up" data-aos-delay={i * 100} className="group p-6 rounded-2xl border border-gray-100 bg-white hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center text-orange-500 mb-5 transition-colors duration-300">{f.icon}</div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <span className="text-orange-400 font-semibold text-sm uppercase tracking-widest">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">Simple for everyone</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">Getting started on BiteSwift takes just a few steps whether you're ordering or listing your business.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Customer Side */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white text-lg">🛍️</div>
                <h3 className="text-white font-bold text-xl">For Customers</h3>
              </div>
              <div className="space-y-4 flex-1">
                {customerSteps.map((step, i) => (
                  <div key={step.number} data-aos="fade-right" data-aos-delay={i * 150} className="flex gap-5 p-5 sm:p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-orange-500/30 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/30">
                      <span className="text-white font-extrabold text-sm">{step.number}</span>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base mb-1">{step.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <a href="/customer/register" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105">
                  Start Ordering <IconArrow size={16} />
                </a>
              </div>
            </div>

            {/* Business Side */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-white text-lg">🏪</div>
                <h3 className="text-white font-bold text-xl">For Business Owners</h3>
              </div>
              <div className="space-y-4 flex-1">
                {businessSteps.map((step, i) => (
                  <div key={step.number} data-aos="fade-left" data-aos-delay={i * 150} className="flex gap-5 p-5 sm:p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-orange-500/30 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-extrabold text-sm">{step.number}</span>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base mb-1">{step.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <a href="/contact" className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105">
                  List Your Business <IconArrow size={16} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-16 sm:py-24 px-4 sm:px-6 bg-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">Loved by customers and businesses</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">Real stories from people using BiteSwift every day.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={t.name} data-aos="zoom-in" data-aos-delay={i * 100} className="bg-white p-6 sm:p-8 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 text-orange-400">{[...Array(t.rating)].map((_, i) => <IconStar key={i} />)}</div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${t.type === "business" ? "bg-gray-100 text-gray-600" : "bg-orange-100 text-orange-600"}`}>
                    {t.type === "business" ? "🏪 Business" : "🛍️ Customer"}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm flex-shrink-0">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <div className="text-gray-900 font-semibold text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs truncate">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Customer CTA */}
            <div data-aos="fade-right" className="bg-orange-500 rounded-3xl p-8 sm:p-10 text-center">
              <div className="text-5xl mb-4">🛍️</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Ready to order?</h2>
              <p className="text-orange-100 text-sm mb-8 max-w-xs mx-auto">
                Sign up free and start ordering from hundreds of local businesses near you.
              </p>
              <a href="/customer/register" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-orange-500 font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg">
                Create Account <IconArrow size={18} />
              </a>
              <p className="text-orange-200 text-xs mt-4">Already have an account? <a href="/customer/login" className="underline font-semibold">Log in</a></p>
            </div>

            {/* Business CTA */}
            <div data-aos="fade-left" className="bg-gray-800 rounded-3xl p-8 sm:p-10 text-center border border-gray-700">
              <div className="text-5xl mb-4">🏪</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Own a business?</h2>
              <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto">
                Join {businessCount !== null ? `${businessCount}+` : "500+"} businesses already growing with BiteSwift. We'll set everything up for you.
              </p>
              <a href="/contact" className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-orange-500/30">
                List Your Business <IconArrow size={18} />
              </a>
              <p className="text-gray-500 text-xs mt-4">Already a partner? <a href="/login" className="underline font-semibold text-gray-400">Partner Login</a></p>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 text-gray-400 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-1 sm:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="text-xl font-bold text-white">BiteSwift</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">Nigeria's fastest growing marketplace. Connecting customers to local businesses — fast, easy, and reliable.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Platform</h4>
              <ul className="space-y-3">
                {[
                  { label: "Order Now", href: "/customer/browse" },
                  { label: "Customer Login", href: "/customer/login" },
                  { label: "Partner Login", href: "/login" },
                  { label: "List Your Business", href: "/contact" },
                ].map(link => (
                  <li key={link.label}>
                    <a href={link.href} className="text-gray-500 hover:text-orange-400 text-sm transition-colors">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-3">
                {["About Us", "Contact", "Privacy Policy", "Terms of Service"].map(link => (
                  <li key={link}><a href="#" className="text-gray-500 hover:text-orange-400 text-sm transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">© 2025 BiteSwift. All rights reserved.</p>
            <p className="text-gray-600 text-sm">Built with ❤️ for Nigerian businesses and customers</p>
          </div>
        </div>
      </footer>
    </div>
  );
}