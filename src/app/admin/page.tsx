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
      next: { revalidate: 60 }, // 1분 캐시
    });

    const data = await response.json();
    const discussions = data?.data?.repository?.discussions?.nodes || [];

    const commentMap = new Map<string, number>();
    for (const discussion of discussions) {
      // Giscus는 pathname을 title로 사용함 (예: /posts/my-slug)
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

  // 댓글 수 가져오기
  const commentMap = await getDiscussionComments();

  // 각 게시물의 조회수와 댓글 수를 가져옴
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
    <div>
      <h1 className="text-3xl font-bold mb-8">대시보드</h1>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="group p-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] hover:border-[var(--accent)] transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs text-[var(--text-muted)]">전체</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalPosts}</p>
        </div>

        <div className="group p-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] hover:border-[var(--accent)] transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs text-[var(--text-muted)]">발행됨</span>
          </div>
          <p className="text-2xl font-bold text-green-500">{stats.publishedPosts}</p>
        </div>

        <div className="group p-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] hover:border-[var(--accent)] transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-xs text-[var(--text-muted)]">임시저장</span>
          </div>
          <p className="text-2xl font-bold text-yellow-500">{stats.draftPosts}</p>
        </div>

        <div className="group p-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] hover:border-[var(--accent)] transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span className="text-xs text-[var(--text-muted)]">카테고리</span>
          </div>
          <p className="text-2xl font-bold">{stats.categories}</p>
        </div>

        <div className="group p-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] hover:border-[var(--accent)] transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="text-xs text-[var(--text-muted)]">태그</span>
          </div>
          <p className="text-2xl font-bold">{stats.tags}</p>
        </div>
      </div>

      {/* 최신 게시물 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">최신 게시물</h2>
          <Link
            href="/admin/posts"
            className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            전체 보기
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div className="text-center py-8 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)]">
            <p className="text-[var(--text-muted)]">게시물이 없습니다.</p>
          </div>
        ) : (
          <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[var(--bg-secondary)]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">제목</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">상태</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">조회수</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">댓글</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">작성일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {recentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="font-medium hover:text-[var(--accent)] transition-colors"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {post.published ? (
                        <span className="inline-flex px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                          발행됨
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                          임시저장
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {post.view_count.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.comment_count}
                      </div>
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
