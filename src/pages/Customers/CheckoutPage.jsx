import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const IconArrowLeft = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const IconMapPin = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconPhone = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const IconCreditCard = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);
const IconBank = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="21" y2="22" />
    <line x1="6" y1="18" x2="6" y2="11" /><line x1="10" y1="18" x2="10" y2="11" />
    <line x1="14" y1="18" x2="14" y2="11" /><line x1="18" y1="18" x2="18" y2="11" />
    <polygon points="12 2 20 7 4 7" />
  </svg>
);
const IconCheck = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconArrow = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconInfo = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const categoryBg = {
  food: "bg-orange-50", grocery: "bg-green-50", pharmacy: "bg-blue-50",
  fashion: "bg-pink-50", electronics: "bg-purple-50", beauty: "bg-rose-50",
};
const sizeColors = {
  small: "bg-green-100 text-green-600",
  medium: "bg-blue-100 text-blue-600",
  large: "bg-purple-100 text-purple-600",
};
const sizeLabels = { small: "Small", medium: "Medium", large: "Large" };
const formatPrice = (price) => `₦${price.toLocaleString()}`;

export default function CheckoutPage({ onClearCart }) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    cartItems = [],
    subtotal = 0,
    riderFee = 0,
    serviceFee = 0,
    total = 0,
    highestSize = "small",
  } = location.state || {};

  const [form, setForm] = useState({ address: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [showFeeInfo, setShowFeeInfo] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("https://biteswift-qw3s.onrender.com/api/customers/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("customerToken")}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        const profile = data.data || data.customer || data;
        setCustomerProfile(profile);
        if (profile?.phone) {
          setForm((prev) => ({ ...prev, phone: profile.phone }));
        }
      } catch (_) {
        // silent - profile pre-fill is optional
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.address.trim()) newErrors.address = "Delivery address is required";
    else if (form.address.trim().length < 10) newErrors.address = "Please enter a full address";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^(\+?234|0)[789]\d{9}$/.test(form.phone.replace(/\s/g, "")))
      newErrors.phone = "Enter a valid Nigerian phone number";
    return newErrors;
  };

  const handlePlaceOrder = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    if (!cartItems.length) { setErrors({ general: "Your cart is empty." }); return; }

    setLoading(true);

    try {
      const token = localStorage.getItem("customerToken");
      const businessId = cartItems[0]?.businessId;

      const orderRes = await fetch("https://biteswift-qw3s.onrender.com/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessId,
          customerName: customerProfile?.name || "Customer",
          customerPhone: form.phone,
          deliveryAddress: form.address,
          size: highestSize.charAt(0).toUpperCase() + highestSize.slice(1),
          items: cartItems.map((item) => ({
            productId: item.id || item._id,
            name: item.name,
            price: item.price,
            quantity: item.qty,
          })),
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || "Failed to place order");

      const orderId = orderData.data._id;
      const totalAmount = orderData.data.totalAmount;

      localStorage.setItem("pendingOrderId", orderId);

      if (!customerProfile?.email) {
        throw new Error("Could not load your profile. Please refresh and try again.");
      }

      const payRes = await fetch("https://biteswift-qw3s.onrender.com/api/wallet/initialize-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: customerProfile.email,
          amount: totalAmount,
          orderId,
          businessId,
        }),
      });

      const payData = await payRes.json();
      if (!payRes.ok) throw new Error(payData.message || "Failed to initialize payment");

      if (onClearCart) onClearCart();
      window.location.href = payData.data.authorization_url;

    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full pl-11 pr-4 py-3 rounded-xl border text-gray-900 text-sm placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
      errors[field] ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
    }`;

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Fee Info Modal */}
      {showFeeInfo && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFeeInfo(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <p className="font-bold text-gray-900">How fees are calculated</p>
                <p className="text-xs text-gray-400 mt-0.5">Understanding your order total</p>
              </div>
              <button
                onClick={() => setShowFeeInfo(false)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Product price */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-800 mb-1">Product price</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                The actual cost of your items, set by the business.
              </p>
            </div>

            {/* Rider fee */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <p className="text-sm font-semibold text-gray-800">Rider fee</p>
                <div className="flex gap-1 flex-wrap">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Small ₦500</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Medium ₦1,000</span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Large ₦1,500</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Based on the largest item size in your cart. One rider delivers all your items from the same business.
              </p>
            </div>

            {/* Service fee */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-gray-800">Service fee</p>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Flat ₦600</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                A fixed platform fee that keeps BiteSwift running and your payments secure.
              </p>
            </div>

            {/* Multi-business warning */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-orange-700 mb-1">Ordering from multiple businesses?</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Each business sends its own rider, so a separate rider fee applies per business. For lower fees, place orders from one business at a time.
              </p>
            </div>

            <p className="text-xs text-gray-400 text-center pt-2 border-t border-gray-100">
              Payments are processed securely via Paystack.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/customer/cart")}
            className="flex items-center gap-1.5 text-gray-500 hover:text-orange-500 transition-colors text-sm font-medium"
          >
            <IconArrowLeft size={16} /> Back to Cart
          </button>
          <div className="w-px h-4 bg-gray-200" />
          <h1 className="text-lg font-extrabold text-gray-900">Checkout</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left: Form */}
          <div className="flex-1 space-y-5">

            {/* Delivery Details */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="text-gray-900 font-extrabold text-base mb-4">Delivery Details</h2>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Address</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><IconMapPin size={16} /></div>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="e.g. 12 Adeola Odeku Street, Victoria Island, Lagos"
                    className={inputClass("address")}
                  />
                </div>
                {errors.address && <p className="text-red-500 text-xs mt-1.5">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><IconPhone size={16} /></div>
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
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="text-gray-900 font-extrabold text-base mb-4">Payment Method</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "card", label: "Debit Card", icon: <IconCreditCard size={18} /> },
                  { id: "transfer", label: "Bank Transfer", icon: <IconBank size={18} /> },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                      paymentMethod === method.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      paymentMethod === method.id ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500"
                    }`}>
                      {method.icon}
                    </div>
                    <span className={`text-sm font-bold ${paymentMethod === method.id ? "text-orange-500" : "text-gray-600"}`}>
                      {method.label}
                    </span>
                    {paymentMethod === method.id && (
                      <span className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white">
                        <IconCheck size={12} />
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-blue-700 text-xs font-semibold mb-1">🔒 Secured by Paystack</p>
                <p className="text-gray-500 text-xs">You'll be redirected to Paystack to complete your payment securely. Do not close the tab during payment.</p>
              </div>
            </div>

            {errors.general && (
              <p className="text-red-500 text-sm text-center bg-red-50 py-3 rounded-xl border border-red-100">
                {errors.general}
              </p>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-4">
              <h2 className="text-gray-900 font-extrabold text-base mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${categoryBg[item.category?.toLowerCase()] || "bg-gray-50"} flex items-center justify-center text-xl flex-shrink-0 overflow-hidden`}>
                      {item.image
                        ? <img src={`https://biteswift-qw3s.onrender.com${item.image}`} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                        : item.emoji || "📦"
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 text-xs font-semibold line-clamp-1">{item.name}</p>
                      <p className="text-gray-400 text-xs">x{item.qty}</p>
                    </div>
                    <span className="text-gray-900 text-xs font-bold flex-shrink-0">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-2 border-t border-gray-100 pt-4 mb-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Product price</span>
                  <span className="text-gray-900 font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500">Rider fee</span>
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${sizeColors[highestSize]}`}>
                      {sizeLabels[highestSize]}
                    </span>
                  </div>
                  <span className="text-gray-900 font-semibold">{formatPrice(riderFee)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Service fee</span>
                  <span className="text-gray-900 font-semibold">{formatPrice(serviceFee)}</span>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-extrabold">Total</span>
                  <span className="text-orange-500 font-extrabold text-lg">{formatPrice(total)}</span>
                </div>

                {/* Fee info trigger */}
                <button
                  onClick={() => setShowFeeInfo(true)}
                  className="flex items-center gap-1 text-orange-500 hover:text-orange-600 text-xs font-semibold mt-1 transition-colors"
                >
                  <IconInfo size={12} />
                  How fees are calculated
                </button>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-200"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Pay {formatPrice(total)} <IconArrow size={18} /></>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-3">
                By placing this order you agree to our Terms of Service
              </p>
            </div>
          </div> 

        </div>
      </div>
    </div>
  );
}