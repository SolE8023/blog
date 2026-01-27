import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { PostCard } from "@/components/PostCard";
import type { PostWithRelations, Category, Tag } from "@/types";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
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

async function searchPosts(query: string): Promise<PostWithRelations[]> {
  if (!query.trim()) {
    return [];
  }

  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      *,
      category:categories(*),
      post_tags(
        tag:tags(*)
      )
    `)
    .eq("published", true)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Search error:", error);
    return [];
  }

  return (posts || []).map((post: PostQueryResult) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    thumbnail: post.thumbnail,
    category_id: post.category_id,
    published: post.published,
    created_at: post.created_at,
    updated_at: post.updated_at,
    category: post.category || null,
    tags: post.post_tags?.map((pt) => pt.tag).filter(Boolean) || [],
  }));
}

async function getAllPosts(): Promise<PostWithRelations[]> {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      *,
      category:categories(*),
      post_tags(
        tag:tags(*)
      )
    `)
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return (posts || []).map((post: PostQueryResult) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    thumbnail: post.thumbnail,
    category_id: post.category_id,
    published: post.published,
    created_at: post.created_at,
    updated_at: post.updated_at,
    category: post.category || null,
    tags: post.post_tags?.map((pt) => pt.tag).filter(Boolean) || [],
  }));
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query } = await searchParams;
  const posts = query ? await searchPosts(query) : await getAllPosts();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="editorial-container py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="text-body text-sm font-medium text-[var(--accent)] mb-4">
            {query ? "검색 결과" : "글 목록"}
          </p>
          <h1 className="text-display text-4xl md:text-5xl font-bold leading-tight mb-6">
            {query ? (
              <>
                <span className="text-[var(--accent)]">&ldquo;{query}&rdquo;</span>
                <span className="text-[var(--text-muted)]"> 검색 결과</span>
              </>
            ) : (
              "전체 글"
            )}
          </h1>
          {query && (
            <p className="text-body text-lg text-[var(--text-secondary)]">
              총 {posts.length}개의 글을 찾았습니다.
            </p>
          )}
        </div>
      </section>

      {/* Divider */}
      <div className="divider" />

      {/* Search Form */}
      <section className="editorial-container py-12">
        <form action="/search" method="GET" className="max-w-xl">
          <div className="relative">
            <input
              type="text"
              name="q"
              defaultValue={query || ""}
              placeholder="검색어를 입력하세요..."
              className="w-full pl-12 pr-4 py-4 text-body text-lg bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-subtle)] transition-all"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 btn-primary rounded-lg"
            >
              검색
            </button>
          </div>
        </form>
      </section>

      {/* Results */}
      <section className="editorial-container py-12 pb-24">
        {posts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[var(--border)] rounded-xl bg-[var(--bg-secondary)]">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--accent-subtle)] flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[var(--accent)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <h3 className="text-display text-xl font-semibold mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-body text-[var(--text-muted)] mb-6">
              {query
                ? "다른 검색어로 다시 시도해보세요."
                : "아직 게시된 글이 없습니다."}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-body text-sm font-medium text-[var(--accent)] hover:gap-3 transition-all"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              홈으로 돌아가기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <div
                key={post.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const { q: query } = await searchParams;

  return {
    title: query ? `"${query}" 검색 결과 | 필기장` : "검색 | 필기장",
    description: "블로그 글 검색",
  };
}
