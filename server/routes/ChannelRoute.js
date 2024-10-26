import { Router } from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { createChannel, getChannelMessages, getUserChannel } from "../controllers/ChannelController.js";


const ChannelRoutes = Router()

ChannelRoutes.post('/create-channel',verifyToken,createChannel)
ChannelRoutes.get('/get-user-channels',verifyToken,getUserChannel)
ChannelRoutes.get('/get-channel-messages/:channelId',verifyToken,getChannelMessages)
export default ChannelRoutes