import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../auth/[...nextauth]';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    const post = await prisma.post.findUnique({
      where: { id: String(id) },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    return res.json(post);
  }

  // Verificar se é admin para operações de modificação
  if (session.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  if (req.method === 'PUT') {
    const { title, content } = req.body;

    try {
      const post = await prisma.post.update({
        where: { id: String(id) },
        data: {
          title,
          content,
        },
      });

      return res.json(post);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar post' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.post.delete({
        where: { id: String(id) },
      });

      return res.status(204).end();
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao deletar post' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
