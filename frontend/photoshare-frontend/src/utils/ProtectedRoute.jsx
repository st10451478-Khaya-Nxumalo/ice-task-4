import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router";

const ProtectedRoute = ({ isAuthenticated, redirectPath = "/login" }) => {
  // Hook to programmatically navigate to a different route
  const navigate = useNavigate();

  //checks if user is authenticated on component mount or when dependencies change
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  if (!isAuthenticated) {
    return null;
  }

  // Render child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
