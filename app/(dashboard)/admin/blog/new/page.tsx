import { redirect } from "next/navigation";
import Link from "next/link";
import { getBlogAdmin } from "@/lib/blog-admin";
import { getPublishedBlogPosts } from "@/lib/blog-posts";
import { BlogEditor } from "@/components/admin/blog-editor";
export const dynamic = "force-dynamic";
export const metadata = {
  keywords: ["AI virtual try-on"],
  description: "Create a VFitly article about AI virtual try-on. Add a title, summary, cover image, and practical guidance for outfit image and video workflows.", title: "New article", robots: { index: false, follow: false } };
export default async function NewBlogPage() {
  if (!await getBlogAdmin()) redirect("/login");
  const posts = await getPublishedBlogPosts();
  return <section className="mx-auto max-w-5xl px-4 py-10"><Link href="/admin/blog">Back to articles</Link><h1 className="my-8 text-3xl font-semibold">New article</h1><BlogEditor links={posts.map(post => ({ title: post.title, url: post.url }))} /></section>;
}
