import Link from "next/link";
import Image from "next/image";
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
    <article className="group card-editorial rounded-lg overflow-hidden">
      {post.thumbnail && (
        <Link href={`/posts/${post.slug}`} className="block relative h-52 overflow-hidden">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>
      )}

      <div className="p-6">
        {/* Category & Date */}
        <div className="flex items-center gap-3 mb-4">
          {post.category && (
            <Link
              href={`/categories/${post.category.slug}`}
              className="tag-editorial"
            >
              {post.category.name}
            </Link>
          )}
          <span className="text-body text-xs text-[var(--text-muted)] tracking-wide">
            {formatDate(post.created_at)}
          </span>
        </div>

        {/* Title */}
        <Link href={`/posts/${post.slug}`} className="block group/title">
          <h2 className="text-display text-xl font-semibold leading-tight mb-3 text-[var(--text-primary)] group-hover/title:text-[var(--accent)] transition-colors duration-300">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-body text-[var(--text-secondary)] text-sm leading-relaxed mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--border)]">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="text-body text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
            {post.tags.length > 3 && (
              <span className="text-body text-xs text-[var(--text-muted)]">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function FeaturedPostCard({ post }: { post: PostWithRelations }) {
  return (
    <article className="group relative overflow-hidden rounded-xl">
      {/* Background Image */}
      <div className="relative h-[500px] md:h-[600px]">
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-card)]" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
        <div className="max-w-2xl">
          {/* Category & Date */}
          <div className="flex items-center gap-4 mb-4">
            {post.category && (
              <Link
                href={`/categories/${post.category.slug}`}
                className="px-3 py-1 text-xs font-medium bg-[var(--accent)] text-[var(--bg-primary)] rounded"
              >
                {post.category.name}
              </Link>
            )}
            <span className="text-body text-sm text-white/70">
              {formatDate(post.created_at)}
            </span>
          </div>

          {/* Title */}
          <Link href={`/posts/${post.slug}`}>
            <h2 className="text-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 group-hover:text-[var(--accent)] transition-colors duration-300">
              {post.title}
            </h2>
          </Link>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-body text-white/80 text-lg leading-relaxed mb-6 line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {/* Read More */}
          <Link
            href={`/posts/${post.slug}`}
            className="inline-flex items-center gap-2 text-body text-sm font-medium text-[var(--accent)] hover:gap-4 transition-all duration-300"
          >
            글 읽기
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
