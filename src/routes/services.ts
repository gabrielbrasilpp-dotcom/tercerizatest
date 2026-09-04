import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/services', async (req: Request, res: Response) => {
  try {
    const services = await (prisma as any).service?.findMany() || [];
    res.json(services);
  } catch (error) {
    res.status(500).send('Erro ao buscar serviços.');
  }
});

export default router;
