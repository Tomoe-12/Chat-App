import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE, GET_CHANNEL_MESSAGES, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect } from "react";
import { useRef } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { getColor } from "@/lib/utils";
import { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area"
import AnimationContainer from "@/components/AnimationContainer";

const MessageContainer = () => {
  const scrollRef = useRef();
  const [containerWidth, setContainerWidth] = useState(200);

  const {
    selectedChatData,
    selectedChatType,
    userInfo,
    selectedChatMessage,
    setSelectedChatMessage,
    setIsDownloading,
    setFileDownloadprogress,
  } = useAppStore();

  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (res.data.messages) {
          setSelectedChatMessage(res.data.messages);
        }
      } catch (error) {
        console.log({ error });
      }
    };
    const getChannelMessages = async () => {
      try {
        const res = await apiClient.get(
          `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
          { withCredentials: true }
        );
        if (res.data.messages) {
          setSelectedChatMessage(res.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages();
      } else if (selectedChatType === "channel") {
        getChannelMessages();
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
      const container = document.getElementById("file-name-container");
      if (container) {
        setContainerWidth(container.clientWidth);
      }
    };

    // Measure initial width
    handleResize();

    // Update on resize
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
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
      return <div className="lg:text-3xl text-2xl font-medium w-full h-full text-gray-600 flex flex-col items-center justify-center">
         <AnimationContainer
            animationType="started"
            width={500}
            height={500}
          />
        Let's get Started </div>;
    }
    let lastDate = null;
    return selectedChatMessage.map((message, i) => {
      const messageDate = moment(message.timestamp).format("DD-MM-YYYY");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={i}>
          {showDate && (
            <div className="text-center my-2 text-gray-600">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderedMessages(message)}
          {selectedChatType === "channel" && renderedChannelMessages(message)}
        </div>
      );
    });
  };

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
    setIsDownloading(true);
    setFileDownloadprogress(0);

    // Extract fileSize from the URL
    const urlParams = new URL(url);
    const fileSize = urlParams.searchParams.get("fileSize");
    const totalFileSize = fileSize ? parseInt(fileSize, 10) : null;

    try {
      const res = await apiClient.get(`${url}`, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          const { loaded } = progressEvent;
          console.log("Loaded:", loaded);

          if (totalFileSize) {
            // Use the extracted file size to calculate progress
            const percentCompleted = Math.round((100 * loaded) / totalFileSize);
            console.log("Progress:", percentCompleted);
            setFileDownloadprogress(percentCompleted);
          } else {
            // If file size is not available, show bytes downloaded
            console.log(`Downloaded ${loaded} bytes`);
            setFileDownloadprogress(null); // Indicate that percentage is not available
          }
        },
      });

      const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", customFileName || url.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
      setIsDownloading(false);
      setFileDownloadprogress(0);
    } catch (error) {
      console.error("Error downloading file:", error);
      setIsDownloading(false);
    }
  };

  const getFileNameFromUrl = (fileURL) => {
    // Extract the 'fileName' parameter from the URL
    const urlParams = new URLSearchParams(fileURL.split("?")[1]);
    const fileName = urlParams.get("fileName");
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
                )} text-gray-600 rounded-3xl rounded-br-none    ` // text-[#8417ff]/90 border-[#8417ff]/50
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
              ? ` ${getColor(
                  userInfo.color
                )} text-white rounded-3xl rounded-br-none`
              : " bg-[#2a2b33]/5 text-white border-[#ffffff]/20 rounded-3xl rounded-bl-none"
          } border inline-block p-2 rounded my-1 max-w-[70%] break-words `}
        >
          {checkIfImage(message.fileURL) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageURL(message.fileURL);
              }}
            >
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
            <div
              className="flex items-center justify-center gap-4"
              id="file-name-container"
            >
              <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              {/* Truncate file name based on container width */}
              <span className="text-sm">
                {truncateFileName(
                  getFileNameFromUrl(message.fileURL),
                  containerWidth
                )}
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

  const renderedChannelMessages = (message) => {
    console.log("endfd", message);

    return (
      <div
        className={`mt-5  ${
          message.sender._id !== userInfo.id ? "text-left " : "text-right"
        } `}
      >
        {message.messageType === "text" && (
          <div
            className={` ${
              message.sender._id === userInfo.id
                ? ` ${getColor(
                    userInfo.color
                  )} text-white rounded-3xl rounded-br-none    ` // text-[#8417ff]/90 border-[#8417ff]/50
                : " bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20  rounded-3xl rounded-bl-none  "
            } border inline-block p-4 rounded my-1 max-w-[70%] break-words ml-9 `}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={` ${
              message.sender !== selectedChatData._id
                ? ` ${getColor(
                    userInfo.color
                  )} text-white rounded-3xl rounded-br-none`
                : " bg-[#2a2b33]/5 text-white border-[#ffffff]/20 rounded-3xl rounded-bl-none"
            } border inline-block p-2 rounded my-1 max-w-[70%] break-words `}
          >
            {checkIfImage(message.fileURL) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageURL(message.fileURL);
                }}
              >
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
              <div
                className="flex items-center justify-center gap-4"
                id="file-name-container"
              >
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                {/* Truncate file name based on container width */}
                <span className="text-sm">
                  {truncateFileName(
                    getFileNameFromUrl(message.fileURL),
                    containerWidth
                  )}
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
        {message.sender._id !== userInfo.id ? (
          <div className="flex items-center justify-start rounded-full gap-3">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden">
              {message.sender.image && (
                <AvatarImage
                  src={message.sender.image}
                  alt="profile"
                  className="object-cover h-full bg-black"
                />
              )}
              <AvatarFallback
                className={`uppercase h-8 w-8  text-lg flex items-center justify-center rounded-full ${getColor(
                  message.sender.color
                )}`}
              >
                {message.sender.firstName
                  ? message.sender.firstName.split("").shift()
                  : message.sender.email}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
            <span className="text-xs text-white/60  ">
              {moment(message.timestamp).format("LT")}
            </span>
          </div>
        ) : (
          <>
            <div className="text-xs mt-1 text-white/60  ">
              {moment(message.timestamp).format("LT")}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <ScrollArea className="bg-white flex-1 overflow-auto scrollbar-hidden px-4 md:px-8 pb-4  w-full ">
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img src={imageURL} className="w-full h-[80vh] bg-cover" />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5 ">
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(imageURL)}
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setShowImage(false);
                setImageURL(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </ScrollArea>
  );
};

export default MessageContainer;
