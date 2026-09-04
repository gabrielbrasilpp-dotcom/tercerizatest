import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/dashboard', authenticateToken, (req: Request, res: Response) => {
  res.send('Dashboard OK');
});

export default router;
