import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/posts';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import TableOfContents from '@/components/TableOfContents';
import Comments from '@/components/Comments';
import type { Metadata } from 'next';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: '포스트를 찾을 수 없습니다' };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, post.tags);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="lg:grid lg:grid-cols-[1fr_250px] lg:gap-8">
        {/* Main Content */}
        <article className="max-w-3xl">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
                홈
              </Link>
              <span>/</span>
              <span>{post.title}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <time dateTime={post.date}>
                {format(new Date(post.date), 'yyyy년 M월 d일', { locale: ko })}
              </time>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/tags/${tag}`}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {post.description && (
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {post.description}
              </p>
            )}
          </header>

          <hr className="border-gray-200 dark:border-gray-700 mb-8" />

          {/* Content */}
          <div className="prose-container">
            <MarkdownRenderer content={post.content} />
          </div>

          <hr className="border-gray-200 dark:border-gray-700 my-12" />

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-bold mb-6">관련 글</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map(relatedPost => (
                  <Link
                    key={relatedPost.slug}
                    href={`/posts/${relatedPost.slug}`}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <h3 className="font-medium line-clamp-2">{relatedPost.title}</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {relatedPost.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Comments */}
          <Comments slug={slug} />
        </article>

        {/* Sidebar - TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents content={post.content} />
          </div>
        </aside>
      </div>
    </div>
  );
}
