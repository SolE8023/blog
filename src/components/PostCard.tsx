import Link from "next/link";
import type { PostWithRelations } from "@/types";
import { formatDate } from "@/lib/utils";

interface PostCardProps {
  post: PostWithRelations;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  if (featured) {
    return <FeaturedPostCard post={post} />;
  }

  return (
    <article className="group py-10 border-b border-[var(--border)]">
      <Link href={`/posts/${post.slug}`} className="block">
        {/* 날짜 */}
        <time className="text-ui text-xs tracking-wider text-[var(--text-muted)] mb-4 block">
          {formatDate(post.created_at)}
        </time>

        {/* 제목 */}
        <h2 className="text-display text-xl md:text-2xl font-bold tracking-wide leading-relaxed mb-4 group-hover:opacity-60 transition-opacity duration-300">
          {post.title}
        </h2>

        {/* 발췌 */}
        {post.excerpt && (
          <p className="text-body text-[var(--text-secondary)] leading-loose line-clamp-2 mb-4">
            {post.excerpt}
          </p>
        )}

        {/* 카테고리 */}
        {post.category && (
          <span className="text-ui text-xs tracking-wider text-[var(--text-muted)]">
            {post.category.name}
          </span>
        )}
      </Link>
    </article>
  );
}

function FeaturedPostCard({ post }: { post: PostWithRelations }) {
  return (
    <article className="group py-12">
      <Link href={`/posts/${post.slug}`} className="block text-center">
        {/* 날짜 */}
        <time className="text-ui text-xs tracking-wider text-[var(--text-muted)] mb-6 block">
          {formatDate(post.created_at)}
        </time>

        {/* 제목 */}
        <h2 className="text-display text-2xl md:text-3xl font-bold tracking-wide leading-relaxed mb-6 group-hover:opacity-60 transition-opacity duration-300">
          {post.title}
        </h2>

        {/* 발췌 */}
        {post.excerpt && (
          <p className="text-body text-[var(--text-secondary)] leading-loose max-w-lg mx-auto mb-6">
            {post.excerpt}
          </p>
        )}

        {/* 읽기 링크 */}
        <span className="text-ui text-sm tracking-wider text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
          읽기
        </span>
      </Link>
    </article>
  );
}
