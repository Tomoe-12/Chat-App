import { disconnect } from 'mongoose'
import { Server as SockerIOServer } from 'socket.io'
import Message from '../models/MessagesModel.js'
import Channel from '../models/ChannelModel.js'
const setupSocket = (server) => {
    const io = new SockerIOServer(server, {
        cors: {
            // origin: process.env.ORIGIN,
            origin: 'https://chat-app-three-beryl.vercel.app',
            method: ['GET', 'POST'],
            credentials: true
        }
    })
    const userScoketMap = new Map()

    const disconnect = (socket) => {
        console.log('client disconnect', socket.id);

        for (const [userId, socketId] of userScoketMap.entries()) {
            if (socketId === socket.id) {
                userScoketMap.delete(userId)
                break
            }
        }
    }

    const sendMessage = async (message) => {
        const senderSocketId = userScoketMap.get(message.sender)
        const recipientSocketId = userScoketMap.get(message.recipient)

        const createMessage = await Message.create(message)

        const messageData = await Message.findById(createMessage._id)
            .populate('sender', "id email firstName lastName image color")
            .populate('recipient', "id email firstName lastName image color")

        if (recipientSocketId) {
            io.to(recipientSocketId).emit('recieveMessage', messageData)
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit('recieveMessage', messageData)
        }
    }

    const sendChannelMessage = async (message) => {
        const { channelId, sender, content, messageType, fileURL } = message

        const createMessage = await Message.create({
            sender,
            recipient: null,
            content,
            messageType,
            timestamp: new Date(),
            fileURL
        })

        const messageData = await Message.findById(createMessage._id)
            .populate('sender', 'id email firstName lastName image color')
            .exec()


        await Channel.findByIdAndUpdate(channelId, {
            $push: { messages: createMessage._id }
        })

        const channel = await Channel.findById(channelId).populate('members')

        const finalData = { ...messageData._doc, channelId: channel._id }

        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memberSocketId = userScoketMap.get(member._id.toString())
                if (memberSocketId) {
                    io.to(memberSocketId).emit('receive-channel-message', finalData)
                }
            })
            const adminSocketId = userScoketMap.get(channel.admin._id.toString())
            if (adminSocketId) {
                io.to(adminSocketId).emit('receive-channel-message', finalData)
            }
        }

    }

    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId

        if (userId) {
            userScoketMap.set(userId, socket.id)
            console.log('user connected : ', userId, 'with socket id : ', socket.id);

        } else {
            console.log('user id not provided during connection ');
        }

        socket.on('send-channel-message', sendChannelMessage)
        socket.on('sendMessage', sendMessage)
        socket.on('disconnect', () => disconnect(socket))
    })
}


export default setupSocket