"use client";

import { deleteArticle } from "@/lib/actions";
import { useTransition } from "react";

export default function DeleteArticleButton({ slug }: { slug: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className="text-sm text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"
      disabled={isPending}
      onClick={() => {
        if (confirm("Are you sure you want to delete this article?")) {
          startTransition(async () => {
            await deleteArticle(slug);
          });
        }
      }}
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
