import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactContainer from "./components/contact-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";
import AnimationContainer from "@/components/AnimationContainer";
import { SidebarProvider } from "@/components/ui/sidebar";

const Chat = () => {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadprogress,
  } = useAppStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please setup profile to continue");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
      <SidebarProvider>
        <div className="flex h-[100vh] w-[100vw] text-white overflow-hidden">
        {isUploading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 z-50 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg ">
          <AnimationContainer
            animationType="uploading"
            width={500}
            height={500}
          />
          {fileUploadProgress}%
        </div>
      )}
      {isDownloading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 z-50 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg ">
          <AnimationContainer
            animationType="downloading"
            width={500}
            height={500}
          />
          {fileDownloadprogress}%
        </div>
      )}
          <ContactContainer />
          {selectedChatType === undefined ? (
            <EmptyChatContainer />
          ) : (
            <ChatContainer />
          )}
        </div>
      </SidebarProvider>
  );
};

export default Chat;
