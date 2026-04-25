import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = "https://biteswift-qw3s.onrender.com";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconArrowLeft = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const IconMapPin = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconShoppingCart = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);
const IconCheck = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconStar = ({ size = 16, filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconPackage = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </svg>
);
const IconTag = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);
const IconUser = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconMessageSquare = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatPrice = (p) => `₦${Number(p || 0).toLocaleString()}`;
const formatDate = (d) => new Date(d).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" });

const sizeColors = {
  small: "bg-green-100 text-green-700",
  medium: "bg-blue-100 text-blue-700",
  large: "bg-purple-100 text-purple-700",
};

// ── Star Rating Display ───────────────────────────────────────────────────────
const StarDisplay = ({ rating = 0, size = 16 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={s <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}>
        <IconStar size={size} filled={s <= Math.round(rating)} />
      </span>
    ))}
  </div>
);

// ── Star Rating Selector ──────────────────────────────────────────────────────
const StarSelector = ({ value, onChange }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        type="button"
        onClick={() => onChange(s)}
        className={`transition-all duration-150 hover:scale-110 ${s <= value ? "text-amber-400" : "text-gray-300 hover:text-amber-300"}`}
      >
        <IconStar size={28} filled={s <= value} />
      </button>
    ))}
  </div>
);

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`bg-gray-100 animate-pulse rounded-xl ${className}`} />
);

// ── Image Gallery ─────────────────────────────────────────────────────────────
const ImageGallery = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedIndexes, setFailedIndexes] = useState(new Set());

  const handleError = (index) => {
    setFailedIndexes(prev => new Set(prev).add(index));
  };

  const activeImage = images[activeIndex];
  const showFallback = !activeImage || failedIndexes.has(activeIndex);

  return (
    <div className="w-full md:w-80 flex-shrink-0 flex flex-col">
      {/* Main image */}
      <div className="h-64 md:h-80 bg-orange-50 flex items-center justify-center overflow-hidden">
        {showFallback ? (
          <span className="text-7xl">🛍️</span>
        ) : (
          <img
            src={activeImage?.startsWith("http") ? activeImage : `${BASE_URL}${activeImage}`}
            alt="Product"
            className="w-full h-full object-cover"
            onError={() => handleError(activeIndex)}
          />
        )}
      </div>

      {/* Thumbnail strip — only if more than 1 image */}
      {images.length > 1 && (
        <div className="flex gap-2 p-3 bg-white border-t border-gray-100 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                activeIndex === index
                  ? "border-orange-500 shadow-md shadow-orange-100"
                  : "border-gray-100 hover:border-orange-300"
              }`}
            >
              {failedIndexes.has(index) ? (
                <div className="w-full h-full bg-orange-50 flex items-center justify-center text-lg">🛍️</div>
              ) : (
                <img
                  src={img?.startsWith("http") ? img : `${BASE_URL}${img}`}
                  alt={`View ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => handleError(index)}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Product Detail Page ───────────────────────────────────────────────────────
export default function ProductDetailPage({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState({ eligible: false, alreadyReviewed: false });
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const token = localStorage.getItem("customerToken");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const productRes = await fetch(`${BASE_URL}/api/products/${id}`);
        if (!productRes.ok) throw new Error("Product not found");
        const productData = await productRes.json();
        setProduct(productData.product);

        const reviewsRes = await fetch(`${BASE_URL}/api/products/${id}/reviews`);
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData.data || []);
        }

        if (token) {
          const canReviewRes = await fetch(`${BASE_URL}/api/products/${id}/can-review`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (canReviewRes.ok) {
            const canReviewData = await canReviewRes.json();
            setCanReview({ eligible: canReviewData.eligible, alreadyReviewed: canReviewData.alreadyReviewed });
          }

          const ordersRes = await fetch(`${BASE_URL}/api/orders/customer`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (ordersRes.ok) {
            const ordersData = await ordersRes.json();
            const delivered = (ordersData.data || ordersData.orders || []).filter(order =>
              (order.status?.toLowerCase() === "delivered") &&
              order.items?.some(item => item.productId === id || item.productId?._id === id)
            );
            setCustomerOrders(delivered);
            if (delivered.length === 1) setSelectedOrderId(delivered[0]._id);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id, token]);

  const handleAddToCart = () => {
    if (!product || !onAddToCart) return;
    onAddToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      size: product.size?.toLowerCase() || "small",
      image: product.image,
      category: product.category?.toLowerCase(),
      businessId: product.businessId?._id,
      businessName: product.businessId?.restaurantName || "",
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleSubmitReview = async () => {
    if (reviewRating === 0) { setReviewError("Please select a star rating."); return; }
    if (!reviewComment.trim()) { setReviewError("Please write a comment."); return; }
    if (!selectedOrderId) { setReviewError("Please select the order this product was from."); return; }

    setSubmitting(true);
    setReviewError("");

    try {
      const res = await fetch(`${BASE_URL}/api/products/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: selectedOrderId, rating: reviewRating, comment: reviewComment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit review");

      setReviewSuccess(true);
      setCanReview({ eligible: false, alreadyReviewed: true });

      const reviewsRes = await fetch(`${BASE_URL}/api/products/${id}/reviews`);
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.data || []);
      }
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="px-4 sm:px-6 pt-6 mb-4">
          <Skeleton className="w-20 h-4" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-6">
            <div className="flex flex-col md:flex-row">
              <Skeleton className="w-full md:w-80 h-64 md:h-80 rounded-none" />
              <div className="flex-1 p-6 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-12 w-40" />
              </div>
            </div>
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-40 px-6 text-center">
        <div className="text-5xl mb-4">📦</div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Product not found</h1>
        <p className="text-gray-400 text-sm mb-6">This product doesn't exist or may have been removed.</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
        >
          <IconArrowLeft size={18} /> Go Back
        </button>
      </div>
    );
  }

  const business = product.businessId;
  const sizeKey = product.size?.toLowerCase() || "small";

  // ── Build images array ────────────────────────────────────────────────────
  const allImages = product.images?.length > 0
    ? product.images
    : product.image
    ? [product.image]
    : [];

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Back button */}
      <div className="px-4 sm:px-6 pt-6 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors text-sm font-medium"
        >
          <IconArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 space-y-5">

        {/* ── Product Card ── */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
          <div className="flex flex-col md:flex-row">

            {/* Image Gallery */}
            {allImages.length > 0 ? (
              <ImageGallery images={allImages} />
            ) : (
              <div className="w-full md:w-80 h-64 md:h-80 flex-shrink-0 bg-orange-50 flex items-center justify-center">
                <span className="text-7xl">🛍️</span>
              </div>
            )}

            {/* Info */}
            <div className="flex-1 p-6 sm:p-8 flex flex-col">

              {/* Category + Size + Stock badges */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {product.category && (
                  <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-600">
                    <IconTag size={11} /> {product.category}
                  </span>
                )}
                <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${sizeColors[sizeKey] || sizeColors.small}`}>
                  <IconPackage size={11} /> {product.size || "Small"}
                </span>
                {product.stock !== undefined && (
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 leading-tight">{product.name}</h1>

              {/* Rating summary */}
              <div className="flex items-center gap-2 mb-3">
                <StarDisplay rating={product.avgRating || 0} size={16} />
                <span className="text-sm text-gray-500">
                  {product.avgRating ? product.avgRating.toFixed(1) : "No ratings yet"}
                  {product.reviewCount > 0 && <span className="ml-1">({product.reviewCount} review{product.reviewCount !== 1 ? "s" : ""})</span>}
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{product.description}</p>
              )}

              {/* Business */}
              {business && (
                <button
                  onClick={() => navigate(`/customer/business/${business._id}`)}
                  className="flex items-start gap-2 mb-5 group w-fit"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500 flex-shrink-0 mt-0.5">
                    🏪
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-orange-500 transition-colors">{business.restaurantName}</p>
                    <div className="flex items-center gap-1 text-gray-400">
                      <IconMapPin size={11} />
                      <span className="text-xs">{business.restaurantLocation}</span>
                    </div>
                  </div>
                </button>
              )}

              {/* Price + Add to cart */}
              <div className="flex items-center gap-4 mt-auto">
                <span className="text-3xl font-extrabold text-orange-500">{formatPrice(product.price)}</span>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                    added
                      ? "bg-green-500 hover:bg-green-600 shadow-green-200"
                      : "bg-orange-500 hover:bg-orange-600 shadow-orange-200"
                  }`}
                >
                  {added ? <><IconCheck size={16} /> Added!</> : <><IconShoppingCart size={16} /> Add to Cart</>}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* ── Reviews Section ── */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <IconMessageSquare size={18} />
            <h2 className="text-lg font-extrabold text-gray-900">
              Reviews
              {reviews.length > 0 && <span className="text-gray-400 font-normal text-sm ml-2">({reviews.length})</span>}
            </h2>
          </div>

          {/* Review Form */}
          {canReview.eligible && !canReview.alreadyReviewed && !reviewSuccess && (
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Write a Review</h3>

              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Your Rating</label>
                <StarSelector value={reviewRating} onChange={setReviewRating} />
              </div>

              {customerOrders.length > 1 && (
                <div className="mb-4">
                  <label className="text-xs font-semibold text-gray-600 mb-2 block">Which order was this from?</label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  >
                    <option value="">Select an order...</option>
                    {customerOrders.map(order => (
                      <option key={order._id} value={order._id}>
                        Order #{order._id.slice(-6).toUpperCase()} — {formatDate(order.createdAt)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Your Comment</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                />
              </div>

              {reviewError && <p className="text-red-500 text-xs mb-3">{reviewError}</p>}

              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-200"
              >
                {submitting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                ) : "Submit Review"}
              </button>
            </div>
          )}

          {reviewSuccess && (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white flex-shrink-0">
                <IconCheck size={14} />
              </div>
              <p className="text-green-700 text-sm font-semibold">Your review has been submitted. Thank you!</p>
            </div>
          )}

          {canReview.alreadyReviewed && !reviewSuccess && (
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6">
              <p className="text-gray-500 text-sm">You've already reviewed this product.</p>
            </div>
          )}

          {reviews.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-gray-400 text-sm">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="border border-gray-100 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 flex-shrink-0">
                        <IconUser size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{review.customerName}</p>
                        <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>
                    <StarDisplay rating={review.rating} size={13} />
                  </div>
                  {review.comment && (
                    <p className="text-gray-600 text-sm leading-relaxed ml-10">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}