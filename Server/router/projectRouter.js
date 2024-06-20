import express from 'express';
import { getProject, addProject, updateProject, deleteProject, getProjectById } from '../controller/projectController.js';
const router = express.Router();

router.get('/', getProject)
router.post('/', addProject);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
