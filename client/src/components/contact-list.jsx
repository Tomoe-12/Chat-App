/* eslint-disable react/prop-types */
import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "./ui/avatar";
import { getColor } from "@/lib/utils";
import { SidebarMenuItem } from "./ui/sidebar";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    selectedChatType,
    userInfo,
    setSelectedChatMessage,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessage([]);
    }
  };

  return (
    <div className="mt-5  ">
      {contacts.map((contact, i) => (
        <SidebarMenuItem
          key={i}
          className={`pl-5 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? `${getColor(userInfo.color)} `
              : "hover:bg-[#f1f1f111]"
          } `}
          onClick={() => handleClick(contact)}
        >
          {/* <div className="flex gap-5 items-center justify-start text-neutral-300 "> */}
          <div className="flex gap-5 items-center justify-start text-gray-600 ">
            {!isChannel && (
              <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                {contact.image ? (
                  <AvatarImage
                    src={contact.image}
                    alt="profile"
                    className="object-cover h-full bg-black"
                  />
                ) : (
                  <div
                    className={`
                        ${
                          selectedChatData &&
                          selectedChatData._id === contact._id
                            ? " bg-[#ffffff22] border border-white/70"
                            : getColor(contact.color)
                        }
                        uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full `}
                  >
                    {contact.firstName
                      ? contact.firstName.split("").shift()
                      : contact.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            )}
            {isChannel && (
              // <div className=" bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full ">
              <div className="text-white bg-gray-500 h-10 w-10 flex items-center justify-center rounded-full ">
                #
              </div>
            )}
            {isChannel ? (
              <span>{contact.name}</span>
            ) : (
              <span>
                {" "}
                {contact.firstName
                  ? `${contact.firstName} ${contact.lastName} `
                  : contact.email}{" "}
              </span>
            )}
          </div>
        </SidebarMenuItem>
      ))}
    </div>
  );
};

export default ContactList;
