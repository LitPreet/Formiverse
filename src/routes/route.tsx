import  { Suspense } from "react";
import { useRoutePath } from "../hooks/useRoutePath";
import { BrowserRouter,  Route, Routes } from "react-router-dom";
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
            {/* publuc route  */}
            <Route path={routePath.registerUser} element={<Register />} />
            <Route path={routePath.login} element={<Login />} />

          <Route path={routePath.home} element={<Layout />}>
            <Route index element={<MainPage />} />
            {/* private route  */}
            {/* if you want role based auth then simply pass role as prop in protectedRoutre accordingly find and show unauthorized screen  */}
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
