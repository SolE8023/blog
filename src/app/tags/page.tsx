import Link from 'next/link';
import { getAllTags } from '@/lib/posts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '태그',
  description: '모든 태그 목록을 확인하세요.',
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">태그</h1>
        <p className="text-gray-600 dark:text-gray-400">
          모든 태그 목록입니다. 관심 있는 태그를 클릭하여 관련 글을 확인하세요.
        </p>
      </header>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className="group px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
            >
              <span className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">
                #{tag}
              </span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                ({count})
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <p className="text-lg">아직 태그가 없습니다.</p>
          <p className="text-sm mt-2">
            포스트에 태그를 추가하면 여기에 표시됩니다.
          </p>
        </div>
      )}
    </div>
  );
}
