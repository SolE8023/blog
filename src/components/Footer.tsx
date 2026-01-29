import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)]">
      <div className="editorial-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center group">
              <span className="text-display text-3xl font-bold tracking-tight">
                Log
              </span>
              <span className="w-2.5 h-6 bg-[var(--accent)] ml-0.5 rounded-sm" />
            </Link>
            <p className="mt-6 text-body text-[var(--text-muted)] leading-relaxed max-w-sm">
              개발, 일상, 그리고 다양한 이야기들.
              기록하고 싶은 모든 것들을 담는 공간입니다.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <SocialLink href="https://github.com/SolE8023" label="깃허브">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </SocialLink>
              <SocialLink href="mailto:khs671998@gmail.com" label="이메일">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </SocialLink>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-body text-xs font-semibold tracking-wide text-[var(--text-muted)] mb-4">
              둘러보기
            </h4>
            <nav className="flex flex-col gap-3">
              <FooterLink href="/">홈</FooterLink>
              <FooterLink href="/categories">카테고리</FooterLink>
              <FooterLink href="/tags">태그</FooterLink>
              <FooterLink href="/search">검색</FooterLink>
            </nav>
          </div>

                  </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-body text-sm text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} Log. All rights reserved.
            <Link href="/admin/login" className="ml-2 opacity-30 hover:opacity-100 transition-opacity">·</Link>
          </p>
          <p className="text-body text-xs text-[var(--text-muted)]">
            Next.js & Supabase로 제작
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children
}: {
  href: string;
  label: string;
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all duration-300"
      aria-label={label}
    >
      {children}
    </a>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-body text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200"
    >
      {children}
    </Link>
  );
}
