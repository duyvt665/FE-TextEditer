import { Button } from "@/components/ui/button";
import apiService from "@/service/apiService";
import { Form, Input, message } from "antd";
import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import SpinButton from "@/components/Loader/SpinButton";

const Login = () => {

  type FormData = {
    username: string;
    password: string;
  }

  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(false);

  const handleRegister = () => {
    navigate("/register");
  };

  const onSubmit = async (values: FormData) => {
    setIsDisabled(true)
    try {
      const response = await apiService.post("/user/sign-in", values)
      const accessToken = response.token;
      Cookies.set("access_token", accessToken, { expires: 7})
      message.success("Login successfully!")
      setTimeout(() => navigate("/home"), 1000)
      setTimeout(() => setIsDisabled(false),2000)
    } catch (error) {
      setTimeout(() => setIsDisabled(false),2000)
    }
  }

  return (
    <>
      <Form onFinish={onSubmit} layout="vertical" requiredMark={false} size="small">
        <div className="w-[100%] h-dvh flex ">
          <div className=" hidden w-[50%] h-dvh bg-blue-300 md:flex">
            <img
              src="/login.jpg"
              alt="login"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="w-[100%] h-dvh flex justify-center items-center md:w-[50%] bg-cover bg-[url('/login.jpg')] md:bg-white md:bg-[url('')]">
            <div className="w-[80%] p-5 flex flex-col justify-center gap-5 bg-white rounded-sm h-[60%] md:h-full sm:w-[60%]">
              <div className="flex flex-col">
                <h1 className="text-[20px] sm:text-[30px] font-bold">Login</h1>
                <span className="text-[14px] sm:text-[18px] text-gray-400">
                  Welcome back! Please login to your account.
                </span>
              </div>

              <div className="flex flex-col gap-5">
                <Form.Item
                  name="username"
                  label={
                    <span className="text-[14px] sm:text-[18px] font-normal">
                      Username <span className="text-red-500">*</span>
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please enter your name!" },
                    {
                      max: 30,
                      message: "Username must not exceed 50 characters!",
                    },
                  ]}
                  className="mb-0"
                >
                  <Input className="h-[36px]" required />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={
                    <span className="text-[14px] sm:text-[18px] font-normal">
                      Password <span className="text-red-500">*</span>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please enter your password!",
                    },
                    {
                      min: 8,
                      message: "Password must have a minimum of 8 characters!",
                    },
                  ]}
                  className="mb-0"
                >
                  <Input.Password className="h-[36px]" required />
                </Form.Item>
              </div>
              <Button type="submit" variant="click" className="h-[36px] text-white bg-blue-500 hover:bg-blue-600 mt-2" disabled={isDisabled}>
               {isDisabled ? <SpinButton/> : <span className="text-[14px] sm:text-[18px]">Login</span>} 
              </Button>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-[14px] sm:text-[18px]">
                  New user?
                  <button
                    className="text-[#111111] text-[14px] sm:text-[18px] font-medium ml-1"
                    onClick={handleRegister}
                  >
                    Register
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
};

export default Login;
