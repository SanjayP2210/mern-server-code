import { Schema, model } from 'mongoose';

const ProjectSchema = new Schema({
    title: String,
    description: String,
    image: {
        public_id: { type: String },
        url: { type: String },
    },
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
    }
});

export default model('Project', ProjectSchema);
