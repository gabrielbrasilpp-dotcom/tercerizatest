import express from 'express';
import serviceRoutes from './routes/services';
import proposalRoutes from './routes/proposals';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
          --bg-color: #070a12;
          --card-bg: rgba(15, 23, 42, 0.85);
          --text-main: #ffffff;
          --text-muted: #cbd5e1;
          --border-color: #334155;
          --accent: #ea580c;
          --accent-hover: #c2410c;
        }
        [data-theme="light"] {
          --bg-color: #0f172a;
          --card-bg: rgba(30, 41, 59, 0.95);
          --text-main: #f8fafc;
          --text-muted: #e2e8f0;
          --border-color: #475569;
          --accent: #f97316;
          --accent-hover: #ea580c;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        
        body {
          background-color: var(--bg-color);
          color: var(--text-main);
          min-height: 100vh;
          padding-bottom: 90px;
          overflow-x: hidden;
          position: relative;
        }

        /* Fundo dinâmico com imagem e efeito de movimento suave */
        .bg-overlay {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(135deg, rgba(7, 10, 18, 0.92) 0%, rgba(15, 23, 42, 0.88) 100%),
                      url('https://images.unsplash.com/photo-1541888946425-d0fbb18f5223?q=80&w=1920&auto=format&fit=crop') no-repeat center center;
          background-size: cover;
          z-index: -1;
          animation: bgZoom 25s infinite alternate ease-in-out;
        }

        @keyframes bgZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.08); }
        }

        /* Animações de Motion */
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        header {
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          padding: 14px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
          animation: fadeInDown 0.6s ease-out;
        }

        .logo { font-size: 1.3rem; font-weight: 800; color: #ffffff; text-decoration: none; display: flex; align-items: center; gap: 8px; letter-spacing: -0.5px; }
        .logo-icon { background: var(--accent); color: #fff; padding: 6px 10px; border-radius: 8px; font-size: 1rem; box-shadow: 0 0 15px rgba(234, 88, 12, 0.5); }

        .header-actions { display: flex; align-items: center; gap: 12px; }
        .theme-toggle { background: #1e293b; color: #ffffff; border: 1px solid var(--border-color); padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .theme-toggle:hover { background: var(--accent); border-color: var(--accent); }

        .hero {
          max-width: 750px;
          margin: 45px auto;
          padding: 0 20px;
          text-align: center;
          animation: fadeInUp 0.8s ease-out;
        }

        .hero h1 {
          font-size: 2.4rem;
          color: #ffffff;
          margin-bottom: 14px;
          font-weight: 800;
          line-height: 1.2;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }

        .hero p {
          font-size: 1.15rem;
          color: var(--text-muted);
          margin-bottom: 30px;
          font-weight: 500;
        }

        .region-card {
          background: var(--card-bg);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border-color);
          padding: 24px;
          border-radius: 16px;
          margin: 0 auto 30px auto;
          text-align: left;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          transition: transform 0.3s;
        }
        .region-card:hover { transform: translateY(-3px); }

        .region-card label { display: block; font-size: 0.95rem; font-weight: 700; margin-bottom: 10px; color: #ffffff; }
        .region-select {
          width: 100%;
          padding: 12px 14px;
          background: #090d16;
          color: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          outline: none;
          margin-bottom: 12px;
          cursor: pointer;
        }
        .region-select:focus { border-color: var(--accent); box-shadow: 0 0 10px rgba(234, 88, 12, 0.3); }

        .cta-buttons { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }
        
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
          gap: 8px;
          box-shadow: 0 4px 20px rgba(234, 88, 12, 0.4);
          transition: all 0.2s ease;
        }
        .btn:hover { background: var(--accent-hover); transform: translateY(-2px); box-shadow: 0 6px 25px rgba(234, 88, 12, 0.6); }

        .btn-outline {
          background: rgba(15, 23, 42, 0.7);
          color: #ffffff;
          border: 1px solid var(--border-color);
          box-shadow: none;
        }
        .btn-outline:hover { background: rgba(30, 41, 59, 0.9); border-color: var(--accent); }

        .bottom-nav {
          display: flex;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(15px);
          border-top: 1px solid var(--border-color);
          height: 70px;
          justify-content: space-around;
          align-items: center;
          z-index: 1000;
          box-shadow: 0 -5px 25px rgba(0,0,0,0.5);
        }
        .bottom-nav a { display: flex; flex-direction: column; align-items: center; gap: 3px; text-decoration: none; color: #94a3b8; font-size: 0.75rem; font-weight: 600; transition: 0.2s; }
        .bottom-nav a:hover, .bottom-nav a.active { color: var(--accent); transform: scale(1.05); }

        @media (max-width: 600px) {
          .hero h1 { font-size: 1.9rem; }
          .cta-buttons { flex-direction: column; width: 100%; }
          .btn { width: 100%; justify-content: center; }
        }
      </style>
    </head>
    <body>
      <div class="bg-overlay"></div>

      <header>
        <a href="/" class="logo"><span class="logo-icon">🛠️</span> Tercereiza</a>
        <div class="header-actions">
          <button class="theme-toggle" onclick="toggleTheme()">☀️ / 🌙 Tema</button>
          <a href="/auth/login" style="font-size: 0.9rem; font-weight: 700; color: #ffffff; text-decoration: none; padding: 6px 12px; background: rgba(255,255,255,0.05); border-radius: 8px;">Entrar</a>
        </div>
      </header>

      <div class="hero">
        <h1>O Marketplace de Serviços de Mato Grosso do Sul</h1>
        <p>Conecte-se com profissionais locais qualificados ou publique sua demanda com direcionamento inteligente por região.</p>

        <div class="region-card">
          <label>📍 Sua Região / Cidade Atual:</label>
          <select id="userRegion" class="region-select" onchange="updateRegion()">
            <option value="Ponta Porã - MS" selected>Ponta Porã - MS (Detectado)</option>
            <option value="Dourados - MS">Dourados - MS</option>
            <option value="Campo Grande - MS">Campo Grande - MS</option>
            <option value="Três Lagoas - MS">Três Lagoas - MS</option>
            <option value="Corumbá - MS">Corumbá - MS</option>
          </select>
          <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4;">O sistema filtra automaticamente os pedidos com base na sua cidade para otimizar o deslocamento dos profissionais.</p>
        </div>

        <div class="cta-buttons">
          <a href="/services" class="btn"><span>🔍</span> Explorar Serviços</a>
          <a href="/services/new" class="btn btn-outline"><span>➕</span> Publicar Pedido</a>
        </div>
      </div>

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
  console.log(`🚀 Tercereiza rodando na porta ${PORT} com Motion, Dark Slate imersivo e alta acessibilidade!`);
});
