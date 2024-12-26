import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import prisma from '../../lib/prisma';
import { Post } from '@prisma/client';

interface PostWithAuthor extends Post {
  author: {
    name: string;
    email: string;
  };
}

interface Props {
  post: PostWithAuthor;
}

export default function PostView({ post }: Props) {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    // Importar e inicializar o módulo de segurança
    import('../../utils/security').then(({ initSecurity }) => {
      initSecurity('.post-content');
    });
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando documento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <article className="prose lg:prose-xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-600 text-sm">
            <span>Por {post.author.name}</span>
            <span className="mx-2">•</span>
            <time dateTime={post.createdAt.toString()}>
              {new Date(post.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </time>
          </div>
        </header>

        <div className="mt-6 text-gray-800 leading-relaxed whitespace-pre-wrap post-content">
          {post.content}
        </div>

        <div className="mt-8 border-t pt-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Voltar
          </button>
        </div>
      </article>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: String(params?.id) },
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
      return {
        notFound: true,
      };
    }

    return {
      props: {
        post: JSON.parse(JSON.stringify(post)),
      },
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return {
      notFound: true,
    };
  }
};
