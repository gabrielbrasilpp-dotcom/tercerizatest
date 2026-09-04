import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/dashboard', authenticateToken, (req: Request, res: Response) => {
  const userEmail = (req as any).user?.email || 'Usuário';

  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Terceriza - Painel</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }
        body { background-color: #0d1b2a; color: #e0e1dd; display: flex; min-height: 100vh; }
        .sidebar { width: 240px; background-color: #1b263b; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; border-right: 1px solid #415a77; }
        .logo { color: #fcc200; font-size: 1.5rem; font-weight: bold; margin-bottom: 30px; text-decoration: none; display: block; }
        .nav-link { color: #e0e1dd; text-decoration: none; display: block; padding: 10px; border-radius: 6px; margin-bottom: 10px; }
        .nav-link:hover, .nav-link.active { background-color: #415a77; color: #fcc200; }
        .main-content { flex: 1; padding: 40px; }
        .grid-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .card { background-color: #1b263b; border: 1px solid #415a77; padding: 20px; border-radius: 8px; }
        .card-title { font-size: 0.85rem; color: #778da9; text-transform: uppercase; margin-bottom: 10px; }
        .card-value { font-size: 1.8rem; font-weight: bold; color: #fcc200; }
        .actions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
        .action-card { background-color: #1b263b; border: 1px solid #415a77; padding: 20px; border-radius: 8px; text-decoration: none; color: #e0e1dd; transition: transform 0.2s; }
        .action-card:hover { transform: translateY(-3px); border-color: #fcc200; }
        .action-card h3 { color: #fcc200; margin-bottom: 8px; }
        .action-card p { color: #778da9; font-size: 0.85rem; }
      </style>
    </head>
    <body>
      <aside class="sidebar">
        <div>
          <a href="/dashboard" class="logo">Terceriza</a>
          <a href="/dashboard" class="nav-link active">Painel</a>
          <a href="/services" class="nav-link">Serviços / Mão de Obra</a>
          <a href="/profile" class="nav-link">Meu Perfil de Autônomo</a>
        </div>
        <a href="/auth/logout" style="color:#e63946; text-decoration:none; font-weight:bold;">Sair</a>
      </aside>

      <main class="main-content">
        <h1 style="margin-bottom: 10px;">Plataforma de Mão de Obra Autônoma</h1>
        <p style="color: #778da9; margin-bottom: 30px;">Conectado como: <strong>${userEmail}</strong></p>

        <section class="grid-cards">
          <div class="card">
            <div class="card-title">Mão de Obra Ofertada</div>
            <div class="card-value">Ativo</div>
          </div>
          <div class="card">
            <div class="card-title">Avaliação de Clientes</div>
            <div class="card-value">5.0 ★</div>
          </div>
        </section>

        <h2 style="margin-bottom: 15px; font-size: 1.2rem;">Ações do Autônomo / Contratante</h2>
        <section class="actions-grid">
          <a href="/services" class="action-card">
            <h3>Oferecer Mão de Obra</h3>
            <p>Anuncie um novo tipo de serviço ou trabalho que você realiza.</p>
          </a>
          <a href="/profile" class="action-card">
            <h3>Meu Perfil Profissional</h3>
            <p>Configure suas habilidades e apresentação para quem busca contratação.</p>
          </a>
        </section>
      </main>
    </body>
    </html>
  `);
});

export default router;
