import { Sidebar } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import StorageIcon from "@mui/icons-material/Storage";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import HelpIcon from "@mui/icons-material/Help";
import useFetchData from "@/service/component/getData";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";

const SideBar = () => {
  const navigation = useNavigate();
  const location = useLocation();

  //API
  const { data: userData, refetch: refetchUserData } =
    useFetchData("/user/get-info");

  const getItemClass = (path: any) => {
    return location.pathname === path
      ? "bg-blue-500 text-white hover:bg-blue-500"
      : "";
  };

  const handleLogout = () => {
    Cookies.remove("accesstoken");
    navigation("/");
  };

  const handleHome = () => {
    navigation("/home");
  };

  const handleStorage = () => {
    navigation("/user/storage");
  };

  const handleInformation = () => {
    navigation("/user/information");
  };

  return (
    <>
      <div className="w-[100%] h-[100%]  !border-r-2">
        <Sidebar
          aria-label="Sidebar with content separator example"
          className="w-[100%]"
        >
          <Sidebar.Items className="h-[100%] flex flex-col">
            <div className="w-[100%] !min-h-[6%] flex flex-col justify-center items-center gap-2 xl:flex-row xl:justify-start xl:items-center xl:gap-2">
              <Avatar icon={<UserOutlined />} />
              <div className="flex flex-col items-center xl:items-start">
                <span>{userData?.userInfo?.email}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {userData?.userInfo?.username}
                </span>
              </div>
            </div>
            <Sidebar.ItemGroup className="max-h-[40%]">
              <Sidebar.Item
                icon={TextFieldsIcon}
                onClick={handleHome}
                className={getItemClass("/home")}
              >
                Text Editor
              </Sidebar.Item>
              <Sidebar.Item
                icon={StorageIcon}
                className={getItemClass("/user/storage")}
                onClick={handleStorage}
              >
                Storage
              </Sidebar.Item>
              <Sidebar.Item
                icon={AccountCircleIcon}
                onClick={handleInformation}
                className={getItemClass("/user/information")}
              >
                User
              </Sidebar.Item>
            </Sidebar.ItemGroup >
            <Sidebar.ItemGroup className="max-h-[40%]">
              <Sidebar.Item icon={LogoutIcon} onClick={handleLogout}>
                Log Out
              </Sidebar.Item>
              {/* <Sidebar.Item icon={HelpIcon}>Help</Sidebar.Item> */}
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
    </>
  );
};

export default SideBar;
