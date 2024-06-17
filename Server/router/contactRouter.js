import express from 'express';
import { addContact, deleteContact, getContact } from '../controller/contactController.js';
import authMiddleWare from '../middleware/auth-middle-ware.js';

const router = express.Router();
router.get('/', authMiddleWare, getContact);
router.post('/', addContact);
router.delete('/:id', authMiddleWare, deleteContact);
export default router;