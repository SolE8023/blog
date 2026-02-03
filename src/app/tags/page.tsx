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

  return (
    <div className="zen-container py-16 md:py-24">
      {/* Header */}
      <header className="text-center mb-16">
        <div className="ensou-small mb-8" />
        <h1 className="text-2xl md:text-3xl font-normal tracking-wide mb-4">
          태그
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          {tags.length}개의 태그 · {totalPosts}편의 글
        </p>
      </header>

      {/* Tags */}
      {tags.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[var(--text-muted)]">
            아직 태그가 없습니다
          </p>
        </div>
      ) : (
        <div className="zen-narrow">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <span>{tag.name}</span>
                <span className="text-[var(--text-muted)] ml-1 text-sm">
                  ({tag.post_count})
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const metadata = {
  title: "태그",
  description: "태그별 글 목록",
};
