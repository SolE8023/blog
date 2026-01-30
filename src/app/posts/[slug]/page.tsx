import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-server";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Comments } from "@/components/Comments";
import { ViewCounter } from "@/components/ViewCounter";
import { formatDate } from "@/lib/utils";
import type { PostWithRelations, Category, Tag } from "@/types";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

interface PostQueryResult {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  thumbnail: string | null;
  category_id: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  category: Category | null;
  post_tags: { tag: Tag }[] | null;
}

async function getPost(slug: string): Promise<PostWithRelations | null> {
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      category:categories(*),
      post_tags(
        tag:tags(*)
      )
    `)
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !post) {
    return null;
  }

  const typedPost = post as PostQueryResult;

  return {
    id: typedPost.id,
    title: typedPost.title,
    slug: typedPost.slug,
    content: typedPost.content,
    excerpt: typedPost.excerpt,
    thumbnail: typedPost.thumbnail,
    category_id: typedPost.category_id,
    published: typedPost.published,
    created_at: typedPost.created_at,
    updated_at: typedPost.updated_at,
    category: typedPost.category || null,
    tags: typedPost.post_tags?.map((pt) => pt.tag).filter(Boolean) || [],
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen">
      {/* Hero Section */}
      <header className="relative">
        {post.thumbnail ? (
          <div className="relative h-[50vh] md:h-[60vh]">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        ) : (
          <div className="h-32 md:h-48 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-card)]" />
        )}

        {/* Title Overlay */}
        <div className="editorial-container relative -mt-32 md:-mt-40 pb-12">
          <div className="max-w-3xl">
            {/* Meta */}
            <div className="flex items-center gap-4 mb-6 animate-fade-in-up">
              {post.category && (
                <Link
                  href={`/categories/${post.category.slug}`}
                  className="tag-editorial bg-[var(--bg-primary)]/90 backdrop-blur-sm"
                >
                  {post.category.name}
                </Link>
              )}
              <time className="text-body text-sm text-[var(--text-muted)]">
                {formatDate(post.created_at)}
              </time>
              <span className="text-[var(--text-muted)]">·</span>
              <ViewCounter postId={post.id} />
            </div>

            {/* Title */}
            <h1 className="text-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 animate-fade-in-up stagger-1">
              {post.title}
            </h1>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-3 animate-fade-in-up stagger-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tags/${tag.slug}`}
                    className="text-body text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="editorial-container pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="prose-editorial animate-fade-in-up stagger-3">
              <MarkdownRenderer content={post.content} />
            </div>

            {/* Divider */}
            <div className="my-12 divider" />

            {/* Author / Share Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 py-8 border-t border-b border-[var(--border)]">
              <div>
                <p className="text-body text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">
                  발행일
                </p>
                <p className="text-body text-[var(--text-secondary)]">
                  {formatDate(post.created_at)}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-body text-xs uppercase tracking-widest text-[var(--text-muted)]">
                  공유하기
                </span>
                <div className="flex items-center gap-2">
                  <ShareButton
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    label="트위터"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </ShareButton>
                  <ShareButton
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    label="링크드인"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </ShareButton>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-body text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                모든 글 보기
              </Link>
            </div>

            {/* Comments */}
            <div className="mt-16">
              <h3 className="text-display text-2xl font-semibold mb-8 accent-line">
                댓글
              </h3>
              <Comments slug={slug} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {/* Table of Contents placeholder */}
              <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
                <h4 className="text-display text-lg font-semibold mb-4">
                  이 글 소개
                </h4>
                {post.excerpt && (
                  <p className="text-body text-sm text-[var(--text-muted)] leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
                {post.category && (
                  <div className="mt-4 pt-4 border-t border-[var(--border)]">
                    <p className="text-body text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">
                      카테고리
                    </p>
                    <Link
                      href={`/categories/${post.category.slug}`}
                      className="text-body text-[var(--accent)] hover:underline"
                    >
                      {post.category.name}
                    </Link>
                  </div>
                )}
              </div>

              {/* Related Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
                  <h4 className="text-display text-lg font-semibold mb-4">
                    관련 태그
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/tags/${tag.slug}`}
                        className="tag-editorial"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}

function ShareButton({
  href,
  label,
  children
}: {
  href: string;
  label: string;
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
      aria-label={`${label}에 공유하기`}
    >
      {children}
    </a>
  );
}

const BASE_URL = "https://blog-eight-kohl-50.vercel.app";

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "글을 찾을 수 없습니다",
    };
  }

  const url = `${BASE_URL}/posts/${slug}`;

  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      type: "article",
      locale: "ko_KR",
      url,
      title: post.title,
      description: post.excerpt || undefined,
      siteName: "Log.",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      ...(post.thumbnail && { images: [{ url: post.thumbnail }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || undefined,
      ...(post.thumbnail && { images: [post.thumbnail] }),
    },
  };
}
