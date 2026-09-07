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
    --bg-color: #0b1329;
    --card-bg: #111d3b;
    --card-border: #1e293b;
    --text-main: #ffffff;
    --text-muted: #94a3b8;
    --accent: #f97316;
    --accent-hover: #ea580c;
  }
  [data-theme="light"] {
    --bg-color: #f8fafc;
    --card-bg: #ffffff;
    --card-border: #cbd5e1;
    --text-main: #0f172a;
    --text-muted: #475569;
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
  .container { max-width: 1100px; margin: 40px auto; padding: 0 20px; }
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

// TELA 2: LISTAGEM DINÂMICA DE SERVIÇOS (/services)
app.get('/services', async (req, res) => {
  const cityFilter = (req.query.city as string) || 'Ponta Porã - MS';
  
  // Consulta REAL no banco de dados SQLite
  const services = await prisma.service.findMany({
    where: { city: cityFilter },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });

  const cardsHtml = services.length > 0 ? services.map(s => `
    <div class="card">
      <div>
        <div class="card-header">
          <span class="badge">${s.category}</span>
          <span style="color: #eab308;">★ 5.0</span>
        </div>
        <h3>${s.title}</h3>
        <p>${s.description}</p>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">📍 ${s.city} | Profissional: <b>${s.user.name}</b></p>
      </div>
      <div class="card-footer">
        <span class="price">${s.priceFrom ? 'A partir de R$ ' + s.priceFrom.toFixed(2) : 'Orçamento Grátis'}</span>
        <a href="/proposals/chat" class="btn btn-outline" style="padding: 6px 12px; font-size: 0.85rem;">Solicitar Proposta</a>
      </div>
    </div>
  `).join('') : `<p style="color: var(--text-muted);">Nenhum serviço encontrado para ${cityFilter}.</p>`;

  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR" data-theme="dark">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Explorar Serviços - Tercereiza</title>
      <style>
        ${commonStyles}
        .search-bar { display: flex; gap: 12px; margin-bottom: 30px; flex-wrap: wrap; }
        .search-input { flex: 1; padding: 14px; min-width: 250px; background: var(--card-bg); border: 1px solid var(--card-border); color: var(--text-main); border-radius: 10px; font-size: 1rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
        .card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; }
        .card-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px; }
        .badge { background: rgba(249, 115, 22, 0.15); color: var(--accent); padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; }
        .card h3 { font-size: 1.2rem; margin-bottom: 8px; }
        .card p { color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; }
        .card-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--card-border); padding-top: 16px; margin-top: 16px; }
        .price { font-size: 1.1rem; font-weight: 800; color: var(--accent); }
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
        </nav>
      </header>

      <div class="container">
        <h1 style="margin-bottom: 10px;">Profissionais e Serviços Disponíveis</h1>
        <p style="color: var(--text-muted); margin-bottom: 30px;">Dados carregados em tempo real do banco SQLite.</p>

        <form class="search-bar" method="GET" action="/services">
          <select name="city" class="search-input" onchange="this.form.submit()">
            <option value="Ponta Porã - MS" ${cityFilter === 'Ponta Porã - MS' ? 'selected' : ''}>Ponta Porã - MS</option>
            <option value="Dourados - MS" ${cityFilter === 'Dourados - MS' ? 'selected' : ''}>Dourados - MS</option>
            <option value="Campo Grande - MS" ${cityFilter === 'Campo Grande - MS' ? 'selected' : ''}>Campo Grande - MS</option>
          </select>
        </form>

        <div class="grid">
          ${cardsHtml}
        </div>
      </div>

      <nav class="bottom-nav">
        <a href="/"><span>🏠</span><span>Início</span></a>
        <a href="/services"><span>🔍</span><span>Buscar</span></a>
        <a href="/services/new"><span>➕</span><span>Publicar</span></a>
        <a href="/proposals/chat"><span>💬</span><span>Mensagens</span></a>
      </nav>
    </body>
    </html>
  `);
});

// TELA 3: SALVAR NOVO PEDIDO NO BANCO (/services/new)
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
        .form-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 16px; padding: 32px; max-width: 650px; margin: 0 auto; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-weight: 700; margin-bottom: 8px; font-size: 0.95rem; }
        .form-control { width: 100%; padding: 12px; background: var(--bg-color); border: 1px solid var(--card-border); color: var(--text-main); border-radius: 10px; font-size: 1rem; outline: none; }
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
        </nav>
      </header>

      <div class="container">
        <div class="form-card">
          <h2 style="margin-bottom: 8px;">Publicar Novo Pedido de Serviço</h2>
          <p style="color: var(--text-muted); margin-bottom: 24px;">Ao enviar, o registro será salvo na tabela Order do SQLite.</p>

          <form action="/api/orders" method="POST">
            <div class="form-group">
              <label>Título do Pedido</label>
              <input type="text" name="title" class="form-control" placeholder="Ex: Preciso de troca de fiação" required>
            </div>

            <div class="form-group">
              <label>Categoria do Serviço</label>
              <select name="category" class="form-control">
                <option value="Manutenção Elétrica">Manutenção Elétrica</option>
                <option value="Refrigeração">Refrigeração</option>
                <option value="Pintura">Pintura e Reformas</option>
              </select>
            </div>

            <div class="form-group">
              <label>Cidade / Localização</label>
              <select name="city" class="form-control">
                <option value="Ponta Porã - MS">Ponta Porã - MS</option>
                <option value="Dourados - MS">Dourados - MS</option>
                <option value="Campo Grande - MS">Campo Grande - MS</option>
              </select>
            </div>

            <div class="form-group">
              <label>Descrição Detalhada</label>
              <textarea name="description" class="form-control" rows="4" placeholder="Detalhe o que precisa ser feito..." required></textarea>
            </div>

            <button type="submit" class="btn" style="width: 100%; justify-content: center; padding: 14px; font-size: 1.05rem;">
              🚀 Salvar Pedido no Banco
            </button>
          </form>
        </div>
      </div>

      <nav class="bottom-nav">
        <a href="/"><span>🏠</span><span>Início</span></a>
        <a href="/services"><span>🔍</span><span>Buscar</span></a>
        <a href="/services/new"><span>➕</span><span>Publicar</span></a>
        <a href="/proposals/chat"><span>💬</span><span>Mensagens</span></a>
      </nav>
    </body>
    </html>
  `);
});

// ENDPOINT API: SALVAR PEDIDO
app.post('/api/orders', async (req, res) => {
  try {
    const { title, category, city, description } = req.body;
    
    // Pega o primeiro cliente do banco para associar
    const client = await prisma.user.findFirst({ where: { role: 'CLIENT' } });

    if (client) {
      await prisma.order.create({
        data: { title, category, city, description, clientId: client.id }
      });
    }

    res.redirect('/proposals/chat');
  } catch (err) {
    res.status(500).send('Erro ao salvar pedido.');
  }
});

// TELA 4: CHAT CONECTADO ÀS MENSAGENS DO BANCO (/proposals/chat)
app.get('/proposals/chat', async (req, res) => {
  // Busca a primeira proposta e suas mensagens do banco
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
      </nav>
    </body>
    </html>
  `);
});

// ENDPOINT API: SALVAR MENSAGEM NO BANCO
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

app.listen(PORT, () => {
  console.log(`🚀 Tercereiza rodando perfeitamente na porta ${PORT}`);
});
