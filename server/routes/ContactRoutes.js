import { Router } from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { searchContacts } from "../controllers/ContactsController.js";

const contactsRoutes = Router()

contactsRoutes.post('/search', verifyToken, searchContacts)

export default contactsRoutes