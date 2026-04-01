import express from 'express';
import { getSpareParts } from '../controllers/sparePartsController.js';

const router = express.Router();

router.get('/', getSpareParts);

export default router;
