import { Router } from 'express'
import { signup, login, getUserInfo, updateProfile, addProfileImage, removeProfileImage } from '../controllers/AuthController.js'
import { verifyToken } from '../middleware/AuthMiddleware.js'
import multer from 'multer'


const authRoutes = Router()
const storage = multer.memoryStorage();
const upload = multer({ storage });


authRoutes.post('/signup', signup)
authRoutes.post('/login', login)
authRoutes.get('/user-info', verifyToken, getUserInfo)
authRoutes.post('/update-profile', verifyToken, updateProfile)
authRoutes.post('/add-profile-image', verifyToken, upload.single('profile-image'), addProfileImage)
authRoutes.delete('/remove-profile-image', verifyToken, removeProfileImage)

export default authRoutes;