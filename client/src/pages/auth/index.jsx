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
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loginemail, setloginemail] = useState("");
  const [loginpass, setloginpass] = useState("");
  const [confirmPass, setconfirmPass] = useState("");

  const validateLogin = () => {
    if (!loginemail.length || !loginpass.length) {
      toast.error("Email and Password is required!", {
        style: { border: "1px solid red", borderColor: "red", color: "red" },
      });
      return false;
    }
    if (!loginemail.includes("@")) {
      toast.error("Invalid email!", {
        style: { border: "1px solid red", borderColor: "red", color: "red" },
      });
      return false;
    }
    if (!loginpass.length) {
      toast.error("Password is required!", {
        style: { border: "1px solid red", borderColor: "red", color: "red" },
      });
      return false;
    }
    if (!password.length >= 6) {
      toast.error("Password should be at least 6 characters", {
        style: { border: "1px solid red", borderColor: "red", color: "red" },
      });
      return false;
    }
    return true;
  };

  const validateSignUp = () => {
    if (!email.length || !password.length || !confirmPass.length) {
      toast.error("Email and Password is required!", {
        style: { border: "1px solid red", borderColor: "red", color: "red" },
      });
      return false;
    }
    if (!email.includes("@")) {
      toast.error("Invalid email!", {
        style: { border: "1px solid red", borderColor: "red", color: "red" },
      });
      return false;
    }
    if (!password.length) {
      toast.error("Password is required!", {
        style: { border: "1px solid red", borderColor: "red", color: "red" },
      });
      return false;
    }
    if (password !== confirmPass) {
      toast.error("Password and confirm password do not match ", {
        style: { border: "1px solid red", borderColor: "red", color: "red" },
      });
      return false;
    }
    if (!password.length >= 6 || !confirmPass.length >= 6) {
      toast.error("Password should be at least 6 characters", {
        style: { border: "1px solid red", borderColor: "red", color: "red" },
      });
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        const res = await apiClient.post(
          LOGIN_ROUTE,
          { email: loginemail, password: loginpass },
          { withCredentials: true }
        );
        console.log("res", res);

        if (res.status == 200) {
          const { user, message } = res.data;
          if (user?.id) {
            setUserInfo(user);
            if (user?.profileSetup) {
              navigate("/chat");
            } else {
              navigate("/profile");
            }
          }
          toast.success(message, {
            style: { border: "1px solid green", color: "green" },
          });
          setUserInfo(user);
          navigate("/profile");
        } else {
          const { message } = res.data;
          toast.error(message, {
            style: {
              border: "1px solid red",
              borderColor: "red",
              color: "red",
            },
          });
        }
        // if (res.data.user.id) {
        //   setUserInfo(res.data.user);
        //   if (res.data.user.profileSetup) {
        //     navigate("/chat");
        //   } else {
        //     navigate("/profile");
        //   }
        // }
      } catch (error) {
        const { message } = error.response.data;
        toast.error(message, {
          style: {
            border: "1px solid red",
            borderColor: "red",
            color: "red",
          },
        });
      }
    }
  };

  const handlesSignup = async () => {
    if (validateSignUp()) {
      try {
        const res = await apiClient.post(
          SIGNUP_ROUTE,
          { email, password },
          { withCredentials: true }
        );

        if (res.status == 200) {
          const { user } = res.data;

          // toast.success(message, { BackgroundColor: "green", color: "green" });
          setUserInfo(user);
          navigate("/profile");
        } else {
          toast.error(res.data.message, {
            style: {
              border: "1px solid red",
              borderColor: "red",
              color: "red",
            },
          });
        }
      } catch (error) {
        const { message } = error.response.data;
        toast.error(message, {
          style: {
            border: "1px solid red",
            borderColor: "red",
            color: "red",
          },
        });
      }
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center bg-backgroundColor">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center ">
              <h1 className="md:text-5xl text-4xl text-textColor font-bold lg:text-6xl ">
                Welcome
              </h1>
              <img src={victory} alt="victory emoji" className="h-[50px] " />
            </div>
            <p className="font-medium text-center lg:text-lg md:text-base text-xs">
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

              {/* login */}
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="Email"
                  className="rounded-full p-6"
                  value={loginemail}
                  onChange={(e) => setloginemail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={loginpass}
                  onChange={(e) => setloginpass(e.target.value)}
                />

                <Button className="rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>

              {/* signUP */}
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
                  type="password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  className="rounded-full p-6"
                  type="password"
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
