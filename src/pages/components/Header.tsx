import { MenuOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button } from "antd";
import MenuMobile from "./MenuMobile";
import { useEffect, useState } from "react";

const Header = ({ title }: { title: string }) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

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
      <div className="w-[90%] flex justify-between items-center border-b border-black">
        <div className="flex w-[80%] relative items-center gap-3">
          <span className="font-semibold text-[20px] md:text-2xl text-[#111111]">
            {title}
          </span>
          <div className="inline-block h-[50px] min-h-[1em] mt-3 w-[1px] self-stretch bg-black"></div>
          <span className="text-[15px] font-semibold md:text-sm mt-1">
            {currentDate}
          </span>
        </div>
        <div className="flex relative w-[20%] justify-end">
          <Button
            className="bg-gray-200 h-[50px] hover:bg-gray-300 rounded-xl lg:hidden"
            onClick={handleShowMenuMobile}
          >
            {isOpenMenu ? (
              <MenuUnfoldOutlined
                className="!text-black text-[20px]"
                rotate={90}
              />
            ) : (
              <MenuOutlined className="!text-black text-[20px]" />
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
