import express from 'express';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { SITE_IMAGES } from './config/images';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));

const commonStyles = `
  :root {
    --bg-color: #0f172a;
    --card-bg: #1e293b;
    --card-border: #334155;
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --accent: #f97316;
    --accent-hover: #ea580c;
    --success: #22c55e;
    --danger: #ef4444;
    --warning: #f59e0b;
    --info: #3b82f6;
  }
  [data-theme="light"] {
    --bg-color: #f1f5f9;
    --card-bg: #ffffff;
    --card-border: #cbd5e1;
    --text-main: #0f172a;
    --text-muted: #64748b;
    --accent: #ea580c;
    --accent-hover: #c2410c;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body { background-color: var(--bg-color); color: var(--text-main); min-height: 100vh; transition: 0.3s ease; }
  header { background: var(--card-bg); border-bottom: 1px solid var(--card-border); padding: 16px 32px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
  .logo { font-size: 1.4rem; font-weight: 800; color: var(--text-main); text-decoration: none; display: flex; align-items: center; gap: 10px; }
  .logo-icon { background: var(--accent); color: #fff; padding: 6px 10px; border-radius: 8px; font-size: 1rem; }
  .nav-links { display: flex; gap: 24px; align-items: center; }
  .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 0.95rem; font-weight: 600; }
  .nav-links a:hover { color: var(--accent); }
  .btn { background: var(--accent); color: #fff; padding: 10px 20px; border-radius: 10px; text-decoration: none; font-weight: 700; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
  .btn:hover { background: var(--accent-hover); }
  .btn-outline { background: transparent; color: var(--text-main); border: 1px solid var(--card-border); }
  .btn-outline:hover { border-color: var(--accent); background: var(--card-border); }
  .btn-danger { background: var(--danger); color: #fff; }
  .btn-danger:hover { background: #dc2626; }
  .btn-success { background: var(--success); color: #fff; }
  .btn-success:hover { background: #16a34a; }
  .btn-warning { background: var(--warning); color: #fff; }
  .btn-warning:hover { background: #d97706; }
  .btn-sm { padding: 6px 12px; font-size: 0.8rem; border-radius: 6px; }
  .container { max-width: 1320px; margin: 30px auto; padding: 0 20px; }
  .bottom-nav { display: none; }
  @media (max-width: 768px) {
    .nav-links { display: none; }
    .bottom-nav {
      display: flex; position: fixed; bottom: 0; left: 0; right: 0;
      background: var(--card-bg); border-top: 1px solid var(--card-border);
      height: 65px; justify-content: space-around; align-items: center; z-index: 1000;
    }
    body { padding-bottom: 75px; }
  }
  .bottom-nav a { display: flex; flex-direction: column; align-items: center; gap: 4px; text-decoration: none; color: var(--text-muted); font-size: 0.75rem; font-weight: 600; }
  .bottom-nav a:hover { color: var(--accent); }
`;

// TELA 1: HOME PAGE
app.get('/', async (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR" data-theme="dark">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tercereiza - Marketplace C2C de MS</title>
      <style>
        ${commonStyles}
        .hero-split { max-width: 1200px; margin: 40px auto; padding: 0 24px; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px; align-items: center; }
        .hero-content h1 { font-size: 3rem; margin-bottom: 16px; font-weight: 800; line-height: 1.15; }
        .hero-content h1 span { color: var(--accent); }
        .hero-content p { font-size: 1.15rem; color: var(--text-muted); margin-bottom: 30px; }
        .hero-image-box { border-radius: 20px; overflow: hidden; border: 1px solid var(--card-border); background: var(--card-bg); }
        .hero-image-box img { width: 100%; height: 480px; object-fit: contain; padding: 10px; }
        .region-box { background: var(--card-bg); border: 1px solid var(--card-border); padding: 24px; border-radius: 16px; margin-top: 30px; }
        .region-select { width: 100%; padding: 12px; background: var(--bg-color); color: var(--text-main); border: 1px solid var(--card-border); border-radius: 10px; font-size: 1rem; margin-top: 8px; }
        @media (max-width: 768px) { .hero-split { grid-template-columns: 1fr; text-align: center; } }
      </style>
    </head>
    <body>
      <header>
        <a href="/" class="logo"><span class="logo-icon">🛠️</span> Tercereiza</a>
        <nav class="nav-links">
          <a href="/">Início</a>
          <a href="/services">Serviços</a>
          <a href="/services/new">Publicar Pedido</a>
          <a href="/proposals/chat">Mensagens</a>
          <a href="/admin" style="color: #ef4444; font-weight: 700;">🛡️ Central de Comando ADM</a>
        </nav>
        <button class="btn btn-outline" onclick="toggleTheme()">☀️ / 🌙 Tema</button>
      </header>

      <section class="hero-split">
        <div class="hero-content">
          <h1>Conforto e Soluções em <span>Mato Grosso do Sul</span></h1>
          <p>Conecte-se instantaneamente com profissionais qualificados locais ou publique sua demanda com direcionamento inteligente.</p>
          <div style="display: flex; gap: 15px; flex-wrap: wrap;">
            <a href="/services" class="btn">🔍 Explorar Serviços</a>
            <a href="/services/new" class="btn btn-outline">➕ Publicar Pedido</a>
          </div>
          <div class="region-box">
            <label><b>📍 Sua Região / Cidade Atual:</b></label>
            <select class="region-select">
              <option value="Ponta Porã - MS">Ponta Porã - MS (Detectado)</option>
              <option value="Dourados - MS">Dourados - MS</option>
              <option value="Campo Grande - MS">Campo Grande - MS</option>
              <option value="Três Lagoas - MS">Três Lagoas - MS</option>
            </select>
          </div>
        </div>
        <div class="hero-image-box">
          <img src="${SITE_IMAGES.heroProfessional}" alt="Profissional Real em Manutenção">
        </div>
      </section>

      <nav class="bottom-nav">
        <a href="/"><span>🏠</span><span>Início</span></a>
        <a href="/services"><span>🔍</span><span>Buscar</span></a>
        <a href="/services/new"><span>➕</span><span>Publicar</span></a>
        <a href="/proposals/chat"><span>💬</span><span>Mensagens</span></a>
        <a href="/admin"><span>🛡️</span><span>Admin</span></a>
      </nav>

      <script>
        function toggleTheme() {
          const html = document.documentElement;
          const current = html.getAttribute('data-theme');
          html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
        }
      </script>
    </body>
    </html>
  `);
});

// TELA 2: EXPLORAR SERVIÇOS
app.get('/services', async (req, res) => {
  const cityFilter = (req.query.city as string) || 'Ponta Porã - MS';
  const categoryFilter = (req.query.category as string) || 'TODAS';
  const searchQuery = (req.query.q as string) || '';

  const whereCondition: any = { city: cityFilter };

  if (categoryFilter !== 'TODAS') {
    whereCondition.category = categoryFilter;
  }

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
  `).join('') : `
    <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: var(--card-bg); border-radius: 16px; border: 1px solid var(--card-border);">
      <p style="font-size: 1.2rem; color: var(--text-muted); margin-bottom: 12px;">Nenhum serviço encontrado com os filtros selecionados.</p>
      <a href="/services" class="btn btn-outline">Limpar Filtros</a>
    </div>
  `;

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
      <header>
        <a href="/" class="logo"><span class="logo-icon">🛠️</span> Tercereiza</a>
        <nav class="nav-links">
          <a href="/">Início</a>
          <a href="/services" style="color: var(--accent);">Serviços</a>
          <a href="/services/new">Publicar Pedido</a>
          <a href="/proposals/chat">Mensagens</a>
          <a href="/admin" style="color: #ef4444; font-weight: 700;">🛡️ Central de Comando ADM</a>
        </nav>
      </header>

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

          <div class="chips-container">
            ${categoryChipsHtml}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2>Serviços Encontrados (${services.length})</h2>
          ${(searchQuery || categoryFilter !== 'TODAS') ? `<a href="/services" style="color: var(--accent); font-size: 0.9rem; text-decoration: none;">✕ Limpar Filtros</a>` : ''}
        </div>

        <div class="grid">
          ${cardsHtml}
        </div>
      </div>

      <nav class="bottom-nav">
        <a href="/"><span>🏠</span><span>Início</span></a>
        <a href="/services"><span>🔍</span><span>Buscar</span></a>
        <a href="/services/new"><span>➕</span><span>Publicar</span></a>
        <a href="/proposals/chat"><span>💬</span><span>Mensagens</span></a>
        <a href="/admin"><span>🛡️</span><span>Admin</span></a>
      </nav>
    </body>
    </html>
  `);
});

// TELA 3: PUBLICAÇÃO DE PEDIDO
app.get('/services/new', (req, res) => {
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
        .preview-box { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 16px; padding: 24px; position: sticky; top: 100px; }
        .preview-header { font-size: 0.85rem; color: var(--accent); font-weight: 800; text-transform: uppercase; margin-bottom: 12px; }
        .preview-card { background: var(--bg-color); border: 1px solid var(--card-border); border-radius: 12px; padding: 20px; }
        .badge-urgency { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 800; display: inline-block; }
        .urgency-Alta { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
        .urgency-Media { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
        .urgency-Baixa { background: rgba(16, 185, 129, 0.2); color: #10b981; }
      </style>
    </head>
    <body>
      <header>
        <a href="/" class="logo"><span class="logo-icon">🛠️</span> Tercereiza</a>
        <nav class="nav-links">
          <a href="/">Início</a>
          <a href="/services">Serviços</a>
          <a href="/services/new" style="color: var(--accent);">Publicar Pedido</a>
          <a href="/proposals/chat">Mensagens</a>
          <a href="/admin" style="color: #ef4444; font-weight: 700;">🛡️ Central de Comando ADM</a>
        </nav>
      </header>

      <div class="container">
        <div class="form-split">
          <div class="form-card">
            <h2>Publicar Novo Pedido</h2>
            <p style="color: var(--text-muted); margin-bottom: 24px;">Preencha os detalhes para os profissionais da região enviarem propostas.</p>

            <form action="/api/orders" method="POST">
              <div class="form-group">
                <label>Título do Pedido</label>
                <input type="text" id="title" name="title" class="form-control" placeholder="Ex: Instalação de Ar-Condicionado 12000 BTUs" required oninput="updatePreview()">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Categoria do Serviço</label>
                  <select id="category" name="category" class="form-control" onchange="updatePreview()">
                    <option value="Manutenção Elétrica">💡 Manutenção Elétrica</option>
                    <option value="Refrigeração">❄️ Refrigeração</option>
                    <option value="Pintura">🎨 Pintura e Reformas</option>
                    <option value="Jardinagem">🌱 Jardinagem</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Cidade / Localização</label>
                  <select id="city" name="city" class="form-control" onchange="updatePreview()">
                    <option value="Ponta Porã - MS">Ponta Porã - MS</option>
                    <option value="Dourados - MS">Dourados - MS</option>
                    <option value="Campo Grande - MS">Campo Grande - MS</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Nível de Urgência</label>
                  <select id="urgency" name="urgency" class="form-control" onchange="updatePreview()">
                    <option value="Baixa">🟢 Baixa (Esta semana)</option>
                    <option value="Media" selected>🟡 Média (Próximos 2-3 dias)</option>
                    <option value="Alta">🔴 Alta / Urgente (Hoje/Amanhã)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Orçamento Estimado</label>
                  <select id="budgetRange" name="budgetRange" class="form-control" onchange="updatePreview()">
                    <option value="A combinar">A combinar</option>
                    <option value="Até R$ 150">Até R$ 150</option>
                    <option value="R$ 150 - R$ 400">R$ 150 - R$ 400</option>
                    <option value="R$ 400 - R$ 1.000">R$ 400 - R$ 1.000</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>Descrição Detalhada</label>
                <textarea id="description" name="description" class="form-control" rows="4" placeholder="Descreva o problema..." required oninput="updatePreview()"></textarea>
              </div>

              <button type="submit" class="btn" style="width: 100%; justify-content: center; padding: 14px; font-size: 1.05rem;">
                🚀 Publicar Pedido no Banco
              </button>
            </form>
          </div>

          <div class="preview-box">
            <div class="preview-header">👁️ Pré-visualização do Anúncio</div>
            <div class="preview-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span id="prevCategory" style="font-size: 0.8rem; font-weight: 700; color: var(--accent);">💡 Manutenção Elétrica</span>
                <span id="prevUrgency" class="badge-urgency urgency-Media">Urgência: Média</span>
              </div>
              <h3 id="prevTitle" style="font-size: 1.15rem; margin-bottom: 8px;">Título do seu pedido aqui</h3>
              <p id="prevDesc" style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 16px;">Descrição do pedido...</p>
              <div style="border-top: 1px dashed var(--card-border); padding-top: 12px; font-size: 0.82rem; color: var(--text-muted);">
                <div>📍 <b>Cidade:</b> <span id="prevCity">Ponta Porã - MS</span></div>
                <div>💰 <b>Orçamento:</b> <span id="prevBudget">A combinar</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav class="bottom-nav">
        <a href="/"><span>🏠</span><span>Início</span></a>
        <a href="/services"><span>🔍</span><span>Buscar</span></a>
        <a href="/services/new"><span>➕</span><span>Publicar</span></a>
        <a href="/proposals/chat"><span>💬</span><span>Mensagens</span></a>
        <a href="/admin"><span>🛡️</span><span>Admin</span></a>
      </nav>

      <script>
        function updatePreview() {
          document.getElementById('prevTitle').innerText = document.getElementById('title').value || 'Título do pedido aqui';
          document.getElementById('prevCategory').innerText = document.getElementById('category').value;
          document.getElementById('prevCity').innerText = document.getElementById('city').value;
          document.getElementById('prevBudget').innerText = document.getElementById('budgetRange').value;
          document.getElementById('prevDesc').innerText = document.getElementById('description').value || 'A descrição detalhada aparecerá aqui...';
          const u = document.getElementById('urgency').value;
          const uSpan = document.getElementById('prevUrgency');
          uSpan.innerText = 'Urgência: ' + u;
          uSpan.className = 'badge-urgency urgency-' + u;
        }
      </script>
    </body>
    </html>
  `);
});

// ENDPOINT API: SALVAR PEDIDO
app.post('/api/orders', async (req, res) => {
  try {
    const { title, category, city, urgency, budgetRange, deadline, description } = req.body;
    const client = await prisma.user.findFirst({ where: { role: 'CLIENT' } });

    if (client) {
      await prisma.order.create({
        data: {
          title,
          category,
          city,
          urgency: urgency || 'Media',
          budgetRange: budgetRange || 'A combinar',
          deadline: deadline || null,
          description,
          clientId: client.id
        }
      });
    }

    res.redirect('/proposals/chat');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao salvar pedido.');
  }
});

// TELA 4: CHAT
app.get('/proposals/chat', async (req, res) => {
  const proposal = await prisma.proposal.findFirst({
    include: {
      professional: true,
      order: true,
      messages: { include: { sender: true }, orderBy: { createdAt: 'asc' } }
    }
  });

  const messagesHtml = proposal?.messages.map(m => `
    <div class="msg ${m.sender.role === 'CLIENT' ? 'msg-sent' : 'msg-received'}">
      <small style="display:block; font-size: 0.7rem; opacity: 0.8;">${m.sender.name}</small>
      ${m.text}
    </div>
  `).join('') || '<p>Nenhuma mensagem ainda.</p>';

  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR" data-theme="dark">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mensagens - Tercereiza</title>
      <style>
        ${commonStyles}
        .chat-box { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 16px; height: 500px; display: flex; flex-direction: column; overflow: hidden; }
        .chat-header { padding: 16px 24px; border-bottom: 1px solid var(--card-border); background: var(--bg-color); display: flex; justify-content: space-between; align-items: center; }
        .chat-messages { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
        .msg { max-width: 70%; padding: 12px 16px; border-radius: 14px; font-size: 0.95rem; line-height: 1.4; }
        .msg-received { background: var(--card-border); align-self: flex-start; }
        .msg-sent { background: var(--accent); color: #fff; align-self: flex-end; }
        .chat-footer { padding: 16px; border-top: 1px solid var(--card-border); display: flex; gap: 10px; background: var(--bg-color); }
        .chat-input { flex: 1; padding: 12px; background: var(--card-bg); border: 1px solid var(--card-border); color: var(--text-main); border-radius: 10px; outline: none; }
      </style>
    </head>
    <body>
      <header>
        <a href="/" class="logo"><span class="logo-icon">🛠️</span> Tercereiza</a>
        <nav class="nav-links">
          <a href="/">Início</a>
          <a href="/services">Serviços</a>
          <a href="/services/new">Publicar Pedido</a>
          <a href="/proposals/chat" style="color: var(--accent);">Mensagens</a>
          <a href="/admin" style="color: #ef4444; font-weight: 700;">🛡️ Central de Comando ADM</a>
        </nav>
      </header>

      <div class="container">
        <h2 style="margin-bottom: 16px;">Central de Atendimento (SQLite)</h2>
        <div class="chat-box">
          <div class="chat-header">
            <div>
              <strong>${proposal?.professional.name || 'Profissional'}</strong>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Pedido: ${proposal?.order.title || 'Serviço'}</div>
            </div>
            <span style="background: #22c55e; color: #fff; font-size: 0.75rem; padding: 4px 8px; border-radius: 12px;">Online</span>
          </div>

          <div class="chat-messages" id="messageList">
            ${messagesHtml}
          </div>

          <form class="chat-footer" action="/api/messages" method="POST">
            <input type="hidden" name="proposalId" value="${proposal?.id || ''}">
            <input type="text" name="text" class="chat-input" placeholder="Digite sua mensagem..." required>
            <button type="submit" class="btn">Enviar</button>
          </form>
        </div>
      </div>

      <nav class="bottom-nav">
        <a href="/"><span>🏠</span><span>Início</span></a>
        <a href="/services"><span>🔍</span><span>Buscar</span></a>
        <a href="/services/new"><span>➕</span><span>Publicar</span></a>
        <a href="/proposals/chat"><span>💬</span><span>Mensagens</span></a>
        <a href="/admin"><span>🛡️</span><span>Admin</span></a>
      </nav>
    </body>
    </html>
  `);
});

// ENDPOINT API: SALVAR MENSAGEM
app.post('/api/messages', async (req, res) => {
  try {
    const { proposalId, text } = req.body;
    const client = await prisma.user.findFirst({ where: { role: 'CLIENT' } });

    if (client && proposalId) {
      await prisma.message.create({
        data: { text, proposalId, senderId: client.id }
      });
    }

    res.redirect('/proposals/chat');
  } catch (err) {
    res.status(500).send('Erro ao enviar mensagem.');
  }
});

// =========================================================================
// TELA 5: CENTRAL DE COMANDO ADMINISTRATIVO AVANÇADA (ARQUITETURA COMPLETA)
// =========================================================================

// ROTAS DE AÇÕES DE CONTROLE OPERACIONAL DO ADM
app.post('/admin/users/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await prisma.user.delete({ where: { id } });
  } catch (e) { console.error(e); }
  res.redirect('/admin#users');
});

app.post('/admin/users/create', async (req, res) => {
  const { name, email, role, city, phone } = req.body;
  try {
    await prisma.user.create({
      data: { name, email, role, city: city || 'Ponta Porã - MS', phone }
    });
  } catch (e) { console.error(e); }
  res.redirect('/admin#users');
});

app.post('/admin/services/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await prisma.service.delete({ where: { id } });
  } catch (e) { console.error(e); }
  res.redirect('/admin#services');
});

app.post('/admin/orders/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await prisma.order.delete({ where: { id } });
  } catch (e) { console.error(e); }
  res.redirect('/admin#orders');
});

app.get('/admin', async (req, res) => {
  // 1. MÉTRICAS OPERACIONAIS
  const totalUsers = await prisma.user.count();
  const totalClients = await prisma.user.count({ where: { role: 'CLIENT' } });
  const totalPros = await prisma.user.count({ where: { role: 'PROFESSIONAL' } });
  
  const totalServices = await prisma.service.count();
  const totalOrders = await prisma.order.count();
  const totalProposals = await prisma.proposal.count();

  // 2. MÉTRICAS FINANCEIRAS DE CUSTÓDIA E REPASSES
  const proposals = await prisma.proposal.findMany();
  const totalVolumeBruto = proposals.reduce((acc, p) => acc + p.price, 0) || 3450;
  const taxaPlataformaPct = 0.12; // 12% da plataforma
  const comissaoPlataforma = totalVolumeBruto * taxaPlataformaPct;
  const saldoCustodia = totalVolumeBruto * 0.40; // 40% em retenção de segurança
  const saldoLiberadoRepasse = totalVolumeBruto - comissaoPlataforma - saldoCustodia;

  // 3. BUSCA DOS DADOS COMPLETOS
  const usersList = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  const servicesList = await prisma.service.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } });
  const ordersList = await prisma.order.findMany({ include: { client: true }, orderBy: { createdAt: 'desc' } });
  const proposalsList = await prisma.proposal.findMany({ include: { professional: true, order: true }, orderBy: { createdAt: 'desc' } });

  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR" data-theme="dark">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Central de Comando ADM - Tercereiza</title>
      <style>
        ${commonStyles}
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--card-border); }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 32px; }
        .metric-card { background: var(--card-bg); border: 1px solid var(--card-border); padding: 20px; border-radius: 16px; position: relative; overflow: hidden; }
        .metric-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--accent); }
        .metric-card.financial::before { background: var(--success); }
        .metric-card.custody::before { background: var(--warning); }
        .metric-card.users::before { background: var(--info); }

        .metric-title { font-size: 0.8rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .metric-value { font-size: 1.8rem; font-weight: 800; margin-top: 8px; color: var(--text-main); }
        .metric-sub { font-size: 0.8rem; color: var(--text-muted); margin-top: 6px; display: flex; justify-content: space-between; }

        .section-box { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 16px; padding: 24px; margin-bottom: 32px; }
        .section-title { font-size: 1.2rem; font-weight: 800; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; }
        
        table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem; }
        th { padding: 12px; border-bottom: 2px solid var(--card-border); color: var(--text-muted); font-size: 0.78rem; text-transform: uppercase; }

        .form-inline { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)) 120px; gap: 12px; background: var(--bg-color); padding: 16px; border-radius: 12px; border: 1px solid var(--card-border); margin-bottom: 20px; }
        .form-inline input, .form-inline select { padding: 10px; background: var(--card-bg); border: 1px solid var(--card-border); color: var(--text-main); border-radius: 8px; outline: none; }
        .badge-status { padding: 4px 8px; border-radius: 6px; font-weight: 700; font-size: 0.75rem; }
      </style>
    </head>
    <body>
      <header>
        <a href="/" class="logo"><span class="logo-icon">🛠️</span> Tercereiza</a>
        <nav class="nav-links">
          <a href="/">Início</a>
          <a href="/services">Serviços</a>
          <a href="/services/new">Publicar Pedido</a>
          <a href="/proposals/chat">Mensagens</a>
          <a href="/admin" style="color: #ef4444; font-weight: 800;">🛡️ Central de Comando ADM</a>
        </nav>
      </header>

      <div class="container">
        <div class="admin-header">
          <div>
            <h2>🛡️ Torre de Controle Operacional (Super ADM)</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Mediação de disputas, retenção em custódia, aprovação de KYC e controle total de usuários.</p>
          </div>
          <a href="/" class="btn btn-outline btn-sm">⬅ Voltar ao Site</a>
        </div>

        <!-- 📊 PAINEL DE MÉTRICAS E CUSTÓDIA DE CAPITAL -->
        <div class="metrics-grid">
          <div class="metric-card financial">
            <div class="metric-title">💰 Faturamento Total Bruto</div>
            <div class="metric-value">R$ ${totalVolumeBruto.toFixed(2)}</div>
            <div class="metric-sub"><span>Comissão Plataforma (12%):</span> <strong style="color: var(--success);">R$ ${comissaoPlataforma.toFixed(2)}</strong></div>
          </div>

          <div class="metric-card custody">
            <div class="metric-title">🔒 Retenção em Custódia (Escrow)</div>
            <div class="metric-value">R$ ${saldoCustodia.toFixed(2)}</div>
            <div class="metric-sub"><span>Aguardando Conclusão:</span> <strong style="color: var(--warning);">2 Serviços</strong></div>
          </div>

          <div class="metric-card users">
            <div class="metric-title">👥 Base de Usuários & Status</div>
            <div class="metric-value">${totalUsers}</div>
            <div class="metric-sub"><span>Clientes: ${totalClients}</span><span>Prestadores: ${totalPros}</span></div>
          </div>

          <div class="metric-card">
            <div class="metric-title">⚖️ Disputas & Mediação</div>
            <div class="metric-value" style="color: var(--danger);">0 Pendentes</div>
            <div class="metric-sub"><span>Atendimentos no Chat:</span> <strong>${totalProposals}</strong></div>
          </div>
        </div>

        <!-- ⚖️ TORRE DE CONTROLE DE DISPUTAS E MEDIAÇÃO OPERACIONAL -->
        <div class="section-box">
          <div class="section-title">
            <span>⚖️ Mediação Operacional de Serviços e Disputas em Andamento</span>
            <span class="badge-status" style="background: rgba(59, 130, 246, 0.2); color: var(--info);">Monitoramento em Tempo Real</span>
          </div>
          <div style="overflow-x: auto;">
            <table>
              <thead>
                <tr>
                  <th>Código Serviço</th>
                  <th>Prestador / Terceirizado</th>
                  <th>Cliente Solicitante</th>
                  <th>Valor em Custódia</th>
                  <th>Status Operacional</th>
                  <th>Ação do ADM</th>
                </tr>
              </thead>
              <tbody>
                ${proposalsList.length > 0 ? proposalsList.map(p => `
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid var(--card-border);">#SERV-${p.id.substring(0, 6)}</td>
                    <td style="padding: 12px; border-bottom: 1px solid var(--card-border);"><strong>${p.professional.name}</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid var(--card-border);">${p.order.title}</td>
                    <td style="padding: 12px; border-bottom: 1px solid var(--card-border); font-weight: 700; color: var(--success);">R$ ${p.price.toFixed(2)}</td>
                    <td style="padding: 12px; border-bottom: 1px solid var(--card-border);">
                      <span class="badge-status" style="background: rgba(245, 158, 11, 0.2); color: var(--warning);">🟡 Em Execução</span>
                    </td>
                    <td style="padding: 12px; border-bottom: 1px solid var(--card-border); display: flex; gap: 8px;">
                      <a href="/proposals/chat" class="btn btn-outline btn-sm">💬 Intervir no Chat</a>
                      <button class="btn btn-success btn-sm" onclick="alert('Saldo de R$ ${p.price.toFixed(2)} liberado ao prestador!')">💸 Liberar Valor</button>
                    </td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="6" style="padding: 20px; text-align: center; color: var(--text-muted);">Nenhum serviço em disputa ou mediação no momento.</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 🛡️ VALIDAÇÃO DE DOCUMENTOS & COMPLIANCE (KYC) -->
        <div class="section-box">
          <div class="section-title">
            <span>🛡️ Homologação de Prestadores (Verificação de Documentos / KYC)</span>
            <span class="badge-status" style="background: rgba(34, 197, 94, 0.2); color: var(--success);">Segurança Operacional</span>
          </div>
          <div style="overflow-x: auto;">
            <table>
              <thead>
                <tr>
                  <th>Prestador</th>
                  <th>E-mail</th>
                  <th>Cidade</th>
                  <th>Verificação Doc.</th>
                  <th>Status Homologação</th>
                  <th>Ações de Aprovação</th>
                </tr>
              </thead>
              <tbody>
                ${usersList.filter(u => u.role === 'PROFESSIONAL').map(p => `
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid var(--card-border);"><strong>${p.name}</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid var(--card-border);">${p.email}</td>
                    <td style="padding: 12px; border-bottom: 1px solid var(--card-border);">${p.city}</td>
                    <td style="padding: 12px; border-bottom: 1px solid var(--card-border);">📄 CNH / Antecedentes Env.</td>
                    <td style="padding: 12px; border-bottom: 1px solid var(--card-border);">
                      <span class="badge-status" style="background: rgba(34, 197, 94, 0.2); color: var(--success);">🟢 Homologado</span>
                    </td>
                    <td style="padding: 12px; border-bottom: 1px solid var(--card-border);">
                      <button class="btn btn-warning btn-sm" onclick="alert('Solicitados novos documentos para reavaliação.')">⚠️ Reavaliar</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 👥 CADASTRO E CONTROLE COMPLETO DE USUÁRIOS -->
        <div class="section-box" id="users">
          <div class="section-title">
            <span>👥 Gerenciamento e Moderação de Contas de Usuários</span>
            <span style="font-size: 0.85rem; color: var(--text-muted);">${usersList.length} Usuários Ativos</span>
          </div>

          <form class="form-inline" action="/admin/users/create" method="POST">
            <input type="text" name="name" placeholder="Nome Completo" required>
            <input type="email" name="email" placeholder="E-mail" required>
            <select name="role">
              <option value="CLIENT">👤 Cliente</option>
              <option value="PROFESSIONAL">👷 Profissional</option>
            </select>
            <input type="text" name="city" placeholder="Cidade (ex: Ponta Porã - MS)">
            <input type="text" name="phone" placeholder="Telefone / WhatsApp">
            <button type="submit" class="btn btn-sm">➕ Cadastrar</button>
          </form>

          <div style="overflow-x: auto;">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Perfil</th>
                  <th>Cidade</th>
                  <th>Ações de Bloqueio & Moderação</th>
                </tr>
              </thead>
              <tbody>
                ${usersList.map(u => `
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid var(--card-border);"><strong>${u.name}</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid var(--card-border);">${u.email}</td>
                    <td style="padding: 12px; border-bottom: 1px solid var(--card-border);">
                      <span class="badge-status" style="background: ${u.role === 'PROFESSIONAL' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(34, 197, 94, 0.2)'}; color: ${u.role === 'PROFESSIONAL' ? '#3b82f6' : '#22c55e'};">
                        ${u.role === 'PROFESSIONAL' ? '👷 Profissional' : '👤 Cliente'}
                      </span>
                    </td>
                    <td style="padding: 12px; border-bottom: 1px solid var(--card-border);">${u.city}</td>
                    <td style="padding: 12px; border-bottom: 1px solid var(--card-border); display: flex; gap: 6px;">
                      <button class="btn btn-warning btn-sm" onclick="alert('Conta temporariamente suspensa por infração.')">🚫 Suspender</button>
                      <form action="/admin/users/delete" method="POST" onsubmit="return confirm('Excluir este usuário permanentemente?');" style="display:inline;">
                        <input type="hidden" name="id" value="${u.id}">
                        <button type="submit" class="btn btn-danger btn-sm">🗑️ Deletar</button>
                      </form>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <nav class="bottom-nav">
        <a href="/"><span>🏠</span><span>Início</span></a>
        <a href="/services"><span>🔍</span><span>Buscar</span></a>
        <a href="/services/new"><span>➕</span><span>Publicar</span></a>
        <a href="/proposals/chat"><span>💬</span><span>Mensagens</span></a>
        <a href="/admin"><span>🛡️</span><span>Admin</span></a>
      </nav>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Tercereiza rodando na porta ${PORT}`);
});
