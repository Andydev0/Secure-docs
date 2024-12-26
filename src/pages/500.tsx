export default function Custom500() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">500 - Erro do Servidor</h1>
        <p className="text-gray-600">Desculpe, algo deu errado no servidor.</p>
        <a
          href="/"
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Voltar para a página inicial
        </a>
      </div>
    </div>
  );
}
