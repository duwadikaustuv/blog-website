import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { checkIsAdmin } from "@/lib/authHelpers";
import Link from "next/link";
import AdminMobileNav from "@/components/admin/AdminMobileNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const isAdmin = await checkIsAdmin(session.user.email);
  if (!isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Mobile Navigation */}
      <AdminMobileNav />

      <div className="flex">
        {/* Sidebar - Hidden on mobile, visible on lg and up */}
        <aside className="hidden lg:block w-64 min-h-[calc(100vh-73px)] border-r border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <nav className="p-6">
            <h2 className="text-lg font-semibold text-black dark:text-white mb-6">
              Admin Panel
            </h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/admin"
                  className="block px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/articles"
                  className="block px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                >
                  Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/articles/new"
                  className="block px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                >
                  New Article
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/users"
                  className="block px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                >
                  Users
                </Link>
              </li>
              <li className="pt-4 border-t border-gray-300 dark:border-gray-700 mt-4">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  ← Back to Site
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
