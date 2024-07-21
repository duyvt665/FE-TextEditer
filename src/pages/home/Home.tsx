import TinyEditorComponent from "@/components/TinyEditor/TinyEditerComponent";
import SideBar from "../components/SideBar";
import { useEffect, useState } from "react";
import SpinPage from "@/components/Loader/SpinPage";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="w-full h-dvh flex justify-between">
        <div className="w-[20%] h-[100%] hidden lg:block">
          <SideBar />
        </div>
        {loading ? (
          <div className="w-full h-dvh flex items-center justify-center">
            <SpinPage />
          </div>
        ) : (
          <div className="w-[100%] lg:w-[85%] h-[95%]">
            <TinyEditorComponent />
          </div>
        )}
      </div>
    </>
  );
};
export default Home;
