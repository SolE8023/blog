import Link from "next/link";
import { AdminAuthProvider } from "@/components/admin/AdminAuthProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <div className="editorial-container pb-16">
        <div className="flex gap-8 lg:gap-12">
          {/* Sidebar */}
          <aside className="w-56 shrink-0">
            <nav className="sticky top-24">
              <div className="space-y-1">
                <AdminNavLink href="/admin" icon="dashboard">
                  대시보드
                </AdminNavLink>
                <AdminNavLink href="/admin/posts" icon="posts">
                  게시물 관리
                </AdminNavLink>
                <AdminNavLink href="/admin/categories" icon="categories">
                  카테고리 관리
                </AdminNavLink>
                <AdminNavLink href="/admin/tags" icon="tags">
                  태그 관리
                </AdminNavLink>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-[var(--border)]">
                <p className="text-body text-xs font-medium text-[var(--text-muted)] mb-3 px-3">
                  빠른 작업
                </p>
                <Link
                  href="/admin/posts/new"
                  className="flex items-center gap-2 px-3 py-2.5 text-body text-sm font-medium bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  새 글 작성
                </Link>
              </div>

              {/* Back to Site */}
              <div className="mt-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-2 text-body text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  사이트로 돌아가기
                </Link>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </AdminAuthProvider>
  );
}

function AdminNavLink({
  href,
  icon,
  children
}: {
  href: string;
  icon: "dashboard" | "posts" | "categories" | "tags";
  children: React.ReactNode;
}) {
  const icons = {
    dashboard: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
    ),
    posts: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
    categories: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    tags: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  };

  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-body text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all group"
    >
      <span className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">
        {icons[icon]}
      </span>
      {children}
    </Link>
  );
}

export const metadata = {
  title: "관리자 | Log.",
};
