const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Criar usuário admin
  const adminPassword = await hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Administrador',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log({ admin });

  // Criar alguns posts iniciais
  const post1 = await prisma.post.create({
    data: {
      title: 'Documento de Exemplo 1',
      content: 'Este é um documento de exemplo criado automaticamente.',
      published: true,
      author: {
        connect: { id: admin.id }
      }
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Documento de Exemplo 2',
      content: 'Este é outro documento de exemplo criado automaticamente.',
      published: true,
      author: {
        connect: { id: admin.id }
      }
    },
  });

  console.log({ post1, post2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
