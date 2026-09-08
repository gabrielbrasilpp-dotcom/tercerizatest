import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { commonStyles, renderHeader, renderBottomNav } from '../views/layouts';

const prisma = new PrismaClient();

export class ServiceController {
  static async listServices(req: Request, res: Response) {
    const cityFilter = (req.query.city as string) || 'Ponta Porã - MS';
    const categoryFilter = (req.query.category as string) || 'TODAS';
    const searchQuery = (req.query.q as string) || '';

    const whereCondition: any = { city: cityFilter };
    if (categoryFilter !== 'TODAS') whereCondition.category = categoryFilter;
    if (searchQuery.trim() !== '') {
      whereCondition.OR = [
        { title: { contains: searchQuery } },
        { description: { contains: searchQuery } }
      ];
    }

    const services = await prisma.service.findMany({
      where: whereCondition,
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });

    const categories = [
      { id: 'TODAS', label: 'Todas as Categorias', icon: '⚡' },
      { id: 'Manutenção Elétrica', label: 'Elétrica', icon: '💡' },
      { id: 'Refrigeração', label: 'Refrigeração', icon: '❄️' },
      { id: 'Pintura', label: 'Pintura', icon: '🎨' },
      { id: 'Jardinagem', label: 'Jardinagem', icon: '🌱' }
    ];

    const categoryChipsHtml = categories.map(c => `
      <a href="/services?city=${encodeURIComponent(cityFilter)}&category=${encodeURIComponent(c.id)}&q=${encodeURIComponent(searchQuery)}" 
         class="chip ${categoryFilter === c.id ? 'active' : ''}">
         ${c.icon} ${c.label}
      </a>
    `).join('');

    const cardsHtml = services.length > 0 ? services.map(s => `
      <div class="card">
        <div>
          <div class="card-header">
            <span class="badge">${s.category}</span>
            <span class="rating">★ 5.0 (12)</span>
          </div>
          <h3 class="card-title">${s.title}</h3>
          <p class="card-desc">${s.description}</p>
          <div class="prof-info">
            <div class="avatar">${s.user.name.charAt(0)}</div>
            <div>
              <strong>${s.user.name}</strong>
              <small>📍 ${s.city} ${s.user.phone ? '• 📱 ' + s.user.phone : ''}</small>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <div>
            <small class="price-label">Valor estimado</small>
            <div class="price">${s.priceFrom ? 'R$ ' + s.priceFrom.toFixed(2) : 'A combinar'}</div>
          </div>
          <a href="/proposals/chat" class="btn btn-outline btn-sm">💬 Contatar</a>
        </div>
      </div>
    `).join('') : `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Nenhum serviço encontrado.</p>`;

    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR" data-theme="dark">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Explorar Serviços - Tercereiza</title>
        <style>
          ${commonStyles}
          .search-section { background: var(--card-bg); border: 1px solid var(--card-border); padding: 24px; border-radius: 16px; margin-bottom: 24px; }
          .search-bar { display: grid; grid-template-columns: 2fr 1fr 100px; gap: 12px; margin-bottom: 20px; }
          .form-control { width: 100%; padding: 12px 16px; background: var(--bg-color); border: 1px solid var(--card-border); color: var(--text-main); border-radius: 10px; font-size: 0.95rem; outline: none; }
          .chips-container { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; }
          .chip { padding: 8px 16px; background: var(--bg-color); border: 1px solid var(--card-border); border-radius: 20px; color: var(--text-muted); text-decoration: none; font-size: 0.85rem; font-weight: 600; white-space: nowrap; transition: 0.2s; }
          .chip:hover, .chip.active { background: var(--accent); color: #fff; border-color: var(--accent); }
          .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
          .card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s ease, border-color 0.2s ease; }
          .card:hover { transform: translateY(-3px); border-color: var(--accent); }
          .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
          .badge { background: rgba(249, 115, 22, 0.15); color: var(--accent); padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; }
          .rating { color: #eab308; font-size: 0.85rem; font-weight: 700; }
          .card-title { font-size: 1.25rem; margin-bottom: 8px; }
          .card-desc { color: var(--text-muted); font-size: 0.9rem; line-height: 1.5; margin-bottom: 20px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
          .prof-info { display: flex; align-items: center; gap: 12px; border-top: 1px solid var(--card-border); padding-top: 16px; margin-top: auto; }
          .avatar { width: 38px; height: 38px; border-radius: 50%; background: var(--accent); color: #fff; font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 1rem; }
          .prof-info small { display: block; color: var(--text-muted); font-size: 0.78rem; margin-top: 2px; }
          .card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; margin-top: 16px; border-top: 1px dashed var(--card-border); }
          .price-label { font-size: 0.75rem; color: var(--text-muted); display: block; }
          .price { font-size: 1.2rem; font-weight: 800; color: var(--accent); }
        </style>
      </head>
      <body>
        ${renderHeader('services')}
        <div class="container">
          <div class="search-section">
            <form class="search-bar" method="GET" action="/services">
              <input type="text" name="q" value="${searchQuery}" class="form-control" placeholder="O que você precisa hoje?">
              <select name="city" class="form-control">
                <option value="Ponta Porã - MS" ${cityFilter === 'Ponta Porã - MS' ? 'selected' : ''}>Ponta Porã - MS</option>
                <option value="Dourados - MS" ${cityFilter === 'Dourados - MS' ? 'selected' : ''}>Dourados - MS</option>
                <option value="Campo Grande - MS" ${cityFilter === 'Campo Grande - MS' ? 'selected' : ''}>Campo Grande - MS</option>
              </select>
              <input type="hidden" name="category" value="${categoryFilter}">
              <button type="submit" class="btn">🔍 Buscar</button>
            </form>
            <div class="chips-container">${categoryChipsHtml}</div>
          </div>
          <h2>Serviços Encontrados (${services.length})</h2>
          <div class="grid" style="margin-top: 16px;">${cardsHtml}</div>
        </div>
        ${renderBottomNav()}
      </body>
      </html>
    `);
  }

  static renderNewOrderForm(req: Request, res: Response) {
    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR" data-theme="dark">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Publicar Pedido - Tercereiza</title>
        <style>
          ${commonStyles}
          .form-split { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 32px; align-items: start; }
          .form-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 16px; padding: 32px; }
          .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          .form-group { margin-bottom: 20px; }
          .form-group label { display: block; font-weight: 700; margin-bottom: 8px; font-size: 0.9rem; }
          .form-control { width: 100%; padding: 12px; background: var(--bg-color); border: 1px solid var(--card-border); color: var(--text-main); border-radius: 10px; font-size: 0.95rem; outline: none; }
        </style>
      </head>
      <body>
        ${renderHeader('new-service')}
        <div class="container">
          <div class="form-card">
            <h2>Publicar Novo Pedido</h2>
            <form action="/api/orders" method="POST" style="margin-top: 20px;">
              <div class="form-group">
                <label>Título do Pedido</label>
                <input type="text" name="title" class="form-control" placeholder="Ex: Manutenção de Ar-Condicionado" required>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Categoria</label>
                  <select name="category" class="form-control">
                    <option value="Manutenção Elétrica">💡 Manutenção Elétrica</option>
                    <option value="Refrigeração">❄️ Refrigeração</option>
                    <option value="Pintura">🎨 Pintura</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Cidade</label>
                  <select name="city" class="form-control">
                    <option value="Ponta Porã - MS">Ponta Porã - MS</option>
                    <option value="Dourados - MS">Dourados - MS</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Descrição</label>
                <textarea name="description" class="form-control" rows="4" required></textarea>
              </div>
              <button type="submit" class="btn" style="width: 100%; justify-content: center;">🚀 Publicar Pedido</button>
            </form>
          </div>
        </div>
        ${renderBottomNav()}
      </body>
      </html>
    `);
  }

  static async createOrder(req: Request, res: Response) {
    try {
      const { title, category, city, urgency, budgetRange, description } = req.body;
      const client = await prisma.user.findFirst({ where: { role: 'CLIENT' } });
      if (client) {
        await prisma.order.create({
          data: { title, category, city, urgency: urgency || 'Media', budgetRange: budgetRange || 'A combinar', description, clientId: client.id }
        });
      }
      res.redirect('/proposals/chat');
    } catch (err) {
      res.status(500).send('Erro ao salvar pedido.');
    }
  }
}
