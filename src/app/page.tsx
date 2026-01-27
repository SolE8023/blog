import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { PostCard } from "@/components/PostCard";
import type { PostWithRelations, Category, Tag } from "@/types";

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

async function getPosts(): Promise<PostWithRelations[]> {
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
    .order("created_at", { ascending: false });

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

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data || [];
}

export default async function HomePage() {
  const posts = await getPosts();
  const categories = await getCategories();
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

  const hasContent = posts.length > 0 || categories.length > 0;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="editorial-container py-16 md:py-24">
        <div className="max-w-3xl">
          <p className="text-body text-sm font-medium text-[var(--accent)] mb-4 animate-fade-in-up">
            Welcome to Log.
          </p>
          <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in-up stagger-1">
            개발, 일상, 그리고 다양한 이야기들
          </h1>
          <p className="text-body text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed mb-8 animate-fade-in-up stagger-2">
            기록하고 싶은 모든 것들을 담는 공간입니다.
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in-up stagger-3">
            <Link href="/categories" className="btn-primary rounded-full">
              주제 둘러보기
            </Link>
            <Link
              href="/search"
              className="px-6 py-3 text-body text-sm font-medium border border-[var(--border)] rounded-full text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
            >
              글 검색하기
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="divider" />

      {/* Featured Post */}
      {featuredPost && (
        <section className="editorial-container py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-display text-2xl font-semibold accent-line">
              주요 글
            </h2>
          </div>
          <PostCard post={featuredPost} featured />
        </section>
      )}

      {/* Main Content */}
      <section className="editorial-container py-16">
        {hasContent ? (
          /* 콘텐츠가 있을 때: 사이드바 레이아웃 */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Posts Grid */}
            <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-display text-2xl font-semibold accent-line">
                  최근 글
                </h2>
                <Link
                  href="/search"
                  className="text-body text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                >
                  전체 보기 &rarr;
                </Link>
              </div>

              {recentPosts.length === 0 && !featuredPost ? (
                <EmptyState />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recentPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24">
                <h3 className="text-display text-xl font-semibold mb-6 accent-line">
                  카테고리
                </h3>
                {categories.length > 0 ? (
                  <nav className="space-y-2">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)] transition-all group"
                      >
                        <span className="text-body font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                          {category.name}
                        </span>
                        <svg
                          className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    ))}
                  </nav>
                ) : (
                  <p className="text-body text-[var(--text-muted)] text-sm">
                    아직 카테고리가 없습니다.
                  </p>
                )}
              </div>
            </aside>
          </div>
        ) : (
          /* 콘텐츠가 없을 때: 단일 컬럼 + 심플한 빈 상태 */
          <div className="max-w-2xl mx-auto">
            <div className="text-center py-20">
              {/* Decorative Element */}
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[var(--accent-subtle)] to-[var(--bg-secondary)] flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500">
                  <span className="text-display text-4xl font-bold text-[var(--accent)]">
                    Log
                  </span>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50" />
              </div>

              <h2 className="text-display text-2xl md:text-3xl font-semibold mb-4">
                첫 번째 글을 기다리고 있어요
              </h2>
              <p className="text-body text-[var(--text-muted)] mb-8 max-w-md mx-auto leading-relaxed">
                아직 작성된 글이 없습니다.<br />
                곧 새로운 이야기가 시작될 거예요.
              </p>

              {/* Subtle decoration */}
              <div className="flex items-center justify-center gap-2 text-[var(--text-muted)]">
                <span className="w-8 h-px bg-[var(--border)]" />
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="w-8 h-px bg-[var(--border)]" />
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState() {
  return (
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
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      </div>
      <h3 className="text-display text-xl font-semibold mb-2">
        아직 글이 없습니다
      </h3>
      <p className="text-body text-[var(--text-muted)]">
        곧 새로운 글이 올라올 예정입니다.
      </p>
    </div>
  );
}
