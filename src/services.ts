import { Router, Response } from 'express'; 
import { PrismaClient } from '@prisma/client'; 
import { verifyToken, AuthRequest } from './middleware/auth'; 
 
const router = Router(); 
const prisma = new PrismaClient(); 
 
router.post('/services', verifyToken, async (req: AuthRequest, res: Response) => { 
  try { 
    const { title, description, price } = req.body; 
    const userId = req.userId!; 
    const service = await prisma.service.create({ data: { title, description, price: Number(price), userId } }); 
    res.status(201).json(service); 
  } catch (error) { 
    res.status(400).json({ error: 'Erro ao criar servico' }); 
  } 
}); 
 
router.get('/services', async (req, res) => { 
  try { 
    const services = await prisma.service.findMany({ include: { user: { select: { name: true, email: true } } } }); 
    res.json(services); 
  } catch (error) { 
    res.status(500).json({ error: 'Erro ao buscar servicos' }); 
  } 
}); 
 
export default router;
