import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useRoutePath } from "./routePath";
import Layout from "@/layout"; // Path alias from tsconfig.json

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const path = useRoutePath(); // Assuming this returns an object with your route paths
  const isAuthenticated = false; // Replace this with actual authentication logic

  useEffect(() => {
    if (!isAuthenticated) {
      // If the user is not authenticated, navigate to the login page
      navigate(path.login, { replace: true });
    }
  }, [isAuthenticated, navigate, path]);

  return isAuthenticated ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to={path.login} replace />
  );
};

export default ProtectedRoute;
