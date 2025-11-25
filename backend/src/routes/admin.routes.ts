import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authMiddleware, adminOnly } from '../middleware/auth.middleware';

const router = Router();

// Todas as rotas de admin requerem autenticação e permissão de admin
router.use(authMiddleware);
router.use(adminOnly);

router.get('/stats', AdminController.getStats);
router.get('/activities', AdminController.getActivities);
router.get('/users', AdminController.getUsers);
router.get('/admins', AdminController.getAdmins);
router.post('/admins', AdminController.createAdmin);
router.delete('/admins/:adminId', AdminController.deleteAdmin);
router.get('/companies', AdminController.getCompanies);
router.get('/jobs/moderation', AdminController.getJobsForModeration);
router.post('/jobs/:jobId/moderate', AdminController.moderateJob);
router.get('/metrics/engagement', AdminController.getEngagementMetrics);
router.get('/metrics/accessibility', AdminController.getAccessibilityMetrics);

export default router;
