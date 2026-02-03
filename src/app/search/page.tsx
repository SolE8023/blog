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
    <div className="zen-container py-16 md:py-24">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="ensou-small mb-8" />
        <h1 className="text-2xl md:text-3xl font-normal tracking-wide mb-4">
          {query ? (
            <>「{query}」</>
          ) : (
            "검색"
          )}
        </h1>
        {query && (
          <p className="text-sm text-[var(--text-muted)]">
            {posts.length}편의 글
          </p>
        )}
      </header>

      {/* Search Form */}
      <div className="zen-narrow mb-12">
        <form action="/search" method="GET">
          <div className="relative">
            <input
              type="text"
              name="q"
              defaultValue={query || ""}
              placeholder="검색어를 입력하세요"
              className="w-full px-4 py-3 text-center bg-transparent border-b border-[var(--border)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
            />
          </div>
        </form>
      </div>

      {/* Results */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[var(--text-muted)] mb-6">
            {query
              ? "검색 결과가 없습니다"
              : "아직 게시된 글이 없습니다"}
          </p>
          <Link
            href="/"
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            ← 돌아가기
          </Link>
        </div>
      ) : (
        <div className="zen-narrow space-y-1">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const { q: query } = await searchParams;

  return {
    title: query ? `「${query}」 검색` : "검색",
    description: "블로그 글 검색",
  };
}
