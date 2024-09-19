import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "@/assets/images/bussiness-man.png";
import { logout } from "@/features/auth/authSlice";
import { useRoutePath } from "@/hooks/useRoutePath";
import { useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
import { User } from "@/lib/types/auth";

const Profile = ({ user }: { user: User | undefined }) => {
  const path = useRoutePath();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    dispatch(logout());
    navigate(path.home);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <img src={Logo} alt="profile" className="w-11 h-11 rounded-full border-none" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-2">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Hii, {user?.username}</DropdownMenuItem>
        <DropdownMenuItem>{user?.email}</DropdownMenuItem>
        <DropdownMenuItem><span className="hover:bg-gray-200 dark:hover:bg-gray-600 w-full p-1 cursor-pointer " onClick={() => navigate(path.dashboard)}>Dashboard</span></DropdownMenuItem>
        <DropdownMenuItem><Button onClick={handleLogout}>Logout</Button></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
