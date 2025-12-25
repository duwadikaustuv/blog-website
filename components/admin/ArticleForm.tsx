"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "./RichTextEditor";
import { toast } from "react-toastify";

interface ArticleFormProps {
  initialData?: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    published: boolean;
    readTime: string;
    tags: string[];
  };
  isEditing?: boolean;
}

export default function ArticleForm({ initialData, isEditing }: ArticleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    coverImage: initialData?.coverImage || "",
    published: initialData?.published || false,
    readTime: initialData?.readTime || "5 min read",
    tags: initialData?.tags?.join(", ") || "",
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: isEditing ? formData.slug : generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const payload = {
        title: formData.title,
        slug: formData.slug,
        newSlug: isEditing ? formData.slug : undefined,
        excerpt: formData.excerpt,
        content: formData.content,
        coverImage: formData.coverImage || null,
        published: formData.published,
        readTime: formData.readTime,
        tags: tagsArray,
      };

      const url = isEditing
        ? `/api/articles/${initialData?.slug}`
        : "/api/articles";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to save article");
        setLoading(false);
        return;
      }

      toast.success(isEditing ? "Article updated!" : "Article created!");
      router.push("/admin/articles");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-black dark:text-white mb-2"
            >
              Title *
            </label>
            <input
              id="title"
              type="text"
              required
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
              placeholder="Enter article title"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-black dark:text-white mb-2"
            >
              Slug *
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 dark:text-gray-400 text-sm mr-2">
                /blog/
              </span>
              <input
                id="slug"
                type="text"
                required
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                placeholder="article-url-slug"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-black dark:text-white mb-2"
            >
              Excerpt *
            </label>
            <textarea
              id="excerpt"
              required
              rows={3}
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white resize-none"
              placeholder="Brief description of the article"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-black dark:text-white mb-2"
            >
              Content *
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-6">
            <h3 className="font-medium text-black dark:text-white mb-4">
              Publish Settings
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  id="published"
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData({ ...formData, published: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <label
                  htmlFor="published"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Published
                </label>
              </div>

              <div>
                <label
                  htmlFor="readTime"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Read Time
                </label>
                <input
                  id="readTime"
                  type="text"
                  value={formData.readTime}
                  onChange={(e) =>
                    setFormData({ ...formData, readTime: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                  placeholder="5 min read"
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-6">
            <h3 className="font-medium text-black dark:text-white mb-4">
              Metadata
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="coverImage"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Cover Image URL
                </label>
                <input
                  id="coverImage"
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) =>
                    setFormData({ ...formData, coverImage: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Tags (comma separated)
                </label>
                <input
                  id="tags"
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                  placeholder="Leadership, Technology, Business"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-md px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Article"
                : "Create Article"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
