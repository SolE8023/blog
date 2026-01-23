import { getAllPosts, getAllTags } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import Link from 'next/link';

export default function HomePage() {
  const posts = getAllPosts();
  const tags = getAllTags().slice(0, 10);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to My Blog
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          개발과 기술에 관한 이야기를 공유합니다.
          마크다운으로 작성된 글들을 편하게 읽어보세요.
        </p>
      </section>

      {/* Tags Section */}
      {tags.length > 0 && (
        <section className="mb-12">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">인기 태그:</span>
            {tags.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full transition-colors"
              >
                #{tag}
                <span className="ml-1 text-gray-400">({count})</span>
              </Link>
            ))}
            <Link
              href="/tags"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline ml-2"
            >
              모두 보기 →
            </Link>
          </div>
        </section>
      )}

      {/* Posts Section */}
      <section>
        <h2 className="text-2xl font-bold mb-8">최근 글</h2>

        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map(post => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <p className="text-lg font-medium mb-2">아직 작성된 글이 없습니다</p>
            <p className="text-sm">
              posts 폴더에 마크다운 파일을 추가하여 블로그를 시작하세요.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
