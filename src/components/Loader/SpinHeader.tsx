import { ConfigProvider, Spin } from "antd";

const SpinHeader = () => {
  return (
    <>
      <ConfigProvider 
        theme={{
            token:{
                colorPrimary: "#111111"
            }
        }}
      >
        <Spin className="flex justify-end mt-4" />
      </ConfigProvider>
    </>
  );
};

export default SpinHeader;
