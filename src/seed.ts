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
      password: hashedPassword,
      name: 'Usuario Teste',
    },
  });

  console.log('✅ Usuário pronto para login:');
  console.log('E-mail: admin@terceriza.com');
  console.log('Senha:  123456');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
