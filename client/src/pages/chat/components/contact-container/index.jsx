import { useEffect } from "react";
import NewDM from "./components/new-dm";
import ProfileInfo from "./components/profile-info";
import { apiClient } from "@/lib/api-client";
import { GET_DM_CONTACTS_ROUTES } from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/contact-list";

const ContactContainer = () => {
  const { setDirectMessageContacts, directMessageContacts } = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      const res = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
        withCredentials: true,
      });

      if (res.data.contacts) {
        console.log("all contacts ", res);
        setDirectMessageContacts(res.data.contacts);
      }
    };
    getContacts();
  }, []);

  return (
    <div className="relative md:w-[35vw] lg:w-[33vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b]  w-full ">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden ">
          <ContactList contacts={directMessageContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactContainer;

const Logo = () => {
  return (
    <div className="flex p-5  justify-start items-center gap-2">
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
      <span className="text-3xl font-semibold ">ThiThiSpeak</span>
    </div>
  );
};
const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
