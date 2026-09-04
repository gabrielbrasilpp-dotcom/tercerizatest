import { Router, Request, Response } from 'express'; 
import { PrismaClient } from '@prisma/client'; 
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 
 
const router = Router(); 
const prisma = new PrismaClient(); 
const JWT_SECRET = 'terceriza_segredo_super_seguro'; 
 
router.post('/register', async (req: Request, res: Response) => { 
  try { 
    const { name, email, password } = req.body; 
    const hashedPassword = await bcrypt.hash(password, 10); 
    const user = await prisma.user.create({ data: { name, email, password: hashedPassword } }); 
    res.status(201).json({ id: user.id, name: user.name, email: user.email }); 
  } catch (error) { 
    res.status(400).json({ error: 'Erro ao cadastrar usuario' }); 
  } 
}); 
 
router.post('/login', async (req: Request, res: Response) => { 
  try { 
    const { email, password } = req.body; 
    const user = await prisma.user.findUnique({ where: { email } }); 
    if (!user) return res.status(400).json({ error: 'Usuario nao encontrado' }); 
    const validPassword = await bcrypt.compare(password, user.password); 
    if (!validPassword) return res.status(400).json({ error: 'Senha incorreta' }); 
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' }); 
    res.json({ user: { id: user.id, name: user.name, email: user.email }, token }); 
  } catch (error) { 
    res.status(500).json({ error: 'Erro no login' }); 
  } 
}); 
 
export default router;
