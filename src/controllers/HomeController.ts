import { Request, Response } from 'express';
import { SITE_IMAGES } from '../config/images';
import { commonStyles, renderHeader, renderBottomNav } from '../views/layouts';

export class HomeController {
  static async renderHome(req: Request, res: Response) {
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
        ${renderHeader('home')}
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
        ${renderBottomNav()}
      </body>
      </html>
    `);
  }
}
