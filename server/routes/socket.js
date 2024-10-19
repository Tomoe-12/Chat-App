import { disconnect } from 'mongoose'
import { Server as SockerIOServer } from 'socket.io'
import Message from '../models/MessagesModel.js'
const setupSocket = (server) => {
    const io = new SockerIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
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

        if(recipientSocketId){
            io.to(recipientSocketId).emit('recieveMessage', messageData)
        }
        if(senderSocketId){
            io.to(senderSocketId).emit('recieveMessage', messageData)
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

        socket.on('sendMessage', sendMessage)
        socket.on('disconnect', () => disconnect(socket))
    })
}


export default setupSocket