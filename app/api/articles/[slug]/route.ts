import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Force dynamic to prevent caching issues
export const dynamic = "force-dynamic";

// GET - Get single article by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...article,
      tags: JSON.parse(article.tags || "[]"),
    });
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

// PUT - Update article (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    const { slug } = await params;

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check role from session instead of extra DB call
    const isAdmin = session?.user?.role === "admin" || session?.user?.role === "superadmin";
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, newSlug, excerpt, content, coverImage, published, readTime, tags } = body;

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    });

    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // If changing slug, check for conflicts
    if (newSlug && newSlug !== slug) {
      const slugConflict = await prisma.article.findUnique({
        where: { slug: newSlug },
      });
      if (slugConflict) {
        return NextResponse.json(
          { error: "An article with this slug already exists" },
          { status: 400 }
        );
      }
    }

    const updatedArticle = await prisma.article.update({
      where: { slug },
      data: {
        title: title ?? existingArticle.title,
        slug: newSlug ?? existingArticle.slug,
        excerpt: excerpt ?? existingArticle.excerpt,
        content: content ?? existingArticle.content,
        coverImage: coverImage !== undefined ? coverImage : existingArticle.coverImage,
        published: published !== undefined ? published : existingArticle.published,
        readTime: readTime ?? existingArticle.readTime,
        tags: tags ? JSON.stringify(tags) : existingArticle.tags,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    return NextResponse.json({
      ...updatedArticle,
      tags: JSON.parse(updatedArticle.tags),
    });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

// DELETE - Delete article (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    const { slug } = await params;

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check role from session instead of extra DB call
    const isAdmin = session?.user?.role === "admin" || session?.user?.role === "superadmin";
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete directly - if article doesn't exist, Prisma will throw
    await prisma.article.delete({
      where: { slug },
    });

    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}

