import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import type { Tag } from "@/types";

interface TagWithCount extends Tag {
  post_count: number;
}

async function getTags(): Promise<TagWithCount[]> {
  const supabase = await createClient();

  const { data: tagsData, error } = await supabase
    .from("tags")
    .select("*")
    .order("name");

  if (error || !tagsData) {
    return [];
  }

  const tags = tagsData as Tag[];

  // Get post counts for each tag
  const tagsWithCounts = await Promise.all(
    tags.map(async (tag) => {
      const { count } = await supabase
        .from("post_tags")
        .select("*, posts!inner(published)", { count: "exact", head: true })
        .eq("tag_id", tag.id)
        .eq("posts.published", true);

      return {
        ...tag,
        post_count: count || 0,
      };
    })
  );

  return tagsWithCounts.filter((tag) => tag.post_count > 0);
}

export default async function TagsPage() {
  const tags = await getTags();
  const totalPosts = tags.reduce((sum, tag) => sum + tag.post_count, 0);

  // Group tags by size for visual hierarchy
  const popularTags = tags.filter((t) => t.post_count >= 3);
  const regularTags = tags.filter((t) => t.post_count < 3);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="editorial-container py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="text-body text-sm font-medium text-[var(--accent)] mb-4">
            주제 탐색
          </p>
          <h1 className="text-display text-4xl md:text-5xl font-bold leading-tight mb-6">
            태그
          </h1>
          <p className="text-body text-lg text-[var(--text-secondary)]">
            {tags.length}개의 태그에서 {totalPosts}개의 글을 찾아보세요.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="divider" />

      {/* Tags Cloud */}
      <section className="editorial-container py-16 pb-24">
        {tags.length === 0 ? (
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <h3 className="text-display text-xl font-semibold mb-2">
              아직 태그가 없습니다
            </h3>
            <p className="text-body text-[var(--text-muted)]">
              글이 작성되면 태그가 표시됩니다.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Popular Tags */}
            {popularTags.length > 0 && (
              <div>
                <h2 className="text-display text-xl font-semibold mb-6 accent-line">
                  인기 태그
                </h2>
                <div className="flex flex-wrap gap-4">
                  {popularTags.map((tag, index) => (
                    <Link
                      key={tag.id}
                      href={`/tags/${tag.slug}`}
                      className="group flex items-center gap-3 px-5 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)] transition-all duration-300 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.03}s` }}
                    >
                      <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                      <span className="text-body font-medium text-[var(--text-primary)]">
                        {tag.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] text-body text-xs text-[var(--text-muted)] group-hover:bg-[var(--accent)] group-hover:text-[var(--bg-primary)] transition-colors">
                        {tag.post_count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All Tags */}
            <div>
              <h2 className="text-display text-xl font-semibold mb-6 accent-line">
                {popularTags.length > 0 ? "모든 태그" : "태그 목록"}
              </h2>
              <div className="flex flex-wrap gap-3">
                {(popularTags.length > 0 ? regularTags : tags).map((tag, index) => (
                  <Link
                    key={tag.id}
                    href={`/tags/${tag.slug}`}
                    className="group inline-flex items-center gap-2 tag-editorial animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.02}s` }}
                  >
                    <span>{tag.name}</span>
                    <span className="text-[var(--text-muted)] group-hover:text-[var(--bg-primary)]">
                      ({tag.post_count})
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-[var(--border)]">
              <StatCard label="전체 태그" value={tags.length} />
              <StatCard label="전체 글" value={totalPosts} />
              <StatCard
                label="최다 사용"
                value={tags[0]?.name || "-"}
                isText
              />
              <StatCard
                label="태그당 평균"
                value={tags.length > 0 ? Math.round(totalPosts / tags.length) : 0}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  isText = false
}: {
  label: string;
  value: string | number;
  isText?: boolean
}) {
  return (
    <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
      <p className="text-body text-xs tracking-wide text-[var(--text-muted)] mb-1">
        {label}
      </p>
      <p className={`${isText ? "text-body" : "text-display"} text-2xl font-semibold text-[var(--text-primary)]`}>
        {value}
      </p>
    </div>
  );
}

export const metadata = {
  title: "태그 | 필기장",
  description: "태그별 글 목록",
};
