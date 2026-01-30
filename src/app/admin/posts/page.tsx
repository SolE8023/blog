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
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">게시물 관리</h1>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
        >
          새 게시물
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)]">
          <p className="text-[var(--text-muted)] mb-4">
            게시물이 없습니다.
          </p>
          <Link
            href="/admin/posts/new"
            className="text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            첫 번째 게시물 작성하기
          </Link>
        </div>
      ) : (
        <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--bg-secondary)]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">제목</th>
                <th className="px-4 py-3 text-left text-sm font-medium">카테고리</th>
                <th className="px-4 py-3 text-left text-sm font-medium">상태</th>
                <th className="px-4 py-3 text-left text-sm font-medium">조회수</th>
                <th className="px-4 py-3 text-left text-sm font-medium">작성일</th>
                <th className="px-4 py-3 text-right text-sm font-medium">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="font-medium hover:text-[var(--accent)] transition-colors"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-muted)]">
                    {post.category?.name || "-"}
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
                  <td className="px-4 py-3 text-sm text-[var(--text-muted)]">
                    {formatDate(post.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)]"
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
