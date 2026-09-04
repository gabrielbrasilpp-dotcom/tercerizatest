import { Router } from 'express';

const router = Router();

export const serviceRequests: Array<{
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  budget: string;
  createdAt: string;
}> = [
  {
    id: '1',
    title: 'Reforma de muro frontal',
    category: 'pedreiro',
    description: 'Preciso de um profissional para reconstruir cerca de 4 metros de muro que cedeu.',
    location: 'Ponta Porã - MS',
    budget: 'R$ 800 - R$ 1.200',
    createdAt: new Date().toLocaleDateString('pt-BR')
  },
  {
    id: '2',
    title: 'Instalação de tomadas 220v',
    category: 'eletricista',
    description: 'Instalar 3 novos pontos de tomada na cozinha para eletrodomésticos.',
    location: 'Ponta Porã - MS',
    budget: 'R$ 150 - R$ 300',
    createdAt: new Date().toLocaleDateString('pt-BR')
  }
];

router.get('/', (req, res) => {
  const searchQuery = (req.query.search as string || '').toLowerCase();
  const categoryQuery = (req.query.category as string || '').toLowerCase();

  const filteredServices = serviceRequests.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery) || 
                          item.description.toLowerCase().includes(searchQuery);
    const matchesCategory = categoryQuery ? item.category.toLowerCase() === categoryQuery : true;
    return matchesSearch && matchesCategory;
  });

  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Serviços Disponíveis - Tercereiza</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background-color: #f8fafc; color: #0f172a; padding-bottom: 70px; }
        header { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
        .logo { font-size: 1.25rem; font-weight: 700; color: #0f172a; text-decoration: none; display: flex; align-items: center; gap: 8px; }
        .logo-icon { background: #ea580c; color: #fff; padding: 4px 8px; border-radius: 6px; font-size: 0.9rem; }
        .container { max-width: 800px; margin: 24px auto; padding: 0 16px; }
        .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .btn-new { background: #ea580c; color: #fff; padding: 10px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.9rem; }
        .search-filter { display: flex; gap: 8px; margin-bottom: 24px; }
        .search-filter input { flex: 1; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; outline: none; }
        .search-filter button { background: #0f172a; color: #fff; border: none; padding: 0 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .service-list { display: flex; flex-direction: column; gap: 12px; }
        .service-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; }
        .service-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
        .service-title { font-size: 1.1rem; font-weight: 700; color: #0f172a; }
        .service-badge { background: #ffedd5; color: #c2410c; font-size: 0.75rem; padding: 3px 8px; border-radius: 6px; font-weight: 600; text-transform: uppercase; }
        .service-desc { font-size: 0.95rem; color: #475569; margin-bottom: 12px; }
        .service-footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 10px; }
        .budget { font-weight: 700; color: #0f172a; }
        .bottom-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: #fff; border-top: 1px solid #e2e8f0; height: 60px; justify-content: space-around; align-items: center; z-index: 1000; }
        .bottom-nav a { display: flex; flex-direction: column; align-items: center; gap: 2px; text-decoration: none; color: #64748b; font-size: 0.7rem; font-weight: 500; }
        .bottom-nav a.active { color: #ea580c; font-weight: 700; }
        @media (max-width: 768px) { .bottom-nav { display: flex; } }
      </style>
    </head>
    <body>
      <header>
        <a href="/" class="logo"><span class="logo-icon">🛠️</span> Tercereiza</a>
        <a href="/auth/login" style="font-size: 0.9rem; font-weight: 600; color: #0f172a; text-decoration: none;">Entrar</a>
      </header>
      <div class="container">
        <div class="top-bar">
          <h2>Pedidos de Serviço</h2>
          <a href="/services/new" class="btn-new">+ Publicar Pedido</a>
        </div>
        <form action="/services" method="GET" class="search-filter">
          <input type="text" name="search" value="${searchQuery}" placeholder="Buscar por título ou descrição..." />
          <button type="submit">Filtrar</button>
        </form>
        <div class="service-list">
          ${filteredServices.length === 0 ? '<p style="text-align: center; color: #64748b; padding: 32px;">Nenhum serviço encontrado.</p>' : ''}
          ${filteredServices.map(item => `
            <div class="service-card">
              <div class="service-header">
                <span class="service-title">${item.title}</span>
                <span class="service-badge">${item.category}</span>
              </div>
              <p class="service-desc">${item.description}</p>
              <div class="service-footer">
                <span>📍 ${item.location} • 📅 ${item.createdAt}</span>
                <span class="budget">Orçamento: ${item.budget}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <nav class="bottom-nav">
        <a href="/"><span>🏠</span><span>Início</span></a>
        <a href="/services" class="active"><span>🔍</span><span>Buscar</span></a>
        <a href="/services/new"><span>➕</span><span>Publicar</span></a>
        <a href="/dashboard"><span>💬</span><span>Mensagens</span></a>
        <a href="/auth/login"><span>👤</span><span>Perfil</span></a>
      </nav>
    </body>
    </html>
  `);
});

router.get('/new', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Publicar Pedido - Tercereiza</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background-color: #f8fafc; color: #0f172a; padding-bottom: 70px; }
        header { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.25rem; font-weight: 700; color: #0f172a; text-decoration: none; display: flex; align-items: center; gap: 8px; }
        .logo-icon { background: #ea580c; color: #fff; padding: 4px 8px; border-radius: 6px; font-size: 0.9rem; }
        .form-container { max-width: 600px; margin: 32px auto; background: #fff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; }
        h2 { font-size: 1.3rem; margin-bottom: 20px; color: #0f172a; }
        .form-group { margin-bottom: 16px; }
        label { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 6px; color: #334155; }
        input, select, textarea { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; outline: none; }
        input:focus, select:focus, textarea:focus { border-color: #ea580c; }
        textarea { resize: vertical; height: 100px; }
        .btn-submit { background: #ea580c; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 700; font-size: 1rem; cursor: pointer; margin-top: 8px; }
      </style>
    </head>
    <body>
      <header>
        <a href="/" class="logo"><span class="logo-icon">🛠️</span> Tercereiza</a>
        <a href="/services" style="font-size: 0.9rem; color: #64748b; text-decoration: none;">Voltar</a>
      </header>
      <div class="form-container">
        <h2>Publicar Novo Pedido de Serviço</h2>
        <form action="/services/new" method="POST">
          <div class="form-group">
            <label>Título do Pedido</label>
            <input type="text" name="title" required placeholder="Ex: Conserto de vazamento no banheiro" />
          </div>
          <div class="form-group">
            <label>Categoria</label>
            <select name="category">
              <option value="pedreiro">Pedreiro</option>
              <option value="eletricista">Eletricista</option>
              <option value="encanador">Encanador</option>
              <option value="pintor">Pintor</option>
              <option value="geral">Outros / Geral</option>
            </select>
          </div>
          <div class="form-group">
            <label>Descrição Detalhada</label>
            <textarea name="description" required placeholder="Explique o que precisa ser feito..."></textarea>
          </div>
          <div class="form-group">
            <label>Localização</label>
            <input type="text" name="location" value="Ponta Porã - MS" required />
          </div>
          <div class="form-group">
            <label>Orçamento Estimado (Opcional)</label>
            <input type="text" name="budget" placeholder="Ex: R$ 300 - R$ 500" />
          </div>
          <button type="submit" class="btn-submit">Publicar Agora</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

router.post('/new', (req, res) => {
  const { title, category, description, location, budget } = req.body;
  if (title && description) {
    serviceRequests.unshift({
      id: Date.now().toString(),
      title,
      category: category || 'geral',
      description,
      location: location || 'Ponta Porã - MS',
      budget: budget || 'A combinar',
      createdAt: new Date().toLocaleDateString('pt-BR')
    });
  }
  res.redirect('/services');
});

export default router;
