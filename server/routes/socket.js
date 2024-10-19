import { disconnect } from 'mongoose'
import { Server as SockerIOServer } from 'socket.io'
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
    
    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId

        if (userId) {
            userScoketMap.set(userId, socket.id)
            console.log('user connected : ', userId, 'with socket id : ', socket.id);

        } else {
            console.log('user id not provided during connection ');
        }

        socket.on('disconnect', () => disconnect(socket))
    })
}


export default setupSocket