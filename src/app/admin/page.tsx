import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";

interface RecentPost extends Post {
  view_count: number;
  comment_count: number;
}

async function getStats() {
  const supabase = await createClient();

  const [postsResult, categoriesResult, tagsResult] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("tags").select("*", { count: "exact", head: true }),
  ]);

  const { count: publishedCount } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("published", true);

  return {
    totalPosts: postsResult.count || 0,
    publishedPosts: publishedCount || 0,
    draftPosts: (postsResult.count || 0) - (publishedCount || 0),
    categories: categoriesResult.count || 0,
    tags: tagsResult.count || 0,
  };
}

async function getDiscussionComments(): Promise<Map<string, number>> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;

  if (!token || !repo) {
    return new Map();
  }

  const [owner, repoName] = repo.split("/");

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query {
            repository(owner: "${owner}", name: "${repoName}") {
              discussions(first: 100, categoryId: "${process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID}") {
                nodes {
                  title
                  comments {
                    totalCount
                  }
                }
              }
            }
          }
        `,
      }),
      next: { revalidate: 60 },
    });

    const data = await response.json();
    const discussions = data?.data?.repository?.discussions?.nodes || [];

    const commentMap = new Map<string, number>();
    for (const discussion of discussions) {
      const slug = discussion.title.replace(/^\/posts\//, "");
      commentMap.set(slug, discussion.comments.totalCount);
    }

    return commentMap;
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return new Map();
  }
}

async function getRecentPosts(): Promise<RecentPost[]> {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching recent posts:", error);
    return [];
  }

  const commentMap = await getDiscussionComments();

  const postsWithStats = await Promise.all(
    (posts || []).map(async (post) => {
      const { count } = await supabase
        .from("post_views")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id);

      return {
        ...post,
        view_count: count || 0,
        comment_count: commentMap.get(post.slug) || 0,
      };
    })
  );

  return postsWithStats;
}

export default async function AdminDashboard() {
  const [stats, recentPosts] = await Promise.all([
    getStats(),
    getRecentPosts(),
  ]);

  return (
    <div className="admin-ui">
      <h1 className="text-2xl font-semibold mb-8">대시보드</h1>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        <StatCard label="전체" value={stats.totalPosts} />
        <StatCard label="발행됨" value={stats.publishedPosts} color="green" />
        <StatCard label="임시저장" value={stats.draftPosts} color="yellow" />
        <StatCard label="카테고리" value={stats.categories} />
        <StatCard label="태그" value={stats.tags} />
      </div>

      {/* 최신 게시물 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">최신 게시물</h2>
          <Link
            href="/admin/posts"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            전체 보기
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div className="text-center py-12 border border-[var(--border)] rounded bg-[var(--bg-secondary)]">
            <p className="text-[var(--text-muted)]">게시물이 없습니다</p>
          </div>
        ) : (
          <div className="border border-[var(--border)] rounded overflow-hidden">
            <table className="w-full">
              <thead className="bg-[var(--bg-secondary)]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] tracking-wide">제목</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] tracking-wide">상태</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] tracking-wide">조회</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] tracking-wide">댓글</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] tracking-wide">작성일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {recentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="text-sm font-medium hover:text-[var(--text-muted)] transition-colors"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {post.published ? (
                        <span className="inline-flex px-2 py-0.5 text-xs rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                          발행
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 text-xs rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                          임시
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text-muted)]">
                      {post.view_count.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text-muted)]">
                      {post.comment_count}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text-muted)]">
                      {formatDate(post.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color
}: {
  label: string;
  value: number;
  color?: "green" | "yellow";
}) {
  const colorClass = color === "green"
    ? "text-green-600 dark:text-green-400"
    : color === "yellow"
    ? "text-yellow-600 dark:text-yellow-400"
    : "";

  return (
    <div className="p-4 border border-[var(--border)] rounded bg-[var(--bg-card)] hover:border-[var(--border-strong)] transition-colors">
      <p className="text-xs text-[var(--text-muted)] mb-1">{label}</p>
      <p className={`text-2xl font-semibold ${colorClass}`}>{value}</p>
    </div>
  );
}
