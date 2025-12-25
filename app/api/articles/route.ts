import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Article } from "@/types";

// Force dynamic to prevent caching issues
export const dynamic = "force-dynamic";

// GET - List all articles (public: published only, admin: all)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const includeUnpublished = searchParams.get("all") === "true";
    
    // Only admins can see unpublished articles - check role from session
    const isAdmin = session?.user?.role === "admin" || session?.user?.role === "superadmin";
    
    const articles = await prisma.article.findMany({
      where: includeUnpublished && isAdmin ? {} : { published: true },
      include: {
        author: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Parse tags from JSON string
    const articlesWithParsedTags = articles.map((article: Article) => ({
      ...article,
      tags: JSON.parse(article.tags || "[]"),
    }));

    return NextResponse.json(articlesWithParsedTags);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

// POST - Create new article (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check role from session instead of extra DB call
    const isAdmin = session?.user?.role === "admin" || session?.user?.role === "superadmin";
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, published, readTime, tags } = body;

    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json(
        { error: "Title, slug, excerpt, and content are required" },
        { status: 400 }
      );
    }

    // Get user and check slug in parallel to reduce latency
    const [existingArticle, adminUser] = await Promise.all([
      prisma.article.findUnique({ where: { slug } }),
      prisma.user.findUnique({ where: { email: session.user.email } }),
    ]);

    if (existingArticle) {
      return NextResponse.json(
        { error: "An article with this slug already exists" },
        { status: 400 }
      );
    }

    if (!adminUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage: coverImage || null,
        published: published ?? false,
        readTime: readTime || "5 min read",
        tags: JSON.stringify(tags || []),
        authorId: adminUser.id,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    return NextResponse.json({
      ...article,
      tags: JSON.parse(article.tags),
    });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}
