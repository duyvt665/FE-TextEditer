import { Sidebar } from "flowbite-react";
import { Avatar } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import TextFieldsIcon from '@mui/icons-material/TextFields';
import StorageIcon from '@mui/icons-material/Storage';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpIcon from '@mui/icons-material/Help';

const SideBar = () => {
  const navigation = useNavigate();
  const location = useLocation();

  const getItemClass = (path: any) => {
    return location.pathname === path
      ? "bg-blue-500 text-white hover:bg-blue-500"
      : "";
  };

  const handleLogout = () => {
    Cookies.remove("accesstoken");
    navigation("/");
  };
  
  const handleHome = () =>{
    navigation("/home")
  }

  const handleStorage = () => {
    navigation("/user/storage");
  };

  const handleInformation = () =>{
    navigation("/user/information")
  }

  

  return (
    <>
      <div className="w-[100%] h-[100%]  !border-r-2">
        {/* <button
          data-drawer-target="separator-sidebar"
          data-drawer-toggle="separator-sidebar"
          aria-controls="separator-sidebar"
          type="button"
          className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              fill-rule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            ></path>
          </svg>
        </button> */}
        <Sidebar
          aria-label="Sidebar with content separator example"
          className="w-[100%]"
        >
          <Sidebar.Items>
            <div className="w-[100%] flex flex-col justify-center items-center gap-2 xl:flex-row xl:justify-start xl:items-center xl:gap-2">
              <Avatar img="/avatar.JPG" alt="avatar of Jese" rounded size="md"/>
              <div className="flex flex-col items-center xl:items-start">
                <span>duy950630@gmail.com</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  duyvt665
                </span>
              </div>
            </div>
            <Sidebar.ItemGroup>
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
            </Sidebar.ItemGroup>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                icon={LogoutIcon}
                onClick={handleLogout}
              >
                Log Out
              </Sidebar.Item>
              <Sidebar.Item icon={HelpIcon}>
                Help
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
    </>
  );
};

export default SideBar;
