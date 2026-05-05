const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/project.controller');
const {
  createProjectValidator,
  updateProjectValidator,
  addMemberValidator,
} = require('../validators/project.validator');
const validate = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

// All project routes require auth
router.use(authMiddleware);

router.get('/', getProjects);
router.post('/', createProjectValidator, validate, createProject);
router.get('/:id', getProject);
router.put('/:id', requireRole('ADMIN'), updateProjectValidator, validate, updateProject);
router.delete('/:id', requireRole('ADMIN'), deleteProject);
router.post('/:id/members', requireRole('ADMIN'), addMemberValidator, validate, addMember);
router.delete('/:id/members/:userId', requireRole('ADMIN'), removeMember);

module.exports = router;
