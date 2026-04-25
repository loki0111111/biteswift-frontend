import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const IconArrowLeft = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
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
const IconCheck = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const BASE_URL = "https://biteswift-qw3s.onrender.com";

const sizeColors = {
  small: "bg-green-100 text-green-600",
  medium: "bg-blue-100 text-blue-600",
  large: "bg-purple-100 text-purple-600",
};
const sizeLabels = { small: "Small", medium: "Medium", large: "Large" };
const formatPrice = (price) => `₦${Number(price || 0).toLocaleString()}`;

const ProductImagePlaceholder = ({ name, image }) => (
  <div className="w-full h-full relative">
    {image && (
      <img
        src={image?.startsWith("http") ? image : `${BASE_URL}${image}`}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
      />
    )}
    <div className={`w-full h-full bg-orange-50 flex flex-col items-center justify-center ${image ? "hidden" : "flex"}`}>
      <span className="text-4xl">🛍️</span>
    </div>
  </div>
);

const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-36 sm:h-40 bg-gray-100" />
    <div className="p-3 sm:p-4 space-y-2">
      <div className="h-4 bg-gray-100 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="flex justify-between items-center mt-2">
        <div className="h-4 bg-gray-100 rounded w-1/3" />
        <div className="w-8 h-8 bg-gray-100 rounded-xl" />
      </div>
    </div>
  </div>
);

// ── Product Card ──────────────────────────────────────────────────────────────
const ProductCard = ({ product, onAddToCart, isAdded }) => {
  const navigate = useNavigate();
  const sizeKey = product.size?.toLowerCase() || "small";
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div
      onClick={() => navigate(`/customer/product/${product._id}`)}
      className="group bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-50 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      <div className="h-36 sm:h-40 overflow-hidden relative">
        <ProductImagePlaceholder image={product.image} name={product.name} />
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
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-1 mb-1">
          <h3 className="text-gray-900 font-bold text-xs sm:text-sm leading-tight group-hover:text-orange-500 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${sizeColors[sizeKey] || sizeColors.small}`}>
            {sizeLabels[sizeKey] || "Small"}
          </span>
        </div>
        {product.description && (
          <p className="text-gray-400 text-xs mb-2 line-clamp-1">{product.description}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-orange-500 font-extrabold text-sm sm:text-base">{formatPrice(product.price)}</span>
          <button
            onClick={(e) => { e.stopPropagation(); if (!outOfStock) onAddToCart(product); }}
            disabled={outOfStock}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-white transition-all duration-200 shadow-md ${
              outOfStock
                ? "bg-gray-200 cursor-not-allowed shadow-none"
                : isAdded
                ? "bg-green-500 hover:bg-green-600 hover:scale-110 active:scale-95 shadow-green-200"
                : "bg-orange-500 hover:bg-orange-600 hover:scale-110 active:scale-95 shadow-orange-200"
            }`}
          >
            {isAdded ? <IconCheck size={15} /> : <IconPlus size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function BusinessMenuPage({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [addedIds, setAddedIds] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/public/businesses/${id}/products`);
        if (!res.ok) throw new Error("Business not found");
        const data = await res.json();
        setBusiness(data.business || null);
        const validProducts = (data.products || []).filter(p => p.businessId !== null && (!p.status || p.status?.toLowerCase() === "active"));
        setProducts(validProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [id]);

  const handleAddToCart = (product) => {
    if (onAddToCart) onAddToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      size: product.size?.toLowerCase() || "small",
      image: product.image,
      category: product.category?.toLowerCase(),
      businessId: id,
      businessName: business?.restaurantName || "",
      stock: product.stock,
    });
    setAddedIds(prev => [...new Set([...prev, product._id])]);
    setTimeout(() => {
      setAddedIds(prev => prev.filter(i => i !== product._id));
    }, 2000);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="px-4 sm:px-6 pt-6">
          <div className="w-28 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="mx-4 sm:mx-6 mt-4 rounded-2xl bg-orange-50 py-6 sm:py-8 px-4 sm:px-6 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-orange-100 flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-6 bg-orange-100 rounded w-1/2" />
              <div className="h-4 bg-orange-100 rounded w-1/3" />
            </div>
          </div>
        </div>
        <div className="px-4 sm:px-6 py-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="flex flex-col items-center justify-center py-40 px-6">
        <div className="text-5xl mb-4">🏪</div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Business not found</h1>
        <p className="text-gray-400 text-sm mb-6">This business doesn't exist or may have been removed.</p>
        <button
          onClick={() => navigate("/customer/browse")}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
        >
          <IconArrowLeft size={18} /> Back to Browse
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="px-4 sm:px-6 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors font-medium text-sm"
        >
          <IconArrowLeft size={18} /> Back
        </button>
      </div>

      <div className="bg-orange-50 mx-4 sm:mx-6 mt-4 rounded-2xl py-6 sm:py-8 px-4 sm:px-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white flex items-center justify-center text-4xl sm:text-5xl shadow-sm flex-shrink-0 overflow-hidden">
            {business.image ? (
              <img src={business.image?.startsWith("http") ? business.image : `${BASE_URL}${business.image}`} alt={business.restaurantName} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <span>🏪</span>
            )}
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 mb-1 sm:mb-2">{business.restaurantName}</h1>
            <div className="flex items-center gap-1.5 text-gray-500">
              <IconMapPin size={13} />
              <span className="text-xs sm:text-sm">{business.restaurantLocation}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
            Products <span className="text-gray-400 font-normal text-sm">({products.length})</span>
          </h2>
          <div className="flex items-center gap-2 ml-auto">
            {Object.entries(sizeLabels).map(([key, label]) => (
              <span key={key} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sizeColors[key]}`}>{label}</span>
            ))}
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
                isAdded={addedIds.includes(product._id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏪</div>
            <h3 className="text-gray-900 font-bold text-xl mb-2">No products yet</h3>
            <p className="text-gray-400 text-sm">This business hasn't added any products yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}