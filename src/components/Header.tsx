"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBar } from "./SearchBar";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border)]">
      <div className="editorial-container">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex items-center">
              <span className="text-display text-2xl font-bold tracking-tight">
                Log
              </span>
              <span className="w-2 h-5 bg-[var(--accent)] ml-0.5 animate-pulse rounded-sm" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/">홈</NavLink>
            <NavLink href="/categories">카테고리</NavLink>
            <NavLink href="/tags">태그</NavLink>
            <div className="w-px h-6 bg-[var(--border)] mx-4" />
            <SearchBar />
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
              aria-label="메뉴 열기"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span
                  className={`block h-0.5 bg-[var(--text-primary)] transition-all duration-300 origin-center ${
                    isMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 bg-[var(--text-primary)] transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0 scale-0' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 bg-[var(--text-primary)] transition-all duration-300 origin-center ${
                    isMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="py-6 border-t border-[var(--border)]">
            <div className="flex flex-col gap-1">
              <MobileNavLink href="/" onClick={() => setIsMenuOpen(false)}>
                홈
              </MobileNavLink>
              <MobileNavLink href="/categories" onClick={() => setIsMenuOpen(false)}>
                카테고리
              </MobileNavLink>
              <MobileNavLink href="/tags" onClick={() => setIsMenuOpen(false)}>
                태그
              </MobileNavLink>
              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <SearchBar />
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative px-4 py-2 text-body text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
    >
      {children}
      <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[var(--accent)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
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
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 text-body font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-all group"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
      {children}
    </Link>
  );
}
