import ArticleForm from "@/components/admin/ArticleForm";

export default function NewArticlePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          New Article
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Create a new blog article
        </p>
      </div>

      <ArticleForm />
    </div>
  );
}
