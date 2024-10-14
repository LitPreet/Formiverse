import { Suspense } from "react";
import { useRoutePath } from "../hooks/useRoutePath";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "@/login/Login";
import Register from "@/register/Register";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "@/dashboard/Dashboard";
import Layout from "@/layout";
import MainPage from "@/components/mainpage/MainPage";
import FormView from "@/formview/FormView";
import FormSettings from "@/formview/components/FormSettings";
import FormResponse from "@/formview/components/FormResponse";
import SubmitForm from "@/SubmitForm/SubmitForm";
import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";

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
          <Route path={"/submit-form/:id"} element={<SubmitForm />} />
          <Route path={routePath.forgotPassword} element={<ForgotPasswordForm />} />
          <Route path={routePath.home} element={<Layout />}>
            <Route index element={<MainPage />} />
            {/* private route  */}
            {/* if you want role based auth then simply pass role as prop in protectedRoutre accordingly find and show unauthorized screen  */}
            <Route element={<ProtectedRoute />}>
              <Route path={routePath.dashboard} element={<Dashboard />} />
              {/* Dynamic form route */}
              <Route path={routePath.form} element={<FormView />}>
                <Route path="responses" element={<FormResponse />} />
                <Route path="settings" element={<FormSettings />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export default AllRoutes;
