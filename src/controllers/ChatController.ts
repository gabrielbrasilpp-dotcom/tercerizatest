import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { commonStyles, renderHeader, renderBottomNav } from '../views/layouts';

const prisma = new PrismaClient();

export class ChatController {
  static async renderChat(req: Request, res: Response) {
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
        ${renderHeader('chat')}
        <div class="container">
          <h2>Central de Atendimento</h2>
          <div class="chat-box" style="margin-top: 16px;">
            <div class="chat-header">
              <div>
                <strong>${proposal?.professional.name || 'Profissional'}</strong>
                <div style="font-size: 0.8rem; color: var(--text-muted);">Pedido: ${proposal?.order.title || 'Serviço'}</div>
              </div>
            </div>
            <div class="chat-messages">${messagesHtml}</div>
            <form class="chat-footer" action="/api/messages" method="POST">
              <input type="hidden" name="proposalId" value="${proposal?.id || ''}">
              <input type="text" name="text" class="chat-input" placeholder="Digite sua mensagem..." required>
              <button type="submit" class="btn">Enviar</button>
            </form>
          </div>
        </div>
        ${renderBottomNav()}
      </body>
      </html>
    `);
  }

  static async sendMessage(req: Request, res: Response) {
    try {
      const { proposalId, text } = req.body;
      const client = await prisma.user.findFirst({ where: { role: 'CLIENT' } });
      if (client && proposalId) {
        await prisma.message.create({ data: { text, proposalId, senderId: client.id } });
      }
      res.redirect('/proposals/chat');
    } catch (err) {
      res.status(500).send('Erro ao enviar mensagem.');
    }
  }
}
