import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ArticleForm from "@/components/admin/ArticleForm";

interface EditArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { slug } = await params;
  
  const article = await prisma.article.findUnique({
    where: { slug },
  });

  if (!article) {
    notFound();
  }

  const initialData = {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    coverImage: article.coverImage || undefined,
    published: article.published,
    readTime: article.readTime,
    tags: JSON.parse(article.tags || "[]"),
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Edit Article
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Editing: {article.title}
        </p>
      </div>

      <ArticleForm initialData={initialData} isEditing />
    </div>
  );
}
