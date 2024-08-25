import SpinButton from "@/components/Loader/SpinButton";
import { Button } from "@/components/ui/button";
import apiService from "@/service/apiService";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Input, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginBg from "../../assets/login2.jpg"

const ForgotPassword = () => {

    const navigation = useNavigate()
    const [email, setEmail] = useState("")
    const [isDisabled, setIsDisabled] = useState(false)
    
    const handleLogin = () =>{
        navigation("/")
    }

    const handleVerify = async () =>{
        setIsDisabled(true)
        try {
            await apiService.post("/user/forgot-password", {email: email})
            message.success("Send Email Success!")
            setTimeout(() => setIsDisabled(false),2000)
            navigation("/verify-email")
        } catch (error) {
            setTimeout(() => setIsDisabled(false),2000)
        }
        
    }

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
            <div className="flex flex-col">
              <h1 className="text-[20px] sm:text-[30px] font-bold">
                Forgot Password
              </h1>
              <span className="text-[14px] sm:text-[18px] text-gray-400">
              We have sent a recovery password to your email. Please check your email.
              </span>
            </div>
            <div className="">
              <Input placeholder="your-email@example.com" value={email} onChange={(e) => setEmail(e.target.value)}></Input>
            </div>
            <div className="w-full">
              <Button
                type="submit"
                variant="click"
                className="h-[36px] text-white bg-blue-500 hover:bg-blue-600 mt-2 w-full"
                onClick={handleVerify}
                disabled={isDisabled}
              >
                {isDisabled ? <SpinButton/> : <span className="text-[14px] sm:text-[18px]">Next</span>}
              </Button>
            </div>
            <div className="flex gap-1 ">
              <ArrowLeftOutlined className="text-gray-400"/>
              <button className="text-[18px] text-gray-400 hover:underline" onClick={handleLogin}>
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
