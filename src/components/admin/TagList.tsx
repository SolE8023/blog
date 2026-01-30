"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import type { Tag } from "@/types";

interface TagListProps {
  tags: Tag[];
}

export function TagList({ tags }: TagListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async (tag: Tag) => {
    if (!confirm(`"${tag.name}" 태그를 삭제하시겠습니까?`)) {
      return;
    }

    setDeletingId(tag.id);

    try {
      // First, delete post_tags references
      await supabase.from("post_tags").delete().eq("tag_id", tag.id);

      // Then delete the tag
      const { error } = await supabase.from("tags").delete().eq("id", tag.id);

      if (error) {
        alert("삭제 중 오류가 발생했습니다: " + error.message);
      } else {
        router.refresh();
      }
    } catch {
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  if (tags.length === 0) {
    return (
      <div className="text-center py-8 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)]">
        <p className="text-[var(--text-muted)]">
          등록된 태그가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-[var(--bg-secondary)]">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium">이름</th>
            <th className="px-4 py-3 text-left text-sm font-medium">슬러그</th>
            <th className="px-4 py-3 text-right text-sm font-medium">작업</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {tags.map((tag) => (
            <tr key={tag.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
              <td className="px-4 py-3 font-medium">#{tag.name}</td>
              <td className="px-4 py-3 text-sm text-[var(--text-muted)]">
                {tag.slug}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => handleDelete(tag)}
                  disabled={deletingId === tag.id}
                  className="text-sm text-red-500 hover:text-red-600 disabled:opacity-50 transition-colors"
                >
                  {deletingId === tag.id ? "삭제 중..." : "삭제"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
