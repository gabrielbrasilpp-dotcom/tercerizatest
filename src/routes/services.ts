import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Listar e Criar Serviços
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const services = await (prisma as any).service?.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    }) || [];

    const servicesRows = services.length > 0 
      ? services.map((s: any) => `
        <tr>
          <td><strong>${s.title}</strong></td>
          <td>${s.description || 'Sem descrição'}</td>
          <td>R$ ${s.price ? Number(s.price).toFixed(2) : 'A combinar'}</td>
          <td><span class="badge">Ativo</span></td>
        </tr>
      `).join('')
      : '<tr><td colspan="4" style="text-align:center; color:#778da9;">Nenhum serviço cadastrado ainda.</td></tr>';

    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Terceriza - Serviços</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }
          body { background-color: #0d1b2a; color: #e0e1dd; display: flex; min-height: 100vh; }
          .sidebar { width: 240px; background-color: #1b263b; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; border-right: 1px solid #415a77; }
          .logo { color: #fcc200; font-size: 1.5rem; font-weight: bold; margin-bottom: 30px; text-decoration: none; display: block; }
          .nav-link { color: #e0e1dd; text-decoration: none; display: block; padding: 10px; border-radius: 6px; margin-bottom: 10px; }
          .nav-link:hover, .nav-link.active { background-color: #415a77; color: #fcc200; }
          .main-content { flex: 1; padding: 40px; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
          
          .card-form { background-color: #1b263b; border: 1px solid #415a77; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .form-group { margin-bottom: 15px; }
          label { display: block; margin-bottom: 5px; color: #778da9; font-size: 0.9rem; }
          input, textarea { width: 100%; padding: 10px; background: #0d1b2a; border: 1px solid #415a77; border-radius: 4px; color: #fff; }
          button { background: #fcc200; color: #0d1b2a; font-weight: bold; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
          
          table { width: 100%; border-collapse: collapse; background-color: #1b263b; border-radius: 8px; overflow: hidden; }
          th, td { padding: 15px; text-align: left; border-bottom: 1px solid #415a77; }
          th { background-color: #14213d; color: #fcc200; font-size: 0.9rem; }
          .badge { background: #1b4332; color: #52b788; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; }
        </style>
      </head>
      <body>
        <aside class="sidebar">
          <div>
            <a href="/dashboard" class="logo">Terceriza</a>
            <a href="/dashboard" class="nav-link">Painel</a>
            <a href="/services" class="nav-link active">Serviços</a>
            <a href="/company" class="nav-link">Empresas</a>
            <a href="/profile" class="nav-link">Meu Perfil</a>
          </div>
          <a href="/auth/logout" style="color:#e63946; text-decoration:none; font-weight:bold;">Sair</a>
        </aside>

        <main class="main-content">
          <div class="header">
            <h1>Gerenciamento de Serviços</h1>
          </div>

          <div class="card-form">
            <h2 style="margin-bottom: 15px; color: #fcc200; font-size: 1.1rem;">Cadastrar Novo Serviço</h2>
            <form action="/services" method="POST">
              <div class="form-group">
                <label>Título do Serviço</label>
                <input type="text" name="title" placeholder="Ex: Desenvolvimento Web, Consultoria Contábil" required />
              </div>
              <div class="form-group">
                <label>Descrição</label>
                <textarea name="description" rows="3" placeholder="Detalhes do serviço prestado..."></textarea>
              </div>
              <div class="form-group">
                <label>Preço Estimado (R$)</label>
                <input type="number" step="0.01" name="price" placeholder="0.00" />
              </div>
              <button type="submit">Publicar Serviço</button>
            </form>
          </div>

          <h2 style="margin-bottom: 15px; font-size: 1.2rem;">Serviços Publicados</h2>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Descrição</th>
                <th>Preço</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${servicesRows}
            </tbody>
          </table>
        </main>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send('Erro ao carregar serviços.');
  }
});

// Processar a Criação do Serviço
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { title, description, price } = req.body;
    const userId = (req as any).user?.userId;

    await (prisma as any).service?.create({
      data: {
        title,
        description,
        price: price ? parseFloat(price) : null,
        userId
      }
    });

    res.redirect('/services');
  } catch (error) {
    res.status(400).send('Erro ao cadastrar serviço.');
  }
});

export default router;
