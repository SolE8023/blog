"use client";

import { useEffect, useState } from "react";

interface ViewCounterProps {
  postId: string;
  className?: string;
}

export function ViewCounter({ postId, className = "" }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const storageKey = `viewed_${postId}`;
    const hasViewed = sessionStorage.getItem(storageKey);

    const recordView = async () => {
      try {
        // 이미 이 세션에서 조회했으면 GET만
        if (hasViewed) {
          const res = await fetch(`/api/views/${postId}`);
          const data = await res.json();
          setViews(data.views);
          return;
        }

        // 처음 조회면 POST로 기록
        sessionStorage.setItem(storageKey, "true");
        const res = await fetch(`/api/views/${postId}`, {
          method: "POST",
        });
        const data = await res.json();
        setViews(data.views);

        // 숫자 애니메이션 효과
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);
      } catch (error) {
        console.error("Failed to record view:", error);
      }
    };

    recordView();
  }, [postId]);

  if (views === null) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <svg
          className="w-4 h-4 text-[var(--text-muted)] animate-pulse"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.007-9.963-7.178z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="text-body text-sm text-[var(--text-muted)]">
          <span className="inline-block w-8 h-4 bg-[var(--bg-secondary)] rounded animate-pulse" />
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 group ${className}`}>
      {/* Eye Icon */}
      <svg
        className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors duration-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.007-9.963-7.178z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>

      {/* View Count */}
      <span
        className={`
          text-body text-sm text-[var(--text-muted)] tabular-nums
          transition-all duration-300
          ${isAnimating ? "scale-110 text-[var(--accent)]" : ""}
        `}
      >
        {views.toLocaleString()}
      </span>
    </span>
  );
}
