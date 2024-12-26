import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Post } from '@prisma/client';
import type { GetServerSideProps } from 'next';
import prisma from '../../lib/prisma';

interface PostWithAuthor extends Post {
  author: {
    name: string;
  };
}

interface Props {
  initialPosts: PostWithAuthor[];
}

export default function Posts({ initialPosts }: Props) {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<PostWithAuthor[]>(initialPosts);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Documentos</h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista de todos os documentos disponíveis
          </p>
        </div>
        {session?.user?.role === 'ADMIN' && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Novo Documento
            </Link>
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {post.content.substring(0, 150)}...
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Por {post.author.name}
                </span>
                <Link
                  href={`/posts/${post.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Ler mais →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center mt-8">
          <p className="text-gray-500">Nenhum documento disponível.</p>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      props: {
        initialPosts: JSON.parse(JSON.stringify(posts)),
      },
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      props: {
        initialPosts: [],
      },
    };
  }
};
