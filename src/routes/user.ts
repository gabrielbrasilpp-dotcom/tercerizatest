import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.redirect('/auth/login');
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).send('Usuário não encontrado.');
      return;
    }

    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Terceriza - Perfil do Usuário</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
          body { background-color: #0d1b2a; color: #ffffff; min-height: 100vh; }
          header { background: #1b263b; padding: 1.2rem 2rem; border-bottom: 1px solid #415a77; display: flex; justify-content: space-between; align-items: center; }
          h1 { color: #fcc200; font-size: 1.5rem; }
          nav { display: flex; align-items: center; gap: 1.5rem; }
          nav a { color: #ffffff; text-decoration: none; font-weight: 500; font-size: 0.95rem; }
          nav a:hover, nav a.active { color: #fcc200; }
          .logout-btn { background: #e63946; color: #ffffff; padding: 0.5rem 1rem; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 0.85rem; }
          main { padding: 2.5rem; max-width: 900px; margin: 0 auto; }
          .card { background: #1b263b; border: 1px solid #415a77; border-radius: 12px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 10px 25px rgba(0,0,0,0.4); }
          h2 { color: #fcc200; margin-bottom: 1.2rem; font-size: 1.3rem; }
          .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
          .field { display: flex; flex-direction: column; gap: 0.4rem; }
          label { font-size: 0.85rem; color: #e0e1dd; }
          input, textarea { padding: 0.75rem; border-radius: 6px; border: 1px solid #415a77; background: #0d1b2a; color: #fff; outline: none; }
          input:focus, textarea:focus { border-color: #fcc200; }
          textarea { resize: vertical; min-height: 80px; }
          button { padding: 0.75rem 1.5rem; border: none; border-radius: 6px; background: #fcc200; color: #0d1b2a; font-weight: bold; cursor: pointer; }
          button:hover { background: #e0ac00; }
          .badge-container { display: flex; gap: 0.8rem; flex-wrap: wrap; margin-top: 1rem; }
          .badge { padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.8rem; font-weight: bold; background: #0d1b2a; border: 1px solid #415a77; }
          .verified { color: #2ec4b6; border-color: #2ec4b6; }
          .unverified { color: #e63946; border-color: #e63946; }
        </style>
      </head>
      <body>
        <header>
          <h1>Terceriza</h1>
          <nav>
            <a href="/dashboard">Painel</a>
            <a href="/profile" class="active">Meu Perfil</a>
            <a href="/professional-profile">Perfil Profissional</a>
            <a href="/auth/logout" class="logout-btn">Sair</a>
          </nav>
        </header>
        <main>
          <div class="card">
            <h2>Dados Pessoais</h2>
            <form action="/profile" method="POST">
              <div class="grid">
                <div class="field">
                  <label>Nome Completo</label>
                  <input type="text" name="name" value="${user.name || ''}" required>
                </div>
                <div class="field">
                  <label>URL da Foto de Perfil</label>
                  <input type="text" name="photo" value="${user.photo || ''}" placeholder="https://...">
                </div>
                <div class="field">
                  <label>Cidade</label>
                  <input type="text" name="city" value="${user.city || ''}">
                </div>
                <div class="field">
                  <label>Estado</label>
                  <input type="text" name="state" value="${user.state || ''}">
                </div>
              </div>
              <div class="field" style="margin-bottom: 1rem;">
                <label>Sobre Você / Bio</label>
                <textarea name="description">${user.description || ''}</textarea>
              </div>
              <button type="submit">Atualizar Perfil</button>
            </form>

            <h2 style="margin-top: 2rem;">Status de Verificação</h2>
            <div class="badge-container">
              <span class="badge ${user.emailVerified ? 'verified' : 'unverified'}">E-mail ${user.emailVerified ? '✔' : '✖'}</span>
              <span class="badge ${user.phoneVerified ? 'verified' : 'unverified'}">Telefone ${user.phoneVerified ? '✔' : '✖'}</span>
              <span class="badge ${user.identityVerified ? 'verified' : 'unverified'}">Identidade ${user.identityVerified ? '✔' : '✖'}</span>
              <span class="badge ${user.professionalVerified ? 'verified' : 'unverified'}">Profissional ${user.professionalVerified ? '✔' : '✖'}</span>
            </div>
          </div>
        </main>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send('Erro ao carregar perfil.');
  }
});

router.post('/profile', authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.redirect('/auth/login');
    return;
  }

  const { name, photo, city, state, description } = req.body;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name, photo, city, state, description },
    });
    res.redirect('/profile');
  } catch (error) {
    res.status(400).send('Erro ao atualizar perfil.');
  }
});

export default router;
