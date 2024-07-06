import { ConfigProvider, Spin } from "antd";

const SpinElement = () => {
  return (
    <>
      <ConfigProvider 
        theme={{
            token:{
                colorPrimary: "#111111"
            }
        }}
      >
        <Spin/>
      </ConfigProvider>
    </>
  );
};

export default SpinElement;
