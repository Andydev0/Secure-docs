import { NextPageContext } from 'next';

interface ErrorProps {
  statusCode?: number;
}

function Error({ statusCode }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {statusCode
            ? `Erro ${statusCode}`
            : 'Ocorreu um erro'}
        </h1>
        <p className="text-gray-600">
          {statusCode
            ? `Um erro ${statusCode} ocorreu no servidor`
            : 'Um erro ocorreu no cliente'}
        </p>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
