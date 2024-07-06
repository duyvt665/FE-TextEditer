import { ConfigProvider, Spin } from "antd";

const SpinPage = () => {
  return (
    <>
      <ConfigProvider 
        theme={{
            token:{
                colorPrimary: "#111111"
            }
        }}
      >
        <Spin size="large" className="flex justify-center" />
      </ConfigProvider>
    </>
  );
};

export default SpinPage;
