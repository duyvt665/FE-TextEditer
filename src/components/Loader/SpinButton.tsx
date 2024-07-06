import { ConfigProvider, Spin } from "antd";

const SpinAuth = () => {
  return (
    <>
      <ConfigProvider 
        theme={{
            token:{
                colorPrimary: "#ffffff"
            }
        }}
      >
        <Spin/>
      </ConfigProvider>
    </>
  );
};

export default SpinAuth;
