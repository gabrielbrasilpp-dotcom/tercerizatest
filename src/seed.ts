import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@terceriza.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@terceriza.com',
      name: 'Administrador Terceriza',
      password: hashedPassword,
    },
  });

  console.log('✅ Usuário de teste criado/atualizado com sucesso:', user.email);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
