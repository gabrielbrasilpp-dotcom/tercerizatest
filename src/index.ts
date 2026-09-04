import express from 'express';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import servicesRoutes from './routes/services';
import profileRoutes from './routes/professional';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Home / Landing Page Pública com o nome Tercereiza
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tercereiza - Encontre o profissional certo</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background-color: #f8fafc; color: #0f172a; padding-bottom: 70px; }

        /* Header Alinhado com o Dashboard */
        header { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
        .logo { font-size: 1.25rem; font-weight: 700; color: #0f172a; text-decoration: none; display: flex; align-items: center; gap: 8px; }
        .logo-icon { background: #ea580c; color: #fff; padding: 4px 8px; border-radius: 6px; font-size: 0.9rem; }
        
        .desktop-nav { display: flex; gap: 20px; align-items: center; }
        .desktop-nav a { text-decoration: none; color: #475569; font-size: 0.95rem; font-weight: 500; }
        .desktop-nav a:hover { color: #0f172a; }
        .btn-login { background: #082f49; color: #fff !important; padding: 8px 18px; border-radius: 8px; font-weight: 600; text-decoration: none; transition: background 0.2s; }
        .btn-login:hover { background: #0c4a6e; }

        /* Hero */
        .hero { background: #0f172a; color: #fff; padding: 48px 20px; text-align: center; }
        .hero h1 { font-size: 1.8rem; font-weight: 800; margin-bottom: 12px; }
        .hero p { font-size: 1rem; color: #94a3b8; margin-bottom: 24px; }
        
        .search-box { display: flex; gap: 8px; background: #fff; padding: 6px; border-radius: 10px; max-width: 500px; margin: 0 auto 20px auto; border: 1px solid #cbd5e1; }
        .search-box input { flex: 1; border: none; padding: 10px; outline: none; font-size: 0.95rem; color: #0f172a; }
        .search-box button { background: #ea580c; color: #fff; border: none; padding: 0 20px; border-radius: 6px; font-weight: 600; cursor: pointer; }
        .search-box button:hover { background: #c2410c; }

        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; max-width: 600px; margin: 0 auto; }
        .stat-card { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255,255,255,0.1); padding: 12px 8px; border-radius: 8px; text-align: center; }
        .stat-card h3 { font-size: 1.1rem; color: #f8fafc; }
        .stat-card p { font-size: 0.75rem; color: #94a3b8; }

        /* Categorias */
        .section { max-width: 900px; margin: 32px auto; padding: 0 16px; }
        .section h2 { font-size: 1.25rem; font-weight: 700; color: #0f172a; }
        .categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; margin-top: 16px; }
        .category-card { background: #fff; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; display: flex; align-items: center; gap: 8px; text-decoration: none; color: #334155; font-size: 0.9rem; font-weight: 600; transition: border-color 0.2s; }
        .category-card:hover { border-color: #ea580c; color: #ea580c; }

        /* Bottom Nav Mobile */
        .bottom-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: #fff; border-top: 1px solid #e2e8f0; height: 60px; justify-content: space-around; align-items: center; z-index: 1000; }
        .bottom-nav a { display: flex; flex-direction: column; align-items: center; gap: 2px; text-decoration: none; color: #64748b; font-size: 0.7rem; font-weight: 500; }
        .bottom-nav a.active { color: #ea580c; font-weight: 700; }

        @media (max-width: 768px) {
          .desktop-nav a:not(.btn-login) { display: none; }
          .bottom-nav { display: flex; }
          .hero h1 { font-size: 1.5rem; }
        }
      </style>
    </head>
    <body>

      <header>
        <a href="/" class="logo"><span class="logo-icon">🛠️</span> Tercereiza</a>
        <nav class="desktop-nav">
          <a href="/services">Buscar</a>
          <a href="/profile">Profissionais</a>
          <a href="/services">Publicar</a>
          <a href="/dashboard">Mensagens</a>
          <a href="/auth/login" class="btn-login">Entrar</a>
        </nav>
      </header>

      <section class="hero">
        <span style="font-size: 0.8rem; background: rgba(255,255,255,0.1); padding: 4px 12px; border-radius: 12px; color: #cbd5e1;">📍 Ponta Porã/MS</span>
        <h1 style="margin-top: 12px;">Encontre o profissional certo para a sua obra</h1>
        <p>Publique pedidos, receba propostas e contrate com segurança.</p>

        <form action="/services" method="GET" class="search-box">
          <input type="text" name="search" placeholder="Ex.: pedreiro, pintura..." />
          <button type="submit">Buscar</button>
        </form>

        <div class="stats-grid">
          <div class="stat-card"><h3>24</h3><p>categorias</p></div>
          <div class="stat-card"><h3>PIX</h3><p>seguro</p></div>
          <div class="stat-card"><h3>100%</h3><p>verificados</p></div>
        </div>
      </section>

      <section class="section">
        <h2>Categorias</h2>
        <div class="categories-grid">
          <a href="/services?search=pedreiro" class="category-card">🧱 Pedreiro</a>
          <a href="/services?search=eletricista" class="category-card">⚡ Eletricista</a>
          <a href="/services?search=encanador" class="category-card">🔧 Encanador</a>
          <a href="/services?search=pintor" class="category-card">🎨 Pintor</a>
        </div>
      </section>

      <nav class="bottom-nav">
        <a href="/" class="active"><span>🏠</span><span>Início</span></a>
        <a href="/services"><span>🔍</span><span>Buscar</span></a>
        <a href="/services/new"><span>➕</span><span>Publicar</span></a>
        <a href="/dashboard"><span>💬</span><span>Mensagens</span></a>
        <a href="/auth/login"><span>👤</span><span>Perfil</span></a>
      </nav>

    </body>
    </html>
  `);
});

app.use('/auth', authRoutes);
app.use('/', dashboardRoutes);
app.use('/services', servicesRoutes);
app.use('/profile', profileRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Tercereiza rodando na porta ${PORT}`);
});
