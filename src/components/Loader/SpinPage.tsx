import { ConfigProvider, Spin } from "antd";

const SpinPage = () => {
  return (
    <>
      <ConfigProvider 
        theme={{
            token:{
                colorPrimary: "#3f83f8"
            }
        }}
      >
        <Spin size="large"/>
      </ConfigProvider>
    </>
  );
};

export default SpinPage;
