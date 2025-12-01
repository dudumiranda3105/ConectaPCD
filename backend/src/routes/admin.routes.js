"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Todas as rotas de admin requerem autenticação e permissão de admin
router.use(auth_middleware_1.authMiddleware);
router.use(auth_middleware_1.adminOnly);
router.get('/stats', admin_controller_1.AdminController.getStats);
router.get('/activities', admin_controller_1.AdminController.getActivities);
router.get('/users', admin_controller_1.AdminController.getUsers);
router.get('/admins', admin_controller_1.AdminController.getAdmins);
router.post('/admins', admin_controller_1.AdminController.createAdmin);
router.delete('/admins/:adminId', admin_controller_1.AdminController.deleteAdmin);
router.get('/companies', admin_controller_1.AdminController.getCompanies);
router.get('/jobs/moderation', admin_controller_1.AdminController.getJobsForModeration);
router.post('/jobs/:jobId/moderate', admin_controller_1.AdminController.moderateJob);
router.get('/metrics/engagement', admin_controller_1.AdminController.getEngagementMetrics);
router.get('/metrics/accessibility', admin_controller_1.AdminController.getAccessibilityMetrics);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map