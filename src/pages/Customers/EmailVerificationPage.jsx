import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconCheck = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconX = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconArrow = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

// ── States ────────────────────────────────────────────────────────────────────
const VerifyingState = () => (
  <div className="text-center">
    <div className="w-20 h-20 rounded-full bg-orange-50 border-2 border-orange-100 flex items-center justify-center mx-auto mb-6">
      <div className="w-8 h-8 rounded-full animate-spin" style={{ borderWidth: "3px", borderStyle: "solid", borderColor: "#fed7aa", borderTopColor: "#f97316" }} />
    </div>
    <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Verifying your email...</h1>
    <p className="text-gray-400 text-sm">Please wait while we confirm your account.</p>
  </div>
);

const SuccessState = ({ onGoToLogin }) => (
  <div className="text-center">
    <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center mx-auto mb-6 text-green-500">
      <IconCheck size={36} />
    </div>
    <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Email Verified!</h1>
    <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
      Your email has been verified successfully. You can now sign in to your BiteSwift account and start ordering.
    </p>
    <button
      onClick={onGoToLogin}
      className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-200 mx-auto"
    >
      Go to Login <IconArrow size={18} />
    </button>
  </div>
);

// Already verified — token is null because it was already used successfully
const AlreadyVerifiedState = ({ onGoToLogin }) => (
  <div className="text-center">
    <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center mx-auto mb-6 text-green-500">
      <IconCheck size={36} />
    </div>
    <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Already Verified!</h1>
    <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
      Your email is already verified. Go ahead and sign in to your BiteSwift account.
    </p>
    <button
      onClick={onGoToLogin}
      className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-200 mx-auto"
    >
      Go to Login <IconArrow size={18} />
    </button>
  </div>
);

const ErrorState = ({ message, onGoHome }) => (
  <div className="text-center">
    <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center mx-auto mb-6 text-red-500">
      <IconX size={36} />
    </div>
    <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Verification Failed</h1>
    <p className="text-gray-500 text-sm leading-relaxed mb-2 max-w-xs mx-auto">
      {message || "This verification link is invalid or has expired."}
    </p>
    <p className="text-gray-400 text-xs mb-8">Please register again to get a new verification link.</p>
    <button
      onClick={onGoHome}
      className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mx-auto"
    >
      Back to Home <IconArrow size={18} />
    </button>
  </div>
);

// ── Email Verification Page ───────────────────────────────────────────────────
export default function EmailVerificationPage() {
  const [status, setStatus] = useState("verifying"); // verifying | success | already_verified | error
  const [errorMessage, setErrorMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setErrorMessage("No verification token found in the link.");
      setStatus("error");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`https://biteswift-qw3s.onrender.com/api/customers/verify/${token}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          return;
        }

        // If token is invalid/expired, it could mean already verified
        // Check the message from the backend
        const msg = data.message?.toLowerCase() || "";
        if (msg.includes("invalid") || msg.includes("expired")) {
          // Token was cleared after first use — account is already verified
          setStatus("already_verified");
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        setErrorMessage(error.message);
        setStatus("error");
      }
    };

    verifyToken();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">

      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <span className="text-xl font-bold text-gray-900">BiteSwift</span>
        </div>

        {/* Dynamic state */}
        {status === "verifying" && <VerifyingState />}
        {status === "success" && <SuccessState onGoToLogin={() => navigate("/customer/login")} />}
        {status === "already_verified" && <AlreadyVerifiedState onGoToLogin={() => navigate("/customer/login")} />}
        {status === "error" && <ErrorState message={errorMessage} onGoHome={() => navigate("/")} />}
      </div>

      {/* Back to home */}
      <p className="text-center text-xs text-gray-400 mt-6">
        <a href="/" className="hover:text-gray-600 transition-colors">← Back to BiteSwift.com</a>
      </p>
    </div>
  );
}