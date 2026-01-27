import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { PostCard } from "@/components/PostCard";
import type { Category, PostWithRelations, Tag } from "@/types";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

interface PostQueryResult {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  thumbnail: string | null;
  category_id: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  category: Category | null;
  post_tags: { tag: Tag }[] | null;
}

async function getCategoryWithPosts(
  slug: string
): Promise<{ category: Category; posts: PostWithRelations[] } | null> {
  const supabase = await createClient();

  // Get category
  const { data: categoryData, error: categoryError } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (categoryError || !categoryData) {
    return null;
  }

  const category = categoryData as Category;

  // Get posts in this category
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select(`
      *,
      category:categories(*),
      post_tags(
        tag:tags(*)
      )
    `)
    .eq("category_id", category.id)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (postsError) {
    return null;
  }

  const postsWithRelations = (posts || []).map((post) => {
    const p = post as unknown as PostQueryResult;
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      content: p.content,
      excerpt: p.excerpt,
      thumbnail: p.thumbnail,
      category_id: p.category_id,
      published: p.published,
      created_at: p.created_at,
      updated_at: p.updated_at,
      category: p.category || null,
      tags: p.post_tags?.map((pt) => pt.tag).filter(Boolean) || [],
    };
  });

  return { category, posts: postsWithRelations };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const data = await getCategoryWithPosts(slug);

  if (!data) {
    notFound();
  }

  const { category, posts } = data;

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/categories"
          className="text-blue-500 hover:text-blue-600 text-sm mb-2 inline-block"
        >
          &larr; 모든 카테고리
        </Link>
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {posts.length}개의 글
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50 dark:bg-neutral-800">
          <p className="text-gray-500 dark:text-gray-400">
            이 카테고리에 글이 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const data = await getCategoryWithPosts(slug);

  if (!data) {
    return { title: "카테고리를 찾을 수 없습니다" };
  }

  return {
    title: `${data.category.name} | My Blog`,
    description: `${data.category.name} 카테고리의 글 목록`,
  };
}
