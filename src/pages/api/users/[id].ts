import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';
import { authOptions } from '../auth/[...nextauth]';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.role !== 'ADMIN') {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  const userId = String(req.query.id);

  if (req.method === 'DELETE') {
    try {
      // Não permitir excluir o próprio usuário
      if (userId === session.user.id) {
        return res.status(400).json({ message: 'Não é possível excluir seu próprio usuário' });
      }

      await prisma.user.delete({
        where: { id: userId },
      });

      res.json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Erro ao excluir usuário' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { name, email, password, role } = req.body;

      // Verificar se o email já existe (exceto para o mesmo usuário)
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: {
            id: userId,
          },
        },
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Email já cadastrado' });
      }

      const updateData: any = {
        name,
        email,
        role,
      };

      // Atualizar senha apenas se uma nova senha foi fornecida
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      res.json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
  } else if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
