import { Router } from 'express';
import { ClassController } from '../controllers/classController.js';
import { validateRequest, validateParams } from '../middleware/validationMiddleware.js';
import { createClassSchema, updateClassSchema, classIdSchema } from '../validators/classValidator.js';

const router = Router();
const classController = new ClassController();

router.get('/', classController.getAllClasses.bind(classController));
router.get('/:id', validateParams(classIdSchema), classController.getClassById.bind(classController));
router.post('/', validateRequest(createClassSchema), classController.createClass.bind(classController));
router.put('/:id', validateParams(classIdSchema), validateRequest(updateClassSchema), classController.updateClass.bind(classController));
router.delete('/:id', validateParams(classIdSchema), classController.deleteClass.bind(classController));

export default router;
