import React, { Suspense } from "react";
import { useRoutePath } from "./routePath";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Login from "@/login/Login";
import Register from "@/register/Register";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "@/dashboard/Dashboard";
import Layout from "@/layout";
import MainPage from "@/components/mainpage/MainPage";

const FallbackLoader = () => <div>Loading...</div>; 

const AllRoutes = () => {
  const routePath = useRoutePath();
  return (
    <Suspense fallback={<FallbackLoader />}>
      <BrowserRouter>
        <Routes>
            <Route path={routePath.registerUser} element={<Register />} />
            <Route path={routePath.login} element={<Login />} />
          <Route path={routePath.home} element={<Layout><Outlet /></Layout>}>
          <Route index element={<MainPage />}/>
            <Route element={<ProtectedRoute />}>
              <Route path={routePath.dashboard} element={<Dashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export default AllRoutes;
