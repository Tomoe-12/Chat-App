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

    addChannelInChannelList: (message) => {
        const channels = get().channels
        const data = channels.find((channel) => channel._id === message.channelId)
        const index = channels.findIndex((channel) => channel._id === message.channelId)
        if (index !== -1 && index !== undefined) {
            channels.splice(index, 1)
            channels.unshift(data)
        }
    },

    addContactInDMContacts: (message) => {
        const userId = get().userInfo.id;
        const fromId = message.sender._id === userId
            ? message.recipient._id
            : message.sender._id
        const fromData =
            message.sender._id === userId ? message.recipient : message.sender
        const dmContacts = get().directMessageContacts;
        const data = dmContacts.find((contact) => contact._id === fromId)
        const index = dmContacts.findIndex((contact) => contact._id === fromId)
        if (index !== -1 && index !== undefined) {
            console.log('in if condition');
            dmContacts.splice(index, 1)
            dmContacts.unshift(data)
        } else {
            console.log('in else condition');
            dmContacts.unshift(fromData)
        }
        set({ directMessageContacts: dmContacts })

    }

})