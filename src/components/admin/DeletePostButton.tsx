"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

interface DeletePostButtonProps {
  postId: string;
  postTitle: string;
}

export function DeletePostButton({ postId, postTitle }: DeletePostButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm(`"${postTitle}" 게시물을 삭제하시겠습니까?`)) {
      return;
    }

    setLoading(true);

    try {
      // Delete post_tags first (foreign key constraint)
      await supabase.from("post_tags").delete().eq("post_id", postId);

      // Delete post_views
      await supabase.from("post_views").delete().eq("post_id", postId);

      // Delete the post
      const { error } = await supabase.from("posts").delete().eq("id", postId);

      if (error) {
        alert("삭제 중 오류가 발생했습니다: " + error.message);
      } else {
        router.refresh();
      }
    } catch {
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-[var(--text-muted)] hover:text-red-500 disabled:opacity-50 transition-colors"
    >
      {loading ? "..." : "삭제"}
    </button>
  );
}
