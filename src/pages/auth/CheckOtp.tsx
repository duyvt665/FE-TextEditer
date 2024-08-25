import { ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import loginBg from "../../assets/login2.jpg"

const CheckOTP = () => {
  const navigation = useNavigate();

  const handleLogin = () => {
    navigation("/");
  };

  return (
    <>
      <div className="w-[100%] h-dvh flex ">
        <div className=" hidden w-[50%] h-dvh bg-blue-300 md:flex">
          <img
            src={loginBg}
            alt="login"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-[100%] h-dvh flex justify-center items-center md:w-[50%] bg-cover bg-[url('/login.jpg')] md:bg-white md:bg-[url('')]">
          <div className="w-[80%] p-5 flex flex-col justify-center gap-7 bg-white rounded-sm h-[60%] md:h-full sm:w-[60%]">
            <div className="flex flex-col w-full">
              <h1 className="text-[20px] sm:text-[30px] font-bold">
                Check OTP
              </h1>
              <span className="text-[14px] sm:text-[18px] text-gray-400">
                We have sent a recovery password to your email. Please check
                your email.
              </span>
            </div>
            <div className="w-full flex gap-1 justify-end items-center">
                <button className="hover:underline text-[14px] text-gray-400 sm:text-[18px]" onClick={handleLogin}>
                    Next
                </button>
                <ArrowRightOutlined className="text-gray-400"/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckOTP;
