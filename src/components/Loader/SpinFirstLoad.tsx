import { ConfigProvider, Spin } from "antd"

const SpinFirstLoad = () => {
    return (
        <>
            <div className="flex justify-center items-center w-full h-full">
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: "#111111"
                        }
                    }}
                >
                    <Spin size="large" />
                </ConfigProvider>
            </div>
        </>
    )
}

export default SpinFirstLoad