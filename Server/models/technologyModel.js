import { Schema, model } from 'mongoose';

const technologyModel = Schema({
    name: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
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

export default new model('technology', technologyModel);