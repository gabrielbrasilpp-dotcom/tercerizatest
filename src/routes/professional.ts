import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/professional-profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.redirect('/auth/login');
      return;
    }

    const profile = await prisma.professionalProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Terceriza - Perfil Profissional</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
          body { background-color: #0d1b2a; color: #ffffff; min-height: 100vh; }
          header { background: #1b263b; padding: 1.2rem 2rem; border-bottom: 1px solid #415a77; display: flex; justify-content: space-between; align-items: center; }
          h1 { color: #fcc200; font-size: 1.5rem; }
          nav { display: flex; align-items: center; gap: 1.5rem; }
          nav a { color: #ffffff; text-decoration: none; font-weight: 500; font-size: 0.95rem; }
          nav a:hover, nav a.active { color: #fcc200; }
          .logout-btn { background: #e63946; color: #ffffff; padding: 0.5rem 1rem; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 0.85rem; }
          main { padding: 2.5rem; max-width: 900px; margin: 0 auto; }
          .card { background: #1b263b; border: 1px solid #415a77; border-radius: 12px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 10px 25px rgba(0,0,0,0.4); }
          h2 { color: #fcc200; margin-bottom: 1.2rem; font-size: 1.3rem; }
          .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
          .field { display: flex; flex-direction: column; gap: 0.4rem; }
          label { font-size: 0.85rem; color: #e0e1dd; }
          input, textarea { padding: 0.75rem; border-radius: 6px; border: 1px solid #415a77; background: #0d1b2a; color: #fff; outline: none; }
          input:focus, textarea:focus { border-color: #fcc200; }
          textarea { resize: vertical; min-height: 80px; grid-column: span 2; }
          button { padding: 0.75rem 1.5rem; border: none; border-radius: 6px; background: #fcc200; color: #0d1b2a; font-weight: bold; cursor: pointer; align-self: flex-start; }
          button:hover { background: #e0ac00; }
          .status-badge { display: inline-block; padding: 0.4rem 0.8rem; border-radius: 20px; background: #415a77; color: #fcc200; font-weight: bold; font-size: 0.85rem; margin-bottom: 1rem; }
        </style>
      </head>
      <body>
        <header>
          <h1>Terceriza</h1>
          <nav>
            <a href="/dashboard">Painel</a>
            <a href="/profile">Meu Perfil</a>
            <a href="/professional-profile" class="active">Perfil Profissional</a>
            <a href="/auth/logout" class="logout-btn">Sair</a>
          </nav>
        </header>
        <main>
          <div class="card">
            <h2>Meu Perfil Profissional</h2>
            <div class="status-badge">Status de Verificação: ${profile?.verificationStatus || 'PENDENTE'}</div>
            
            <form action="/professional-profile" method="POST">
              <div class="grid">
                <div class="field">
                  <label>Profissão *</label>
                  <input type="text" name="profession" value="${profile?.profession || ''}" placeholder="Ex: Eletricista, Encanador" required>
                </div>
                <div class="field">
                  <label>Especialidades</label>
                  <input type="text" name="specialties" value="${profile?.specialties || ''}" placeholder="Ex: Residencial, Comercial">
                </div>
                <div class="field">
                  <label>Anos de Experiência</label>
                  <input type="number" name="yearsExperience" value="${profile?.yearsExperience || 0}">
                </div>
                <div class="field">
                  <label>Categorias</label>
                  <input type="text" name="categories" value="${profile?.categories || ''}" placeholder="Ex: Manutenção, Reformas">
                </div>
                <div class="field">
                  <label>Valor / Hora (R$)</label>
                  <input type="number" step="0.01" name="hourlyRate" value="${profile?.hourlyRate || ''}">
                </div>
                <div class="field">
                  <label>Valor / Diária (R$)</label>
                  <input type="number" step="0.01" name="dailyRate" value="${profile?.dailyRate || ''}">
                </div>
                <div class="field">
                  <label>Valor por Serviço (R$)</label>
                  <input type="number" step="0.01" name="serviceRate" value="${profile?.serviceRate || ''}">
                </div>
                <div class="field">
                  <label>Raio de Atendimento (Km)</label>
                  <input type="number" name="serviceRadiusKm" value="${profile?.serviceRadiusKm || ''}">
                </div>
                <div class="field">
                  <label>Disponibilidade</label>
                  <input type="text" name="availability" value="${profile?.availability || ''}" placeholder="Ex: Segunda a Sexta, 08h às 18h">
                </div>
                <div class="field">
                  <label>Cidades Atendidas</label>
                  <input type="text" name="citiesServed" value="${profile?.citiesServed || ''}" placeholder="Ex: São Paulo, Santo André">
                </div>
                <div class="field" style="grid-column: span 2;">
                  <label>Descrição dos Serviços</label>
                  <textarea name="description">${profile?.description || ''}</textarea>
                </div>
              </div>
              <button type="submit">Salvar Perfil Profissional</button>
            </form>
          </div>
        </main>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send('Erro ao carregar perfil profissional.');
  }
});

router.post('/professional-profile', authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.redirect('/auth/login');
    return;
  }

  const {
    profession, specialties, yearsExperience, description,
    hourlyRate, dailyRate, serviceRate, availability,
    serviceRadiusKm, citiesServed, categories
  } = req.body;

  try {
    await prisma.professionalProfile.upsert({
      where: { userId },
      update: {
        profession,
        specialties,
        yearsExperience: parseInt(yearsExperience) || 0,
        description,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        dailyRate: dailyRate ? parseFloat(dailyRate) : null,
        serviceRate: serviceRate ? parseFloat(serviceRate) : null,
        availability,
        serviceRadiusKm: serviceRadiusKm ? parseInt(serviceRadiusKm) : null,
        citiesServed,
        categories,
      },
      create: {
        userId,
        profession,
        specialties,
        yearsExperience: parseInt(yearsExperience) || 0,
        description,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        dailyRate: dailyRate ? parseFloat(dailyRate) : null,
        serviceRate: serviceRate ? parseFloat(serviceRate) : null,
        availability,
        serviceRadiusKm: serviceRadiusKm ? parseInt(serviceRadiusKm) : null,
        citiesServed,
        categories,
      },
    });

    res.redirect('/professional-profile');
  } catch (error) {
    res.status(400).send('Erro ao salvar dados do perfil profissional.');
  }
});

export default router;
