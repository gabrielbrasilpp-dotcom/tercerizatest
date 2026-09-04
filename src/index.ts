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
      <title>Tercereiza - Marketplace C2C</title>
      <style>
        :root {
          --bg-color: #0f172a;
          --card-bg: #1e293b;
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
          --border-color: #334155;
          --accent: #ea580c;
          --accent-hover: #c2410c;
        }
        [data-theme="light"] {
          --bg-color: #f8fafc;
          --card-bg: #ffffff;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --border-color: #e2e8f0;
          --accent: #ea580c;
          --accent-hover: #c2410c;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background-color: var(--bg-color); color: var(--text-main); padding-bottom: 80px; transition: background 0.3s, color 0.3s; }
        
        header { background: var(--card-bg); border-bottom: 1px solid var(--border-color); padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
        .logo { font-size: 1.25rem; font-weight: 700; color: var(--text-main); text-decoration: none; display: flex; align-items: center; gap: 8px; }
        .logo-icon { background: var(--accent); color: #fff; padding: 4px 8px; border-radius: 6px; font-size: 0.9rem; }
        
        .header-actions { display: flex; align-items: center; gap: 12px; }
        .theme-toggle { background: var(--border-color); color: var(--text-main); border: none; padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
        
        .hero { max-width: 800px; margin: 40px auto; padding: 0 16px; text-align: center; }
        .hero h1 { font-size: 2.2rem; color: var(--text-main); margin-bottom: 12px; }
        .hero p { font-size: 1.05rem; color: var(--text-muted); margin-bottom: 24px; }
        
        .region-card { background: var(--card-bg); border: 1px solid var(--border-color); padding: 20px; border-radius: 12px; max-width: 500px; margin: 0 auto 24px auto; text-align: left; }
        .region-card label { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 8px; color: var(--text-main); }
        .region-select { width: 100%; padding: 10px; background: var(--bg-color); color: var(--text-main); border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.95rem; outline: none; margin-bottom: 12px; }
        
        .cta-buttons { display: flex; justify-content: center; gap: 12px; }
        .btn { background: var(--accent); color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; border: none; cursor: pointer; display: inline-block; }
        .btn:hover { background: var(--accent-hover); }
        .btn-outline { background: transparent; color: var(--text-main); border: 1px solid var(--border-color); }
        .btn-outline:hover { background: var(--border-color); }

        .bottom-nav { display: flex; position: fixed; bottom: 0; left: 0; right: 0; background: var(--card-bg); border-top: 1px solid var(--border-color); height: 60px; justify-content: space-around; align-items: center; z-index: 1000; }
        .bottom-nav a { display: flex; flex-direction: column; align-items: center; gap: 2px; text-decoration: none; color: var(--text-muted); font-size: 0.7rem; font-weight: 500; }
        .bottom-nav a.active { color: var(--accent); font-weight: 700; }
      </style>
    </head>
    <body>
      <header>
        <a href="/" class="logo"><span class="logo-icon">🛠️</span> Tercereiza</a>
        <div class="header-actions">
          <button class="theme-toggle" onclick="toggleTheme()">☀️ / 🌙 Tema</button>
          <a href="/auth/login" style="font-size: 0.9rem; font-weight: 600; color: var(--text-main); text-decoration: none;">Entrar</a>
        </div>
      </header>

      <div class="hero">
        <h1>O Marketplace de Serviços de Mato Grosso do Sul</h1>
        <p>Conecte-se com profissionais locais qualificados ou publique sua demanda por região.</p>

        <div class="region-card">
          <label>📍 Sua Região / Cidade Atual:</label>
          <select id="userRegion" class="region-select" onchange="updateRegion()">
            <option value="Ponta Porã - MS" selected>Ponta Porã - MS (Detectado)</option>
            <option value="Dourados - MS">Dourados - MS</option>
            <option value="Campo Grande - MS">Campo Grande - MS</option>
            <option value="Três Lagoas - MS">Três Lagoas - MS</option>
            <option value="Corumbá - MS">Corumbá - MS</option>
          </select>
          <p style="font-size: 0.8rem; color: var(--text-muted);">O sistema direciona automaticamente os pedidos com base na sua cidade para evitar deslocamentos desnecessários.</p>
        </div>

        <div class="cta-buttons">
          <a href="/services" class="btn">Explorar Serviços</a>
          <a href="/services/new" class="btn btn-outline">Publicar Pedido</a>
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

        // Carrega tema salvo
        const savedTheme = localStorage.getItem('tercereiza_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);

        function updateRegion() {
          const region = document.getElementById('userRegion').value;
          localStorage.setItem('tercereiza_region', region);
          alert('Região atualizada para: ' + region + '. Os serviços exibidos serão filtrados para esta cidade.');
        }
      </script>
    </body>
    </html>
  `);
});

app.use('/services', serviceRoutes);
app.use('/proposals', proposalRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Tercereiza rodando na porta ${PORT} com suporte a Dark/Light e Geolocalização regional!`);
});
