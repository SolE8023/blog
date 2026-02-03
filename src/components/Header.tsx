"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBar } from "./SearchBar";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--bg-primary)]/90 backdrop-blur-sm">
      <div className="zen-container">
        <div className="flex h-20 items-center justify-between">
          {/* Logo - 미니멀 */}
          <Link href="/" className="group">
            <span className="text-display text-xl font-bold tracking-wider">
              適
            </span>
          </Link>

          {/* Desktop Navigation - 넓은 간격 */}
          <nav className="hidden md:flex items-center gap-12">
            <NavLink href="/">홈</NavLink>
            <NavLink href="/categories">주제</NavLink>
            <NavLink href="/tags">태그</NavLink>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-6">
            <SearchBar />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 flex items-center justify-center"
              aria-label="메뉴"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span
                  className={`block h-px bg-[var(--text-primary)] transition-all duration-300 origin-center ${
                    isMenuOpen ? "rotate-45 translate-y-[7.5px]" : ""
                  }`}
                />
                <span
                  className={`block h-px bg-[var(--text-primary)] transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-px bg-[var(--text-primary)] transition-all duration-300 origin-center ${
                    isMenuOpen ? "-rotate-45 -translate-y-[7.5px]" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="py-8 border-t border-[var(--border)]">
            <div className="flex flex-col items-center gap-6">
              <MobileNavLink href="/" onClick={() => setIsMenuOpen(false)}>
                홈
              </MobileNavLink>
              <MobileNavLink href="/categories" onClick={() => setIsMenuOpen(false)}>
                주제
              </MobileNavLink>
              <MobileNavLink href="/tags" onClick={() => setIsMenuOpen(false)}>
                태그
              </MobileNavLink>
              <div className="mt-4 pt-6 border-t border-[var(--border)] w-full flex justify-center">
                <SearchBar />
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* 하단 라인 */}
      <div className="h-px bg-[var(--border)]" />
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-body text-sm tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-300"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  onClick,
  children
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-body text-lg tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
    >
      {children}
    </Link>
  );
}
