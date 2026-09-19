"use server";

import fs from "fs";
import path from "path";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getBlogAdmin } from "@/lib/blog-admin";
import { blogSlugFromTitle, isPlaceholderBlogSlug, normalizeBlogSlug } from "@/lib/blog-slug";
import { prisma } from "@/lib/db/prisma";

const schema = z.object({
  id: z.union([z.literal(""), z.string().uuid()]),
  slug: z.string().max(2048).default(""),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(1000).default(""),
  category: z.string().trim().max(100).transform(value => value || "Uncategorized").default("Uncategorized"),
  content: z.string().trim().min(1, "Please enter the article body").max(300000),
  image: z.string().max(2048).refine(value => /^\/(?!\/)[^\s\\]*$/.test(value) || /^https:\/\/[^\s\\]+$/.test(value), "Use a site-relative or HTTPS image URL"),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  tags: z.array(z.string().max(60)).max(20),
});
function refresh(...slugs: (string | undefined)[]) {
  revalidatePath("/admin/blog"); revalidatePath("/blog"); revalidatePath("/sitemap.xml");
  for (const slug of new Set(slugs.filter((slug): slug is string => Boolean(slug)))) revalidatePath(`/blog/${slug}`);
}
function errorMessage(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return "This URL slug is already in use.";
  console.error("Blog operation failed", error);
  return "Unable to save changes. Please retry.";
}
/** slug 是否已被文件文章或其他数据库文章占用。 */
async function slugTakenByOthers(slug: string, excludeId: string) {
  if (fs.existsSync(path.join(process.cwd(), "content/blog", `${slug}.mdx`)) || fs.existsSync(path.join(process.cwd(), "app/(marketing)/blog", slug))) return true;
  const existing = await prisma.blogPost.findFirst({ where: excludeId ? { slug, NOT: { id: excludeId } } : { slug }, select: { id: true } });
  return Boolean(existing);
}
/** 标题自动生成的地址重复时，加数字后缀而不是报错。 */
async function uniqueSlug(base: string, excludeId: string) {
  for (let index = 1; index < 40; index += 1) {
    const candidate = index === 1 ? base : `${base.slice(0, 172).replace(/-+$/, "")}-${index}`;
    if (!await slugTakenByOthers(candidate, excludeId)) return candidate;
  }
  return `${base.slice(0, 150).replace(/-+$/, "")}-${Date.now()}`;
}
export async function saveBlogPost(form: FormData, intent?: "DRAFT" | "PUBLISHED"): Promise<{ error: string } | undefined> {
  const admin = await getBlogAdmin();
  if (!admin) return { error: "Administrator access required." };
  const parsed = schema.safeParse({ ...Object.fromEntries(form), status: intent ?? (form.get("status") || undefined), category: String(form.get("category") || "").trim() || "Uncategorized", image: String(form.get("image") || "").trim() || "/placeholder.jpg", tags: String(form.get("tags") || "").split(",").map(tag => tag.trim()).filter(Boolean) });
  if (!parsed.success) return { error: parsed.error.issues.map(issue => `${issue.path.join(".")}: ${issue.message}`).join("; ") };
  const { id, slug: requestedSlug, status, ...fields } = parsed.data;
  const normalizedSlug = normalizeBlogSlug(requestedSlug);
  // 留空或填了 none 之类的占位内容时，直接用标题生成链接。
  const autoSlug = form.get("slugAuto") === "1" || isPlaceholderBlogSlug(normalizedSlug);
  const baseSlug = autoSlug ? blogSlugFromTitle(fields.title) : normalizedSlug;
  if (!baseSlug) return { error: "Enter a URL slug using letters (including Chinese), numbers, spaces or hyphens." };
  try {
    const old = id ? await prisma.blogPost.findUnique({ where: { id } }) : null;
    if (id && !old) return { error: "Article not found." };
    let slug = old?.slug === baseSlug ? baseSlug : "";
    if (!slug) {
      if (autoSlug) slug = await uniqueSlug(baseSlug, old?.id || "");
      else if (await slugTakenByOthers(baseSlug, old?.id || "")) return { error: "This URL slug is already in use. Choose a different one." };
      else slug = baseSlug;
    }
    const write = { ...fields, slug, status, updatedById: admin.id, publishedAt: old?.publishedAt || (status === "PUBLISHED" ? new Date() : null) };
    if (old) {
      const version = String(form.get("updatedAt") || "");
      if (version !== old.updatedAt.toISOString()) return { error: "This article changed in another session. Reload before editing." };
      const result = await prisma.blogPost.updateMany({ where: { id, updatedAt: old.updatedAt }, data: write });
      if (!result.count) return { error: "This article changed in another session. Reload before editing." };
    } else await prisma.blogPost.create({ data: { ...write, authorName: admin.name || "VFitly Team", createdById: admin.id } });
    refresh(slug, old?.slug);
  } catch (error) { return { error: errorMessage(error) }; }
  redirect("/admin/blog");
}
export async function changeBlogStatus(form: FormData): Promise<void> {
  if (!await getBlogAdmin()) redirect("/dashboard");
  const id = z.string().uuid().parse(form.get("id"));
  const status = z.enum(["DRAFT", "PUBLISHED", "OFFLINE"]).parse(form.get("status"));
  const post = await prisma.blogPost.update({ where: { id }, data: { status, publishedAt: status === "PUBLISHED" ? new Date() : undefined } });
  refresh(post.slug);
}
export async function deleteBlogPost(form: FormData): Promise<{ error: string } | undefined> {
  if (!await getBlogAdmin()) return { error: "Administrator access required." };
  const id = z.string().uuid().safeParse(form.get("id"));
  if (!id.success) return { error: "Invalid article ID." };
  try { const post = await prisma.blogPost.delete({ where: { id: id.data } }); refresh(post.slug); }
  catch (error) { return { error: errorMessage(error) }; }
  redirect("/admin/blog");
}
