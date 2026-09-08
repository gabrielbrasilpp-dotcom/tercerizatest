export const commonStyles = `
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

export function renderHeader(activePage: string) {
  return `
    <header>
      <a href="/" class="logo"><span class="logo-icon">🛠️</span> Tercereiza</a>
      <nav class="nav-links">
        <a href="/" ${activePage === 'home' ? 'style="color: var(--accent);"' : ''}>Início</a>
        <a href="/services" ${activePage === 'services' ? 'style="color: var(--accent);"' : ''}>Serviços</a>
        <a href="/services/new" ${activePage === 'new-service' ? 'style="color: var(--accent);"' : ''}>Publicar Pedido</a>
        <a href="/proposals/chat" ${activePage === 'chat' ? 'style="color: var(--accent);"' : ''}>Mensagens</a>
        <a href="/admin" style="color: #ef4444; font-weight: 800;">🛡️ Central ADM</a>
      </nav>
      <button class="btn btn-outline" onclick="toggleTheme()">☀️ / 🌙 Tema</button>
    </header>
  `;
}

export function renderBottomNav() {
  return `
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
  `;
}
