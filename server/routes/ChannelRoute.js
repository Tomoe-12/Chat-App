import { Router } from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { createChannel, getUserChannel } from "../controllers/ChannelController.js";


const ChannelRoutes = Router()

ChannelRoutes.post('/create-channel',verifyToken,createChannel)
ChannelRoutes.get('/get-user-channels',verifyToken,getUserChannel)

export default ChannelRoutes