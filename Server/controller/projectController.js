import ProjectModel from '../models/ProjectModel.js';
import { uploadImage, handleImageUpload } from './commonController.js';

// Get all projects
const getProject = async (req, res, next) => {
    try {
        const projects = await ProjectModel.find();

        res.json({
            'projects': projects,
        });
    } catch (err) {
        console.log("err in getProject", err);
    }
};

const getProjectById = async (req, res, next) => {
    try {
        console.log("req.params.id", req.params.id);
        const data = await ProjectModel.findById(req.params.id);
        console.log("data", data);
        res.json({ projectData: data });
    } catch (err) {
        console.log("err in getProjectById", err);
    }
};


const addProject = async (req, res, next) => {
    try {
        const body = req.body;
        const { title, description } = body;
        const result = await uploadImage(body?.image);
        console.log(result);
        if (result) {
            body.image = {
                public_id: result?.public_id,
                url: result?.secure_url,
            };
        } else {
            body.image = '';
        }
        body.createdAt = Date.now();
        body.createdBy = req?.user?._id?.toString();
        body.modifiedAt = Date.now();
        body.modifiedBy = req?.user?._id?.toString();
        const newProject = await ProjectModel.create(body);

        res.status(201).json({
            message: "Project saved successfully",
            Project: newProject,
        });
    } catch (error) {
        console.log('error addProject', error);
    }
}

// Update a project
const updateProject = async (req, res) => {

    try {
        const { title, description, newImage = false } = req.body;
        let project = await ProjectModel.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const image = JSON.parse(req.body?.image);
        if (newImage && image?.url?.startsWith("https://res.cloudinary.com")) {
            const { public_id = null } = image;
            project.image = await handleImageUpload(req, res, newImage, public_id);
        } else {
            project.image = image;
        }
        project.title = title;
        project.description = description;
        project.modifiedAt = Date.now();
        project.modifiedBy = req?.user?._id?.toString();
        await project.save();

        res.json({ message: 'Project Updated Successfully', project });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a project
const deleteProject = async (req, res) => {
    try {
        let project = await ProjectModel.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await project.remove();

        res.json({ message: 'Project removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export {
    deleteProject,
    addProject,
    updateProject,
    getProjectById,
    getProject
}