import { Router } from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { getMessages, uploadFile } from "../controllers/MessagesController.js";
import multer from "multer";


const messagesRoutes = Router()
const upload = multer({ dest: 'upload/files' })

messagesRoutes.post('/get-messages', verifyToken, getMessages)
messagesRoutes.post('/upload-file', verifyToken, upload.single('file'), uploadFile)



export default messagesRoutes