import prisma from "@/lib/prisma";
import Link from "next/link";
import DeleteArticleButton from "@/components/admin/DeleteArticleButton";

export const dynamic = "force-dynamic";

interface ArticleWithAuthor {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: Date;
  author: {
    name: string | null;
    email: string;
  };
}

export default async function AdminArticlesPage() {
  const articles: ArticleWithAuthor[] = await prisma.article.findMany({
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Articles
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all blog articles
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="rounded-md px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          + New Article
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12 border border-gray-300 dark:border-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No articles yet
          </p>
          <Link
            href="/admin/articles/new"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Create your first article →
          </Link>
        </div>
      ) : (
        <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {articles.map((article) => (
                <tr
                  key={article.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-black dark:text-white">
                        {article.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        /{article.slug}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {article.author.name || article.author.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                        article.published
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {article.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/blog/${article.slug}`}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                        target="_blank"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/articles/${article.slug}/edit`}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteArticleButton slug={article.slug} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
