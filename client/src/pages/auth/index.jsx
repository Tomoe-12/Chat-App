import React, { useState } from "react";
import Background from "../../assets/login2.svg";
import victory from "../../assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client.js";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const Auth = () => {
  const navigate = useNavigate()
  const { setUserInfo } = useAppStore()
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loginemail, setloginemail] = useState('')
  const [loginpass, setloginpass] = useState('')
  const [confirmPass, setconfirmPass] = useState("");

  const validateLogin = () => {
    if (!loginemail.length) {
      toast.error("Email is required!");
      return false;
    }
    if (!loginpass.length) {
      toast.error("Password is required!");
      return false;
    }
    return true;
  }

  const validateSignUp = () => {
    if (!email.length) {
      toast.error("Email is required!");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required!");
      return false;
    }
    if (password !== confirmPass) {
      toast.error("Password and confirm password do not match ");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      const res = await apiClient.post(
        LOGIN_ROUTE,
        { email: loginemail, password: loginpass },
        { withCredentials: true }
      )
      if (res.data.user.id) {
        setUserInfo(res.data.user)
        if (res.data.user.profileSetup) {
          navigate('/chat')
        } else {
          navigate('/profile')
        }
      }
      console.log(res);
    }
  };

  const handlesSignup = async () => {
    if (validateSignUp()) {
      console.log(email, password);
      const res = await apiClient.post(
        SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (res.status == 200) {
        setUserInfo(res.data.user)
        navigate('/profile')
      }
      console.log(res);
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center bg-backgroundColor">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center ">
              <h1 className="text-5xl text-textColor font-bold md:text-6xl ">
                Welcome
              </h1>
              <img src={victory} alt="victory emoji" className="h-[70px]" />
            </div>
            <p className="font-medium text-center">
              Fill in details to get started with the best chat app!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full 
                data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-primaryColor p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full 
                  data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-primaryColor p-3 transition-all duration-300"
                >
                  SignUp
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="Email"
                  className="rounded-full p-6"
                  value={loginemail}
                  onChange={(e) => setloginemail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  className="rounded-full p-6"
                  value={loginpass}
                  onChange={(e) => setloginpass(e.target.value)}
                />

                <Button className="rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5" value="signup">
                <Input
                  placeholder="Email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  className="rounded-full p-6"
                  value={confirmPass}
                  onChange={(e) => setconfirmPass(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handlesSignup}>
                  Sign Up
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center ">
          <img src={Background} className="h-[700px]" alt="background login" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
