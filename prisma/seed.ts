import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  // Create superadmin user
  const superadminPassword = await bcrypt.hash("superadmin123", 12);
  
  const superadmin = await prisma.user.upsert({
    where: { email: "superadmin@example.com" },
    update: {},
    create: {
      email: "superadmin@example.com",
      name: "Super Admin",
      password: superadminPassword,
      role: "superadmin",
    },
  });

  console.log("Created superadmin user:", superadmin.email);

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: adminPassword,
      role: "admin",
    },
  });

  console.log("Created admin user:", admin.email);

  // Create a sample article
  const article = await prisma.article.upsert({
    where: { slug: "getting-started-with-our-blog" },
    update: {},
    create: {
      title: "Getting Started with Our Blog",
      slug: "getting-started-with-our-blog",
      excerpt: "Welcome to our blog platform! Learn how to create and manage your articles.",
      content: `
        <p>Welcome to our blog platform! This article will help you get started with creating and managing your content.</p>
        
        <h2>Creating Your First Article</h2>
        <p>To create a new article, navigate to the admin dashboard and click on "Articles" in the sidebar. Then click the "New Article" button to open the article editor.</p>
        
        <h2>Using the Editor</h2>
        <p>The article editor provides a simple interface for writing your content. You can:</p>
        <ul>
          <li>Add a title and excerpt for SEO</li>
          <li>Write content using HTML formatting</li>
          <li>Add tags to categorize your posts</li>
          <li>Set a cover image URL</li>
          <li>Save as draft or publish immediately</li>
        </ul>
        
        <h2>Managing Articles</h2>
        <p>From the articles list, you can edit or delete any article. You can also toggle the published status to control visibility on the public blog.</p>
        
        <p>Happy writing!</p>
      `,
      coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
      tags: JSON.stringify(["getting-started", "tutorial"]),
      published: true,
      readTime: "3 min read",
      authorId: admin.id,
    },
  });

  console.log("Created sample article:", article.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
