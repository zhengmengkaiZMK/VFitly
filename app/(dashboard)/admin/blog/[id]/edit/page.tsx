import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { getBlogAdmin } from "@/lib/blog-admin";
import { getPublishedBlogPosts } from "@/lib/blog-posts";
import { prisma } from "@/lib/db/prisma";
import { BlogEditor } from "@/components/admin/blog-editor";
export const dynamic = "force-dynamic";
export const metadata = { title: "Edit article", robots: { index: false, follow: false } };
export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  if (!await getBlogAdmin()) redirect("/login");
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();
  const posts = await getPublishedBlogPosts();
  const editorPost = { id: post.id, title: post.title, slug: post.slug, description: post.description, category: post.category, tags: post.tags, image: post.image, content: post.content, status: post.status, updatedAt: post.updatedAt.toISOString() };
  return <section className="mx-auto max-w-5xl px-4 py-10"><Link href="/admin/blog">Back to articles</Link><h1 className="my-8 text-3xl font-semibold">Edit article</h1><BlogEditor post={editorPost} links={posts.filter(item => item.slug !== post.slug).map(item => ({ title: item.title, url: item.url }))} /></section>;
}
