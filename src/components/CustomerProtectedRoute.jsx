import { Navigate } from "react-router-dom";

export default function CustomerProtectedRoute({ children }) {
  const token = localStorage.getItem("customerToken");
  if (!token) return <Navigate to="/order" replace />;
  return children;
}