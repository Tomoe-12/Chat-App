import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import User from "../models/UserModel.js";

export const createChannel = async (req, res, next) => {
    try {
        const { name, members } = req.body

        const userId = req.userId

        const admin = await User.findById(userId)

        if (!admin) return res.status(400).send('Admin not found')

        const validateMembers = await User.find({ _id: { $in: members } })
        console.log('vaidae ember', validateMembers);


        if (validateMembers.length !== members.length) {
            return res.status(400).send('Some members are not valid users')
        }

        const newChannel = new Channel({
            name,
            members,
            admin: userId
        })

        await newChannel.save()
        res.status(201).json({ channel: newChannel })

    } catch (error) {
        console.log({ error });
        return res.status(500).send('Internal server error');
    }
};

export const getUserChannel = async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId)
        const channels = await Channel.find({
            $or: [{ admin: userId }, { members: userId }],
        }).sort({ updateAt: -1 })

        res.status(201).json({ channels })

    } catch (error) {
        console.log({ error });
        return res.status(500).send('Internal server error');
    }
};