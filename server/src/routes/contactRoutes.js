import express from 'express';
import { submitContact, getContacts } from '../controllers/contactController.js';
import { validate, contactSchema } from '../middleware/validate.js';

const router = express.Router();

router.post('/', validate(contactSchema), submitContact);
router.get('/', getContacts); // Admin usage

export default router;
