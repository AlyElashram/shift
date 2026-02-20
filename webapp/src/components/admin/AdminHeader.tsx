"use client";

import { signOut } from "next-auth/react";
import type { UserRole } from "@prisma/client";

interface AdminHeaderProps {
  user: {
    name: string;
    email: string;
    role: UserRole;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-[var(--shift-black-muted)] border-b border-[var(--shift-gray)]/20 px-6 flex items-center justify-between">
      <p className="text-sm text-[var(--shift-gray-light)]">
        Welcome back, <span className="text-[var(--shift-cream)] font-medium">{user.name}</span>
      </p>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-[var(--shift-cream)] text-sm font-medium">
            {user.name}
          </p>
          <p className="text-[var(--shift-gray)] text-xs">
            {user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
          </p>
        </div>

        <div className="w-10 h-10 rounded-full bg-[var(--shift-yellow)] flex items-center justify-center">
          <span className="text-[var(--shift-black)] font-bold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="p-2 text-[var(--shift-gray-light)] hover:text-[var(--shift-cream)] transition-colors"
          title="Sign out"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
}
