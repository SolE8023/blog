import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { PostForm } from "@/components/admin/PostForm";
import type { Post, Tag } from "@/types";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

interface PostWithTags extends Post {
  post_tags: { tag_id: string }[];
}

async function getPost(id: string): Promise<PostWithTags | null> {
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      post_tags(tag_id)
    `)
    .eq("id", id)
    .single();

  if (error || !post) {
    return null;
  }

  return post as PostWithTags;
}

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

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const [post, { categories, tags }] = await Promise.all([
    getPost(id),
    getCategoriesAndTags(),
  ]);

  if (!post) {
    notFound();
  }

  const selectedTagIds = post.post_tags?.map((pt) => pt.tag_id) || [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">게시물 수정</h1>
      <PostForm
        post={post}
        categories={categories}
        tags={tags}
        selectedTagIds={selectedTagIds}
      />
    </div>
  );
}
