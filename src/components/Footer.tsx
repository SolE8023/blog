import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto">
      {/* 상단 디바이더 */}
      <div className="zen-container">
        <div className="h-px bg-[var(--border)]" />
      </div>

      <div className="zen-container py-16">
        <div className="flex flex-col items-center text-center">
          {/* 원상 심볼 */}
          <div className="ensou-small mb-8" />

          {/* 로고 */}
          <Link href="/" className="mb-6">
            <span className="text-display text-2xl font-bold tracking-wider">
              適
            </span>
          </Link>

          {/* 설명 */}
          <p className="text-body text-sm text-[var(--text-muted)] max-w-xs leading-relaxed mb-8">
            고요히 기록하는 공간
          </p>

          {/* 네비게이션 */}
          <nav className="flex items-center gap-8 mb-12">
            <FooterLink href="/">홈</FooterLink>
            <span className="text-[var(--text-muted)] opacity-30">·</span>
            <FooterLink href="/categories">주제</FooterLink>
            <span className="text-[var(--text-muted)] opacity-30">·</span>
            <FooterLink href="/tags">태그</FooterLink>
          </nav>

          {/* 소셜 링크 */}
          <div className="flex items-center gap-6 mb-12">
            <SocialLink href="https://github.com/SolE8023" label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </SocialLink>
            <SocialLink href="mailto:khs671998@gmail.com" label="Email">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </SocialLink>
          </div>

          {/* 카피라이트 */}
          <p className="text-ui text-xs text-[var(--text-muted)] opacity-60">
            &copy; {new Date().getFullYear()}
            <Link href="/admin/login" className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
              ·
            </Link>
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
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-300"
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
      className="text-body text-sm tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-300"
    >
      {children}
    </Link>
  );
}
