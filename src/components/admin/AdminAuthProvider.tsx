"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

interface AdminAuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}

interface AdminAuthProviderProps {
  children: ReactNode;
}

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);

      if (!user && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router, pathname]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Allow access to login page without auth
  if (!user && pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return null;
  }

  return (
    <AdminAuthContext.Provider value={{ user, loading, signOut }}>
      {/* Admin Top Bar */}
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border)] mb-8">
        <div className="zen-container">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-body text-sm text-[var(--text-muted)]">
                관리자 모드
              </span>
              <span className="text-body text-xs text-[var(--text-muted)] px-2 py-0.5 bg-[var(--bg-primary)] rounded border border-[var(--border)]">
                {user.email}
              </span>
            </div>
            <button
              onClick={signOut}
              className="text-body text-sm text-[var(--text-muted)] hover:text-red-500 transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[var(--bg-primary)]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              로그아웃
            </button>
          </div>
        </div>
      </div>
      {children}
    </AdminAuthContext.Provider>
  );
}
