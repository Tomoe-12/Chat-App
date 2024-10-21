import { request, response } from "express"
import User from "../models/UserModel.js"
import jwt from 'jsonwebtoken'
import { compare } from "bcrypt"
import { unlinkSync } from 'fs'
import { PROFILE_IMAGE, storage, ENDPOINT, PROJECT_ID } from '../lib/appwrite.config.js'
import fs from 'fs'
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
export const addProfileImage = async (req = request, res = response) => {
    const { userId } = req; // Extract user ID from your authentication middleware
    const file = req.file; // Retrieve the uploaded file from the request
    console.log('file', file);

    // Find the user by ID
    const user = await User.findById(userId);
    console.log('user', user);

    if (!user) {
        return res.status(404).json({ message: "User not found!" });
    }

    try {
        // // Upload the image file to Appwrite
        const fileBuffer = file.buffer
        const size = file.size
        const fileName = file.originalname
        const mimeType = file.mimetype

        // Upload the image file to Appwrite
        const result = await storage.createFile(
            PROFILE_IMAGE,
            'unique()',
            new File([fileBuffer], fileName, { type: mimeType, size: size })
        )

        console.log("result", result);

        const imageUrl = `${ENDPOINT}/storage/buckets/${PROFILE_IMAGE}/files/${result.$id}/view?project=${PROJECT_ID}`;
        console.log('imageurl', imageUrl);

        const updatedUser = await User.findByIdAndUpdate(userId,
            { image: imageUrl, },
            { new: true, runValidators: true }
        )

        if (!result || !updatedUser) {
            return res.status(500).json({ error: 'Error creating Image ' })
        }

        return res.status(200).json({ image: imageUrl });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error uploading image" });
    }
};

export const removeProfileImage = async (req, res, next) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId);
        console.log('user', user);

        if (!user || !user.image) {
            return res.status(404).json({ message: 'User And Image not found' });
        }

        // Delete the image from Appwrite
        const fileId = user.image.split('/').slice(-2, -1)[0];
        await storage.deleteFile(PROFILE_IMAGE, fileId);

        // Update the user's profile to remove the image reference
        user.image = null;
        await user.save();

        return res.status(200).send('Profile image removed successfully!');
    } catch (error) {
        console.log({ error });
        return res.status(500).send('Internal server error');
    }
};

export const logout = async (req, res, next) => {
    try {
        res.cookie('jwt', "", { maxAge: 1, secure: true, sameSite: "none" })
        return res.status(200).send('Logout successfully ');
    } catch (error) {
        console.log({ error });
        return res.status(500).send('Internal server error');
    }
};