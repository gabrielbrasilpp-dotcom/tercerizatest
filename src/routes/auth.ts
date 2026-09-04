import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

// Tela de Login
router.get('/login', (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Terceriza - Login</title>
      <style>
        body { background: #0d1b2a; color: #fff; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .card { background: #1b263b; padding: 2rem; border-radius: 8px; border: 1px solid #415a77; width: 300px; }
        h2 { color: #fcc200; margin-bottom: 1rem; text-align: center; }
        input { width: 100%; padding: 0.5rem; margin-bottom: 1rem; border-radius: 4px; border: 1px solid #415a77; background: #0d1b2a; color: #fff; box-sizing: border-box; }
        button { width: 100%; padding: 0.6rem; border: none; border-radius: 4px; background: #fcc200; color: #0d1b2a; font-weight: bold; cursor: pointer; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Entrar no Terceriza</h2>
        <form action="/auth/login" method="POST">
          <input type="email" name="email" placeholder="E-mail" required />
          <input type="password" name="password" placeholder="Senha" required />
          <button type="submit">Entrar</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

// Ação do Login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      res.status(401).send('E-mail ou senha inválidos.');
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      res.status(401).send('E-mail ou senha inválidos.');
      return;
    }

    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: '1d' });

    res.cookie('token', token, { httpOnly: true });
    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).send('Erro interno ao tentar fazer login.');
  }
});

// Logout
router.get('/logout', (req: Request, res: Response) => {
  res.clearCookie('token');
  res.redirect('/auth/login');
});

export default router;
