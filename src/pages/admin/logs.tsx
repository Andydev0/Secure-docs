import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Layout from '../../components/Layout';
import prisma from '../../lib/prisma';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type LogType = 'LOGIN' | 'LOGOUT' | 'VIEW_POST' | 'CREATE_POST' | 'UPDATE_POST' | 'DELETE_POST';

const logTypes: Record<LogType, string> = {
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  VIEW_POST: 'Visualização de documento',
  CREATE_POST: 'Criação de documento',
  UPDATE_POST: 'Atualização de documento',
  DELETE_POST: 'Exclusão de documento',
};

function getLogTypeDisplay(type: LogType): string {
  return logTypes[type] || type;
}

interface Log {
  id: string;
  type: LogType;
  user: {
    name: string | null;
    email: string;
  };
  post?: {
    title: string;
  } | null;
  ip: string | null;
  createdAt: string;
}

interface Props {
  logs: Log[];
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session || session.user.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const logs = await prisma.log.findMany({
    select: {
      id: true,
      type: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      post: {
        select: {
          title: true,
        },
      },
      ip: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    props: {
      logs: logs.map((log) => ({
        ...log,
        createdAt: log.createdAt.toISOString(),
      })),
    },
  };
};

const LogsPage = ({ logs }: Props) => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Logs do Sistema</h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {logTypes[log.type]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.user.name || log.user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.post?.title || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.ip || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LogsPage;
