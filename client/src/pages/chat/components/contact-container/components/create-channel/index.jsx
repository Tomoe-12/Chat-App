import AnimationContainer from "@/components/AnimationContainer";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import MultipleSelector from "@/components/ui/multiselect";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { apiClient } from "@/lib/api-client";
import { animationOptions, getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import {
  GET_ALL_CONTACTS_ROUTES,
  SEARCH_CONTACTS_ROUTES,
} from "@/utils/constants";
import { useEffect } from "react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

const CreateChannel = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const [newChannelModel, setNewChannelModel] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [isSearching, setIsSearching] = useState(false); // New state for tracking input activity
  const [allContacts, setAllContacts] = useState("");
  const [selectedContact, setSelectedContact] = useState([]);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    const getData = async () => {
      const res = await apiClient.get(GET_ALL_CONTACTS_ROUTES, {
        withCredentials: true,
      });
      setAllContacts(res.data.contacts);
    };
    getData();
  }, []);

  const createChannel = async () => {};

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-netural-100 cursor-pointer transition-all duration-300 "
              onClick={() => setNewChannelModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white ">
            Create new Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={newChannelModel} onOpenChange={setNewChannelModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col  ">
          <DialogHeader>
            <DialogTitle>
              Please fill up the details for new channel{" "}
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Channel Name"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div>
            <MultipleSelector
              className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
              defaultOptions={allContacts}
              placeholder="Search Contacts"
              value={selectedContact}
              onChange={setSearchedContacts}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600 ">
                  No Results found.
                </p>
              }
            />
          </div>
          <div>
            <Button
              className="w-full text-white bg-primaryColor hover:bg-blue-500 transition-all duration-300 "
              onClick={createChannel}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
