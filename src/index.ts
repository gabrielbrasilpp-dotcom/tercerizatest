import express from 'express';
import path from 'path';
import serviceRoutes from './routes/services';
import proposalRoutes from './routes/proposals';
import { SITE_IMAGES } from './config/images';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Habilita pasta pública para servir imagens locais
app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR" data-theme="dark">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tercereiza - Marketplace C2C de MS</title>
      <style>
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
        
        body {
          background-color: var(--bg-color);
          color: var(--text-main);
          min-height: 100vh;
          padding-bottom: 95px;
          overflow-x: hidden;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes floatAnim {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }

        header {
          background: var(--card-bg);
          border-bottom: 1px solid var(--card-border);
          padding: 16px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        .logo { font-size: 1.4rem; font-weight: 800; color: var(--text-main); text-decoration: none; display: flex; align-items: center; gap: 10px; }
        .logo-icon { background: var(--accent); color: #fff; padding: 6px 10px; border-radius: 8px; font-size: 1rem; box-shadow: 0 0 15px rgba(249, 115, 22, 0.5); }

        .nav-links { display: flex; gap: 24px; align-items: center; }
        .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 0.95rem; font-weight: 600; transition: 0.2s; }
        .nav-links a:hover { color: var(--accent); }

        .header-actions { display: flex; align-items: center; gap: 12px; }
        .theme-toggle { background: var(--card-border); color: var(--text-main); border: none; padding: 8px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .theme-toggle:hover { background: var(--accent); color: #fff; }

        .hero-split {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 40px;
          align-items: center;
          animation: fadeIn 0.8s ease-out;
        }

        .hero-content h1 {
          font-size: 3rem;
          color: var(--text-main);
          margin-bottom: 16px;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -1px;
        }
        .hero-content h1 span { color: var(--accent); }

        .hero-content p {
          font-size: 1.15rem;
          color: var(--text-muted);
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .hero-image-box {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          border: 1px solid var(--card-border);
          animation: floatAnim 6s ease-in-out infinite;
        }
        .hero-image-box img {
          width: 100%;
          height: 420px;
          object-fit: cover;
          display: block;
        }

        .features-section {
          max-width: 1200px;
          margin: 60px auto;
          padding: 0 24px;
        }
        .section-title {
          text-align: center;
          margin-bottom: 40px;
        }
        .section-title h2 { font-size: 2rem; font-weight: 800; margin-bottom: 10px; color: var(--text-main); }
        .section-title p { color: var(--text-muted); font-size: 1rem; }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }

        .feature-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          padding: 30px;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(249, 115, 22, 0.15);
          border-color: var(--accent);
        }

        .card-icon-box {
          width: 60px; height: 60px;
          background: rgba(249, 115, 22, 0.15);
          color: var(--accent);
          display: flex; align-items: center; justify-content: center;
          border-radius: 14px;
          font-size: 1.6rem;
          margin-bottom: 20px;
          transition: 0.3s;
        }
        .feature-card:hover .card-icon-box { background: var(--accent); color: #fff; transform: scale(1.1); }

        .feature-card h3 { font-size: 1.3rem; font-weight: 700; margin-bottom: 12px; color: var(--text-main); }
        .feature-card p { font-size: 0.95rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 20px; }

        .region-box {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          padding: 24px;
          border-radius: 16px;
          margin-top: 30px;
        }
        .region-box label { display: block; font-weight: 700; margin-bottom: 8px; color: var(--text-main); }
        .region-select {
          width: 100%;
          padding: 12px;
          background: var(--bg-color);
          color: var(--text-main);
          border: 1px solid var(--card-border);
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          outline: none;
          cursor: pointer;
        }

        .btn {
          background: var(--accent);
          color: #ffffff;
          padding: 14px 28px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 700;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 20px rgba(249, 115, 22, 0.4);
          transition: all 0.25s ease;
        }
        .btn:hover { background: var(--accent-hover); transform: translateY(-2px); box-shadow: 0 6px 25px rgba(249, 115, 22, 0.6); }

        .btn-outline {
          background: transparent;
          color: var(--text-main);
          border: 1px solid var(--card-border);
          box-shadow: none;
        }
        .btn-outline:hover { border-color: var(--accent); background: var(--card-border); }

        .bottom-nav {
          display: flex;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: var(--card-bg);
          border-top: 1px solid var(--card-border);
          height: 75px;
          justify-content: space-around;
          align-items: center;
          z-index: 1000;
          box-shadow: 0 -5px 25px rgba(0,0,0,0.4);
        }
        .bottom-nav a { display: flex; flex-direction: column; align-items: center; gap: 4px; text-decoration: none; color: var(--text-muted); font-size: 0.75rem; font-weight: 600; transition: 0.2s; }
        .bottom-nav a:hover, .bottom-nav a.active { color: var(--accent); transform: translateY(-2px); }

        @media (max-width: 900px) {
          .hero-split { grid-template-columns: 1fr; text-align: center; }
          .hero-content h1 { font-size: 2.3rem; }
          .hero-image-box { display: none; }
          .nav-links { display: none; }
        }
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
        <div class="header-actions">
          <button class="theme-toggle" onclick="toggleTheme()">☀️ / 🌙 Tema</button>
          <a href="/auth/login" class="btn btn-outline" style="padding: 8px 16px; font-size: 0.85rem;">Entrar</a>
        </div>
      </header>

      <!-- HERO COM A SUA NOVA IMAGEM LOCAL -->
      <section class="hero-split">
        <div class="hero-content">
          <h1>Conforto e Soluções em <span>Mato Grosso do Sul</span></h1>
          <p>Conecte-se instantaneamente com profissionais qualificados locais ou publique sua demanda com direcionamento inteligente por região.</p>
          
          <div style="display: flex; gap: 15px; flex-wrap: wrap;">
            <a href="/services" class="btn"><span>🔍</span> Explorar Serviços</a>
            <a href="/services/new" class="btn btn-outline"><span>➕</span> Publicar Pedido</a>
          </div>

          <div class="region-box">
            <label>📍 Sua Região / Cidade Atual:</label>
            <select id="userRegion" class="region-select" onchange="updateRegion()">
              <option value="Ponta Porã - MS" selected>Ponta Porã - MS (Detectado)</option>
              <option value="Dourados - MS">Dourados - MS</option>
              <option value="Campo Grande - MS">Campo Grande - MS</option>
              <option value="Três Lagoas - MS">Três Lagoas - MS</option>
              <option value="Corumbá - MS">Corumbá - MS</option>
            </select>
          </div>
        </div>

        <div class="hero-image-box">
          <img src="${SITE_IMAGES.heroProfessional}" alt="Profissional Real em Manutenção">
        </div>
      </section>

      <section class="features-section">
        <div class="section-title">
          <h2>Soluções Especializadas para Você</h2>
          <p>Encontre especialistas validados e prontos para atender na sua região com total segurança.</p>
        </div>

        <div class="cards-grid">
          <div class="feature-card">
            <div class="card-icon-box">⚡</div>
            <h3>Manutenção e Instalação</h3>
            <p>Serviços elétricos, hidráulicos, refrigeração e reformas gerais com garantia de técnicos locais credenciados.</p>
            <a href="/services" style="color: var(--accent); font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">Ver profissionais →</a>
          </div>

          <div class="feature-card">
            <div class="card-icon-box">🛡️</div>
            <h3>Orçamentos Seguros</h3>
            <p>Receba propostas competitivas diretamente no seu chat, compare avaliações e feche com tranquilidade.</p>
            <a href="/services/new" style="color: var(--accent); font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">Publicar demanda →</a>
          </div>

          <div class="feature-card">
            <div class="card-icon-box">⭐</div>
            <h3>Qualidade Garantida</h3>
            <p>Profissionais avaliados pela comunidade com histórico verificado e suporte dedicado em MS.</p>
            <a href="/proposals/chat" style="color: var(--accent); font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">Abrir chat →</a>
          </div>
        </div>
      </section>

      <nav class="bottom-nav">
        <a href="/" class="active"><span>🏠</span><span>Início</span></a>
        <a href="/services"><span>🔍</span><span>Buscar</span></a>
        <a href="/services/new"><span>➕</span><span>Publicar</span></a>
        <a href="/proposals/chat"><span>💬</span><span>Mensagens</span></a>
        <a href="/auth/login"><span>👤</span><span>Perfil</span></a>
      </nav>

      <script>
        function toggleTheme() {
          const html = document.documentElement;
          const currentTheme = html.getAttribute('data-theme');
          const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
          html.setAttribute('data-theme', newTheme);
          localStorage.setItem('tercereiza_theme', newTheme);
        }

        const savedTheme = localStorage.getItem('tercereiza_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);

        function updateRegion() {
          const region = document.getElementById('userRegion').value;
          localStorage.setItem('tercereiza_region', region);
          alert('📍 Região atualizada para: ' + region + '. Os serviços exibidos agora serão filtrados para esta localidade.');
        }
      </script>
    </body>
    </html>
  `);
});

app.use('/services', serviceRoutes);
app.use('/proposals', proposalRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Tercereiza rodando na porta ${PORT} com imagens centralizadas e a foto profissional integrada!`);
});
