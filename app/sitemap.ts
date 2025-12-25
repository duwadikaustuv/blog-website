import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://clearmargin.vercel.app";

  // Get all published articles
  let articles: { slug: string; updatedAt: Date }[] = [];
  try {
    articles = await prisma.article.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
  } catch (error) {
    console.error("Failed to fetch articles for sitemap:", error);
  }

  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...articleUrls,
  ];
}
