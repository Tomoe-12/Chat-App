import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import emptyChatAnimation from '@/assets/lottie/emptychat.json'
import downloadingAnimation from '@/assets/lottie/downloading.json'
import uploadingAnimation from '@/assets/lottie/uploading.json'
import contactAnimation from '@/assets/lottie/contact.json'

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  "bg-[#4cc9f02a] text-[#4cc9f0] border-[1px] border-[#4cc9f0bb]",// hover:bg-[#4cc9f04d]", // Soft Blue: For message bubbles
  "bg-[#06d6a02a] text-[#06d6a0] border-[1px] border-[#06d6a0bb]",// hover:bg-[#06d6a04d]", // Vibrant Green: For status indicators or success messages
  "bg-[#ffd60a2a] text-[#ffd60a] border-[1px] border-[#ffd60abb]",// hover:bg-[#ffd60a4d]", // Bright Yellow: For notifications or highlights
  "bg-[#ff006e2a] text-[#ff006e] border-[1px] border-[#ff006ebb]",// hover:bg-[#ff006e4d]", // Bold Pink: For error messages or urgent alerts
];

export const getColor = (color) => {
  if (color >= 0 && color < colors.length) {
    return colors[color];
  }
  return colors[0]; // Fallback to the first color if out of range
};

export const animationOptions = {
  downloading: {
    loop: true,
    autoprefixer: true,
    animationData: downloadingAnimation,
  },
  contact: {
    loop: true,
    autoprefixer: true,
    animationData: contactAnimation,
  },
  uploading: {
    loop: true,
    autoprefixer: true,
    animationData: uploadingAnimation,
  },
  emptyChat: {
    loop: true,
    autoprefixer: true,
    animationData: emptyChatAnimation,
  },
}