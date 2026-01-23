import Link from 'next/link';
import { getAllTags, getPostsByTag } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import type { Metadata } from 'next';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map(({ tag }) => ({ tag }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `#${decodedTag}`,
    description: `${decodedTag} 태그가 포함된 글 목록입니다.`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
            홈
          </Link>
          <span>/</span>
          <Link href="/tags" className="hover:text-blue-600 dark:hover:text-blue-400">
            태그
          </Link>
          <span>/</span>
          <span>#{decodedTag}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="text-blue-600 dark:text-blue-400">#{decodedTag}</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {posts.length}개의 글이 있습니다.
        </p>
      </header>

      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <p>이 태그에 해당하는 글이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
