import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://biteswift-qw3s.onrender.com";

const IconPlus = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconCheck = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconSliders = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);
const IconPackage = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const sortOptions = [
  { id: "newest", label: "Newest" },
  { id: "price_asc", label: "Price: Low → High" },
  { id: "price_desc", label: "Price: High → Low" },
];

const formatPrice = (p) => `₦${Number(p || 0).toLocaleString()}`;

const ProductImg = ({ image, name }) => {
  const [failed, setFailed] = useState(false);
  if (image && !failed) {
    return <img src={image?.startsWith("http") ? image : `${BASE_URL}${image}`} alt={name} className="w-full h-full object-cover" onError={() => setFailed(true)} />;
  }
  return <div className="w-full h-full bg-orange-50 flex items-center justify-center"><span className="text-4xl sm:text-5xl">🛍️</span></div>;
};

const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-28 sm:h-36 bg-gray-100" />
    <div className="p-2.5 sm:p-3 space-y-2">
      <div className="h-4 bg-gray-100 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-100 rounded w-1/3" />
        <div className="w-7 h-7 bg-gray-100 rounded-xl" />
      </div>
    </div>
  </div>
);

// ── Product Card ──────────────────────────────────────────────────────────────
const ProductCard = ({ product, onAddToCart, justAdded }) => {
  const navigate = useNavigate();
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div
      onClick={() => navigate(`/customer/product/${product._id}`)}
      className="group bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="h-28 sm:h-36 overflow-hidden relative">
        <ProductImg image={product.image} name={product.name} />
        {product.category && (
          <span className="absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-white/90 text-gray-600">
            {product.category}
          </span>
        )}
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
        <h3 className="text-gray-900 font-bold text-xs sm:text-sm leading-tight mb-0.5 group-hover:text-orange-500 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-400 text-xs mb-2 line-clamp-1">
          {product.businessId?.restaurantName || ""}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-orange-500 font-extrabold text-xs sm:text-sm">{formatPrice(product.price)}</span>
          <button
            onClick={(e) => { e.stopPropagation(); if (!outOfStock) onAddToCart(product); }}
            disabled={outOfStock}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-white transition-all duration-200 shadow-sm ${
              outOfStock
                ? "bg-gray-200 cursor-not-allowed"
                : justAdded
                ? "bg-green-500 hover:bg-green-600 hover:scale-110 active:scale-95"
                : "bg-orange-500 hover:bg-orange-600 hover:scale-110 active:scale-95"
            }`}
          >
            {justAdded ? <IconCheck size={13} /> : <IconPlus size={13} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ProductsPage({ searchQuery = "", onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSort, setActiveSort] = useState("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [justAddedIds, setJustAddedIds] = useState(new Set());

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/public/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts((data.products || []).filter(p => p.businessId !== null));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categoryFilters = useMemo(() => {
    const unique = [...new Set(products.map(p => p.category).filter(Boolean))];
    return [
      { id: "all", label: "All", emoji: "🏪" },
      ...unique.map(cat => ({ id: cat.toLowerCase(), label: cat, emoji: "📦" })),
    ];
  }, [products]);

  const handleAddToCart = (product) => {
    if (onAddToCart) onAddToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      size: product.size?.toLowerCase() || "small",
      image: product.image,
      category: product.category?.toLowerCase(),
      businessId: product.businessId?._id || product.businessId,
      businessName: product.businessId?.restaurantName || "",
      stock: product.stock,
    });
    setJustAddedIds(prev => new Set(prev).add(product._id));
    setTimeout(() => {
      setJustAddedIds(prev => { const n = new Set(prev); n.delete(product._id); return n; });
    }, 1500);
  };

  const filtered = useMemo(() => {
    let list = activeCategory === "all"
      ? products
      : products.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.businessId?.restaurantName?.toLowerCase().includes(q)
      );
    }

    switch (activeSort) {
      case "price_asc": return [...list].sort((a, b) => a.price - b.price);
      case "price_desc": return [...list].sort((a, b) => b.price - a.price);
      default: return list;
    }
  }, [products, activeCategory, activeSort, searchQuery]);

  const activeSortLabel = sortOptions.find(s => s.id === activeSort)?.label;
  const activeCategoryLabel = categoryFilters.find(c => c.id === activeCategory)?.label;

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-8 px-4 sm:px-6">
        <h1 className="text-xl sm:text-3xl font-extrabold text-white mb-1">All Products 📦</h1>
        <p className="text-orange-100 text-sm">
          {loading ? "Loading products..." : `${products.length} products from local businesses.`}
        </p>
      </div>

      <div className="bg-white border-b border-gray-100 sticky top-[57px] z-20">
        <div className="px-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto py-3" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {categoryFilters.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  activeCategory === cat.id
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

      <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          {loading ? <span className="text-gray-400">Loading...</span> : (
            <>
              <span className="font-semibold text-gray-900">{filtered.length}</span> product{filtered.length !== 1 ? "s" : ""}
              {activeCategory !== "all" && <span className="text-orange-500 font-semibold"> · {activeCategoryLabel}</span>}
              {searchQuery && <span className="text-gray-400"> for "{searchQuery}"</span>}
            </>
          )}
        </p>
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowSortDropdown(v => !v)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 hover:border-orange-300 hover:text-orange-500 transition-all duration-200"
          >
            <IconSliders size={14} />
            <span className="hidden sm:inline">{activeSortLabel}</span>
            <span className="sm:hidden">Sort</span>
          </button>
          {showSortDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden min-w-[180px]">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { setActiveSort(opt.id); setShowSortDropdown(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-colors ${
                      activeSort === opt.id ? "bg-orange-50 text-orange-500" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                    {activeSort === opt.id && <IconCheck size={14} />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-6 pb-8">
        {error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-gray-900 font-bold text-lg mb-2">Could not load products</h3>
            <p className="text-gray-400 text-sm mb-4">Please check your connection and try again.</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors">Retry</button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {[...Array(12)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filtered.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
                justAdded={justAddedIds.has(product._id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-orange-300 mb-4">
              <IconPackage size={36} />
            </div>
            <h3 className="text-gray-900 font-bold text-lg mb-2">No products found</h3>
            <p className="text-gray-400 text-sm max-w-xs">
              {searchQuery ? `No results for "${searchQuery}".` : "No products in this category yet."}
            </p>
            {activeCategory !== "all" && (
              <button onClick={() => setActiveCategory("all")} className="mt-4 px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors">
                View all categories
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}