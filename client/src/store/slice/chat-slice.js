export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessage: [],
    directMessageContacts: [],
    isUploading: false,
    isDownloading: false,
    fileUploadProgress: 0,
    fileDownloadprogress: 0,
    channels: [],


    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessage: (selectedChatMessage) => set({ selectedChatMessage }),
    setDirectMessageContacts: (directMessageContacts) => set({ directMessageContacts }),

    setIsUploading: (isUploading) => set({ isUploading }),
    setIsDownloading: (isDownloading) => set({ isDownloading }),
    setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
    setFileDownloadprogress: (fileDownloadprogress) => set({ fileDownloadprogress }),
    setChannels: (channels) => set({ channels }),



    addChannel: (channel) => {
        const channels = get().channels
        set({ channels: [channel, ...channels] })
    },
    closeChat: () => set({
        selectedChatData: undefined,
        selectedChatType: undefined,
        selectedChatMessage: []
    }),
    addMessage: (message) => {
        const selectedChatMessage = get().selectedChatMessage;
        const selectedChatType = get().selectedChatType

        set({
            selectedChatMessage: [
                ...selectedChatMessage, {
                    ...message,
                    recipient: selectedChatType === 'channel'
                        ? message.recipient
                        : message.recipient._id,
                    sender: selectedChatType === 'channel'
                        ? message.sender
                        : message.sender._id
                }
            ]
        })
    },
})