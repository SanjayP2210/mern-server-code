import { sendMail } from "../middleware/sendMail.js";
import { sendToken } from "../middleware/sendToken.js";
import userModel from "../models/userModel.js";
import crypto from 'crypto';
import { resetPassword } from "./authController.js";
import { deleteImage, uploadImage } from "./commonController.js";

const getUser = async (req, res, next) => {
    try {
        const { page = 1, limit = 5, search = '', sortBy = 'name', sortOrder = 'asc' } = req.query;

        const query = {
            userName: { $regex: search, $options: 'i' }
        };

        const sortQuery = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        const users = await userModel.find(query)
            .sort(sortQuery)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await userModel.countDocuments(query);

        res.json({
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
        // const data = await userModel.find({}, { "password": 0 }).populate("technology", "name");
        // console.log("data", data);
        // res.json({ users: data });
    } catch (err) {
        console.log("err in getUser", err);
    }
};

const getUserById = async (req, res, next) => {
    try {
        console.log("req.params.id", req.params.id);
        const data = await userModel.findById(req.params.id, { "password": 0 }).populate("technology", "name");
        console.log("data", data);
        res.json({ userData: data });
    } catch (err) {
        console.log("err in getUserById", err);
    }
};

const handleImageUpload = async (req, res, image, public_id) => {
    try {
        if (!image.startsWith("https://res.cloudinary.com")) {
            if (public_id != null && public_id !== 'null') {
                await deleteImage(public_id);
            }

            const result = await uploadImage(image);
            if (result) {
                return {
                    public_id: result?.public_id,
                    url: result?.secure_url,
                };
            } else {
                return req?.file?.filename || image[0];
            }
        }
    } catch (error) {
        console.log("err while upload image in update user", error);
    }
}

const updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const body = req.body;
        if (!body?.image.startsWith("https://res.cloudinary.com")) {
            const { image_public_id = null, image } = body;
            body.image = await handleImageUpload(req, res, image, image_public_id);
        } else {
            body.image = {
                public_id: body?.image.public_id,
                url: body?.image,
            };
        }
        delete body.password;
        body.isAdmin = body.isAdmin === "true";
        body.technology = body?.technology.split(',');
        body.modifiedAt = Date.now();
        body.modifiedBy = req?.user?._id?.toString();
        const userData = await userModel.updateOne({ _id: id }, { $set: body });
        res.json({ message: "User Updated Successfully", user: body });
    } catch (err) {
        console.log("err in updateUser", err);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await userModel.deleteOne({ _id: id });
        console.log("data", data);
        res.json({ message: "User Deleted Successfully" });
    } catch (err) {
        console.log("err in deleteUser", err);
    }
};

const sendEmail = async (req, res, next) => {
    try {
        const response = await sendMail();
        if (response?.isError) {
            const error = response?.error;
            res.status(400).send({ message: 'Error in send email', error: error?.message });
        }
        if (response && response?.messageId) {
            console.log('Message sent: %s', response?.messageId);
            console.log('Preview URL: %s', response?.preview);
            res.status(200).send({ message: `Mail sent successfully to ${response.messageId}`, response });
        }
    } catch (error) {
        res.status(400).send({ message: 'Error in send email', error });
    }
}
// const userSchema = new mongoose.Schema({
//     name: String,
//     image: String,
// });

// export const UserImage = mongoose.model('userimage', userSchema);

// const uploadImage = async (req, res, next) => {
//     try {
//         const user = new UserImage({
//             name: req.body.name,
//             image: req.file.filename,
//         });
//         await user.save();
//         res.json(user);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// }

// const getImage = async (req, res) => {
//     try {
//         const users = await UserImage.find();
//         res.json(users);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// const deleteImage = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const users = await UserImage.deleteOne({ _id: id });
//         if (users) {
//             res.json({ message: 'image deleted successfully', users: users });
//         } else {
//             res.status(400).json({ message: error.message });
//         }
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

const updatePassword = async (req, res, next) => {
    try {
        const { password, confirmPassword, oldPassword, email } = req.body;
        const user = await userModel.findOne({ email: email });
        const isPassMatch = await user.comparePassword(oldPassword);
        if (!isPassMatch) {
            return res.status(401).json({ message: "Old Password is Incorrect", isError: true });
        }

        if (password !== confirmPassword) {
            return res.status(401).json({ message: "Password does not matched", isError: true });
        }

        user.password = password;
        await user.save({ validateBeforeSave: false });

        sendToken(user, res, 200, "Password has been updated successfully");
    } catch (error) {
        res.status(400).json({ message: 'Error while reset password', error: error, isError: true });
    }
}


export {
    getUser,
    getUserById,
    updateUser,
    deleteUser,
    sendEmail,
    updatePassword
    // getImage,
    // uploadImage,
    // deleteImage
};
