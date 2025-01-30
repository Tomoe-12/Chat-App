import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { RiCloseFill } from "react-icons/ri";
import { useMediaQuery } from "react-responsive";

const ChatHeader = () => {
  const isLgOrLarger = useMediaQuery({ minWidth: 1024 });
  const isSmall = useMediaQuery({ maxWidth: 768 });

  const { closeChat, selectedChatData, selectedChatType } = useAppStore();
  console.log("data", selectedChatData);

  return (
    <div
      className={`h-[8vh] border-b border-gray-400 flex items-center bg-white ${
        !isLgOrLarger ? "px-5" : "px-16"
      } `}
    >
      {!isLgOrLarger && <SidebarTrigger className="mr-5" />}
      <div className="flex gap-5 items-center justify-between w-full">
        <div className="flex gap-3 items-center justify-center">
          <div className="w-12 h-12 relative">
            {selectedChatType === "contact" ? (
              <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={selectedChatData.image}
                    alt="profile"
                    className="object-cover h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                      selectedChatData.color
                    )}`}
                  >
                    {selectedChatData.firstName
                      ? selectedChatData.firstName.split("").shift()
                      : selectedChatData.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className=" bg-gray-500 h-11 w-11 flex items-center justify-center rounded-full ">
                #
              </div>
            )}
          </div>
          <div className="text-gray-600">
            {
              selectedChatType == "channel" &&
                selectedChatData.name &&
                selectedChatData.name
              // : selectedChatData.email
            }
            {
              selectedChatType == "contact" &&
                selectedChatData.firstName &&
                `enter ${selectedChatData.firstName} ${selectedChatData.lastName}`
              // : selectedChatData.email
            }
          </div>
        </div>
        {!isSmall && (
          <div className="flex items-center justify-center gap-5  ">
            <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all   ">
              <RiCloseFill className="text-3xl " onClick={closeChat} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default ChatHeader;
