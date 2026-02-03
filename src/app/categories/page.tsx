import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import type { Category } from "@/types";

interface CategoryWithCount extends Category {
  post_count: number;
}

async function getCategories(): Promise<CategoryWithCount[]> {
  const supabase = await createClient();

  const { data: categoriesData, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error || !categoriesData) {
    return [];
  }

  const categories = categoriesData as Category[];

  // Get post counts for each category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
      const { count } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("category_id", category.id)
        .eq("published", true);

      return {
        ...category,
        post_count: count || 0,
      };
    })
  );

  return categoriesWithCounts;
}

export default async function CategoriesPage() {
  const categories = await getCategories();
  const totalPosts = categories.reduce((sum, cat) => sum + cat.post_count, 0);

  return (
    <div className="zen-container py-16 md:py-24">
      {/* Header */}
      <header className="text-center mb-16">
        <div className="ensou-small mb-8" />
        <h1 className="text-2xl md:text-3xl font-normal tracking-wide mb-4">
          카테고리
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          {categories.length}개의 분류 · {totalPosts}편의 글
        </p>
      </header>

      {/* Categories */}
      {categories.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[var(--text-muted)]">
            아직 카테고리가 없습니다
          </p>
        </div>
      ) : (
        <div className="zen-narrow space-y-1">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="flex items-center justify-between py-4 border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors group px-4 -mx-4"
            >
              <span className="text-[var(--text-primary)] group-hover:text-[var(--text-secondary)] transition-colors">
                {category.name}
              </span>
              <span className="text-sm text-[var(--text-muted)]">
                {category.post_count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export const metadata = {
  title: "카테고리",
  description: "카테고리별 글 목록",
};
