import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Ver/Editar Perfil de Autônomo
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const profile = await (prisma as any).professionalProfile?.findUnique({
      where: { userId }
    });

    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Terceriza - Perfil do Autônomo</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }
          body { background-color: #0d1b2a; color: #e0e1dd; display: flex; min-height: 100vh; }
          .sidebar { width: 240px; background-color: #1b263b; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; border-right: 1px solid #415a77; }
          .logo { color: #fcc200; font-size: 1.5rem; font-weight: bold; margin-bottom: 30px; text-decoration: none; display: block; }
          .nav-link { color: #e0e1dd; text-decoration: none; display: block; padding: 10px; border-radius: 6px; margin-bottom: 10px; }
          .nav-link:hover, .nav-link.active { background-color: #415a77; color: #fcc200; }
          .main-content { flex: 1; padding: 40px; }
          .card-form { background-color: #1b263b; border: 1px solid #415a77; padding: 25px; border-radius: 8px; max-width: 600px; }
          .form-group { margin-bottom: 15px; }
          label { display: block; margin-bottom: 5px; color: #778da9; font-size: 0.9rem; }
          input, textarea { width: 100%; padding: 10px; background: #0d1b2a; border: 1px solid #415a77; border-radius: 4px; color: #fff; }
          button { background: #fcc200; color: #0d1b2a; font-weight: bold; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-top: 10px; }
        </style>
      </head>
      <body>
        <aside class="sidebar">
          <div>
            <a href="/dashboard" class="logo">Terceriza</a>
            <a href="/dashboard" class="nav-link">Painel</a>
            <a href="/services" class="nav-link">Mão de Obra / Serviços</a>
            <a href="/profile" class="nav-link active">Meu Perfil de Autônomo</a>
          </div>
          <a href="/auth/logout" style="color:#e63946; text-decoration:none; font-weight:bold;">Sair</a>
        </aside>

        <main class="main-content">
          <h1 style="margin-bottom: 20px;">Meu Perfil de Profissional Autônomo</h1>
          <div class="card-form">
            <form action="/profile" method="POST">
              <div class="form-group">
                <label>Especialidade Principal (ex: Eletricista, Pintor, Dev Frontend)</label>
                <input type="text" name="profession" value="${profile?.bio || ''}" placeholder="Sua principal atuação" required />
              </div>
              <div class="form-group">
                <label>Habilidades / Tecnologias (separadas por vírgula)</label>
                <input type="text" name="skills" value="${profile?.skills || ''}" placeholder="Ex: Alvenaria, Pintura residencial, Reparos" />
              </div>
              <div class="form-group">
                <label>Resumo dos seus serviços (Apresentação para o cliente)</label>
                <textarea name="description" rows="4" placeholder="Descreva sua experiência e como você trabalha...">${profile?.description || ''}</textarea>
              </div>
              <button type="submit">Salvar Perfil</button>
            </form>
          </div>
        </main>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send('Erro ao carregar perfil.');
  }
});

export default router;
