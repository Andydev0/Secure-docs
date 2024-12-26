import { PrismaClient } from '@prisma/client';

// PrismaClient é anexado ao objeto global para evitar múltiplas instâncias
// durante o desenvolvimento hot-reload

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;
