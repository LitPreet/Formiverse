import React from "react";
import Header from "./components/navbar/Header";
import Footer from "./components/footer/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="max-w-screen-xl mx-auto relative">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
