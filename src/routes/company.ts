import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/company', authenticateToken, async (req: Request, res: Response) => {
  try {
    const companies = await (prisma as any).company.findMany({
      include: { user: true },
    });
    res.json(companies);
  } catch (error) {
    res.status(500).send('Erro ao buscar empresas.');
  }
});

router.post('/company', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, cnpj } = req.body;
    const company = await (prisma as any).company.create({
      data: { name, cnpj, userId: (req as any).user?.userId }
    });
    res.json(company);
  } catch (error) {
    res.status(400).send('Erro ao criar empresa.');
  }
});

export default router;
