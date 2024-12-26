# Secure Docs System

Sistema seguro de gerenciamento de documentos construído com Next.js, Prisma e PostgreSQL.

## Funcionalidades

- 🔐 Autenticação de usuários
- 👥 Gerenciamento de usuários (Admin)
- 📄 Proteção de documentos contra cópia
- 🛡️ Controle de acesso baseado em papéis (RBAC)
- 🎨 Interface moderna com Tailwind CSS

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Pré-requisitos

- Node.js 16.x ou superior
- PostgreSQL
- NPM ou Yarn

## Configuração do Ambiente

1. Clone o repositório:
```bash
git clone [URL_DO_SEU_REPOSITORIO]
cd secure-docs-system
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env`
- Preencha as variáveis necessárias:
  ```
  DATABASE_URL="postgresql://[usuario]:[senha]@localhost:5432/secure_docs"
  NEXTAUTH_SECRET="sua-chave-secreta"
  NEXTAUTH_URL="http://localhost:3000"
  ```

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

## Estrutura do Projeto

```
secure-docs-system/
├── src/
│   ├── components/     # Componentes React
│   ├── pages/         # Páginas da aplicação
│   ├── lib/           # Configurações e utilidades
│   ├── utils/         # Funções utilitárias
│   └── types/         # Definições de tipos TypeScript
├── prisma/
│   └── schema.prisma  # Schema do banco de dados
└── public/            # Arquivos estáticos
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
