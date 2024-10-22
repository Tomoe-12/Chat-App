import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect } from "react";
import { useRef } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { getColor } from "@/lib/utils";
import { useState } from "react";

const MessageContainer = () => {
  const scrollRef = useRef();
  const [containerWidth, setContainerWidth] = useState(200);

  const {
    selectedChatData,
    selectedChatType,
    userInfo,
    selectedChatMessage,
    setSelectedChatMessage,
  } = useAppStore();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        console.log("all messages ", res);

        if (res.data.messages) {
          setSelectedChatMessage(res.data.messages);
        }
      } catch (error) {
        console.log({ error });
      }
    };
    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages();
      }
    }
  }, [selectedChatData, selectedChatType]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [selectedChatMessage]);

  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('file-name-container');
      if (container) {
        setContainerWidth(container.clientWidth);
      }
    };

    // Measure initial width
    handleResize();
    
    // Update on resize
    window.addEventListener('resize', handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

// Function to truncate the file name based on available width
const truncateFileName = (fileName, containerWidth, fontSize = 18) => {
  const charWidth = fontSize * 0.6; // Rough estimate of character width
  const maxChars = Math.floor(containerWidth / charWidth) - 10; // 10 characters reserved for "......" and padding

  if (fileName.length <= maxChars) return fileName;

  const start = fileName.slice(0, Math.floor(maxChars / 2));
  const end = fileName.slice(-Math.ceil(maxChars / 2));
  return `${start}......${end}`;
};

  const renderMessages = () => {
    if (!selectedChatMessage || selectedChatMessage.length === 0) {
      return <div>No messages available. put some image here </div>;
    }
    let lastDate = null;
    return selectedChatMessage.map((message, i) => {
      const messageDate = moment(message.timestamp).format("DD-MM-YYYY");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={i}>
          {showDate && (
            <div className="text-center my-2 text-gray-500">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderedMessages(message)}
        </div>
      );
    });
  };

  // const checkIfImage = (filePath) => {
  //   const imageRegex =
  //     /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
  //   return imageRegex(filePath);
  // };
  const checkIfImage = (fileURL) => {
    // Extract the 'type' parameter from the URL
    const urlParams = new URLSearchParams(fileURL.split("?")[1]);
    const fileType = urlParams.get("type");

    // List of image MIME types
    const imageMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/tiff",
      "image/webp",
      "image/svg+xml",
      "image/vnd.microsoft.icon",
      "image/heic",
      "image/heif",
    ];

    // Check if the file type matches any of the image MIME types
    return imageMimeTypes.includes(fileType);
  };

  const downloadFile = async (url, customFileName) => {
    try {
      const res = await apiClient.get(`${url}`, { responseType: "blob" });
      const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      // Set the custom file name
      link.setAttribute("download", customFileName || url.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const getFileNameFromUrl = (fileURL) => {
    // Extract the 'fileName' parameter from the URL
    const urlParams = new URLSearchParams(fileURL.split("?")[1]);
    const fileName = urlParams.get("fileName");
    console.log(fileName);

    return fileName;
  };

  const renderedMessages = (message) => (
    <div
      className={` ${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      } `}
    >
      {message.messageType === "text" && (
        <div
          className={` ${
            message.sender !== selectedChatData._id
              ? ` ${getColor(
                  userInfo.color
                )} text-white rounded-3xl rounded-br-none    ` // text-[#8417ff]/90 border-[#8417ff]/50
              : " bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20  rounded-3xl rounded-bl-none  "
          } border inline-block p-4 rounded my-1 max-w-[70%] break-words `}
        >
          {message.content}
        </div>
      )}
        {message.messageType === "file" && (
        <div
          className={` ${
            message.sender !== selectedChatData._id
              ? ` ${getColor(userInfo.color)} text-white rounded-3xl rounded-br-none`
              : " bg-[#2a2b33]/5 text-white border-[#ffffff]/20 rounded-3xl rounded-bl-none"
          } border inline-block p-2 rounded my-1 max-w-[70%] break-words `}
        >
          {checkIfImage(message.fileURL) ? (
            <div className="cursor-pointer">
              <img
                src={message.fileURL}
                className={` ${
                  message.sender !== selectedChatData._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                } rounded-3xl`}
                height={300}
                width={300}
                alt=""
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4" id="file-name-container">
              <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              {/* Truncate file name based on container width */}
              <span className="text-sm">
                {truncateFileName(getFileNameFromUrl(message.fileURL), containerWidth)}
              </span>
              <span
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() =>
                  downloadFile(
                    message.fileURL,
                    getFileNameFromUrl(message.fileURL)
                  )
                }
              >
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 overflow-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full ">
      {renderMessages()}
      <div ref={scrollRef} />{" "}
    </div>
  );
};

export default MessageContainer;
