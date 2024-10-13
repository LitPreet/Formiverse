import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import FormEdit from "./components/FormEdit";
import FormResponse from "./components/FormResponse";
import FormSettings from "./components/FormSettings";

const FormView = () => {
  const { id } = useParams();
  const location = useLocation();

  // Scroll to the top whenever the pathname changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const renderContent = () => {
    switch (location.pathname) {
      case `/form/${id}`:
        return <FormEdit />;
      case `/form/${id}/responses`:
        return <FormResponse />;
      case `/form/${id}/settings`:
        return <FormSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen items-start my-5 md:my-2">
      <div className="sticky  top-0 left-0 right-0 z-10 flex px-3 md:px-0 justify-between w-full md:w-[60%] 2xl:w-[50%] items-center h-8 text-sm gap-2">
        <div className="mx-3">
          <NavLink
            to={`/dashboard`}
            className={`px-2 py-1 text-sm gap-1 flex items-center transition-all duration-500 ease-in-out text-white dark:text-gray-800 bg-primary justify-center`}
          >
            <ArrowLeft /> Back
          </NavLink>
        </div>
        <div className="flex justify-center items-center">
          <NavLink
            to={`/form/${id}`}
            className={`p-2 flex items-center transition-all duration-500 ease-in-out text-black dark:text-gray-100 justify-center ${
              location.pathname === `/form/${id}`
                ? "border-b-4 border-b-slate-600 dark:border-b-slate-200"
                : "border-b-4 border-b-transparent"
            }`}
          >
            Questions
          </NavLink>
          <NavLink
            to={`/form/${id}/responses`}
            className={({ isActive }) =>
              `p-2 flex items-center text-black transition-all duration-500 ease-in-out dark:text-gray-100 justify-center ${
                isActive
                  ? "border-b-4 border-b-slate-600 dark:border-b-slate-200"
                  : "border-b-4 border-b-transparent"
              }`
            }
          >
            Responses
          </NavLink>
          <NavLink
            to={`/form/${id}/settings`}
            className={({ isActive }) =>
              `p-2 flex items-center text-black transition-all duration-500 ease-in-out dark:text-gray-100 justify-center ${
                isActive
                  ? "border-b-4 border-b-slate-600 dark:border-b-slate-200"
                  : "border-b-4 border-b-transparent"
              }`
            }
          >
            Settings
          </NavLink>
        </div>
      </div>

      <div className="w-full flex justify-center my-6 md:my-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default FormView;
