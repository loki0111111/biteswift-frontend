import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ContactPage from "./pages/ContactPage";
import SetupPassword from "./pages/SetupPassword";

import DashboardLayout from "./pages/BusinessOwners/DashboardLayout";
import DashboardHome from "./pages/BusinessOwners/DashboardHome";
import OrdersPage from "./pages/BusinessOwners/OrdersPage";
import BusinessProductsPage from "./pages/BusinessOwners/ProductsPage";
import {
  DeliveriesPage,
  WalletPage,
  AnalyticsPage,
  SettingsPage as BusinessSettingsPage,
} from "./pages/BusinessOwners/DashboardPages";

import RequestsPage from "./pages/Admin/requests/RequestsPage";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminHome from "./pages/Admin/AdminHome";
import {
  MerchantsPage,
  FleetPage,
  MarketplacePage,
  FinancePage,
  AdminSettings,
  AdminWalletPage,
} from "./pages/Admin/AdminPages";

import ProtectedRoute from "./components/ProtectedRoute";

import CustomerAuthPage from "./pages/Customers/CustomerAuthPage";
import CustomerRegisterPage from "./pages/Customers/CustomerRegisterPage";
import CustomerLoginPage from "./pages/Customers/CustomerLoginPage";
import EmailVerificationPage from "./pages/Customers/EmailVerificationPage";
import CustomerLayout from "./pages/Customers/CustomerLayout";
import BrowseBusinessesPage from "./pages/Customers/BrowseBusinessesPage";
import BusinessMenuPage from "./pages/Customers/BusinessMenuPage";
import CartPage from "./pages/Customers/CartPage";
import CheckoutPage from "./pages/Customers/CheckoutPage";
import CustomerOrdersPage from "./pages/Customers/CustomerOrdersPage";
import CustomerAccountPage from "./pages/Customers/CustomerAccountPage";
import CustomerProductsPage from "./pages/Customers/ProductsPage";
import BusinessesPage from "./pages/Customers/BusinessesPage";
import SupportPage from "./pages/Customers/SupportPage";
import CustomerSettingsPage from "./pages/Customers/SettingsPage";
import CustomerProtectedRoute from "./components/CustomerProtectedRoute";
import PaymentCallbackPage from "./pages/Customers/PaymentCallbackPage";
import ProductDetailPage from "./pages/Customers/ProductDetailPage";

// ── Cart Conflict Modal ───────────────────────────────────────────────────────
function CartConflictModal({ businessName, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🛒</span>
        </div>
        <h3 className="text-gray-900 font-extrabold text-lg mb-2">Start a new cart?</h3>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Your cart has items from <span className="font-semibold text-gray-800">{businessName}</span>. Adding this item will clear your current cart.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Keep Cart
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-orange-200"
          >
            Clear & Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Shared state wrapper for all customer pages ───────────────────────────────
function CustomerApp({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [conflictProduct, setConflictProduct] = useState(null);

  const addToCart = (product) => {
    if (cartItems.length > 0 && cartItems[0].businessId !== product.businessId) {
      // Show custom modal instead of window.confirm
      setConflictProduct(product);
      return;
    }
    _addProduct(product);
  };

  const _addProduct = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const handleConflictConfirm = () => {
    if (conflictProduct) {
      setCartItems([{ ...conflictProduct, qty: 1 }]);
      setConflictProduct(null);
    }
  };

  const handleConflictCancel = () => {
    setConflictProduct(null);
  };

  const updateCart = (newItems) => setCartItems(newItems);
  const clearCart = () => setCartItems([]);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      {conflictProduct && (
        <CartConflictModal
          businessName={cartItems[0]?.businessName || "another business"}
          onConfirm={handleConflictConfirm}
          onCancel={handleConflictCancel}
        />
      )}
      <CustomerLayout
        cartCount={cartCount}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      >
        {typeof children === "function"
          ? children({ addToCart, updateCart, clearCart, cartItems, searchQuery, setSearchQuery })
          : children}
      </CustomerLayout>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public Routes ── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/setup-password" element={<SetupPassword />} />

        {/* ── Customer Auth Routes (no layout) ── */}
        <Route path="/order" element={<CustomerAuthPage />} />
        <Route path="/customer/register" element={<CustomerRegisterPage />} />
        <Route path="/customer/login" element={<CustomerLoginPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/customer/payment/callback" element={<PaymentCallbackPage />} />

        {/* ── Customer App Routes (all protected) ── */}
        <Route path="/customer/browse" element={
          <CustomerProtectedRoute>
            <CustomerApp>
              {({ addToCart, searchQuery }) => (
                <BrowseBusinessesPage searchQuery={searchQuery} onAddToCart={addToCart} />
              )}
            </CustomerApp>
          </CustomerProtectedRoute>
        } />

        <Route path="/customer/products" element={
          <CustomerProtectedRoute>
            <CustomerApp>
              {({ addToCart, searchQuery }) => (
                <CustomerProductsPage searchQuery={searchQuery} onAddToCart={addToCart} />
              )}
            </CustomerApp>
          </CustomerProtectedRoute>
        } />

        <Route path="/customer/businesses" element={
          <CustomerProtectedRoute>
            <CustomerApp>
              {({ searchQuery }) => (
                <BusinessesPage searchQuery={searchQuery} />
              )}
            </CustomerApp>
          </CustomerProtectedRoute>
        } />

        <Route path="/customer/business/:id" element={
          <CustomerProtectedRoute>
            <CustomerApp>
              {({ addToCart }) => (
                <BusinessMenuPage onAddToCart={addToCart} />
              )}
            </CustomerApp>
          </CustomerProtectedRoute>
        } />

        <Route path="/customer/cart" element={
          <CustomerProtectedRoute>
            <CustomerApp>
              {({ cartItems, updateCart, clearCart }) => (
                <CartPage cartItems={cartItems} onUpdateCart={updateCart} onClearCart={clearCart} />
              )}
            </CustomerApp>
          </CustomerProtectedRoute>
        } />

        <Route path="/customer/checkout" element={
          <CustomerProtectedRoute>
            <CustomerApp>
              {({ clearCart }) => (
                <CheckoutPage onClearCart={clearCart} />
              )}
            </CustomerApp>
          </CustomerProtectedRoute>
        } />

        <Route path="/customer/orders" element={
          <CustomerProtectedRoute>
            <CustomerApp>
              <CustomerOrdersPage />
            </CustomerApp>
          </CustomerProtectedRoute>
        } />

        <Route path="/customer/account" element={
          <CustomerProtectedRoute>
            <CustomerApp>
              <CustomerAccountPage />
            </CustomerApp>
          </CustomerProtectedRoute>
        } />

        <Route path="/customer/support" element={
          <CustomerProtectedRoute>
            <CustomerApp>
              <SupportPage />
            </CustomerApp>
          </CustomerProtectedRoute>
        } />

        <Route path="/customer/settings" element={
          <CustomerProtectedRoute>
            <CustomerApp>
              <CustomerSettingsPage />
            </CustomerApp>
          </CustomerProtectedRoute>
        } />

        <Route path="/customer/product/:id" element={
          <CustomerProtectedRoute>
            <CustomerApp>
              {({ addToCart }) => (
                <ProductDetailPage onAddToCart={addToCart} />
              )}
            </CustomerApp>
          </CustomerProtectedRoute>
        } />

        {/* ── Business Dashboard Routes ── */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRole="business">
            <DashboardLayout><DashboardHome /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/orders" element={
          <ProtectedRoute allowedRole="business">
            <DashboardLayout><OrdersPage /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/products" element={
          <ProtectedRoute allowedRole="business">
            <DashboardLayout><BusinessProductsPage /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/deliveries" element={
          <ProtectedRoute allowedRole="business">
            <DashboardLayout><DeliveriesPage /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/wallet" element={
          <ProtectedRoute allowedRole="business">
            <DashboardLayout><WalletPage /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/analytics" element={
          <ProtectedRoute allowedRole="business">
            <DashboardLayout><AnalyticsPage /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/settings" element={
          <ProtectedRoute allowedRole="business">
            <DashboardLayout><BusinessSettingsPage /></DashboardLayout>
          </ProtectedRoute>
        } />

        {/* ── Admin Dashboard Routes ── */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout><AdminHome /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/merchants" element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout><MerchantsPage /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/fleet" element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout><FleetPage /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/marketplace" element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout><MarketplacePage /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/finance" element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout><FinancePage /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout><AdminSettings /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/wallet" element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout><AdminWalletPage /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/requests" element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout><RequestsPage /></AdminLayout>
          </ProtectedRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;