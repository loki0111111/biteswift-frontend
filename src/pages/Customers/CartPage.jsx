import { useNavigate } from "react-router-dom";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconTrash = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const IconPlus = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconMinus = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconArrowLeft = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const IconArrow = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconShoppingBag = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

// ── Pricing ───────────────────────────────────────────────────────────────────
const RIDER_FEE = { small: 500, medium: 1000, large: 1500 };
const SERVICE_FEE = 600;

const getHighestSize = (items) => {
  if (items.some(i => i.size === "large")) return "large";
  if (items.some(i => i.size === "medium")) return "medium";
  return "small";
};

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

// ── Cart Page ─────────────────────────────────────────────────────────────────
export default function CartPage({ cartItems = [], onUpdateCart, onClearCart }) {
  const navigate = useNavigate();

  const updateQty = (id, delta) => {
    if (!onUpdateCart) return;
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    const newQty = item.qty + delta;
    if (newQty <= 0) {
      onUpdateCart(cartItems.filter(i => i.id !== id));
    } else {
      onUpdateCart(cartItems.map(i => i.id === id ? { ...i, qty: newQty } : i));
    }
  };

  const removeItem = (id) => {
    if (onUpdateCart) onUpdateCart(cartItems.filter(i => i.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const highestSize = getHighestSize(cartItems);
  const riderFee = cartItems.length > 0 ? RIDER_FEE[highestSize] : 0;
  const serviceFee = cartItems.length > 0 ? SERVICE_FEE : 0;
  const total = subtotal + riderFee + serviceFee;

  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-gray-300 mb-4"><IconShoppingBag size={64} /></div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 text-sm mb-8">Add items from businesses to get started</p>
        <button
          onClick={() => navigate("/customer/browse")}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
        >
          <IconArrowLeft size={18} /> Browse Businesses
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/customer/browse")}
            className="flex items-center gap-1.5 text-gray-500 hover:text-orange-500 transition-colors text-sm font-medium"
          >
            <IconArrowLeft size={16} /> Back
          </button>
          <div className="w-px h-4 bg-gray-200" />
          <h1 className="text-lg font-extrabold text-gray-900">My Cart</h1>
          <span className="text-gray-400 text-sm">({cartItems.length} {cartItems.length === 1 ? "item" : "items"})</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Cart Items */}
          <div className="flex-1 space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl ${categoryBg[item.category] || "bg-gray-50"} flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0`}>
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-gray-900 font-bold text-sm line-clamp-1">{item.name}</h3>
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${sizeColors[item.size] || "bg-gray-100 text-gray-500"}`}>
                      {sizeLabels[item.size] || "S"}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5">{item.business}</p>
                  <p className="text-orange-500 font-extrabold text-sm mt-1">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:border-orange-400 hover:text-orange-500 transition-colors"
                  >
                    <IconMinus size={13} />
                  </button>
                  <span className="text-gray-900 font-bold text-sm w-5 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="w-7 h-7 rounded-lg bg-orange-500 hover:bg-orange-600 flex items-center justify-center text-white transition-colors"
                  >
                    <IconPlus size={13} />
                  </button>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-gray-900 font-extrabold text-sm">{formatPrice(item.price * item.qty)}</span>
                  <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                    <IconTrash size={15} />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => onClearCart && onClearCart()}
              className="text-red-400 hover:text-red-500 text-xs font-medium transition-colors"
            >
              Clear cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-4">
              <h2 className="text-gray-900 font-extrabold text-base mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
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
              </div>

              <button
                onClick={() => navigate("/customer/checkout", {
                  state: { cartItems, subtotal, riderFee, serviceFee, total, highestSize }
                })}
                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-200"
              >
                Order Now <IconArrow size={18} />
              </button>

              <button
                onClick={() => navigate("/customer/browse")}
                className="w-full text-center text-gray-400 hover:text-orange-500 text-sm font-medium mt-3 transition-colors"
              >
                + Add more items
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}