import { request, response } from "express"
import User from "../models/UserModel.js"
import jwt from 'jsonwebtoken'
import { compare } from "bcrypt"
import { renameSync, unlink, unlinkSync } from 'fs'

const maxAge = 3 * 24 * 60 * 60 * 1000

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge })
}

export const signup = async (req, res, next) => {
    console.log('hello', req.body);

    try {
        const { email, password } = req.body
        if (!email || !password) return res.status(400).send('emial and password is required')
        const user = await User.create({ email, password })
        res.cookie('jwt', createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: 'none',
        })
        return res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                // firstName : user.firstName,
                // lastName : user.lastName,
                // image : user.image,
                profileSetup: user.profileSetup
            }
        })
    } catch (error) {
        console.log({ error });
        return res.status(500).send('inter server error')

    }
}

export const login = async (req, res, next) => {
    console.log('hello', req.body);

    try {
        const { email, password } = req.body
        if (!email | !password) return res.status(400).send('email and password is required')
        const user = await User.findOne({ email })
        console.log('user', user);

        if (!user) {
            return res.status(404).send('user with the given email not found !')
        }
        const auth = await compare(password, user.password)
        if (!auth) {
            return res.status(400).send('password is incorrect !')
        }

        res.cookie('jwt', createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: 'none',
        })
        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
                profileSetup: user.profileSetup

            }
        })
    } catch (error) {
        console.log({ error });
        return res.status(500).send('inter server error')

    }
}

export const getUserInfo = async (req, res, next) => {
    try {
        console.log(req.userId);
        const userData = await User.findById(req.userId)
        console.log(userData);

        if (!userData) {
            return res.status(404).send('User with the given id not found')
        }
        return res.status(200).json({
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
            profileSetup: userData.profileSetup
        })
    } catch (error) {
        console.log({ error });
        return res.status(500).send('inter server error')
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const { userId } = req

        const { firstName, lastName, color } = req.body
        if (!firstName || !lastName) {
            return res.status(404).send('First Name , Last Name and color is required')
        }

        const userData = await User.findByIdAndUpdate(userId, {
            firstName,
            lastName,
            color,
            profileSetup: true
        }, { new: true, runValidators: true })

        console.log('dinal daa', userData);

        return res.status(200).json({
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
            profileSetup: userData.profileSetup
        })


    } catch (error) {
        console.log({ error });
        return res.status(500).send('inter server error')
    }
}

export const addProfileImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send('image is required')
        }

        const date = Date.now()
        let fileName = 'upload/profile/' + date + req.file.originalname
        renameSync(req.file.path, fileName)

        const updatedUser = await User.findByIdAndUpdate(req.userId,
            { image: fileName, },
            { new: true, runValidators: true }
        )

        return res.status(200).json({
            image : updatedUser.image
        })
    } catch (error) {
        console.log({ error });
        return res.status(500).send('inter server error')
    }
}

export const removeProfileImage = async (req, res, next) => {
    try {
        const { userId } = req
        const user = await User.findById(userId)

        if(!user) {
            return res.status(404).send('User not found ')
        }

        if(user.image) {
            unlinkSync(user.image)
        }
        user.image = null
        await user.save()
      
        return res.status(200).send('Profile Image removed successfully !')


    } catch (error) {
        console.log({ error });
        return res.status(500).send('inter server error')
    }
}
