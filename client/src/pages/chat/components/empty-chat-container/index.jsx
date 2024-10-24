import AnimationContainer from "@/components/AnimationContainer";

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:bg-[#1c1d25] md:flex hidden flex-col justify-center items-center duration-1000 transition-all">
      <AnimationContainer animationType={'emptyChat'} width={500} height={500} />
      <div className="text-opacity-80 text-white flex flex-col gap-5 items-center lg:text-4xl text-3xl transition-all duration-300 text-center">
        <h3 className="font-lato">
          Hi<span className="text-primaryColor">!</span>Welcome to{" "}
          <span className="text-primaryColor">ThiThiSpeak </span>Chat App{" "}
          <span className="text-primaryColor">.</span>
        </h3>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
