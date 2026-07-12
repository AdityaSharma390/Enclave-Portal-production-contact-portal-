import express from 'express';
import {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
  getDashboardStats,
} from '../controllers/contactController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Apply auth protection to all routes below
router.use(protect);

router.post('/', upload.single('profileImage'), createContact);
router.get('/', getContacts);
router.get('/search', getContacts); // mapping /search to listing endpoint for direct query calls
router.get('/dashboard-stats', getDashboardStats);
router.get('/:id', getContactById);
router.put('/:id', upload.single('profileImage'), updateContact);
router.delete('/:id', deleteContact);

export default router;
