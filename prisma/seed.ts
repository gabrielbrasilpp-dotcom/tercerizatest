import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Populando banco de dados com dados de teste para MS...');

  // 1. Criar Usuários
  const cliente = await prisma.user.upsert({
    where: { email: 'cliente@tercereiza.com' },
    update: {},
    create: {
      name: 'João Silva',
      email: 'cliente@tercereiza.com',
      phone: '67999990001',
      city: 'Ponta Porã - MS',
      role: 'CLIENT',
    },
  });

  const eletricista = await prisma.user.upsert({
    where: { email: 'carlos@eletrica.com' },
    update: {},
    create: {
      name: 'Carlos Eduardo',
      email: 'carlos@eletrica.com',
      phone: '67999990002',
      city: 'Ponta Porã - MS',
      role: 'PROFESSIONAL',
    },
  });

  // 2. Criar Serviço
  await prisma.service.create({
    data: {
      title: 'Carlos Eduardo - Instalações Elétricas',
      category: 'Manutenção Elétrica',
      description: 'Especialista em manutenção residencial, quadro de disjuntores e climatização.',
      priceFrom: 120.0,
      city: 'Ponta Porã - MS',
      userId: eletricista.id,
    },
  });

  // 3. Criar Pedido do Cliente
  const pedido = await prisma.order.create({
    data: {
      title: 'Troca de Disjuntores em Residência',
      category: 'Manutenção Elétrica',
      description: 'Preciso trocar 4 disjuntores do quadro elétrico principal.',
      city: 'Ponta Porã - MS',
      clientId: cliente.id,
    },
  });

  // 4. Criar Proposta do Profissional
  const proposta = await prisma.proposal.create({
    data: {
      price: 130.0,
      notes: 'Visita técnica e instalação inclusa com garantia de 30 dias.',
      orderId: pedido.id,
      professionalId: eletricista.id,
    },
  });

  // 5. Criar Mensagens
  await prisma.message.createMany({
    data: [
      {
        text: 'Olá! Posso fazer a visita hoje à tarde em Ponta Porã. O valor fica R$ 130,00.',
        senderId: eletricista.id,
        proposalId: proposta.id,
      },
      {
        text: 'Boa tarde Carlos! Aceita PIX após a conclusão?',
        senderId: cliente.id,
        proposalId: proposta.id,
      },
    ],
  });

  console.log('✅ Banco populado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
