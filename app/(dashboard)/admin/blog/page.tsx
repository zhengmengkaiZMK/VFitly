import { redirect } from "next/navigation";
import Link from "next/link";
import { getBlogAdmin } from "@/lib/blog-admin";
import { prisma } from "@/lib/db/prisma";
import { changeBlogStatus } from "@/app/actions/blog";

export const dynamic = "force-dynamic";
export const metadata = {
  keywords: ["AI virtual try-on"],
  description: "Manage VFitly articles about AI virtual try-on. Review drafts and published guides, edit content and cover images, and maintain the blog.", title: "Blog management", robots: { index: false, follow: false } };
export default async function AdminBlogPage() {
  if (!await getBlogAdmin()) redirect("/login");
  const posts = await prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" }, select: { id: true, title: true, slug: true, category: true, status: true, authorName: true, updatedAt: true } });
  return <section className="mx-auto max-w-6xl px-4 py-10">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-sm uppercase tracking-widest text-blue-500">Admin</p><h1 className="mt-3 text-3xl font-semibold">Blog management</h1><p className="mt-2 text-sm text-muted-foreground">Manage new articles here. Existing MDX articles remain unchanged.</p></div>
      <Link href="/admin/blog/new" className="rounded-full bg-primary px-5 py-3 text-primary-foreground">New article</Link>
    </div>
    <div className="space-y-3">{!posts.length && <div className="rounded-2xl border border-dashed p-10 text-center">No database articles yet.</div>}
      {posts.map(post => <article key={post.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-5">
        <div><h2 className="font-semibold">{post.title}</h2><p className="mt-1 text-sm text-muted-foreground">/blog/{post.slug} · {post.category} · {post.status}</p><p className="text-xs text-muted-foreground">{post.authorName} · Updated {post.updatedAt.toISOString().slice(0,10)}</p></div>
        <div className="flex gap-2"><Link href={`/admin/blog/${post.id}/edit`} className="rounded-lg border px-3 py-2 text-sm">Edit / Preview / Delete</Link>
          {post.status === "PUBLISHED" && <><Link target="_blank" href={`/blog/${post.slug}`} className="rounded-lg border px-3 py-2 text-sm">View article</Link><form action={changeBlogStatus}><input type="hidden" name="id" value={post.id}/><button name="status" value="OFFLINE" className="rounded-lg border px-3 py-2 text-sm">Take offline</button></form></>}
        </div>
      </article>)}
    </div>
  </section>;
}
