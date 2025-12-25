"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminMobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/articles", label: "Articles" },
    { href: "/admin/articles/new", label: "New Article" },
    { href: "/admin/users", label: "Users" },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="lg:hidden">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-black dark:text-white">
          Admin Panel
        </h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="p-4 border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-4 border-t border-gray-300 dark:border-gray-700 mt-4">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-md text-sm font-medium text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                ← Back to Site
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
