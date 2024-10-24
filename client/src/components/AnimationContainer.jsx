/* eslint-disable react/prop-types */
import { animationOptions } from "@/lib/utils";
import Lottie from "react-lottie";

const AnimationContainer = ({ animationType ,height ,width }) => {
  
  const animationDefaultOptions = animationOptions[animationType] || animationOptions.emptyChat; // Fallback to empty chat animation if not found

  return (
   
      <Lottie
        isClickToPauseDisabled={true}
        height={height}
        width={width}
        options={animationDefaultOptions}
      />
  
  );
};

export default AnimationContainer;
