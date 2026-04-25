import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconCheck = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconX = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconArrow = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

// ── Payment Callback Page ─────────────────────────────────────────────────────
export default function PaymentCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "failed"
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Step 1 — Extract reference from URL query params
        const reference = new URLSearchParams(window.location.search).get("reference");
        if (!reference) throw new Error("No payment reference found.");

        // Step 2 — Get orderId from localStorage
        const orderId = localStorage.getItem("pendingOrderId");
        if (!orderId) throw new Error("No pending order found.");

        // Step 3 — Verify payment with backend
        const res = await fetch("https://biteswift-qw3s.onrender.com/api/wallet/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("customerToken")}`,
          },
          body: JSON.stringify({ reference, orderId }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Payment verification failed.");

        // Step 4 — Clean up localStorage
        localStorage.removeItem("pendingOrderId");

        setStatus("success");
      } catch (err) {
        setErrorMessage(err.message);
        setStatus("failed");
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-12 max-w-md w-full text-center">

        {/* Verifying */}
        {status === "verifying" && (
          <>
            <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-6">
              <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Verifying payment...</h2>
            <p className="text-gray-400 text-sm">Please wait while we confirm your payment. Do not close this tab.</p>
          </>
        )}

        {/* Success */}
        {status === "success" && (
          <>
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 text-green-500">
              <IconCheck size={40} />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Payment successful! 🎉</h2>
            <p className="text-gray-500 text-sm mb-8">
              Your order has been placed and payment confirmed. You can track your order in real-time.
            </p>
            <button
              onClick={() => navigate("/customer/orders")}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-orange-200 mb-3"
            >
              Track My Order <IconArrow size={18} />
            </button>
            <button
              onClick={() => navigate("/customer/browse")}
              className="w-full py-3 text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors"
            >
              Continue Shopping
            </button>
          </>
        )}

        {/* Failed */}
        {status === "failed" && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6 text-red-500">
              <IconX size={40} />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Payment failed</h2>
            <p className="text-gray-500 text-sm mb-2">
              We couldn't verify your payment. Please try again or contact support.
            </p>
            {errorMessage && (
              <p className="text-red-400 text-xs mb-8 bg-red-50 py-2 px-3 rounded-xl border border-red-100">
                {errorMessage}
              </p>
            )}
            <button
              onClick={() => navigate("/customer/cart")}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-orange-200 mb-3"
            >
              Back to Cart <IconArrow size={18} />
            </button>
            <button
              onClick={() => navigate("/customer/support")}
              className="w-full py-3 text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors"
            >
              Contact Support
            </button>
          </>
        )}

      </div>
    </div>
  );
}