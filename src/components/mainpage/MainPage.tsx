import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useRoutePath } from "@/hooks/useRoutePath";
import { useTheme } from "@/hooks/useTheme";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const MainPage = () => {
  const navigate = useNavigate();
  const path = useRoutePath()
  const theme = useTheme();
  const user = useSelector((state:RootState) => state.auth.user)
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6 h-[93vh] overflow-hidden">
     <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-80"
      >
        {theme.theme === "light" && (
          <>
            <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-800 dark:to-purple-700"></div>
            <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:from-indigo-600 dark:to-indigo-800"></div>
          </>
        )}
      </div>
      <div className="relative pt-20 2xl:pt-32 ml-auto">
        <div className="lg:w-2/3 text-center mx-auto">
          <h1 className="text-gray-900 dark:text-white font-bold text-3xl sm:text-4xl  xl:text-5xl 2xl:text-5xl">
            Design Forms, Collect Insights,{" "}
            <span className="text-primary dark:text-white">
              Shape the Future.
            </span>
          </h1>
          <p className="mt-8 text-gray-700 dark:text-gray-300">
            Effortlessly create, share, and analyze forms with our intuitive
            platform. From surveys to feedback, our app simplifies every step,
            helping you gather insights in real-time. Smart, simple, and built
            for your needs.
          </p>
          {user && <Button className="my-4" onClick={() => navigate(path.dashboard)}>Start Building</Button>}
          {
            !user && ( <div className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6">
              <div
                className="relative flex h-11 w-56  items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max" onClick={() => navigate(path.registerUser)}
              >
                <span className="relative text-base cursor-pointer font-semibold dark:text-black text-white" >
                  Get started
                </span>
              </div>
              <div
                className="relative flex h-11  w-56  items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-gray-800 sm:w-max"
              >
                <span className="relative text-base font-semibold text-primary dark:text-white">
                  Learn more
                </span>
              </div>
            </div>) 
          }
         
        </div>
      </div>
    </div>
  );
};

export default MainPage;
