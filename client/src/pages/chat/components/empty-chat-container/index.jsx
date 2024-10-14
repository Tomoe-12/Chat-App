import { animationDefaultOptions } from "@/lib/utils";
import Lottie from "react-lottie";

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:bg-[#1c1d25] md:flex hidden flex-col justify-center items-center duration-1000 transition-all">
      <Lottie
        isClickToPauseDisabled={true}
        height={500}
        width={500}
        options={animationDefaultOptions}
      />
      <div className="text-opacity-80 text-white flex flex-col gap-5 items-center lg:text-4xl text-3xl transition-all duration-300 text-center">
        <h3 className="font-lato">
          Hi<span className="text-purple-500">!</span>Welcome to{" "}
          <span className="text-purple-500">ThiThi </span>Chat App{" "}
          <span className="text-purple-500">.</span>
        </h3>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
