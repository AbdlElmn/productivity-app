import { Navigate } from "react-router-dom";
import { FullPageLoader } from "./ui/Skeleton";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <FullPageLoader title="Checking admin access" />;
  }

  if (!isAdmin) {
    return <Navigate to="/app" replace />;
  }

  return children;
}
