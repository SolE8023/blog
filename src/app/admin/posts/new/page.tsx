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
    <div>
      <h1 className="text-3xl font-bold mb-8">새 게시물</h1>
      <PostForm categories={categories} tags={tags} />
    </div>
  );
}
