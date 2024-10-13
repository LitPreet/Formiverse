import { useDispatch } from "react-redux";
import "./App.css";
import AllRoutes from "./routes/route";
import { useQuery } from "react-query";
import { getCurrentUser } from "./api/auth";
import { useEffect } from "react";
import { setUser } from "./features/auth/authSlice";
import { Toaster } from "./components/ui/toaster";

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = localStorage.getItem("authenticated") === "true";
  // console.log(user, token, "ju");
  const { data } = useQuery(
    ["currentUser"],
    getCurrentUser,
    {
      enabled: isAuthenticated, // Only fetch if authenticated
      retry: 1, // Prevents retrying on failure
      staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    }
  );
  useEffect(() => {
    if (data) {
      const { username, email, fullName } = data;
      console.log("unnj", { username, email, fullName });
      dispatch(setUser({ username, email, fullName }));
    }
  }, [data]);

  return (
    <div className="App dark:bg-black">
      <Toaster />
      <AllRoutes />
    </div>
  );
}

export default App;
