import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useRoutePath } from "@/hooks/useRoutePath";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useQuery } from "react-query";
import { getCurrentUser } from "@/api/auth";
import { setUser } from "@/features/auth/authSlice";

const MainPage = () => {
  const navigate = useNavigate();
  const path = useRoutePath();


  const user = useSelector((state: RootState) => state.auth.user);


  return (
    <div className="flex justify-center flex-col items-center">
      <h1 className="mt-11 font-bold text-3xl">Welcome to Our Application</h1>
      {user ? (
        <Button onClick={() => navigate(path.dashboard)}>Dashboard</Button>
      ) : (
        <p className="mt-11 font-bold text-2xl">This is the main page. Please log in or sign up to continue.</p>
      )}
      {/* Add links or buttons for Login and Register */}

      {/* <Button onClick={() => refreshedToken()}>get Refresh Token</Button> */}
    
    </div>
  );
};

export default MainPage;
