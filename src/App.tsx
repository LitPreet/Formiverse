import { useDispatch } from "react-redux";
import "./App.css";
import AllRoutes from "./routes/route";
import { useQuery } from "react-query";
import { getCurrentUser } from "./api/auth";
import { useEffect } from "react";
import { setUser } from "./features/auth/authSlice";

function App() {
  const dispatch = useDispatch()
  const isAuthenticated = localStorage.getItem('authenticated') === 'true';
  // console.log(user, token, "ju");
  const { data, error, isLoading, isError } = useQuery(['currentUser'], getCurrentUser,{
    enabled: isAuthenticated
  });
  useEffect(() => {
    if(data){
      const { username, email,  fullName } = data;

      dispatch(setUser({ username, email,  fullName }));
    }
  },[data])
  return (
    <div className="App dark:bg-black">
      <AllRoutes /> 
    </div>
  );
}

export default App;
