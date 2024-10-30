import { SidebarTrigger } from "@/components/ui/sidebar";


const EmptyHeader = () => {
  return (
    <div className=" h-[8vh]  border-b-2 border-[#2f303b] flex items-center justify-between px-5  ">
       <SidebarTrigger />
    </div>
  );
};

export default EmptyHeader;
