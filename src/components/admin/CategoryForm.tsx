"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { generateSlug } from "@/lib/utils";

export function CategoryForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const supabase = createClient();

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(generateSlug(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from("categories")
        .insert({ name, slug });

      if (insertError) {
        if (insertError.code === "23505") {
          setError("이미 존재하는 카테고리입니다.");
        } else {
          setError(insertError.message);
        }
      } else {
        setName("");
        setSlug("");
        router.refresh();
      }
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border border-[var(--border)] bg-[var(--bg-secondary)]">
      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm text-[var(--text-muted)] mb-2">
            이름
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-4 py-2 bg-transparent border border-[var(--border)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
            required
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm text-[var(--text-muted)] mb-2">
            슬러그
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-4 py-2 bg-transparent border border-[var(--border)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {loading ? "..." : "추가"}
        </button>
      </div>
    </form>
  );
}
