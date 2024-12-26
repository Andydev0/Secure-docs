import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    const user = await prisma.user.findUnique({
      where: { id: String(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.json(user);
  }

  if (req.method === 'PUT') {
    const { name, email, password, role } = req.body;

    try {
      const updateData: any = {
        name,
        email,
        role,
      };

      if (password) {
        updateData.password = await hash(password, 10);
      }

      const user = await prisma.user.update({
        where: { id: String(id) },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar usuário' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.user.delete({
        where: { id: String(id) },
      });

      return res.status(204).end();
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao deletar usuário' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
