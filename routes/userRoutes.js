import express from 'express';
import { protect, requireAdmin } from '../middleware/auth.js';
import {
  getMe,
  updateMe,
  getAllUsers,
  deleteUser,
  promoteUser,
  demoteUser,
} from '../controllers/userController.js';

const router = express.Router();

// All routes below require a valid logged-in user
router.use(protect);

router.get('/me', getMe);
router.put('/me', updateMe);

// Admin-only routes
router.get('/', requireAdmin, getAllUsers);
router.delete('/:userId', requireAdmin, deleteUser);
router.put('/:userId/promote', requireAdmin, promoteUser);
router.put('/:userId/demote', requireAdmin, demoteUser);

export default router;
