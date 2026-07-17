import { Router } from 'express';
import { WaitlistController } from '../controllers/waitlistController.js';
import { validateRequest, validateParams } from '../middleware/validationMiddleware.js';
import { createWaitlistSchema, updateWaitlistSchema, waitlistIdSchema } from '../validators/waitlistValidator.js';

const router = Router();
const waitlistController = new WaitlistController();

router.get('/', waitlistController.getAllWaitlistEntries.bind(waitlistController));
router.get('/:id', validateParams(waitlistIdSchema), waitlistController.getWaitlistById.bind(waitlistController));
router.post('/', validateRequest(createWaitlistSchema), waitlistController.addToWaitlist.bind(waitlistController));
router.put('/:id', validateParams(waitlistIdSchema), validateRequest(updateWaitlistSchema), waitlistController.updateWaitlistEntry.bind(waitlistController));
router.delete('/:id', validateParams(waitlistIdSchema), waitlistController.removeFromWaitlist.bind(waitlistController));

export default router;
