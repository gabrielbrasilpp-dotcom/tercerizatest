import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'terceriza_chave_secreta_padrao';

router.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Terceriza - Login</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
        body { background-color: #0d1b2a; color: #ffffff; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .card { background: #1b263b; padding: 2.5rem; border-radius: 12px; width: 100%; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.4); border: 1px solid #415a77; }
        h2 { text-align: center; margin-bottom: 1.5rem; color: #fcc200; font-size: 1.8rem; font-weight: 700; }
        .field { margin-bottom: 1.2rem; }
        label { display: block; margin-bottom: 0.4rem; font-size: 0.9rem; color: #e0e1dd; }
        input { width: 100%; padding: 0.75rem; border-radius: 6px; border: 1px solid #415a77; background: #0d1b2a; color: #ffffff; font-size: 1rem; outline: none; }
        input:focus { border-color: #fcc200; }
        button { width: 100%; padding: 0.75rem; border: none; border-radius: 6px; background: #fcc200; color: #0d1b2a; font-weight: bold; font-size: 1rem; cursor: pointer; transition: background 0.2s, transform 0.1s; margin-top: 0.5rem; }
        button:hover { background: #e0ac00; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Terceriza</h2>
        <form action="/auth/login" method="POST">
          <div class="field">
            <label for="email">E-mail</label>
            <input type="email" id="email" name="email" required placeholder="seu@email.com">
          </div>
          <div class="field">
            <label for="password">Senha</label>
            <input type="password" id="password" name="password" required placeholder="••••••••">
          </div>
          <button type="submit">Entrar no Sistema</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return res.status(401).send(`
        <div style="background:#0d1b2a; color:#fff; min-height:100vh; padding:2rem; font-family:sans-serif;">
          <h3 style="color:#ff4d4d;">Usuário ou senha inválidos!</h3>
          <a href="/auth/login" style="color:#fcc200;">Voltar</a>
        </div>
      `);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).send(`
        <div style="background:#0d1b2a; color:#fff; min-height:100vh; padding:2rem; font-family:sans-serif;">
          <h3 style="color:#ff4d4d;">Usuário ou senha inválidos!</h3>
          <a href="/auth/login" style="color:#fcc200;">Voltar</a>
        </div>
      `);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.cookie('token', token, { httpOnly: true, maxAge: 8 * 3600 * 1000 });
    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).send(`
      <div style="background:#0d1b2a; color:#fff; min-height:100vh; padding:2rem; font-family:sans-serif;">
        <h3 style="color:#ff4d4d;">Erro interno ao processar autenticação.</h3>
      </div>
    `);
  }
});

// Rota GET - Encerra a sessão limpando o cookie
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/auth/login');
});

export default router;
