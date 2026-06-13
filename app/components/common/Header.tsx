"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navLink = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`font-medium transition-colors ${
          active
            ? "text-zinc-900 dark:text-zinc-50"
            : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          CSV Metadata Dashboard
        </h1>
        <nav className="flex items-center gap-6 text-sm">
          {navLink("/", "Overview")}
          {navLink("/compare", "Compare")}
        </nav>
      </div>
    </header>
  );
}
