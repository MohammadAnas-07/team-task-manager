const express = require('express');
const router = express.Router({ mergeParams: true });
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/task.controller');
const { createTaskValidator, updateTaskValidator } = require('../validators/task.validator');
const validate = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

// All task routes require auth and at least project membership
router.use(authMiddleware);
router.use(requireRole('ADMIN', 'MEMBER'));

router.get('/', getTasks);
router.post('/', createTaskValidator, validate, createTask);
router.put('/:taskId', updateTaskValidator, validate, updateTask);
router.delete('/:taskId', requireRole('ADMIN'), deleteTask);

module.exports = router;
