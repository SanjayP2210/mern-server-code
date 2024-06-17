import { Schema, model } from 'mongoose';

const contactSchema = new Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdBy: {
        type: Schema.Types.ObjectId
    },
    modifiedBy: {
        type: Schema.Types.ObjectId
    },
    modifiedAt: {
        type: Date,
        default: Date.now()
    }
});

export default model("contact", contactSchema);