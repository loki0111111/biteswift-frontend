import { useNavigate } from "react-router-dom";

const IconArrowLeft = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

export default function ComingSoonPage({ title = "Coming Soon" }) {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl mb-6">🚧</div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-400 text-sm mb-8 max-w-xs">
        This page is currently being built. Check back soon!
      </p>
      <button
        onClick={() => navigate("/customer/browse")}
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
      >
        <IconArrowLeft size={18} /> Back to Home
      </button>
    </div>
  );
}