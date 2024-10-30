import AnimationContainer from "@/components/AnimationContainer";
import EmptyHeader from "./components/empty-header";
import { useMediaQuery } from "react-responsive";

const EmptyChatContainer = () => {
  const isLgOrLarger = useMediaQuery({ minWidth: 1024 });
  const isSmall = useMediaQuery({ maxWidth: 768 });
  return (
    // <div className="flex-1 relative md:bg-[#1c1d25] md:flex hidden flex-col justify-center items-center duration-1000 transition-all">
    <div className="fixed  top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1 ">
      {!isLgOrLarger && <EmptyHeader />}
      {isSmall ? (
        <AnimationContainer
          animationType={"emptyChat"}
          width={300}
          height={300}
        />
      ) : (
        <AnimationContainer
          animationType={"emptyChat"}
          width={600}
          height={600}
        />
      )}
      <div className="px-5 text-opacity-80 text-white flex flex-col gap-5 items-center lg:text-4xl md:text-3xl text-xl transition-all duration-300 text-center">
        <h3 className="font-lato">
          Hi<span className="text-primaryColor">! </span>Welcome to{" "}
          <span className="text-primaryColor">THISPEAK </span>Chat App{" "}
          <span className="text-primaryColor">.</span>
        </h3>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
