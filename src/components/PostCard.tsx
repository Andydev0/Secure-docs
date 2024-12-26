import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
  };
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300">
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
  );
}
