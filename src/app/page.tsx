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

  return (
    <div className="min-h-screen">
      {/* Hero - 고요한 인트로 */}
      <section className="zen-container py-24 md:py-32">
        <div className="flex flex-col items-center text-center">
          {/* 원상 심볼 */}
          <div className="ensou mb-12 animate-fade-in" />

          {/* 제목 */}
          <h1 className="text-display text-3xl md:text-4xl font-bold tracking-wider leading-relaxed mb-6 animate-fade-in-up stagger-1">
            고요히 기록하는 공간
          </h1>

          {/* 부제 */}
          <p className="text-body text-[var(--text-muted)] tracking-wide mb-12 animate-fade-in-up stagger-2">
            개발과 일상의 이야기
          </p>

          {/* 잉크 라인 */}
          <div className="ink-line animate-fade-in-up stagger-3" />
        </div>
      </section>

      {/* 글 목록 */}
      {posts.length > 0 ? (
        <section className="zen-container pb-24">
          <div className="zen-narrow">
            {/* 섹션 헤더 */}
            <div className="flex items-center justify-center mb-16">
              <h2 className="text-display text-lg tracking-widest text-[var(--text-muted)]">
                글
              </h2>
            </div>

            {/* 포스트 리스트 */}
            <div className="space-y-0">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <EmptyState />
      )}

      {/* 카테고리 */}
      {categories.length > 0 && (
        <section className="zen-container pb-24">
          <div className="zen-narrow">
            {/* 디바이더 */}
            <div className="zen-divider" />

            {/* 섹션 헤더 */}
            <div className="flex items-center justify-center mb-12">
              <h2 className="text-display text-lg tracking-widest text-[var(--text-muted)]">
                주제
              </h2>
            </div>

            {/* 카테고리 목록 */}
            <div className="flex flex-wrap justify-center gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="text-body tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <section className="zen-container pb-24">
      <div className="zen-narrow">
        <div className="flex flex-col items-center text-center py-16">
          <div className="ensou-small mb-8 animate-breathe" />
          <p className="text-body text-[var(--text-muted)] tracking-wide">
            아직 기록이 없습니다
          </p>
        </div>
      </div>
    </section>
  );
}
