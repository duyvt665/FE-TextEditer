import { useEffect, useState } from "react";
import SideBar from "./components/SideBar";
import SpinPage from "@/components/Loader/SpinPage";

const Information = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      <div className="w-[100%] h-dvh flex justify-between">
        <div className="w-[20%] h-[100%] hidden lg:block">
          <SideBar />
        </div>
        {loading ? (
          <div className="w-full h-dvh flex items-center justify-center">
            <SpinPage />
          </div>
        ) : (
          <div className="w-[80%] h-[100%]"></div>
        )}
      </div>
    </>
  );
};

export default Information;
