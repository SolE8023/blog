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
      <div className="text-center py-8 border rounded-lg bg-gray-50 dark:bg-neutral-800">
        <p className="text-gray-500 dark:text-gray-400">
          등록된 카테고리가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-neutral-800">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium">이름</th>
            <th className="px-4 py-3 text-left text-sm font-medium">슬러그</th>
            <th className="px-4 py-3 text-right text-sm font-medium">작업</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
              <td className="px-4 py-3 font-medium">{category.name}</td>
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                {category.slug}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => handleDelete(category)}
                  disabled={deletingId === category.id}
                  className="text-sm text-red-500 hover:text-red-600 disabled:opacity-50"
                >
                  {deletingId === category.id ? "삭제 중..." : "삭제"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
