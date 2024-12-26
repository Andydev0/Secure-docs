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

  if (req.method === 'GET') {
    try {
      const posts = await prisma.post.findMany({
        where: { published: true },
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({ error: 'Erro ao buscar posts' });
    }
  }

  if (req.method === 'POST') {
    if (session.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    try {
      const { title, content } = req.body;

      const post = await prisma.post.create({
        data: {
          title,
          content,
          published: true,
          author: { connect: { id: session.user.id } },
        },
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      return res.status(201).json(post);
    } catch (error) {
      console.error('Error creating post:', error);
      return res.status(500).json({ error: 'Erro ao criar post' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
