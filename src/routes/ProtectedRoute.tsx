import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useRoutePath } from "../hooks/useRoutePath";
import Layout from "@/layout"; // Path alias from tsconfig.json

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = useRoutePath(); // Assuming this returns an object with your route paths
  const isAuthenticated = localStorage.getItem('authenticated'); // Replace this with actual authentication logic

  useEffect(() => {
    if (!isAuthenticated) {
      // If the user is not authenticated, navigate to the login page
      navigate(path.login, { replace: true });
    }
  }, [isAuthenticated, navigate, path]);

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={path.login} state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
