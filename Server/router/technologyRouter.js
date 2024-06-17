import express from 'express';

import { postRequest, getAll, patchRequest, putRequest, deleteRequest, getOne } from '../controller/commonController.js';
import technologyModel from '../models/technologyModel.js';
const router = express.Router();

router.post('/', postRequest(technologyModel, 'Technology'));
router.get('/', getAll(technologyModel, 'Technology'));
router.get('/:id', getOne(technologyModel, 'Technology'));
router.patch('/:id', patchRequest(technologyModel, 'Technology'));
router.delete('/:id', deleteRequest(technologyModel, 'Technology'));

export default router;