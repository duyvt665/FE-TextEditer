import TinyEditorComponent from "@/components/TinyEditor/TinyEditerComponent";
import SideBar from "../components/SideBar";
import { useEffect, useState } from "react";
import SpinPage from "@/components/Loader/SpinPage";
import { useLocation } from "react-router-dom";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const docId = searchParams.get("docId");
  const permission = searchParams.get("permission");
  const [documentId, setDocumentId] = useState<any>("");
  const [userPermissions, setUserPermissions] = useState<any>("edit")

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); 

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (docId) {
      setDocumentId(docId);
    }
    if (permission) {
      setUserPermissions(permission);
    }
  }, [docId, permission]);


  return (
    <>
      <div className="w-full h-dvh flex justify-between">
        {/* <div className="min-w-[20%] h-[100%] hidden lg:block">
          <SideBar />
        </div> */}
        {loading ? (
          <div className="w-full h-dvh flex items-center justify-center">
            <SpinPage />
          </div>
        ) : (
          <div className="w-[100%] lg:w-[100%] h-[100%]">
            <TinyEditorComponent documentId={documentId} permission={userPermissions}/>
          </div>
        )}
      </div>
    </>
  );
};
export default Home;
