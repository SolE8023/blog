import { createClient } from "@/lib/supabase-server";

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

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">대시보드</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 border rounded-lg bg-white dark:bg-neutral-800">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">전체 게시물</h3>
          <p className="text-3xl font-bold">{stats.totalPosts}</p>
        </div>

        <div className="p-6 border rounded-lg bg-white dark:bg-neutral-800">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">발행된 게시물</h3>
          <p className="text-3xl font-bold text-green-500">{stats.publishedPosts}</p>
        </div>

        <div className="p-6 border rounded-lg bg-white dark:bg-neutral-800">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">임시 저장</h3>
          <p className="text-3xl font-bold text-yellow-500">{stats.draftPosts}</p>
        </div>

        <div className="p-6 border rounded-lg bg-white dark:bg-neutral-800">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">카테고리</h3>
          <p className="text-3xl font-bold">{stats.categories}</p>
        </div>

        <div className="p-6 border rounded-lg bg-white dark:bg-neutral-800">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">태그</h3>
          <p className="text-3xl font-bold">{stats.tags}</p>
        </div>
      </div>
    </div>
  );
}
