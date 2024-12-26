import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prismadb = new PrismaClient();

async function main() {
  try {
    // Criar usuário admin
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prismadb.user.upsert({
      where: { email: 'admin@admin.com' },
      update: {},
      create: {
        email: 'admin@admin.com',
        name: 'Admin',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('Admin user created:', admin);

    // Criar alguns posts iniciais
    const post1 = await prismadb.post.create({
      data: {
        title: 'Documento de Exemplo 1',
        content: 'Este é um documento de exemplo criado automaticamente.',
        published: true,
        author: {
          connect: { id: admin.id }
        }
      },
    });

    const post2 = await prismadb.post.create({
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
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismadb.$disconnect();
  });
