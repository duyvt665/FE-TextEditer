import { useEffect, useState } from "react";
import SideBar from "./components/SideBar";
import SpinPage from "@/components/Loader/SpinPage";
import { Input, Typography, Form } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import type {
  RcFile,
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from "antd/es/upload/interface";
import useFetchData from "@/service/component/getData";
import apiService from "@/service/apiService";

type FileType = RcFile;
const { Title } = Typography;

const Information = () => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const { data: userData, isLoading: userDataLoading } =
    useFetchData("/user/get-info");

  console.log(userData?.userInfo);

  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile<FileType>>
  ) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
    if (info.file.status === "error") {
      setLoading(false);
      message.error("Upload failed.");
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingPage(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  //FORMAT DATE TIME
  const formatCreatedAt = (createdAt: any) => {
    const date = new Date(createdAt);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <div className="w-[100%] h-dvh flex justify-between">
        <div className="w-[20%] h-[100%] hidden lg:block">
          <SideBar />
        </div>
        {loadingPage ? (
          <div className="w-full h-dvh flex items-center justify-center">
            <SpinPage />
          </div>
        ) : (
          <div className="w-[100%] h-[100%] flex justify-center items-center lg:w-[80%]">
            <div className="w-[80%] h-[100%] flex flex-col justify-center items-center gap-4">
              <div className="flex justify-between items-center w-full">
                <div className="w-[15%]">
                  
                </div>
                <div className="flex flex-col text-[14px] md:text-[20px] gap-3 w-[85%]">
                  <span>{userData?.userInfo?.email}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {userData?.userInfo?.username}
                  </span>
                </div>
              </div>
              <hr className="border-2 border-black w-full" />
              <div className="w-full flex flex-col gap-4">
                <Title level={4}>User Information</Title>
                <Form layout="vertical" className="w-full">
                  <Form.Item label="Email" name="email">
                    <Input
                      placeholder={userData?.userInfo?.email}
                      className="rounded-[6px]"
                      disabled
                    />
                  </Form.Item>
                  <Form.Item label="Username" name="username">
                    <Input
                      placeholder={userData?.userInfo?.username}
                      className="rounded-[6px]"
                      disabled
                    />
                  </Form.Item>
                  <Form.Item label="Password" name="password">
                    <Input.Password
                      placeholder="********"
                      className="h-[41.6px]"
                      disabled
                    />
                  </Form.Item>
                  <Form.Item
                    label="Account Creation Date"
                    name="creationDate"
                    className="rounded-[6px]"
                  >
                    <Input
                      placeholder={formatCreatedAt(
                        userData?.userInfo?.createdAt
                      )}
                      disabled
                    />
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Information;
