// src/components/layouts/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // បើ loading → បង្ហាញ loading screen (មិន redirect)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-xl font-medium text-gray-700 animate-pulse">
          Checking session...
        </div>
      </div>
    );
  }

  // បើ user មាន → ចូល system
  // បើ user គ្មាន → ទៅ login
  return user ? children : <Navigate to="/login" replace />;
}