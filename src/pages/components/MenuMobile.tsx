import StorageIcon from "@mui/icons-material/Storage";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from "react-router-dom";

const MenuMobile = () => {
    const navigation = useNavigate();
    const location = useLocation();

    const handleHome = () =>{
        navigation("/home");
    }

    const handleStorage = () =>{
        navigation("/user/storage");
    }

    const handleUserProfile = () =>{
        navigation("/user/information");
    }

    const handleLogout = () =>{
        Cookies.remove("access_token");
        navigation("/");
    }

    const isActive = (path : any) => {
        return location.pathname === path ? "bg-blue-500 text-white" : "hover:bg-gray-300";
    }

  return (
    <>
      <div className="w-[200px] h-[200px] bg-white shadow-md brightness-100 flex flex-col justify-between">
        <button className={`text-start p-3 flex gap-1 ${isActive("/home")}`}  onClick={handleHome}>
          <HomeOutlinedIcon />
          <span>Home</span>
        </button>
        <button className={`text-start p-3 flex gap-1 ${isActive("/user/storage")}`}  onClick={handleStorage}>
          <StorageIcon />
          <span>Storage</span>
        </button>
        <button className={`text-start p-3 flex gap-1 ${isActive("/user/information")}`} onClick={handleUserProfile}>
          <AccountCircleIcon />
          <span>User Profile</span>
        </button>
        <hr />
        <button className="text-start p-3 hover:bg-gray-300 flex gap-1" onClick={handleLogout}>
          <LogoutIcon />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );
};

export default MenuMobile;
