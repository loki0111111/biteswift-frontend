import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const BASE_URL = "https://biteswift-qw3s.onrender.com";

const IconEye = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const IconCheck = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconLock = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconBank = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="16" />
    <line x1="10" y1="14" x2="14" y2="14" />
  </svg>
);

export default function SetupPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("verifying"); // verifying | valid | invalid | success
  const [step, setStep] = useState(1); // 1 = password, 2 = bank details
  const [authToken, setAuthToken] = useState(null); // JWT after password setup

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [businessName, setBusinessName] = useState("");

  // Bank details state
  const [banks, setBanks] = useState([]);
  const [bankDetails, setBankDetails] = useState({
    bankAccountNumber: "",
    bankCode: "",
    bankName: "",
    accountName: "",
  });
  const [resolving, setResolving] = useState(false);
  const [savingBank, setSavingBank] = useState(false);
  const [bankError, setBankError] = useState(null);

  // Verify token on page load
  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    const verifyToken = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/auth/verify-token/${token}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setBusinessName(data.restaurantName);
        setStatus("valid");
      } catch (err) {
        setStatus("invalid");
      }
    };
    verifyToken();
  }, [token]);

  // Fetch banks list when moving to step 2
  useEffect(() => {
    if (step === 2 && authToken) {
      const fetchBanks = async () => {
        try {
          const res = await fetch(`${BASE_URL}/api/wallet/banks`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          const json = await res.json();
          setBanks(json.data || []);
        } catch (err) {
          console.error("Could not load banks");
        }
      };
      fetchBanks();
    }
  }, [step, authToken]);

  const validate = () => {
    const newErrors = {};
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
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
      const response = await fetch(`${BASE_URL}/api/auth/setup-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: form.password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Save token if returned so we can call protected endpoints in step 2
      if (data.token) {
        setAuthToken(data.token);
      }

      // Move to bank details step
      setStep(2);
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  const resolveAccount = async (accountNumber, bankCode) => {
    if (accountNumber.length !== 10 || !bankCode || !authToken) return;
    setResolving(true);
    setBankError(null);
    try {
      const res = await fetch(
        `${BASE_URL}/api/wallet/resolve-account?account_number=${accountNumber}&bank_code=${bankCode}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setBankDetails((prev) => ({ ...prev, accountName: json.data.account_name }));
    } catch (err) {
      setBankError("Could not verify account. Check the details and try again.");
      setBankDetails((prev) => ({ ...prev, accountName: "" }));
    } finally {
      setResolving(false);
    }
  };

  const handleAccountNumberChange = (accountNumber) => {
    setBankDetails((prev) => ({ ...prev, bankAccountNumber: accountNumber, accountName: "" }));
    if (accountNumber.length === 10 && bankDetails.bankCode) {
      resolveAccount(accountNumber, bankDetails.bankCode);
    }
  };

  const handleBankChange = (bankCode) => {
    const selectedBank = banks.find((b) => b.code === bankCode);
    setBankDetails((prev) => ({
      ...prev,
      bankCode,
      bankName: selectedBank?.name || "",
      accountName: "",
    }));
    if (bankDetails.bankAccountNumber.length === 10) {
      resolveAccount(bankDetails.bankAccountNumber, bankCode);
    }
  };

  const handleSaveBankDetails = async () => {
    if (!bankDetails.bankCode || !bankDetails.bankAccountNumber || !bankDetails.accountName) {
      setBankError("Please complete all bank details and verify your account first.");
      return;
    }
    if (!authToken) {
      setBankError("Session expired. Please log in and add bank details from Settings.");
      return;
    }
    setSavingBank(true);
    setBankError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/wallet/save-bank-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(bankDetails),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setStatus("success");
    } catch (err) {
      setBankError(err.message || "Failed to save bank details. You can add them later in Settings.");
    } finally {
      setSavingBank(false);
    }
  };

  const handleSkipBank = () => {
    setStatus("success");
  };

  // Password strength
  const getStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getStrength(form.password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"][strength];

  // ── Verifying State ──
  if (status === "verifying") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Verifying your link...</p>
        </div>
      </div>
    );
  }

  // ── Invalid Token State ──
  if (status === "invalid") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
            <span className="text-red-500 text-2xl">✕</span>
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-2">Link Invalid or Expired</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            This setup link is either invalid or has expired. Please contact BiteSwift support to get a new link.
          </p>
          <a
            href="/contact"
            className="inline-block mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm transition-all"
          >
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  // ── Success State ──
  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5 text-green-500">
            <IconCheck size={32} />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-2">Account Ready! 🎉</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Your account has been set up. You can now log in to your BiteSwift dashboard.
            {!authToken && " You can add your bank details anytime from Settings."}
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ── Main Form ──
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">BiteSwift</span>
          </a>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`flex items-center gap-2 flex-1`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"}`}>
              {step > 1 ? <IconCheck size={14} /> : "1"}
            </div>
            <span className={`text-xs font-semibold ${step === 1 ? "text-gray-800" : "text-gray-400"}`}>Set Password</span>
          </div>
          <div className="h-px flex-1 bg-gray-200" />
          <div className="flex items-center gap-2 flex-1 justify-end">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"}`}>
              2
            </div>
            <span className={`text-xs font-semibold ${step === 2 ? "text-gray-800" : "text-gray-400"}`}>Bank Details</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

          {/* ── STEP 1: Set Password ── */}
          {step === 1 && (
            <>
              <div className="mb-7">
                <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Set your password</h1>
                <p className="text-gray-500 text-sm">
                  Welcome, <span className="text-orange-500 font-semibold">{businessName}</span>! Create a secure password for your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <IconLock size={16} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Min. 8 characters"
                      className={`w-full pl-10 pr-12 py-3.5 rounded-xl border text-gray-900 text-sm placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                        errors.password ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}

                  {form.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : "bg-gray-200"}`} />
                        ))}
                      </div>
                      <p className="text-xs text-gray-400">
                        Strength: <span className="font-medium text-gray-600">{strengthLabel}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <IconLock size={16} />
                    </div>
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      placeholder="Re-enter your password"
                      className={`w-full pl-10 pr-12 py-3.5 rounded-xl border text-gray-900 text-sm placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                        errors.confirmPassword ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                {errors.general && (
                  <p className="text-red-500 text-sm text-center bg-red-50 py-3 rounded-xl border border-red-100">
                    {errors.general}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-4 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-orange-200"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Setting up your account...
                    </>
                  ) : (
                    "Set Password & Continue"
                  )}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 2: Bank Details ── */}
          {step === 2 && (
            <>
              <div className="mb-7">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
                  <IconBank size={20} className="text-orange-500" />
                </div>
                <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Add bank details</h1>
                <p className="text-gray-500 text-sm">
                  Add your bank account so payments go directly to you. You can also do this later from Settings.
                </p>
              </div>

              <div className="space-y-4">
                {/* Bank Selector */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Select Bank</label>
                  <select
                    value={bankDetails.bankCode}
                    onChange={(e) => handleBankChange(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-200 bg-gray-50 rounded-xl text-sm text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 appearance-none"
                  >
                    <option value="">-- Select your bank --</option>
                    {banks.map((bank) => (
                      <option key={bank.code} value={bank.code}>{bank.name}</option>
                    ))}
                  </select>
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="Enter 10-digit account number"
                    value={bankDetails.bankAccountNumber}
                    onChange={(e) => handleAccountNumberChange(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-3 py-3 border border-gray-200 bg-gray-50 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                {/* Account Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Account Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      placeholder={resolving ? "Verifying account..." : "Will appear automatically"}
                      value={bankDetails.accountName}
                      className="w-full px-3 py-3 border border-gray-200 bg-gray-50 rounded-xl text-sm text-gray-700 outline-none"
                    />
                    {resolving && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-orange-400/30 border-t-orange-400 rounded-full animate-spin" />
                    )}
                  </div>
                  {bankDetails.accountName && !resolving && (
                    <p className="text-xs text-green-600 mt-1 font-medium">✓ Account verified — {bankDetails.accountName}</p>
                  )}
                </div>

                {bankError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl">
                    {bankError}
                  </div>
                )}

                {/* No token warning */}
                {!authToken && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs px-4 py-3 rounded-xl">
                    Your session token wasn't returned. Please log in first, then add bank details from Settings.
                  </div>
                )}

                <button
                  onClick={handleSaveBankDetails}
                  disabled={savingBank || resolving || !bankDetails.accountName || !authToken}
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-4 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-orange-200"
                >
                  {savingBank ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Bank Details & Finish"
                  )}
                </button>

                <button
                  onClick={handleSkipBank}
                  className="w-full py-3 text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
                >
                  Skip for now — I'll add this in Settings later
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}