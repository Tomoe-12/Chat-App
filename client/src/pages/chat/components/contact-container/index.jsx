import { useEffect } from "react";
import NewDM from "./components/new-dm";
import ProfileInfo from "./components/profile-info";
import { apiClient } from "@/lib/api-client";
import {
  GET_DM_CONTACTS_ROUTES,
  GET_USER_CHANNEL_ROUTE,
} from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/contact-list";
import CreateChannel from "./components/create-channel";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const ContactContainer = () => {
  const {
    setDirectMessageContacts,
    directMessageContacts,
    channels,
    setChannels,
  } = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      const res = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
        withCredentials: true,
      });

      if (res.data.contacts) {
        setDirectMessageContacts(res.data.contacts);
      }
    };

    const getChannels = async () => {
      const res = await apiClient.get(GET_USER_CHANNEL_ROUTE, {
        withCredentials: true,
      });

      if (res.data.channels) {
        setChannels(res.data.channels);
      }
    };

    getContacts();
    getChannels();
  }, [setChannels, setDirectMessageContacts]);


  return (
    <Sidebar className="border-r-2 border-gray-400 text-white min-h-screen">
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10 ">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <SidebarMenuItem className="max-h-[38vh] overflow-y-auto scrollbar-hidden ">
          <ContactList contacts={directMessageContacts} />
        </SidebarMenuItem>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10 ">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <SidebarMenuItem className="max-h-[38vh] overflow-y-auto scrollbar-hidden ">
          <ContactList contacts={channels} isChannel={true} />
        </SidebarMenuItem>
      </div>
      <SidebarFooter>
        <ProfileInfo />
      </SidebarFooter>
    </Sidebar>
  );
};

export default ContactContainer;

const Logo = () => {
  return (
    <div className="flex p-5   justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#1DA1F2" // Primary Blue
        ></path>{" "}
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#9B59B6" // Muted Purple
        ></path>{" "}
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#4CAF50" // Green
        ></path>{" "}
      </svg>
      <span className="text-3xl font-semibold text-gray-600 ">THISPEAK</span>
    </div>
  );
};
const Title = ({ text }) => {
  return (
    // <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
    <h6 className="uppercase tracking-widest text-gray-600 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
