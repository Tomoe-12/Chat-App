import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import authRoutes from './routes/AuthRoutes.js'
import contactsRoutes from './routes/ContactRoutes.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001;
const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/'

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", 'PUT', 'DELETE'],
    credentials: true,
}))

app.use('/upload/profile', express.static('upload/profile'))

app.use(cookieParser())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/contacts',contactsRoutes)



const server = app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
})

mongoose
    .connect(dbUrl)
    .then(() => console.log('DB connected Successfully'))
    .catch(err => {
        if (err.code == 'ECONNREFUSED') {
            console.log('Netwok error')
        } else {
            console.log(err.message);
        }
    })