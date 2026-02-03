import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { PostCard } from "@/components/PostCard";
import type { Tag, PostWithRelations, Category } from "@/types";

interface TagPageProps {
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

async function getTagWithPosts(
  slug: string
): Promise<{ tag: Tag; posts: PostWithRelations[] } | null> {
  const supabase = await createClient();

  // Get tag
  const { data: tagData, error: tagError } = await supabase
    .from("tags")
    .select("*")
    .eq("slug", slug)
    .single();

  if (tagError || !tagData) {
    return null;
  }

  const tag = tagData as Tag;

  // Get posts with this tag
  const { data: postTags, error: postTagsError } = await supabase
    .from("post_tags")
    .select(`
      post:posts(
        *,
        category:categories(*),
        post_tags(
          tag:tags(*)
        )
      )
    `)
    .eq("tag_id", tag.id);

  if (postTagsError || !postTags) {
    return { tag, posts: [] };
  }

  const posts = postTags
    .map((pt) => (pt as unknown as { post: PostQueryResult | null }).post)
    .filter((post): post is PostQueryResult => post !== null && post.published)
    .map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      thumbnail: post.thumbnail,
      category_id: post.category_id,
      published: post.published,
      created_at: post.created_at,
      updated_at: post.updated_at,
      category: post.category || null,
      tags: post.post_tags?.map((pt) => pt.tag).filter(Boolean) || [],
    }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return { tag, posts };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const data = await getTagWithPosts(slug);

  if (!data) {
    notFound();
  }

  const { tag, posts } = data;

  return (
    <div className="zen-container py-16 md:py-24">
      {/* Header */}
      <header className="text-center mb-16">
        <Link
          href="/tags"
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-8 inline-block"
        >
          ← 태그
        </Link>
        <div className="ensou-small mb-8" />
        <h1 className="text-2xl md:text-3xl font-normal tracking-wide mb-4">
          {tag.name}
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          {posts.length}편의 글
        </p>
      </header>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[var(--text-muted)]">
            이 태그가 붙은 글이 없습니다
          </p>
        </div>
      ) : (
        <div className="zen-narrow space-y-1">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({ params }: TagPageProps) {
  const { slug } = await params;
  const data = await getTagWithPosts(slug);

  if (!data) {
    return { title: "태그를 찾을 수 없습니다" };
  }

  return {
    title: data.tag.name,
    description: `${data.tag.name} 태그가 붙은 글 목록`,
  };
}
