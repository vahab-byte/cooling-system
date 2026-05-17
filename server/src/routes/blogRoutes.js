import express from 'express';
import { getAllPosts, getPostBySlug, createPost, updatePost, deletePost, getCategories } from '../controllers/blogController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllPosts);
router.get('/categories', getCategories);
router.get('/:slug', getPostBySlug);

// Admin-only routes (protected)
router.post('/', protect, requireRole('admin'), createPost);
router.put('/:id', protect, requireRole('admin'), updatePost);
router.delete('/:id', protect, requireRole('admin'), deletePost);

export default router;
