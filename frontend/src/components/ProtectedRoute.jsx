import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;