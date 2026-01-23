import Link from 'next/link';
import { searchPosts } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import type { Metadata } from 'next';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = {
  title: '검색',
  description: '블로그에서 원하는 글을 검색하세요.',
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query } = await searchParams;
  const results = query ? searchPosts(query) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
            홈
          </Link>
          <span>/</span>
          <span>검색</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">검색 결과</h1>

        {query && (
          <p className="text-gray-600 dark:text-gray-400">
            <span className="text-blue-600 dark:text-blue-400 font-medium">&quot;{query}&quot;</span>
            에 대한 검색 결과 {results.length}개
          </p>
        )}
      </header>

      {query ? (
        results.length > 0 ? (
          <div className="space-y-6">
            {results.map(post => (
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-lg font-medium mb-2">검색 결과가 없습니다</p>
            <p className="text-sm">다른 키워드로 검색해 보세요.</p>
          </div>
        )
      ) : (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <p>검색어를 입력하세요.</p>
        </div>
      )}
    </div>
  );
}
