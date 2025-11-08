// client/src/AppComonents/Commom/ProtectedRoutes.jsx - COMPLETE REPLACE
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  // ✅ Check localStorage directly as fallback
  const token = localStorage.getItem("token");

  if (isLoading) return <LoadingSpinner />;

  if (!isAuthenticated && !token) {
    return <Navigate to="/auth" replace />;
  }

  return children || <Outlet />;
};

export const Authenticated = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  if (isLoading) return <LoadingSpinner />;

  if (isAuthenticated || token) {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
};

export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const token = localStorage.getItem("token");

  if (isLoading) return <LoadingSpinner />;

  if (!isAuthenticated || !token) {
    return <Navigate to="/auth" replace />;
  }

  if (user?.role !== "instructor") {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
};
