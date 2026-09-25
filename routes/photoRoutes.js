import express from 'express';
import { protect, requireAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import {
  getPhotos,
  getAllPhotosAdmin,
  uploadPhoto,
  updatePhoto,
  deletePhoto,
} from '../controllers/photoController.js';

const router = express.Router();

// All photo routes require authentication
router.use(protect);

// NOTE: /all must be declared before any /:photoId-style route so that
// "all" is never mistakenly parsed as a photoId.
router.get('/all', requireAdmin, getAllPhotosAdmin);

router.get('/', getPhotos);
router.post('/', upload.single('image'), uploadPhoto);
router.put('/:photoId', upload.single('image'), updatePhoto);
router.delete('/:photoId', deletePhoto);

export default router;
