import { cache } from "react";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { calculateReadTime, getAllBlogPosts, type BlogPost } from "@/lib/blog-utils";

export type PublicBlogPost = BlogPost & { content?: string; updatedAt?: string };

export const getPublishedBlogPosts = cache(async (): Promise<PublicBlogPost[]> => {
  const legacy = getAllBlogPosts();
  try {
    const posts = await prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" } });
    const mapped: PublicBlogPost[] = posts.map(post => ({
      slug: post.slug, title: post.title, description: post.description, category: post.category,
      date: (post.publishedAt || post.createdAt).toISOString(), updatedAt: post.updatedAt.toISOString(),
      author: { name: post.authorName, avatar: "/avatar.jpeg" }, image: post.image,
      content: post.content, readTime: calculateReadTime(post.content), tags: post.tags, url: `/blog/${post.slug}`,
    }));
    return [...mapped, ...legacy.filter(post => !mapped.some(item => item.slug === post.slug))].sort((a,b) => Date.parse(b.date) - Date.parse(a.date));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") return legacy;
    throw error;
  }
});
