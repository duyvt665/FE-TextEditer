import SpinButton from "@/components/Loader/SpinButton";
import { Button } from "@/components/ui/button";
import apiService from "@/service/apiService";
import { Form, Input, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  type FormData = {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
  };

  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(false);

  const handleLogin = () => {
    navigate("/");
  };

  const onSubmit = async (values: FormData) => {
    setIsDisabled(true);
    try {
      await apiService.post("/user/sign-up", values);
      message.success("Register successfully!");
      setTimeout(() => navigate("/"), 1000);
      setTimeout(() => setIsDisabled(false), 2000);
    } catch (error) {
      setTimeout(() => setIsDisabled(false), 2000);
    }
  };

  return (
    <>
      <Form
        onFinish={onSubmit}
        layout="vertical"
        requiredMark={false}
        size="small"
      >
        <div className="w-[100%] h-dvh flex">
          <div className="w-[50%] h-dvh bg-blue-300 hidden md:flex">
            <img
              src="/login.jpg"
              alt="login"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="w-[100%] h-dvh bg-cover bg-[url('/login.jpg')] md:bg-white md:bg-[url('')] flex justify-center items-center md:w-[50%] ">
            <div className="w-[80%] p-10 flex flex-col justify-center gap-5 bg-white rounded-sm md:h-full sm:w-[60%]">
              <div className="flex flex-col">
                <h1 className="text-[20px] sm:text-[30px] font-bold">
                  Register
                </h1>
                <span className="text-[14px] sm:text-[18px] text-gray-400">
                  Please fill in the information below to create an account.
                </span>
              </div>

              <div className="flex flex-col gap-2 sm:gap-5">
                <Form.Item
                  name="email"
                  label={
                    <span className="text-[14px] sm:text-[18px]">
                      Email <span className="text-red-500">*</span>
                    </span>
                  }
                  hasFeedback
                  rules={[
                    { required: true, message: "Please enter your email!" },
                    {
                      max: 50,
                      message:
                        "Emails can only have a maximum of 50 characters!",
                    },
                    { type: "email", message: "Email invalidate!" },
                  ]}
                  className="mb-0"
                >
                  <Input className="h-[36px]" required />
                </Form.Item>

                <Form.Item
                  name="username"
                  label={
                    <span className="text-[14px] sm:text-[18px] font-normal">
                      Username <span className="text-red-500">*</span>
                    </span>
                  }
                  hasFeedback
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
                  hasFeedback
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

                <Form.Item
                  name="confirmPassword"
                  label={
                    <span className="text-[14px] sm:text-[18px]">
                      Confirm Password <span className="text-red-500">*</span>
                    </span>
                  }
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "The new password that you entered do not match!"
                          )
                        );
                      },
                    }),
                  ]}
                  className="mb-0"
                >
                  <Input.Password className="h-[36px]" required />
                </Form.Item>
              </div>

              <Button
                type="submit"
                variant="click"
                className="h-[36px] text-white bg-blue-500 hover:bg-blue-600 mt-2"
                disabled={isDisabled}
              >
                {isDisabled ? (
                  <SpinButton />
                ) : (
                  <span className="text-[14px] sm:text-[18px]">
                    Create new account
                  </span>
                )}
              </Button>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-[14px] sm:text-[18px]">
                  Already have an account?
                  <button
                    className="text-[#111111] text-[14px] sm:text-[18px] font-medium ml-1"
                    onClick={handleLogin}
                  >
                    Login
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

export default Register;
