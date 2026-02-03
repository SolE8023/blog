"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import type { Category } from "@/types";

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async (category: Category) => {
    if (!confirm(`"${category.name}" 카테고리를 삭제하시겠습니까?`)) {
      return;
    }

    setDeletingId(category.id);

    try {
      // First, update posts to remove category reference
      await supabase
        .from("posts")
        .update({ category_id: null })
        .eq("category_id", category.id);

      // Then delete the category
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", category.id);

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

  if (categories.length === 0) {
    return (
      <div className="text-center py-8 border border-[var(--border)] bg-[var(--bg-secondary)]">
        <p className="text-[var(--text-muted)]">
          카테고리 없음
        </p>
      </div>
    );
  }

  return (
    <div className="border border-[var(--border)] overflow-hidden">
      <table className="w-full">
        <thead className="bg-[var(--bg-secondary)]">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] tracking-wide">이름</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] tracking-wide">슬러그</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-[var(--text-muted)] tracking-wide">작업</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
              <td className="px-4 py-3 text-sm">{category.name}</td>
              <td className="px-4 py-3 text-sm text-[var(--text-muted)]">
                {category.slug}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => handleDelete(category)}
                  disabled={deletingId === category.id}
                  className="text-sm text-[var(--text-muted)] hover:text-red-500 disabled:opacity-50 transition-colors"
                >
                  {deletingId === category.id ? "..." : "삭제"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
