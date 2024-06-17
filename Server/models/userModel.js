import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import { Schema } from "mongoose";
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    image: {
        public_id: { type: String },
        url: { type: String },
    },
    userName: {
        type: String,
        required: [true, 'user name required'],
        min: [3, '3 characters required'],
    },
    email: {
        type: String,
        required: [true, 'email required'],
        validate: {
            validator: function (value) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    mobileNumber: {
        type: String,
        max: [10, '10 Characters is allowed'],
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
    },
    password: {
        type: String,
        required: [true, 'password required']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    technology: { type: [Schema.Types.ObjectId], ref: 'technology', required: true },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    createdBy: {
        type: Schema.Types.ObjectId
    },
    modifiedBy: {
        type: Schema.Types.ObjectId
    },
    modifiedAt: {
        type: Date,
        default: Date.now()
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

userSchema.pre("save", async function (next) {
    const user = this;

    if (!user.isModified('password')) {
        next();
    }

    try {
        const saltRound = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(user.password, saltRound);
        user.password = hash_password;
    } catch (error) {
        console.log('error while bcrypting', error);
    }
})

userSchema.methods.generateToken = function () {
    try {
        return jwt.sign({
            userID: this._id.toString(),
            isAdmin: this._isAdmin,
            email: this.email
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE
        }
        )
    } catch (error) {
        console.log('error while generating Token', error);
    }
}

userSchema.methods.comparePassword = async function (password) {
    const user = this;
    try {
        return await bcrypt.compare(password, user.password);
    } catch (error) {
        console.log('error while comparePassword', error);
    }
}

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}

export default new mongoose.model('user', userSchema);