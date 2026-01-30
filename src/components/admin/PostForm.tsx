"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { generateSlug, getExcerpt } from "@/lib/utils";
import type { Post, Category, Tag } from "@/types";

interface PostFormProps {
  post?: Post;
  categories: Category[];
  tags: Tag[];
  selectedTagIds?: string[];
}

export function PostForm({ post, categories, tags, selectedTagIds = [] }: PostFormProps) {
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [content, setContent] = useState(post?.content || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [thumbnail, setThumbnail] = useState(post?.thumbnail || "");
  const [categoryId, setCategoryId] = useState(post?.category_id || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(selectedTagIds);
  const [published, setPublished] = useState(post?.published ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const supabase = createClient();
  const isEditing = !!post;

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditing || !post?.slug) {
      setSlug(generateSlug(value));
    }
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    if (!excerpt) {
      setExcerpt(getExcerpt(value));
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const postData = {
        title,
        slug,
        content,
        excerpt: excerpt || getExcerpt(content),
        thumbnail: thumbnail || null,
        category_id: categoryId || null,
        published,
        updated_at: new Date().toISOString(),
      };

      if (isEditing) {
        // Update existing post
        const { error: updateError } = await supabase
          .from("posts")
          .update(postData)
          .eq("id", post.id);

        if (updateError) throw updateError;

        // Update tags
        await supabase.from("post_tags").delete().eq("post_id", post.id);

        if (selectedTags.length > 0) {
          const tagInserts = selectedTags.map((tagId) => ({
            post_id: post.id,
            tag_id: tagId,
          }));
          await supabase.from("post_tags").insert(tagInserts);
        }
      } else {
        // Create new post
        const { data: newPost, error: insertError } = await supabase
          .from("posts")
          .insert(postData)
          .select()
          .single();

        if (insertError) throw insertError;

        // Add tags
        if (selectedTags.length > 0 && newPost) {
          const tagInserts = selectedTags.map((tagId) => ({
            post_id: newPost.id,
            tag_id: tagId,
          }));
          await supabase.from("post_tags").insert(tagInserts);
        }
      }

      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      console.error("Error saving post:", err);
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              제목 *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-1">
              슬러그 *
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              내용 (Markdown) *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              rows={20}
              className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent font-mono text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium mb-1">
              요약
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="p-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)]">
            <h3 className="font-medium mb-4">발행 설정</h3>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded accent-[var(--accent)]"
              />
              <span className="text-sm">발행하기</span>
            </label>
          </div>

          <div className="p-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)]">
            <label htmlFor="thumbnail" className="block text-sm font-medium mb-2">
              썸네일 URL
            </label>
            <input
              id="thumbnail"
              type="url"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            />
          </div>

          <div className="p-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)]">
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              카테고리
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            >
              <option value="">선택 안함</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)]">
            <h3 className="text-sm font-medium mb-2">태그</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedTags.includes(tag.id)
                      ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                      : "bg-[var(--bg-card)] border-[var(--border-color)] hover:border-[var(--accent)]"
                  }`}
                >
                  #{tag.name}
                </button>
              ))}
              {tags.length === 0 && (
                <p className="text-sm text-[var(--text-muted)]">등록된 태그가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-[var(--border-color)]">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "저장 중..." : isEditing ? "수정하기" : "작성하기"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  );
}
