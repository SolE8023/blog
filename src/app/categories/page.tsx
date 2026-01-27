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
    <div className="min-h-screen">
      {/* Header */}
      <section className="editorial-container py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="text-body text-sm font-medium text-[var(--accent)] mb-4">
            주제별 탐색
          </p>
          <h1 className="text-display text-4xl md:text-5xl font-bold leading-tight mb-6">
            카테고리
          </h1>
          <p className="text-body text-lg text-[var(--text-secondary)]">
            {categories.length}개의 카테고리에서 {totalPosts}개의 글을 찾아보세요.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="divider" />

      {/* Categories Grid */}
      <section className="editorial-container py-16 pb-24">
        {categories.length === 0 ? (
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-display text-xl font-semibold mb-2">
              아직 카테고리가 없습니다
            </h3>
            <p className="text-body text-[var(--text-muted)]">
              글이 작성되면 카테고리가 표시됩니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative p-8 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)] transition-all duration-300 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Background Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-subtle)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="relative">
                  {/* Icon */}
                  <div className="w-12 h-12 mb-6 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:scale-110 transition-all duration-300">
                    <svg
                      className="w-6 h-6 text-[var(--text-muted)] group-hover:text-[var(--bg-primary)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>

                  {/* Title */}
                  <h2 className="text-display text-xl font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors">
                    {category.name}
                  </h2>

                  {/* Count */}
                  <p className="text-body text-sm text-[var(--text-muted)]">
                    {category.post_count}개의 글
                  </p>

                  {/* Arrow */}
                  <div className="absolute top-8 right-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-300">
                    <svg
                      className="w-5 h-5 text-[var(--accent)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export const metadata = {
  title: "카테고리 | 필기장",
  description: "카테고리별 글 목록",
};
