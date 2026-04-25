import { useState, useEffect } from "react";

const BASE_URL = "https://biteswift-qw3s.onrender.com";
const getToken = () => localStorage.getItem("token");

// ── Business type → category mapping ─────────────────────────────────────────
const CATEGORY_MAP = {
  Restaurant:  ["Main Course", "Fast Food", "Protein", "Snacks", "Drinks", "Desserts", "Other"],
  Grocery:     ["Fruits & Veg", "Dairy", "Beverages", "Grains", "Household", "Snacks", "Other"],
  Pharmacy:    ["Medicines", "Supplements", "Personal Care", "Baby Care", "Other"],
  Fashion:     ["Men", "Women", "Kids", "Accessories", "Footwear", "Other"],
  Electronics: ["Phones", "Laptops", "Accessories", "Audio", "Gaming", "Other"],
  Beauty:      ["Skincare", "Haircare", "Makeup", "Fragrance", "Other"],
  Other:       ["General", "Other"],
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconPlus = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
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
const IconSearch = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconX = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconImage = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const IconPackage = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const statusOptions = ["All", "Active", "Inactive", "Out of Stock"];

// ── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    "Active": "bg-green-100 text-green-700",
    "Inactive": "bg-gray-100 text-gray-600",
    "Out of Stock": "bg-red-100 text-red-600",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
};

// ── Skeleton Loader ───────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 bg-gray-100 rounded-lg w-full" />
      </td>
    ))}
  </tr>
);

// ── Confirm Delete Modal ──────────────────────────────────────────────────────
const ConfirmDeleteModal = ({ product, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
        <IconTrash size={24} />
      </div>
      <h3 className="text-lg font-extrabold text-gray-900 mb-2">Delete Product?</h3>
      <p className="text-gray-500 text-sm mb-6">
        Are you sure you want to delete <strong>{product.name}</strong>? This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={loading} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-60">
          {loading ? "Deleting..." : "Yes, Delete"}
        </button>
      </div>
    </div>
  </div>
);

// ── Product Modal (Add / Edit) ────────────────────────────────────────────────
const ProductModal = ({ product, onSave, onClose, loading, categoryOptions }) => {
  const isEdit = !!product?._id;
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    stock: product?.stock || "",
    category: product?.category || "",
    status: product?.status || "Active",
    size: product?.size || "Medium",
    images: [],        // new File objects
    imagePreviews: [], // preview URLs for new uploads
  });
  const [errors, setErrors] = useState({});

  // Existing images from server (edit mode)
  const existingImages = product?.images?.length
    ? product.images
    : product?.image
    ? [product.image]
    : [];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const combined = [...form.images, ...files].slice(0, 5); // max 5
    const previews = combined.map(f => URL.createObjectURL(f));
    setForm({ ...form, images: combined, imagePreviews: previews });
  };

  const removeNewImage = (index) => {
    const newImages = form.images.filter((_, i) => i !== index);
    const newPreviews = form.imagePreviews.filter((_, i) => i !== index);
    setForm({ ...form, images: newImages, imagePreviews: newPreviews });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) newErrors.price = "Enter a valid price";
    if (form.stock === "" || isNaN(form.stock) || Number(form.stock) < 0) newErrors.stock = "Enter a valid quantity";
    if (!form.category) newErrors.category = "Please select a category";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form images at submit:", form.images); // ← add this
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onSave({ ...form, price: Number(form.price), stock: Number(form.stock) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-extrabold text-gray-900">{isEdit ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
            <IconX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* ── Image Upload Section ── */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Images <span className="text-gray-400 font-normal">(up to 5)</span>
            </label>

            {/* Existing images (edit mode) */}
            {isEdit && existingImages.length > 0 && form.imagePreviews.length === 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-2">Current images:</p>
                <div className="flex gap-2 flex-wrap">
                  {existingImages.map((img, i) => (
                    <img
                      key={i}
                      src={`${BASE_URL}${img}`}
                      alt={`Product ${i + 1}`}
                      className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* New image previews */}
            {form.imagePreviews.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-3">
                {form.imagePreviews.map((preview, i) => (
                  <div key={i} className="relative">
                    <img src={preview} alt={`Preview ${i + 1}`} className="w-16 h-16 object-cover rounded-xl border border-orange-200" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <IconX size={10} />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 text-center text-white text-xs bg-black/40 rounded-b-xl py-0.5">Main</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            {form.images.length < 5 && (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed rounded-xl p-4 text-center transition-colors hover:border-orange-400 hover:bg-orange-50 border-gray-200">
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <IconImage size={24} />
                    <span className="text-sm">Click to upload images</span>
                    <span className="text-xs">PNG, JPG up to 5MB each · {5 - form.images.length} remaining</span>
                  </div>
                </div>
                <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
              </label>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name <span className="text-orange-500">*</span></label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Jollof Rice"
              className={`w-full px-4 py-3.5 rounded-xl border text-gray-900 text-sm placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Describe the product..."
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₦) <span className="text-orange-500">*</span></label>
              <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="0.00" min="0"
                className={`w-full px-4 py-3.5 rounded-xl border text-gray-900 text-sm placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${errors.price ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}`}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity <span className="text-orange-500">*</span></label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="0" min="0"
                className={`w-full px-4 py-3.5 rounded-xl border text-gray-900 text-sm placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${errors.stock ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}`}
              />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category <span className="text-orange-500">*</span></label>
            <select name="category" value={form.category} onChange={handleChange}
              className={`w-full px-4 py-3.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 appearance-none ${errors.category ? "border-red-400 bg-red-50 text-gray-900" : "border-gray-200 bg-gray-50"} ${!form.category ? "text-gray-400" : "text-gray-900"}`}
            >
              <option value="" disabled>Select a category</option>
              {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Size</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Small", fee: "₦500 delivery" },
                { label: "Medium", fee: "₦1,000 delivery" },
                { label: "Large", fee: "₦1,500 delivery" },
              ].map(({ label, fee }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setForm({ ...form, size: label })}
                  className={`flex flex-col items-center py-3 px-2 rounded-xl border transition-all ${
                    form.size === label
                      ? "bg-orange-500 text-white border-orange-500"
                      : "border-gray-200 text-gray-600 hover:border-orange-300 hover:bg-orange-50"
                  }`}
                >
                  <span className="text-xs font-bold">{label}</span>
                  <span className={`text-xs mt-0.5 ${form.size === label ? "text-white/80" : "text-gray-400"}`}>{fee}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <div className="flex gap-3">
              {["Active", "Inactive", "Out of Stock"].map(s => (
                <button key={s} type="button" onClick={() => setForm({ ...form, status: s })}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    form.status === s
                      ? s === "Active" ? "bg-green-500 text-white border-green-500"
                        : s === "Inactive" ? "bg-gray-500 text-white border-gray-500"
                        : "bg-red-500 text-white border-red-500"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 border border-gray-200 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] shadow-lg shadow-orange-200 disabled:opacity-60"
            >
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Products Page ────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState(CATEGORY_MAP["Other"]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) return;
        const json = await res.json();
        const profile = json.data ?? json;
        const type = profile.businessType || "Other";
        setCategoryOptions(CATEGORY_MAP[type] || CATEGORY_MAP["Other"]);
      } catch (err) {
        console.error("Could not load profile for category filter");
      }
    };
    fetchProfile();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/products`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data.data);
    } catch (err) {
      setError("Could not load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSave = async (formData) => {
    console.log("Images to upload:", formData.images);
    setSaving(true);
    try {
      const isEdit = !!editProduct?._id;
      const url = isEdit
        ? `${BASE_URL}/api/products/${editProduct._id}`
        : `${BASE_URL}/api/products`;
      const method = isEdit ? "PUT" : "POST";

      const body = new FormData();
      body.append("name", formData.name);
      body.append("description", formData.description);
      body.append("price", formData.price);
      body.append("stock", formData.stock);
      body.append("category", formData.category);
      body.append("status", formData.status);
      body.append("size", formData.size);

      // Append each image file under the key "images"
      formData.images.forEach(file => body.append("images", file));

      for (let [key, value] of body.entries()) {
        console.log(key, value);
      }
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${getToken()}` },
        body,
      });

      if (!res.ok) throw new Error("Failed to save product");
      await fetchProducts();
      setShowModal(false);
      setEditProduct(null);
    } catch (err) {
      alert("Something went wrong saving the product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/products/${deleteProduct._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchProducts();
      setDeleteProduct(null);
    } catch (err) {
      alert("Could not delete product. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const filterCategories = ["All", ...categoryOptions];

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "All" || p.category === categoryFilter;
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === "Active").length;
  const outOfStock = products.filter(p => p.status === "Out of Stock").length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your menu and inventory</p>
        </div>
        <button onClick={() => { setEditProduct(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-3 rounded-xl transition-all hover:scale-105 shadow-lg shadow-orange-200 text-sm"
        >
          <IconPlus size={18} /> Add Product
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-3 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchProducts} className="font-semibold underline ml-4">Retry</button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Products", value: totalProducts, color: "text-gray-900" },
          { label: "Active Products", value: activeProducts, color: "text-green-600" },
          { label: "Out of Stock", value: outOfStock, color: "text-red-500" },
          { label: "Total Stock Units", value: totalStock.toLocaleString(), color: "text-orange-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-gray-500 text-xs font-medium mb-1">{stat.label}</p>
            <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><IconSearch size={16} /></div>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products by name or category..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filterCategories.map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${categoryFilter === cat ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all appearance-none cursor-pointer"
          >
            {statusOptions.map(s => <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
              </tbody>
            </table>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
              <IconPackage size={32} />
            </div>
            <h3 className="text-gray-900 font-bold text-lg mb-1">No products found</h3>
            <p className="text-gray-400 text-sm mb-6">
              {search || categoryFilter !== "All" || statusFilter !== "All"
                ? "Try adjusting your search or filters"
                : "Add your first product to get started"}
            </p>
            {!search && categoryFilter === "All" && statusFilter === "All" && (
              <button onClick={() => { setEditProduct(null); setShowModal(true); }}
                className="flex items-center gap-2 bg-orange-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-orange-600 transition-colors"
              >
                <IconPlus size={16} /> Add First Product
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img
                            src={product.image?.startsWith("http") ? product.image : `${BASE_URL}${product.image}`}
                            alt={product.name}
                            className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500 flex-shrink-0 text-lg font-bold">
                            {product.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-gray-900 font-semibold text-sm">{product.name}</p>
                          <p className="text-gray-400 text-xs line-clamp-1">{product.description || "No description"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">{product.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-semibold text-sm">₦{Number(product.price).toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${product.stock === 0 ? "text-red-500" : product.stock < 10 ? "text-yellow-600" : "text-gray-900"}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={product.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setEditProduct(product); setShowModal(true); }}
                          className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors"
                        >
                          <IconEdit size={14} />
                        </button>
                        <button onClick={() => setDeleteProduct(product)}
                          className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors"
                        >
                          <IconTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-4 border-t border-gray-100">
              <p className="text-gray-400 text-sm">Showing {filtered.length} of {products.length} products</p>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <ProductModal
          product={editProduct}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditProduct(null); }}
          loading={saving}
          categoryOptions={categoryOptions}
        />
      )}

      {deleteProduct && (
        <ConfirmDeleteModal
          product={deleteProduct}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteProduct(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}