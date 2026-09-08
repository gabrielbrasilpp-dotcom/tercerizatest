import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { commonStyles, renderHeader, renderBottomNav } from '../views/layouts';

const prisma = new PrismaClient();

export class AdminController {
  static async renderDashboard(req: Request, res: Response) {
    const totalUsers = await prisma.user.count();
    const totalClients = await prisma.user.count({ where: { role: 'CLIENT' } });
    const totalPros = await prisma.user.count({ where: { role: 'PROFESSIONAL' } });

    const proposals = await prisma.proposal.findMany();
    const totalVolumeBruto = proposals.reduce((acc, p) => acc + p.price, 0) || 3450;
    const comissaoPlataforma = totalVolumeBruto * 0.12;
    const saldoCustodia = totalVolumeBruto * 0.40;

    const usersList = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    const proposalsList = await prisma.proposal.findMany({ include: { professional: true, order: true }, orderBy: { createdAt: 'desc' } });

    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR" data-theme="dark">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Central ADM - Tercereiza</title>
        <style>
          ${commonStyles}
          .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 32px; }
          .metric-card { background: var(--card-bg); border: 1px solid var(--card-border); padding: 20px; border-radius: 16px; }
          .metric-title { font-size: 0.8rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; }
          .metric-value { font-size: 1.8rem; font-weight: 800; margin-top: 8px; }
          .section-box { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 16px; padding: 24px; margin-bottom: 32px; }
          table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem; }
          th { padding: 12px; border-bottom: 2px solid var(--card-border); color: var(--text-muted); font-size: 0.78rem; text-transform: uppercase; }
          td { padding: 12px; border-bottom: 1px solid var(--card-border); }
        </style>
      </head>
      <body>
        ${renderHeader('admin')}
        <div class="container">
          <h2>🛡️ Torre de Controle Operacional (Super ADM)</h2>
          <br>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-title">💰 Faturamento Bruto</div>
              <div class="metric-value">R$ ${totalVolumeBruto.toFixed(2)}</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">🔒 Custódia (Escrow)</div>
              <div class="metric-value">R$ ${saldoCustodia.toFixed(2)}</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">👥 Usuários Totais</div>
              <div class="metric-value">${totalUsers}</div>
            </div>
          </div>

          <div class="section-box">
            <h3>👥 Gerenciamento de Usuários</h3>
            <table>
              <thead>
                <tr>
                  <th>Nome</th><th>E-mail</th><th>Perfil</th><th>Cidade</th><th>Ação</th>
                </tr>
              </thead>
              <tbody>
                ${usersList.map(u => `
                  <tr>
                    <td><strong>${u.name}</strong></td>
                    <td>${u.email}</td>
                    <td>${u.role}</td>
                    <td>${u.city}</td>
                    <td>
                      <form action="/admin/users/delete" method="POST" style="display:inline;">
                        <input type="hidden" name="id" value="${u.id}">
                        <button type="submit" class="btn btn-danger btn-sm">Deletar</button>
                      </form>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        ${renderBottomNav()}
      </body>
      </html>
    `);
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      await prisma.user.delete({ where: { id: req.body.id } });
    } catch (e) { console.error(e); }
    res.redirect('/admin');
  }
}
