import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { formatDate } from "@/lib/utils";
import { DeletePostButton } from "@/components/admin/DeletePostButton";
import type { Post, Category } from "@/types";

interface PostWithCategory extends Post {
  category: Category | null;
  view_count: number;
}

async function getPosts(): Promise<PostWithCategory[]> {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      *,
      category:categories(*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  // 각 게시물의 조회수를 가져옴
  const postsWithViews = await Promise.all(
    (posts || []).map(async (post) => {
      const { count } = await supabase
        .from("post_views")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id);

      const { category, ...rest } = post as { category?: Category | null } & Post;
      return {
        ...rest,
        category: category || null,
        view_count: count || 0,
      };
    })
  );

  return postsWithViews;
}

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <div className="admin-ui">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">게시물</h1>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 text-ui text-sm bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-80 transition-opacity"
        >
          새 글
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 border border-[var(--border)] bg-[var(--bg-secondary)]">
          <p className="text-[var(--text-muted)] mb-4">
            게시물이 없습니다
          </p>
          <Link
            href="/admin/posts/new"
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            첫 번째 게시물 작성하기
          </Link>
        </div>
      ) : (
        <div className="border border-[var(--border)] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--bg-secondary)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] tracking-wide">제목</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] tracking-wide">카테고리</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] tracking-wide">상태</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] tracking-wide">조회</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] tracking-wide">작성일</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--text-muted)] tracking-wide">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="text-sm font-medium hover:text-[var(--text-muted)] transition-colors"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-muted)]">
                    {post.category?.name || "-"}
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
                    {formatDate(post.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        수정
                      </Link>
                      <DeletePostButton postId={post.id} postTitle={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
