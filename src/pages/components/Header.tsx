import { MenuOutlined, MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import MenuMobile from "./MenuMobile";
import { useEffect, useState } from "react";
import useFetchData from "@/service/component/getData";

const Header = ({ title }: { title: string }) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  
  //API
  const { data: userData, refetch: refetchUserData } = useFetchData("/user/get-info");

  const handleShowMenuMobile = () => {
    setIsOpenMenu(!isOpenMenu);
  };

  useEffect(() => {
    const date = new Date();
    setCurrentDate(formatDate(date));
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(
      date
    );
    const parts = formattedDate.split(" ");
    return `${parts[0]} ${parts[1]}, ${parts[2]}`;
  };

  return (
    <>
      <div className="w-[100%] flex justify-between items-center border-b border-black">
        <div className="flex w-[50%] relative items-center gap-3">
          <span className="font-semibold sm:text-[20px] md:text-2xl text-[#111111]">
            {title}
          </span>
          <div className="inline-block h-[50px] min-h-[1em] mt-3 w-[1px] self-stretch bg-black"></div>
          <span className="text-[13px] sm:text-[15px] font-semibold md:text-sm mt-1">
            {currentDate}
          </span>
        </div>
        <div className="flex relative w-[40%] justify-end gap-2 items-center sm:w-[50%]">
          <button className=" text-black max-w-[80%] truncate h-[40px] flex justify-end items-center mt-[4px] hover:bg-gray-200 ">
            <span className=" text-[12px] truncate text-[#111111] md:text-[14px] xl:truncate-none mr-1">
              <>
                <p className="truncate font-semibold">{userData?.userInfo?.email}</p>
              </>
            </span>
            <Avatar icon={<UserOutlined />} />
          </button>
          <Button
            className=" rounded-xl lg:hidden text-center border-none text-cernter"
            onClick={handleShowMenuMobile}
          >
            {isOpenMenu ? (
              <MenuUnfoldOutlined
                className="!text-black"
                rotate={90}
              />
            ) : (
              <MenuOutlined className="!text-black " />
            )}
          </Button>
          {isOpenMenu && (
            <div className="absolute top-[75px] right-[10px] z-20 md:top-[70px] lg:hidden">
              <MenuMobile />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Header;
