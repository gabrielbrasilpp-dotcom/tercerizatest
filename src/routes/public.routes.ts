import { Router } from 'express';
import { HomeController } from '../controllers/HomeController';
import { ServiceController } from '../controllers/ServiceController';
import { ChatController } from '../controllers/ChatController';

const router = Router();

router.get('/', HomeController.renderHome);
router.get('/services', ServiceController.listServices);
router.get('/services/new', ServiceController.renderNewOrderForm);
router.post('/api/orders', ServiceController.createOrder);

router.get('/proposals/chat', ChatController.renderChat);
router.post('/api/messages', ChatController.sendMessage);

export default router;
