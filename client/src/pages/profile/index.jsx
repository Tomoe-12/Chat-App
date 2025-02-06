import { useAppStore } from "@/store";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  REMOVE_ROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "@/utils/constants";
import { useRef } from "react";
import { useEffect } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  console.log("user image", userInfo.image);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
    if (userInfo.image) {
      setImage(`${userInfo.image}`);
    }
  }, [userInfo]);

  const validateProfile = () => {
    let valid = true;
    if (!firstName) {
      toast.error("First Name is required!", {
        style: { border: "1px solid red", color: "red" },
      });
      valid = false;
    }
    if (!lastName) {
      toast.error("Last Name is required!", {
        style: { border: "1px solid red", color: "red" },
      });
      valid = false;
    }
    return valid;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      setLoading(true);
      try {
        const res = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        if (res.status === 200 && res.data) {
          setUserInfo({ ...res.data });
          toast.success("Profile Updated successfully !", {
            style: { border: "1px solid green", color: "green" },
          });
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup Profile", {
        style: {
          border: "1px solid red",
          color: "red",
        },
      });
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    setLoading(true);
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      try {
        const res = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
          withCredentials: true,
        });
        if (res.status === 200 && res.data.image) {
          setUserInfo({ ...userInfo, image: res.data.image });
          toast.success("Image updated successfully", {
            style: { border: "1px solid green", color: "green" },
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("Error updating image");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      setLoading(true);
      const res = await apiClient.delete(REMOVE_ROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        toast("image remove successfully", {
          style: { border: "1px solid green", color: "green" },
        });
        setImage(null);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error removing image", {
        style: { border: "1px solid red", color: "red" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
    <div className="bg-white h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max ">
        {/* back arrow */}
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:text-5xl text-black cursor-pointer " />
        </div>
        <div className="grid md:grid-cols-2 md:gap-0 gap-4 items-center  ">
          {/* avatar */}
          <div
            className="h-full md:w-48 md:h-48 relative w-full flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover h-full bg-white"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute m-auto  h-32 w-32 md:w-48 md:h-48 inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 cursor-pointer rounded-full"
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept=".png , .jpg ,  .jpeg ,  .svg , .webp"
            />
          </div>

          {/* input box */}
          <div className="flex min-w-32 md:min-w-64 text-black gap-5 flex-col items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                // className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                className="rounded-lg border border-gray-400 "
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Fist Name"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                // className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                className={`rounded-lg border border-gray-400 text-black `}
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Second Name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                // className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                className={`rounded-lg border border-gray-400 focus:border-none text-black `}
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-200
                  ${
                    selectedColor === index
                      ? "outline outline-whtie/50 outline-1"
                      : ""
                  }}
                    `}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            disabled={loading}
            className={`md:h-16 h-10 w-full bg-${getColor(
              selectedColor
            )} hover:bg-${getColor(
              selectedColor
            )}/20 transition-all duration-200  ${getColor(selectedColor)}`}
            onClick={saveChanges}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
