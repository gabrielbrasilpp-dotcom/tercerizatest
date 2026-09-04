import express from 'express';
import serviceRoutes from './routes/services';
import proposalRoutes from './routes/proposals';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para leitura de dados JSON e formulários URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota Principal / Home do Tercereiza
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tercereiza - Ponta Porã / MS</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background-color: #f8fafc; color: #0f172a; padding-bottom: 70px; }
        header { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
        .logo { font-size: 1.25rem; font-weight: 700; color: #0f172a; text-decoration: none; display: flex; align-items: center; gap: 8px; }
        .logo-icon { background: #ea580c; color: #fff; padding: 4px 8px; border-radius: 6px; font-size: 0.9rem; }
        .hero { max-width: 800px; margin: 40px auto; padding: 0 16px; text-align: center; }
        .hero h1 { font-size: 2rem; color: #0f172a; margin-bottom: 12px; }
        .hero p { font-size: 1.05rem; color: #475569; margin-bottom: 24px; }
        .cta-buttons { display: flex; justify-content: center; gap: 12px; }
        .btn { background: #ea580c; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; }
        .btn:hover { background: #c2410c; }
        .btn-outline { background: #fff; color: #0f172a; border: 1px solid #cbd5e1; }
        .btn-outline:hover { background: #f1f5f9; }
        .bottom-nav { display: flex; position: fixed; bottom: 0; left: 0; right: 0; background: #fff; border-top: 1px solid #e2e8f0; height: 60px; justify-content: space-around; align-items: center; z-index: 1000; }
        .bottom-nav a { display: flex; flex-direction: column; align-items: center; gap: 2px; text-decoration: none; color: #64748b; font-size: 0.7rem; font-weight: 500; }
        .bottom-nav a.active { color: #ea580c; font-weight: 700; }
      </style>
    </head>
    <body>
      <header>
        <a href="/" class="logo"><span class="logo-icon">🛠️</span> Tercereiza</a>
        <a href="/auth/login" style="font-size: 0.9rem; font-weight: 600; color: #0f172a; text-decoration: none;">Entrar</a>
      </header>
      <div class="hero">
        <h1>O Marketplace de Serviços de Ponta Porã/MS</h1>
        <p>Conecte-se com os melhores profissionais locais ou publique sua demanda agora mesmo.</p>
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
    </body>
    </html>
  `);
});

// Registro das Rotas do Sistema
app.use('/services', serviceRoutes);
app.use('/proposals', proposalRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Tercereiza rodando na porta ${PORT} em Ponta Porã/MS!`);
});
