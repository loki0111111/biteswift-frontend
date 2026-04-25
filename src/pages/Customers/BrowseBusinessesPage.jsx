import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://biteswift-qw3s.onrender.com";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconMapPin = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconPlus = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconChevronRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

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

const formatPrice = (p) => `₦${Number(p || 0).toLocaleString()}`;

const ProductImg = ({ image, name }) => {
  const [failed, setFailed] = useState(false);
  if (image && !failed) {
    return <img src={image?.startsWith("http") ? image : `${BASE_URL}${image}`} alt={name} className="w-full h-full object-cover" onError={() => setFailed(true)} />;
  }
  return <div className="w-full h-full bg-orange-50 flex items-center justify-center"><span className="text-4xl sm:text-5xl">🛍️</span></div>;
};

const BusinessSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-24 sm:h-32 bg-gray-100" />
    <div className="p-2.5 space-y-2">
      <div className="h-4 bg-gray-100 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
    </div>
  </div>
);

const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-28 sm:h-36 bg-gray-100" />
    <div className="p-2.5 space-y-2">
      <div className="h-4 bg-gray-100 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="flex justify-between"><div className="h-4 bg-gray-100 rounded w-1/3" /><div className="w-7 h-7 bg-gray-100 rounded-xl" /></div>
    </div>
  </div>
);

const BusinessCard = ({ business, onClick }) => {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <div onClick={onClick} className="group bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50 transition-all duration-300 cursor-pointer overflow-hidden">
      <div className="h-24 sm:h-32 bg-orange-50 flex items-center justify-center overflow-hidden">
        {business.image && !imgFailed ? (
          <img src={business.image?.startsWith("http") ? business.image : `${BASE_URL}${business.image}`} alt={business.name} className="w-full h-full object-cover" onError={() => setImgFailed(true)} />
        ) : (
          <span className="text-4xl">{typeEmoji(business.type)}</span>
        )}
      </div>
      <div className="p-2.5 sm:p-3">
        <h3 className="text-gray-900 font-bold text-xs sm:text-sm group-hover:text-orange-500 transition-colors line-clamp-1">{business.name}</h3>
        <div className="flex items-center gap-1 mt-1 text-gray-400">
          <IconMapPin size={11} /><span className="text-xs truncate">{business.location}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 truncate max-w-[80%]">
            {business.type || "General"}
          </span>
          <span className="text-orange-500 text-xs"><IconChevronRight size={14} /></span>
        </div>
      </div>
    </div>
  );
};

// ── Product Card ──────────────────────────────────────────────────────────────
const ProductCard = ({ product, onAddToCart, onClick }) => {
  const businessName = product.businessName || product.businessId?.restaurantName || "";
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div onClick={onClick} className="group bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50 transition-all duration-300 cursor-pointer overflow-hidden">
      <div className="h-28 sm:h-36 overflow-hidden relative">
        <ProductImg image={product.image} name={product.name} />
        {outOfStock && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-full">Out of stock</span>
          </div>
        )}
        {!outOfStock && product.stock !== undefined && (
          <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-400 text-white">
            {product.stock} left
          </span>
        )}
      </div>
      <div className="p-2.5 sm:p-3">
        <h3 className="text-gray-900 font-bold text-xs sm:text-sm leading-tight mb-1 group-hover:text-orange-500 transition-colors line-clamp-1">{product.name}</h3>
        <p className="text-gray-400 text-xs mb-2 line-clamp-1">{businessName}</p>
        <div className="flex items-center justify-between">
          <span className="text-orange-500 font-extrabold text-xs sm:text-sm">{formatPrice(product.price)}</span>
          <button
            onClick={(e) => { e.stopPropagation(); if (!outOfStock) onAddToCart(product); }}
            disabled={outOfStock}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-white transition-all duration-200 shadow-sm ${
              outOfStock
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 hover:scale-110 active:scale-95"
            }`}
          >
            <IconPlus size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductSection = ({ title, products, onAddToCart, onProductClick, loading }) => (
  <div className="mb-8">
    <h2 className="text-base sm:text-xl font-extrabold text-gray-900 mb-3">{title}</h2>
    {loading ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
      </div>
    ) : products.length === 0 ? (
      <p className="text-gray-400 text-sm">Nothing here yet.</p>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {products.map(product => (
          <ProductCard key={product._id} product={product} onAddToCart={onAddToCart} onClick={() => onProductClick(product)} />
        ))}
      </div>
    )}
  </div>
);

export default function BrowseBusinessesPage({ searchQuery = "", onAddToCart }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [businessTypes, setBusinessTypes] = useState([]);
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);
  const [mostOrdered, setMostOrdered] = useState([]);
  const [loadingMostOrdered, setLoadingMostOrdered] = useState(true);
  const [newest, setNewest] = useState([]);
  const [loadingNewest, setLoadingNewest] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoadingBusinesses(true);
        const res = await fetch(`${BASE_URL}/api/public/businesses`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        const mapped = (data.businesses || []).map(b => ({
          id: b._id, name: b.restaurantName, location: b.restaurantLocation,
          type: b.businessType || "General", image: b.image || null,
        }));
        setAllBusinesses(mapped);
        setFilteredBusinesses(mapped);
        setBusinessTypes([...new Set(mapped.map(b => b.type).filter(Boolean))]);
      } catch (_) {
      } finally { setLoadingBusinesses(false); }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        setLoadingMostOrdered(true);
        const res = await fetch(`${BASE_URL}/api/public/products/most-ordered?limit=10`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setMostOrdered(data.data || []);
      } catch (_) {
      } finally { setLoadingMostOrdered(false); }
    };
    fetch_();
  }, []);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        setLoadingNewest(true);
        const res = await fetch(`${BASE_URL}/api/public/products/newest?limit=10`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setNewest(data.data || []);
      } catch (_) {
      } finally { setLoadingNewest(false); }
    };
    fetch_();
  }, []);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/public/products`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setProducts((data.products || []).filter(p => p.businessId !== null));
      } catch (_) {}
    };
    fetch_();
  }, []);

  useEffect(() => {
    if (activeFilter === "all") { setFilteredBusinesses(allBusinesses); return; }
    const fetchByType = async () => {
      try {
        setLoadingBusinesses(true);
        const res = await fetch(`${BASE_URL}/api/public/businesses?type=${encodeURIComponent(activeFilter)}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setFilteredBusinesses((data.businesses || []).map(b => ({
          id: b._id, name: b.restaurantName, location: b.restaurantLocation,
          type: b.businessType || "General", image: b.image || null,
        })));
      } catch (_) {
      } finally { setLoadingBusinesses(false); }
    };
    fetchByType();
  }, [activeFilter, allBusinesses]);

  const categoryFilteredProducts = activeFilter === "all"
    ? []
    : products.filter(p => {
        const bizId = p.businessId?._id || p.businessId;
        return filteredBusinesses.some(b => b.id === bizId);
      });

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults(null); return; }
    const q = searchQuery.toLowerCase();
    setSearchResults({
      businesses: allBusinesses.filter(b =>
        b.name?.toLowerCase().includes(q) || b.type?.toLowerCase().includes(q) || b.location?.toLowerCase().includes(q)
      ),
      products: products.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.businessId?.restaurantName?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      ),
    });
  }, [searchQuery, allBusinesses, products]);

  const handleAddToCart = (product) => {
    if (onAddToCart) onAddToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      size: product.size?.toLowerCase() || "small",
      image: product.image,
      category: product.category?.toLowerCase(),
      businessId: product.businessId?._id || product.businessId,
      businessName: product.businessName || product.businessId?.restaurantName || "",
      stock: product.stock,
    });
  };

  const handleProductClick = (product) => {
    navigate(`/customer/product/${product._id}`);
  };

  const categoryBar = [
    { id: "all", label: "All", emoji: "🏪" },
    ...businessTypes.map(type => ({ id: type, label: type, emoji: typeEmoji(type) })),
  ];

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-8 px-4 sm:px-6">
        <h1 className="text-xl sm:text-3xl font-extrabold text-white mb-1">What would you like to order today? 🛍️</h1>
        <p className="text-orange-100 text-sm">Browse from hundreds of local businesses, food, groceries, fashion and more.</p>
      </div>

      <div className="bg-white border-b border-gray-100 sticky top-[57px] z-20">
        <div className="px-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto py-3" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {categoryBar.map(cat => (
              <button key={cat.id} onClick={() => setActiveFilter(cat.id)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  activeFilter === cat.id && !searchQuery
                    ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                    : "bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-500 border border-gray-200"
                }`}
              >
                <span>{cat.emoji}</span>{cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 w-full">
        {searchResults ? (
          <div>
            <p className="text-gray-500 text-sm mb-5">Results for <span className="font-semibold text-gray-900">"{searchQuery}"</span></p>
            {searchResults.products.length > 0 && (
              <div className="mb-8">
                <h2 className="text-base sm:text-lg font-extrabold text-gray-900 mb-3">Products</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {searchResults.products.map(product => (
                    <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} onClick={() => handleProductClick(product)} />
                  ))}
                </div>
              </div>
            )}
            {searchResults.businesses.length > 0 && (
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-gray-900 mb-3">Businesses</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {searchResults.businesses.map(business => (
                    <BusinessCard key={business.id} business={business} onClick={() => navigate(`/customer/business/${business.id}`)} />
                  ))}
                </div>
              </div>
            )}
            {searchResults.businesses.length === 0 && searchResults.products.length === 0 && (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-gray-900 font-bold text-xl mb-2">No results found</h3>
                <p className="text-gray-400 text-sm">Try searching for something else</p>
              </div>
            )}
          </div>
        ) : activeFilter !== "all" ? (
          <div>
            {categoryFilteredProducts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-base sm:text-xl font-extrabold text-gray-900 mb-3">{typeEmoji(activeFilter)} {activeFilter} Products</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {categoryFilteredProducts.map(product => (
                    <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} onClick={() => handleProductClick(product)} />
                  ))}
                </div>
              </div>
            )}
            <div>
              <h2 className="text-base sm:text-xl font-extrabold text-gray-900 mb-3">{typeEmoji(activeFilter)} {activeFilter} Businesses</h2>
              {loadingBusinesses ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[...Array(4)].map((_, i) => <BusinessSkeleton key={i} />)}
                </div>
              ) : filteredBusinesses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🏪</div>
                  <h3 className="text-gray-900 font-bold text-xl mb-2">No businesses found</h3>
                  <p className="text-gray-400 text-sm">No {activeFilter} businesses yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredBusinesses.map(business => (
                    <BusinessCard key={business.id} business={business} onClick={() => navigate(`/customer/business/${business.id}`)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <ProductSection title="🔥 Most Ordered" products={mostOrdered} onAddToCart={handleAddToCart} onProductClick={handleProductClick} loading={loadingMostOrdered} />
            <ProductSection title="✨ Newest" products={newest} onAddToCart={handleAddToCart} onProductClick={handleProductClick} loading={loadingNewest} />
          </>
        )}
      </div>
    </div>
  );
}