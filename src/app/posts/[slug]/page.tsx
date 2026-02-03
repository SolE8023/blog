import { notFound } from "next/navigation";
import Link from "next/link";
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
      {/* 헤더 - 고요한 시작 */}
      <header className="zen-container py-20 md:py-28">
        <div className="zen-narrow text-center">
          {/* 원상 심볼 */}
          <div className="ensou-small mx-auto mb-10 animate-fade-in" />

          {/* 카테고리 */}
          {post.category && (
            <Link
              href={`/categories/${post.category.slug}`}
              className="text-ui text-xs tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-6 block animate-fade-in-up"
            >
              {post.category.name}
            </Link>
          )}

          {/* 제목 */}
          <h1 className="text-display text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide leading-relaxed mb-8 animate-fade-in-up stagger-1">
            {post.title}
          </h1>

          {/* 메타 정보 */}
          <div className="flex items-center justify-center gap-4 text-ui text-xs tracking-wider text-[var(--text-muted)] animate-fade-in-up stagger-2">
            <time>{formatDate(post.created_at)}</time>
            <span className="opacity-30">·</span>
            <ViewCounter postId={post.id} />
          </div>

          {/* 잉크 라인 */}
          <div className="ink-line mx-auto mt-12 animate-fade-in-up stagger-3" />
        </div>
      </header>

      {/* 본문 */}
      <div className="zen-container pb-20">
        <div className="zen-narrow">
          {/* 콘텐츠 */}
          <div className="prose-zen animate-fade-in-up stagger-3">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* 태그 */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-20 pt-12 border-t border-[var(--border)]">
              <div className="flex flex-wrap justify-center gap-4">
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tags/${tag.slug}`}
                    className="zen-tag"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 하단 정보 */}
          <div className="mt-20 py-12 border-t border-[var(--border)]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div>
                <p className="text-ui text-xs tracking-widest text-[var(--text-muted)] mb-2">
                  발행일
                </p>
                <p className="text-body text-sm text-[var(--text-secondary)]">
                  {formatDate(post.created_at)}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-ui text-xs tracking-widest text-[var(--text-muted)]">
                  공유
                </span>
                <ShareButton
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`}
                  label="Twitter"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </ShareButton>
              </div>
            </div>
          </div>

          {/* 돌아가기 */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-ui text-sm tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              돌아가기
            </Link>
          </div>

          {/* 댓글 */}
          <div className="mt-24">
            <div className="zen-divider" />
            <div className="text-center mb-12">
              <h3 className="text-display text-lg tracking-widest text-[var(--text-muted)]">
                이야기
              </h3>
            </div>
            <Comments slug={slug} />
          </div>
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
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
      aria-label={`${label}에 공유`}
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
      siteName: "適",
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
