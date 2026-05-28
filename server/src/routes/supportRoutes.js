import express from 'express';
import { createSupportTicket, getTickets, updateTicketStatus, getUserTickets } from '../controllers/supportController.js';
import { validate, supportSchema } from '../middleware/validate.js';

const router = express.Router();

router.post('/', validate(supportSchema), createSupportTicket);
router.get('/', getTickets); // Admin usage
router.get('/user/:userId', getUserTickets);
router.patch('/:id/status', updateTicketStatus); // Admin usage

export default router;
