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
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Terceriza - Painel</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        body { background-color: #0d1b2a; color: #e0e1dd; display: flex; min-height: 100vh; }
        
        /* Sidebar */
        .sidebar { width: 240px; background-color: #1b263b; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; border-right: 1px solid #415a77; }
        .logo { color: #fcc200; font-size: 1.5rem; font-weight: bold; margin-bottom: 30px; text-decoration: none; display: block; }
        .nav-list { list-style: none; }
        .nav-item { margin-bottom: 15px; }
        .nav-link { color: #e0e1dd; text-decoration: none; font-size: 0.95rem; display: block; padding: 10px; border-radius: 6px; transition: 0.2s; }
        .nav-link:hover, .nav-link.active { background-color: #415a77; color: #fcc200; }
        .btn-logout { color: #e63946; text-decoration: none; padding: 10px; display: block; font-weight: bold; }

        /* Main Content */
        .main-content { flex: 1; padding: 40px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .welcome-text h1 { font-size: 1.8rem; color: #ffffff; }
        .welcome-text p { color: #778da9; font-size: 0.9rem; margin-top: 5px; }
        
        /* Cards */
        .grid-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .card { background-color: #1b263b; border: 1px solid #415a77; padding: 20px; border-radius: 8px; }
        .card-title { font-size: 0.85rem; color: #778da9; text-transform: uppercase; margin-bottom: 10px; }
        .card-value { font-size: 1.8rem; font-weight: bold; color: #fcc200; }

        /* Actions Section */
        .section-title { font-size: 1.2rem; color: #fff; margin-bottom: 15px; }
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
          <ul class="nav-list">
            <li class="nav-item"><a href="/dashboard" class="nav-link active">Painel</a></li>
            <li class="nav-item"><a href="/services" class="nav-link">Serviços</a></li>
            <li class="nav-item"><a href="/company" class="nav-link">Empresas</a></li>
            <li class="nav-item"><a href="/profile" class="nav-link">Meu Perfil</a></li>
          </ul>
        </div>
        <a href="/auth/logout" class="btn-logout">Sair</a>
      </aside>

      <main class="main-content">
        <header class="header">
          <div class="welcome-text">
            <h1>Painel de Controle</h1>
            <p>Conectado como: <strong>${userEmail}</strong></p>
          </div>
        </header>

        <section class="grid-cards">
          <div class="card">
            <div class="card-title">Serviços Ativos</div>
            <div class="card-value">0</div>
          </div>
          <div class="card">
            <div class="card-title">Empresas Parceiras</div>
            <div class="card-value">0</div>
          </div>
          <div class="card">
            <div class="card-title">Propostas Pendentes</div>
            <div class="card-value">0</div>
          </div>
        </section>

        <h2 class="section-title">Ações Rápidas</h2>
        <section class="actions-grid">
          <a href="/services" class="action-card">
            <h3>Gerenciar Serviços</h3>
            <p>Cadastre novos serviços prestados ou navegue pelas oportunidades.</p>
          </a>
          <a href="/company" class="action-card">
            <h3>Minha Empresa</h3>
            <p>Atualize os dados do CNPJ, perfil corporativo e contratações.</p>
          </a>
          <a href="/profile" class="action-card">
            <h3>Perfil Profissional</h3>
            <p>Ajuste suas competências, histórico de trabalhos e dados pessoais.</p>
          </a>
        </section>
      </main>
    </body>
    </html>
  `);
});

export default router;
