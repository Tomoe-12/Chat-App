import User from "../models/UserModel.js";

export const searchContacts = async (req, res, next) => {
    try {
        const { searchTerm } = req.body
        console.log('searchTerm',searchTerm);
        

        if (searchContacts === undefined || searchTerm === null) {
            return res.status(400).send('searchTerm is required')
        }

        const sanitizedSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        )

        console.log('sanitizedSearchTerm',sanitizedSearchTerm);

        const regex = new RegExp(sanitizedSearchTerm, 'i')

        console.log('regex : ',regex);
        

        const contacts = await User.find({
            $and: [
                { _id: { $ne: req.userId } },
                {
                  $or: [{ firstName: regex }, { lastName: regex }, { email: regex }]
                }
            ]
        })
        console.log('contacts : ' ,contacts);
        
        return res.status(200).json({ contacts })
    } catch (error) {
        console.log({ error });
        return res.status(500).send('Internal server error');
    }
};