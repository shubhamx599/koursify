// client/src/AppComonents/Commom/ProtectedRoutes.jsx - COMPLETE REPLACE
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen bg-[#07110f]">
    <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/5 border-t-[#c9ff62]"></div>
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
