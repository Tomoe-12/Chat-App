import Message from "../models/MessagesModel.js";
import { mkdirSync, renameSync } from 'fs'
import { ENDPOINT, MESSAGE_FILE, PROJECT_ID, storage } from "../lib/appwrite.config.js";


export const getMessages = async (req, res, next) => {
    try {
        const user1 = req.userId
        const user2 = req.body.id

        if (!user1 || !user2) {
            return res.status(400).send('Both user id\' are required ')
        }

        const messages = await Message.find({
            $or: [{ sender: user1, recipient: user2 }, { sender: user2, recipient: user1 }]
        }).sort({ timestamp: 1 })

        return res.status(200).json({ messages })
    } catch (error) {
        console.log({ error });
        return res.status(500).send('Internal server error');
    }
};

// export const uploadFile = async (req, res, next) => {
//     try {
//         if (!req.file) {
//             return res.status(400).send('File is required ! ')
//         }
//         const date = Date.now()
//         let fileDir = `upload/files/${date}`
//         let fileName = `${fileDir}/${req.file.originalname}`

//         mkdirSync(fileDir, { recursive: true })
//         renameSync(req.file.path, fileName)



//         return res.status(200).json({ filePath: fileName })
//     } catch (error) {
//         console.log({ error });
//         return res.status(500).send('Internal server error');
//     }
// };

export const uploadFile = async (req = request, res = response) => {
    const file = req.file; // Retrieve the uploaded file from the request
    console.log('file', file);

    if (!req.file) {
        return res.status(400).send('File is required ! ')
    }

    try {
        // // Upload the image file to Appwrite
        const fileBuffer = file.buffer
        const size = file.size
        const fileName = file.originalname
        const fileMineType = file.mimetype

        //   upload file
        const result = await storage.createFile(
            MESSAGE_FILE,
            'unique()',
            new File([fileBuffer], fileName, { type: fileMineType, size: size })
        )
        const imageUrl = `${ENDPOINT}/storage/buckets/${MESSAGE_FILE}/files/${result.$id}/view?project=${PROJECT_ID}&type=${fileMineType}&fileName=${encodeURIComponent(fileName)}`;
        console.log('result ', result);



        return res.status(200).json({ fileURL: imageUrl });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error uploading image" });
    }
};