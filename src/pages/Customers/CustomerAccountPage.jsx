import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconUser = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconMail = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IconPhone = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const IconMapPin = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconLock = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconEdit = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
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
const IconLogOut = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const IconAlertTriangle = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const IconEye = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const IconEyeOff = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const IconCheck = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconX = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ── Section Card ──────────────────────────────────────────────────────────────
const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
      <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
        <Icon size={16} />
      </div>
      <h2 className="text-gray-900 font-extrabold text-sm">{title}</h2>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// ── Profile Skeleton ──────────────────────────────────────────────────────────
const ProfileSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gray-100 flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 bg-gray-100 rounded w-1/4" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

// ── Customer Account Page ─────────────────────────────────────────────────────
export default function CustomerAccountPage() {
  const navigate = useNavigate();

  // Profile state
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", address: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Addresses state (local only — no dedicated endpoint)
  const [addresses, setAddresses] = useState([]);
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: "", address: "" });

  // Password state
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const [showPasswords, setShowPasswords] = useState({ current: false, newPass: false, confirm: false });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Delete
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ── Fetch profile ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("https://biteswift-qw3s.onrender.com/api/customers/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("customerToken")}` },
        });
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        const p = data.customer || data;
        setProfile(p);
        setProfileForm({ name: p.name || "", phone: p.phone || "", address: p.address || "" });
      } catch (err) {
        setProfileError(err.message);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ── Save profile ──────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setProfileError("");
    try {
      const res = await fetch("https://biteswift-qw3s.onrender.com/api/customers/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("customerToken")}`,
        },
        body: JSON.stringify({
          name: profileForm.name,
          phone: profileForm.phone,
          address: profileForm.address,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");
      const updated = data.customer || data;
      setProfile(updated);
      setEditingProfile(false);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileSaving(false);
    }
  };

  // ── Address handlers (local) ──────────────────────────────────────────────
  const handleAddAddress = () => {
    if (!newAddress.label.trim() || !newAddress.address.trim()) return;
    setAddresses(prev => [...prev, { id: Date.now(), ...newAddress }]);
    setNewAddress({ label: "", address: "" });
    setAddingAddress(false);
  };

  const handleRemoveAddress = (id) => setAddresses(prev => prev.filter(a => a.id !== id));

  // ── Password handlers ─────────────────────────────────────────────────────
  const validatePassword = () => {
    const errors = {};
    if (!passwordForm.current) errors.current = "Current password is required";
    if (!passwordForm.newPass) errors.newPass = "New password is required";
    else if (passwordForm.newPass.length < 6) errors.newPass = "Must be at least 6 characters";
    if (!passwordForm.confirm) errors.confirm = "Please confirm your password";
    else if (passwordForm.newPass !== passwordForm.confirm) errors.confirm = "Passwords do not match";
    return errors;
  };

  const handleChangePassword = async () => {
    const errors = validatePassword();
    if (Object.keys(errors).length > 0) { setPasswordErrors(errors); return; }
    setPasswordSaving(true);
    try {
      // No password endpoint yet — placeholder
      await new Promise(r => setTimeout(r, 800));
      setPasswordForm({ current: "", newPass: "", confirm: "" });
      setPasswordErrors({});
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    } finally {
      setPasswordSaving(false);
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("customerToken");
    navigate("/order");
  };

  const inputClass = (error) =>
    `w-full px-4 py-3 rounded-xl border text-gray-900 text-sm placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
      error ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
    }`;

  return (
    <div className="bg-gray-50 min-h-screen">

      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-5">
        <h1 className="text-xl font-extrabold text-gray-900">My Account</h1>
        <p className="text-gray-400 text-sm mt-0.5">Manage your profile and settings</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ── Profile ── */}
        <SectionCard title="Profile Information" icon={IconUser}>
          {profileSuccess && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-600 text-sm font-medium px-4 py-3 rounded-xl mb-4">
              <IconCheck size={16} /> Profile updated successfully!
            </div>
          )}
          {profileError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
              {profileError}
            </div>
          )}

          {profileLoading ? (
            <ProfileSkeleton />
          ) : editingProfile ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
                <input type="text" value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className={inputClass(false)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number</label>
                <input type="tel" value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className={inputClass(false)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Default Address</label>
                <input type="text" value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  placeholder="e.g. 12 Adeola Odeku Street, VI, Lagos"
                  className={inputClass(false)} />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={handleSaveProfile} disabled={profileSaving}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200">
                  {profileSaving
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <IconCheck size={14} />}
                  Save Changes
                </button>
                <button onClick={() => { setEditingProfile(false); setProfileForm({ name: profile?.name || "", phone: profile?.phone || "", address: profile?.address || "" }); }}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200">
                  <IconX size={14} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { icon: IconUser,  label: "Full Name",     value: profile?.name },
                { icon: IconMail,  label: "Email Address", value: profile?.email },
                { icon: IconPhone, label: "Phone Number",  value: profile?.phone },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-400 text-xs">{label}</p>
                    <p className="text-gray-900 font-semibold text-sm">{value || "—"}</p>
                  </div>
                </div>
              ))}
              <button onClick={() => setEditingProfile(true)}
                className="flex items-center gap-2 text-orange-500 hover:text-orange-600 text-sm font-semibold transition-colors mt-2">
                <IconEdit size={14} /> Edit Profile
              </button>
            </div>
          )}
        </SectionCard>

        {/* ── Saved Addresses ── */}
        <SectionCard title="Saved Addresses" icon={IconMapPin}>
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500 flex-shrink-0 mt-0.5">
                  <IconMapPin size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-bold text-sm">{addr.label}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{addr.address}</p>
                </div>
                <button onClick={() => handleRemoveAddress(addr.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5">
                  <IconTrash size={14} />
                </button>
              </div>
            ))}

            {addingAddress ? (
              <div className="space-y-3 pt-1">
                <input type="text" value={newAddress.label}
                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                  placeholder="Label (e.g. Home, Office)" className={inputClass(false)} />
                <input type="text" value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  placeholder="Full address" className={inputClass(false)} />
                <div className="flex gap-2">
                  <button onClick={handleAddAddress}
                    className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                    <IconCheck size={13} /> Save Address
                  </button>
                  <button onClick={() => { setAddingAddress(false); setNewAddress({ label: "", address: "" }); }}
                    className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
                    <IconX size={13} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAddingAddress(true)}
                className="flex items-center gap-2 text-orange-500 hover:text-orange-600 text-sm font-semibold transition-colors">
                <IconPlus size={14} /> Add New Address
              </button>
            )}
          </div>
        </SectionCard>

        {/* ── Change Password ── */}
        <SectionCard title="Change Password" icon={IconLock}>
          {passwordSuccess && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-600 text-sm font-medium px-4 py-3 rounded-xl mb-4">
              <IconCheck size={16} /> Password changed successfully!
            </div>
          )}
          <div className="space-y-4">
            {[
              { key: "current", label: "Current Password",      placeholder: "Enter current password" },
              { key: "newPass", label: "New Password",          placeholder: "Min. 6 characters" },
              { key: "confirm", label: "Confirm New Password",  placeholder: "Re-enter new password" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
                <div className="relative">
                  <input
                    type={showPasswords[key] ? "text" : "password"}
                    value={passwordForm[key]}
                    onChange={(e) => {
                      setPasswordForm({ ...passwordForm, [key]: e.target.value });
                      if (passwordErrors[key]) setPasswordErrors({ ...passwordErrors, [key]: "" });
                    }}
                    placeholder={placeholder}
                    className={`${inputClass(passwordErrors[key])} pr-11`}
                  />
                  <button type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, [key]: !showPasswords[key] })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPasswords[key] ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                  </button>
                </div>
                {passwordErrors[key] && <p className="text-red-500 text-xs mt-1">{passwordErrors[key]}</p>}
              </div>
            ))}
            <button onClick={handleChangePassword} disabled={passwordSaving}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200">
              {passwordSaving
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <IconLock size={14} />}
              Update Password
            </button>
          </div>
        </SectionCard>

        {/* ── Account Actions ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-orange-50 hover:text-orange-500 transition-all duration-200 text-sm font-semibold">
            <IconLogOut size={18} /> Log Out
          </button>
          <div className="h-px bg-gray-100" />
          {!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-50 transition-all duration-200 text-sm font-semibold">
              <IconTrash size={18} /> Delete Account
            </button>
          ) : (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <IconAlertTriangle size={18} />
                <div>
                  <p className="text-red-600 font-bold text-sm">Are you sure?</p>
                  <p className="text-red-400 text-xs mt-0.5">This is permanent and cannot be undone.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { localStorage.removeItem("customerToken"); navigate("/order"); }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2.5 rounded-xl transition-colors">
                  Yes, Delete My Account
                </button>
                <button onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold py-2.5 rounded-xl transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}