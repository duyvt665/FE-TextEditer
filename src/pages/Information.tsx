import { useEffect, useState } from "react";
import SideBar from "./components/SideBar";
import SpinPage from "@/components/Loader/SpinPage";
import { Input, message } from "antd";
import useFetchData from "@/service/component/getData";
import Header from "./components/Header";
import apiService from "@/service/apiService";
import SpinButton from "@/components/Loader/SpinButton";

const Information = () => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [email, setEmail] = useState("");
  const [initialEmail, setInitialEmail] = useState("");
  const [username, setUsername] = useState("");
  const [initialUsername, setInitialUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordInputsEmpty, setIsPasswordInputsEmpty] = useState(true);
  const [isDisabledButtonInfor, setIsDisabledButtonInfor] = useState(false);
  const [isDisabledButtonPassword, setIsDisabledButtonPassword] =
    useState(false);

  //API
  const { data: userData, refetch: refetchUserData } =
    useFetchData("/user/get-info");

  //SET LOADING STATE
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingPage(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  //SET VALUE INFORMATION
  useEffect(() => {
    setEmail(userData?.userInfo?.email);
    setInitialEmail(userData?.userInfo?.email);
    setUsername(userData?.userInfo?.username);
    setInitialUsername(userData?.userInfo?.username);
  }, [userData]);

  //CHECK INFORMATION CHANGE
  const isInforChanged = email !== initialEmail || username !== initialUsername;

  //CHECK INPUTS PASSWORD EMPTY
  useEffect(() => {
    setIsPasswordInputsEmpty(
      currentPassword === "" || newPassword === "" || confirmPassword === ""
    );
  }, [currentPassword, newPassword, confirmPassword]);

  //FORMAT DATE TIME
  const formatCreatedAt = (createdAt: any) => {
    const date = new Date(createdAt);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  //HANDLE CHANGE INFORMATIONS
  const handleChangeInformation = async () => {
    setIsDisabledButtonInfor(true);
    if (email === "" || username === "") {
      message.error("Please input email or username!");
      setTimeout(() => setIsDisabledButtonInfor(false), 2000);
      return;
    } 
    try {
      await apiService.put("/user/update-user", {
        email: email,
        username: username,
      });
      message.success("Information updated successfully!");
      setTimeout(() => setIsDisabledButtonInfor(false), 2000);
      refetchUserData();
    } catch (e) {
      setTimeout(() => setIsDisabledButtonInfor(false), 2000);
    }
  };

  //HANDLE CHANGE PASSWORD
  const handleChangePassword = async () => {
    setIsDisabledButtonPassword(true);
    if (newPassword !== confirmPassword) {
      message.error("New password and confirm password do not match!");
      setTimeout(() => setIsDisabledButtonPassword(false), 2000);
      return;
    } else if (newPassword.length < 8 || newPassword.length > 30 || currentPassword.length < 8 || currentPassword.length > 30) {
      message.error("Password length must be between 8 and 30 characters!");
      setTimeout(() => setIsDisabledButtonPassword(false), 2000);
      return;
    }
    try {
      await apiService.post("/user/change-password", {
        password: currentPassword,
        newPassword: newPassword,
      });
      message.success("Password changed successfully!");
      setTimeout(() => setIsDisabledButtonPassword(false), 2000);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setTimeout(() => setIsDisabledButtonPassword(false), 2000);
    }
  };

  return (
    <>
      <div className="max-w-[100%] h-dvh flex justify-between overflow-hidden">
        <div className="min-w-[20%] h-[100%] hidden lg:block">
          <SideBar />
        </div>
        {loadingPage ? (
          <div className="w-full h-dvh flex items-center justify-center">
            <SpinPage />
          </div>
        ) : (
          <div className="w-[100%] h-[100%] flex justify-center items-center lg:w-[80%] overflow-auto">
            <div className="w-[90%] h-[100%] flex flex-col gap-4">
              <div className="w-full">
                <Header title="Information" />
              </div>
              <span className="text-[30px] font-bold">Profile</span>
              <div className="w-full flex flex-col gap-4 items-start">
                <span className="text-[24px] font-semibold">
                  User Information
                </span>
                <div className="w-full flex flex-col gap-2">
                  <span>Email</span>
                  <Input
                    className="rounded-[6px]"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                  />
                </div>
                <div className="w-full flex flex-col gap-2">
                  <span>Username</span>
                  <Input
                    className="rounded-[6px]"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                  />
                </div>
                <div className="w-full flex flex-col gap-2">
                  <span>Account Creation Date</span>
                  <Input
                    placeholder={formatCreatedAt(userData?.userInfo?.createdAt)}
                    disabled
                  />
                </div>
                <button
                  className={`py-2 text-white rounded-sm w-[150px] ${
                    !isInforChanged || isDisabledButtonInfor
                      ? "bg-gray-300"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  disabled={!isInforChanged || isDisabledButtonInfor}
                  onClick={handleChangeInformation}
                >
                  {isDisabledButtonInfor ? <SpinButton /> : "Update User"}
                </button>
              </div>

              <div className="w-full flex flex-col gap-4 mt-5 items-start">
                <span className="text-[24px] font-semibold">
                  Authentication
                </span>
                <div className="w-full flex flex-col gap-2 ">
                  <span>Current Password</span>
                  <Input.Password
                    className="rounded-[6px]"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    value={currentPassword}
                  />
                </div>
                <div className="w-full flex flex-col gap-2">
                  <span>New Password</span>
                  <Input.Password
                    className="rounded-[6px]"
                    onChange={(e) => setNewPassword(e.target.value)}
                    value={newPassword}
                  />
                </div>
                <div className="w-full flex flex-col gap-2">
                  <span>Confirm Password</span>
                  <Input.Password
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                  />
                </div>
                <button
                  className={`py-2 text-white rounded-sm w-[150px] mb-2 ${
                    isPasswordInputsEmpty || isDisabledButtonPassword
                      ? "bg-gray-300"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  disabled={isPasswordInputsEmpty || isDisabledButtonPassword}
                  onClick={handleChangePassword}
                >
                  {isDisabledButtonPassword ? (
                    <SpinButton />
                  ) : (
                    "Change Password"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Information;
