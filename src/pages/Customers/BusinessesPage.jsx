import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://biteswift-qw3s.onrender.com";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconMapPin = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconChevronRight = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IconStore = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M2 9h20" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

// ── Emoji map for business types ──────────────────────────────────────────────
const typeEmoji = (type) => {
  if (!type) return "🏪";
  const t = type.toLowerCase();
  if (t.includes("food") || t.includes("restaurant")) return "🍔";
  if (t.includes("grocery") || t.includes("supermarket")) return "🛒";
  if (t.includes("pharmacy") || t.includes("health")) return "💊";
  if (t.includes("fashion") || t.includes("cloth")) return "👗";
  if (t.includes("electronic") || t.includes("tech")) return "📱";
  if (t.includes("beauty") || t.includes("cosmetic")) return "🧴";
  if (t.includes("bakery")) return "🥖";
  if (t.includes("drink") || t.includes("beverage")) return "🥤";
  return "🏪";
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-32 sm:h-40 bg-gray-100" />
    <div className="p-3 sm:p-4 space-y-2">
      <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
      <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
      <div className="h-3 bg-gray-100 rounded-lg w-2/3" />
    </div>
  </div>
);

// ── Skeleton for category bar ─────────────────────────────────────────────────
const FilterSkeleton = () => (
  <div className="flex items-center gap-2 overflow-x-auto py-3" style={{ scrollbarWidth: "none" }}>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-9 w-24 bg-gray-100 rounded-xl animate-pulse flex-shrink-0" />
    ))}
  </div>
);

// ── Business Card ─────────────────────────────────────────────────────────────
const BusinessCard = ({ business, onClick }) => (
  <div
    onClick={onClick}
    className="group bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50 transition-all duration-300 cursor-pointer overflow-hidden"
  >
    <div className="h-32 sm:h-40 bg-orange-50 flex items-center justify-center relative overflow-hidden">
      {business.image ? (
        <img
          src={business.image?.startsWith("http") ? business.image : `${BASE_URL}${business.image}`}
          alt={business.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-5xl sm:text-6xl">{typeEmoji(business.type)}</span>
      )}
      <span className="absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 max-w-[70%] truncate">
        {business.type || "General"}
      </span>
    </div>
    <div className="p-3 sm:p-4">
      <h3 className="text-gray-900 font-bold text-sm leading-tight mb-1 group-hover:text-orange-500 transition-colors line-clamp-1">
        {business.name}
      </h3>
      <div className="flex items-center gap-1 text-gray-400 mb-2">
        <IconMapPin size={12} />
        <span className="text-xs truncate">{business.location}</span>
      </div>
      <div className="flex items-center justify-end">
        <span className="text-orange-500 group-hover:translate-x-0.5 transition-transform duration-200">
          <IconChevronRight size={15} />
        </span>
      </div>
    </div>
  </div>
);

// ── Businesses Page ───────────────────────────────────────────────────────────
export default function BusinessesPage({ searchQuery = "" }) {
  const [activeType, setActiveType] = useState("all");
  const [businessTypes, setBusinessTypes] = useState([]);
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ── Fetch all businesses on mount — build type filters ────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/public/businesses`);
        if (!res.ok) throw new Error("Failed to fetch businesses");
        const data = await res.json();
        const mapped = (data.businesses || []).map(b => ({
          id: b._id,
          name: b.restaurantName,
          location: b.restaurantLocation,
          type: b.businessType || "General",
          phone: b.phoneNumber,
          image: b.image || "", // ✅ add this
        }));
        setAllBusinesses(mapped);
        setFilteredBusinesses(mapped);
        const types = [...new Set(mapped.map(b => b.type).filter(Boolean))];
        setBusinessTypes(types);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── When type filter changes, use ?type= endpoint ─────────────────────────
  useEffect(() => {
    if (activeType === "all") {
      setFilteredBusinesses(allBusinesses);
      return;
    }
    const fetchByType = async () => {
      try {
        setFiltering(true);
        const res = await fetch(`${BASE_URL}/api/public/businesses?type=${encodeURIComponent(activeType)}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setFilteredBusinesses((data.businesses || []).map(b => ({
          id: b._id,
          name: b.restaurantName,
          location: b.restaurantLocation,
          type: b.businessType || "General",
          phone: b.phoneNumber,
          image: b.image || "", // ✅ add this
        })));
      } catch (_) {
      } finally {
        setFiltering(false);
      }
    };
    fetchByType();
  }, [activeType, allBusinesses]);

  // ── Apply search on top of filtered list ─────────────────────────────────
  const displayed = useMemo(() => {
    if (!searchQuery.trim()) return filteredBusinesses;
    const q = searchQuery.toLowerCase();
    return filteredBusinesses.filter(b =>
      b.name?.toLowerCase().includes(q) ||
      b.type?.toLowerCase().includes(q) ||
      b.location?.toLowerCase().includes(q)
    );
  }, [filteredBusinesses, searchQuery]);

  // ── Category bar — "All" + dynamic types ─────────────────────────────────
  const categoryBar = [
    { id: "all", label: "All", emoji: "🏪" },
    ...businessTypes.map(type => ({ id: type, label: type, emoji: typeEmoji(type) })),
  ];

  return (
    <div className="bg-gray-50 min-h-screen w-full">

      {/* HERO */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-8 px-4 sm:px-6">
        <h1 className="text-xl sm:text-3xl font-extrabold text-white mb-1">All Businesses 🏪</h1>
        <p className="text-orange-100 text-sm">
          {loading ? "Loading businesses..." : `${allBusinesses.length} businesses on BiteSwift, find yours and start ordering.`}
        </p>
      </div>

      {/* CATEGORY BAR */}
      <div className="bg-white border-b border-gray-100 sticky top-[57px] z-20">
        <div className="px-4 sm:px-6">
          {loading ? <FilterSkeleton /> : (
            <div className="flex items-center gap-2 overflow-x-auto py-3" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {categoryBar.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveType(cat.id)}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                    activeType === cat.id
                      ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                      : "bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-500 border border-gray-200"
                  }`}
                >
                  <span>{cat.emoji}</span>{cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="px-4 sm:px-6 py-4">
        <p className="text-sm text-gray-500">
          {loading || filtering ? (
            <span className="text-gray-400">Loading...</span>
          ) : (
            <>
              <span className="font-semibold text-gray-900">{displayed.length}</span> business{displayed.length !== 1 ? "es" : ""}
              {activeType !== "all" && (
                <span className="text-orange-500 font-semibold"> · {activeType}</span>
              )}
              {searchQuery && <span className="text-gray-400"> for "{searchQuery}"</span>}
            </>
          )}
        </p>
      </div>

      {/* GRID */}
      <div className="px-4 sm:px-6 pb-8">
        {error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-gray-900 font-bold text-lg mb-2">Could not load businesses</h3>
            <p className="text-gray-400 text-sm mb-4">Please check your connection and try again.</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors">
              Retry
            </button>
          </div>
        ) : loading || filtering ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : displayed.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {displayed.map(business => (
              <BusinessCard
                key={business.id}
                business={business}
                onClick={() => navigate(`/customer/business/${business.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-orange-300 mb-4">
              <IconStore size={36} />
            </div>
            <h3 className="text-gray-900 font-bold text-lg mb-2">No businesses found</h3>
            <p className="text-gray-400 text-sm max-w-xs">
              {searchQuery ? `No results for "${searchQuery}".` : "No businesses in this category yet. Check back soon!"}
            </p>
            {activeType !== "all" && (
              <button onClick={() => setActiveType("all")} className="mt-4 px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors">
                View all businesses
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}