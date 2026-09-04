import { Router } from 'express';

const router = Router();

// Banco temporário em memória para as propostas e chat
export const proposalsData: Array<{
  id: string;
  serviceId: string;
  providerName: string;
  providerCategory: string;
  price: string;
  message: string;
  createdAt: string;
}> = [
  {
    id: '1',
    serviceId: '1',
    providerName: 'Carlos Souza (Pedreiro Mestre)',
    providerCategory: 'Pedreiro',
    price: 'R$ 950,00',
    message: 'Olá! Tenho experiência com muros de arrimo e posso começar na próxima segunda-feira.',
    createdAt: new Date().toLocaleDateString('pt-BR')
  },
  {
    id: '2',
    serviceId: '2',
    providerName: 'João Eletro',
    providerCategory: 'Eletricista',
    price: 'R$ 200,00',
    message: 'Faço o serviço com garantia e material de primeira linha. Posso ir amanhã à tarde.',
    createdAt: new Date().toLocaleDateString('pt-BR')
  }
];

// Tela de envio de proposta para um serviço específico
router.get('/new/:serviceId', (req, res) => {
  const { serviceId } = req.params;

  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Enviar Proposta - Tercereiza</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background-color: #f8fafc; color: #0f172a; padding-bottom: 70px; }
        header { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.25rem; font-weight: 700; color: #0f172a; text-decoration: none; display: flex; align-items: center; gap: 8px; }
        .logo-icon { background: #ea580c; color: #fff; padding: 4px 8px; border-radius: 6px; font-size: 0.9rem; }
        .form-container { max-width: 600px; margin: 32px auto; background: #fff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; }
        h2 { font-size: 1.3rem; margin-bottom: 20px; color: #0f172a; }
        .form-group { margin-bottom: 16px; }
        label { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 6px; color: #334155; }
        input, textarea { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; outline: none; }
        input:focus, textarea:focus { border-color: #ea580c; }
        textarea { resize: vertical; height: 100px; }
        .btn-submit { background: #ea580c; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 700; font-size: 1rem; cursor: pointer; margin-top: 8px; }
        .btn-submit:hover { background: #c2410c; }
      </style>
    </head>
    <body>
      <header>
        <a href="/" class="logo"><span class="logo-icon">🛠️</span> Tercereiza</a>
        <a href="/services" style="font-size: 0.9rem; color: #64748b; text-decoration: none;">Voltar</a>
      </header>
      <div class="form-container">
        <h2>Enviar Proposta para o Pedido #${serviceId}</h2>
        <form action="/proposals/new/${serviceId}" method="POST">
          <div class="form-group">
            <label>Seu Nome ou Nome da Empresa</label>
            <input type="text" name="providerName" required placeholder="Ex: Carlos Reformas" />
          </div>
          <div class="form-group">
            <label>Sua Especialidade / Categoria</label>
            <input type="text" name="providerCategory" required placeholder="Ex: Pedreiro / Pintor" />
          </div>
          <div class="form-group">
            <label>Valor da Proposta (R$)</label>
            <input type="text" name="price" required placeholder="Ex: R$ 850,00" />
          </div>
          <div class="form-group">
            <label>Mensagem / Condições para o Cliente</label>
            <textarea name="message" required placeholder="Explique seu prazo, disponibilidade e detalhes do orçamento..."></textarea>
          </div>
          <button type="submit" class="btn-submit">Enviar Proposta</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

// Processar o envio da proposta
router.post('/new/:serviceId', (req, res) => {
  const { serviceId } = req.params;
  const { providerName, providerCategory, price, message } = req.body;

  if (providerName && price && message) {
    proposalsData.unshift({
      id: Date.now().toString(),
      serviceId,
      providerName,
      providerCategory: providerCategory || 'Geral',
      price,
      message,
      createdAt: new Date().toLocaleDateString('pt-BR')
    });
  }

  res.redirect('/proposals/chat');
});

// Tela de Chat / Propostas Recebidas (Simulação de Mensagens)
router.get('/chat', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mensagens e Propostas - Tercereiza</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background-color: #f8fafc; color: #0f172a; padding-bottom: 70px; }
        header { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
        .logo { font-size: 1.25rem; font-weight: 700; color: #0f172a; text-decoration: none; display: flex; align-items: center; gap: 8px; }
        .logo-icon { background: #ea580c; color: #fff; padding: 4px 8px; border-radius: 6px; font-size: 0.9rem; }
        .container { max-width: 800px; margin: 24px auto; padding: 0 16px; }
        h2 { font-size: 1.3rem; margin-bottom: 20px; color: #0f172a; }
        .chat-list { display: flex; flex-direction: column; gap: 12px; }
        .chat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; }
        .chat-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
        .provider-name { font-size: 1.05rem; font-weight: 700; color: #0f172a; }
        .price-badge { background: #dcfce7; color: #166534; font-size: 0.85rem; padding: 4px 10px; border-radius: 6px; font-weight: 700; }
        .chat-msg { font-size: 0.95rem; color: #475569; margin-bottom: 12px; background: #f8fafc; padding: 10px; border-radius: 6px; border-left: 3px solid #ea580c; }
        .chat-footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: #64748b; }
        .bottom-nav { display: flex; position: fixed; bottom: 0; left: 0; right: 0; background: #fff; border-top: 1px solid #e2e8f0; height: 60px; justify-content: space-around; align-items: center; z-index: 1000; }
        .bottom-nav a { display: flex; flex-direction: column; align-items: center; gap: 2px; text-decoration: none; color: #64748b; font-size: 0.7rem; font-weight: 500; }
        .bottom-nav a.active { color: #ea580c; font-weight: 700; }
      </style>
    </head>
    <body>
      <header>
        <a href="/" class="logo"><span class="logo-icon">🛠️</span> Tercereiza</a>
        <a href="/services" style="font-size: 0.9rem; color: #64748b; text-decoration: none;">Explorar Serviços</a>
      </header>
      <div class="container">
        <h2>Propostas e Conversas Ativas</h2>
        <div class="chat-list">
          ${proposalsData.length === 0 ? '<p style="text-align: center; color: #64748b; padding: 32px;">Nenhuma proposta recebida ainda.</p>' : ''}
          ${proposalsData.map(prop => `
            <div class="chat-card">
              <div class="chat-header">
                <div>
                  <span class="provider-name">${prop.providerName}</span>
                  <span style="font-size: 0.8rem; color: #64748b; display: block;">Especialidade: ${prop.providerCategory}</span>
                </div>
                <span class="price-badge">${prop.price}</span>
              </div>
              <div class="chat-msg">"${prop.message}"</div>
              <div class="chat-footer">
                <span>📅 Recebida em: ${prop.createdAt}</span>
                <span style="color: #ea580c; font-weight: 600; cursor: pointer;">💬 Responder / Negociar</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <nav class="bottom-nav">
        <a href="/"><span>🏠</span><span>Início</span></a>
        <a href="/services"><span>🔍</span><span>Buscar</span></a>
        <a href="/services/new"><span>➕</span><span>Publicar</span></a>
        <a href="/proposals/chat" class="active"><span>💬</span><span>Mensagens</span></a>
        <a href="/auth/login"><span>👤</span><span>Perfil</span></a>
      </nav>
    </body>
    </html>
  `);
});

export default router;
