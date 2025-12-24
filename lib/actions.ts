"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteArticle(slug: string) {
  await prisma.article.delete({
    where: { slug },
  });
  revalidatePath("/admin/articles");
}
