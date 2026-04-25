import { useState } from "react";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconCheck = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ── Toggle ────────────────────────────────────────────────────────────────────
const Toggle = ({ enabled, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${enabled ? "bg-orange-500" : "bg-gray-200"}`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${enabled ? "translate-x-5" : "translate-x-0"}`}
    />
  </button>
);

// ── Settings Data ─────────────────────────────────────────────────────────────
const notificationSections = [
  {
    title: "Order Updates",
    description: "Stay informed about your active orders",
    items: [
      { id: "order_placed",      label: "Order confirmed",        description: "When your order is successfully placed" },
      { id: "order_preparing",   label: "Order being prepared",   description: "When the business starts preparing your order" },
      { id: "order_dispatched",  label: "Rider on the way",       description: "When a rider picks up your order" },
      { id: "order_delivered",   label: "Order delivered",        description: "When your order has been delivered" },
    ],
  },
  {
    title: "Promotions & Offers",
    description: "Deals, discounts, and platform updates",
    items: [
      { id: "promo_offers",    label: "Exclusive offers",       description: "Special deals and discount codes for you" },
      { id: "new_businesses",  label: "New businesses nearby",  description: "When new businesses join BiteSwift in your area" },
      { id: "flash_sales",     label: "Flash sales",            description: "Limited-time deals from businesses you've ordered from" },
    ],
  },
  {
    title: "Account & Security",
    description: "Important alerts about your account",
    items: [
      { id: "login_alerts",    label: "New login detected",     description: "When your account is accessed from a new device" },
      { id: "password_change", label: "Password changed",       description: "Confirmation when your password is updated" },
    ],
  },
];

// ── Settings Page ─────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [settings, setSettings] = useState({
    order_placed: true,
    order_preparing: true,
    order_dispatched: true,
    order_delivered: true,
    promo_offers: true,
    new_businesses: false,
    flash_sales: true,
    login_alerts: true,
    password_change: true,
  });

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggle = (id) => {
    setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
    }, 800);
  };

  const enabledCount = Object.values(settings).filter(Boolean).length;
  const totalCount = Object.values(settings).length;

  return (
    <div className="bg-gray-50 min-h-screen w-full">

      {/* HERO */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-8 px-4 sm:px-6">
        <h1 className="text-xl sm:text-3xl font-extrabold text-white mb-1">Settings ⚙️</h1>
        <p className="text-orange-100 text-sm">Manage your notification preferences.</p>
      </div>

      <div className="px-4 sm:px-6 py-8 max-w-2xl mx-auto space-y-6">

        {/* Summary bar */}
        <div className="bg-white rounded-2xl border border-gray-100 px-4 sm:px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-gray-900">Notifications</p>
            <p className="text-xs text-gray-400 mt-0.5">{enabledCount} of {totalCount} enabled</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSettings(Object.fromEntries(Object.keys(settings).map((k) => [k, true])))}
              className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
            >
              Enable all
            </button>
            <span className="text-gray-200 text-sm">|</span>
            <button
              onClick={() => setSettings(Object.fromEntries(Object.keys(settings).map((k) => [k, false])))}
              className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
            >
              Disable all
            </button>
          </div>
        </div>

        {/* Notification sections */}
        {notificationSections.map((section) => (
          <div key={section.title} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-4 sm:px-5 py-3.5 border-b border-gray-100">
              <p className="text-sm font-extrabold text-gray-900">{section.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{section.description}</p>
            </div>
            <div className="divide-y divide-gray-50">
              {section.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 px-4 sm:px-5 py-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.description}</p>
                  </div>
                  <Toggle enabled={settings[item.id]} onToggle={() => toggle(item.id)} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full flex items-center justify-center gap-2 py-3.5 text-sm font-bold rounded-2xl transition-all duration-200 ${
            saved
              ? "bg-green-500 text-white"
              : "bg-orange-500 hover:bg-orange-600 text-white disabled:bg-orange-300"
          }`}
        >
          {saving ? (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : saved ? (
            <IconCheck size={15} />
          ) : null}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Preferences"}
        </button>

      </div>
    </div>
  );
}