import Header from "./components/navbar/Header";
import Footer from "./components/footer/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="mx-auto relative">
      <Header />
      <div className="flex justify-center w-full">
      <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
