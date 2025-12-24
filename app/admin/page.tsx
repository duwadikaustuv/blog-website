import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface RecentUser {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
}

interface RecentArticle {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: Date;
}

export default async function AdminDashboard() {
  const [totalUsers, totalArticles, publishedArticles, draftArticles] = await Promise.all([
    prisma.user.count(),
    prisma.article.count(),
    prisma.article.count({ where: { published: true } }),
    prisma.article.count({ where: { published: false } }),
  ]);

  const recentUsers: RecentUser[] = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const recentArticles: RecentArticle[] = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Overview of your blog platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-6 bg-white dark:bg-black">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Total Users
          </h3>
          <p className="text-3xl font-bold text-black dark:text-white mt-2">
            {totalUsers}
          </p>
        </div>

        <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-6 bg-white dark:bg-black">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Total Articles
          </h3>
          <p className="text-3xl font-bold text-black dark:text-white mt-2">
            {totalArticles}
          </p>
        </div>

        <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-6 bg-white dark:bg-black">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Published
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
            {publishedArticles}
          </p>
        </div>

        <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-6 bg-white dark:bg-black">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Drafts
          </h3>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
            {draftArticles}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-black dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="flex gap-4">
          <Link
            href="/admin/articles/new"
            className="rounded-md px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            + New Article
          </Link>
          <Link
            href="/admin/articles"
            className="rounded-md px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Manage Articles
          </Link>
          <Link
            href="/admin/users"
            className="rounded-md px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            View Users
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-black dark:text-white mb-4">
            Recent Users
          </h2>
          {recentUsers.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No users yet
            </p>
          ) : (
            <ul className="space-y-3">
              {recentUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800 last:border-0"
                >
                  <div>
                    <p className="font-medium text-black dark:text-white">
                      {user.name || "No name"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/admin/users"
            className="block mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            View all users →
          </Link>
        </div>

        {/* Recent Articles */}
        <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-black dark:text-white mb-4">
            Recent Articles
          </h2>
          {recentArticles.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No articles yet
            </p>
          ) : (
            <ul className="space-y-3">
              {recentArticles.map((article) => (
                <li
                  key={article.id}
                  className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800 last:border-0"
                >
                  <div>
                    <p className="font-medium text-black dark:text-white">
                      {article.title}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        article.published
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {article.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <Link
                    href={`/admin/articles/${article.slug}/edit`}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Edit
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/admin/articles"
            className="block mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            View all articles →
          </Link>
        </div>
      </div>
    </div>
  );
}
