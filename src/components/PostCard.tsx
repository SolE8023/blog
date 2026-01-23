import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { PostMeta } from '@/lib/posts';

interface PostCardProps {
  post: PostMeta;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group">
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all duration-200">
          <time className="text-sm text-gray-500 dark:text-gray-400">
            {format(new Date(post.date), 'yyyy년 M월 d일', { locale: ko })}
          </time>

          <h2 className="mt-2 text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h2>

          {post.description && (
            <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
              {post.description}
            </p>
          )}

          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
