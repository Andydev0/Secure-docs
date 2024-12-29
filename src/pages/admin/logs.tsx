import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Layout from '../../components/Layout';
import prisma from '../../lib/prisma';
import { format } from 'date-fns';
import { FaClipboardList, FaUser, FaFileAlt, FaNetworkWired, FaClock } from 'react-icons/fa';

type LogType = 'LOGIN' | 'LOGOUT' | 'VIEW_POST' | 'CREATE_POST' | 'UPDATE_POST' | 'DELETE_POST';

const logTypes: Record<LogType, string> = {
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  VIEW_POST: 'Visualização de documento',
  CREATE_POST: 'Criação de documento',
  UPDATE_POST: 'Atualização de documento',
  DELETE_POST: 'Exclusão de documento',
};

const getLogTypeDisplay = (type: LogType): string => {
  return logTypes[type];
};

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

export default function LogsPage({ logs }: Props) {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div className="flex items-center mb-6">
            <FaClipboardList className="text-blue-600 mr-3" size={32} />
            <h1 className="text-3xl font-semibold text-gray-800">Logs do Sistema</h1>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaClipboardList className="mr-2" />
                        Tipo
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaUser className="mr-2" />
                        Usuário
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaFileAlt className="mr-2" />
                        Documento
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaNetworkWired className="mr-2" />
                        IP
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaClock className="mr-2" />
                        Data
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          log.type.includes('POST')
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {getLogTypeDisplay(log.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
            {logs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum log encontrado
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
