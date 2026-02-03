import { createClient } from "@/lib/supabase-server";
import { PostForm } from "@/components/admin/PostForm";

async function getCategoriesAndTags() {
  const supabase = await createClient();

  const [categoriesResult, tagsResult] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("tags").select("*").order("name"),
  ]);

  return {
    categories: categoriesResult.data || [],
    tags: tagsResult.data || [],
  };
}

export default async function NewPostPage() {
  const { categories, tags } = await getCategoriesAndTags();

  return (
    <div className="admin-ui">
      <h1 className="text-2xl font-semibold mb-8">새 글</h1>
      <PostForm categories={categories} tags={tags} />
    </div>
  );
}
