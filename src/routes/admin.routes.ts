import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';

const router = Router();

router.get('/admin', AdminController.renderDashboard);
router.post('/admin/users/delete', AdminController.deleteUser);

export default router;
