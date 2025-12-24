"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [year, setYear] = useState(2025);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-base font-semibold text-black dark:text-white">
              ClearMargin
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              ClearMargin is a simple blog focused on clear thinking, honest writing, and practical insight across leadership, work, and personal development.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-black dark:text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog/transformational-leadership" className="hover:text-black dark:hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-black dark:hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-300 dark:border-gray-700 pt-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {year} ClearMargin. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
