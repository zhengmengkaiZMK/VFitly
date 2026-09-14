"use server";

import fs from "fs";
import path from "path";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getBlogAdmin } from "@/lib/blog-admin";
import { prisma } from "@/lib/db/prisma";

const schema = z.object({
  id: z.union([z.literal(""), z.string().uuid()]),
  slug: z.string().trim().min(1).max(2048).transform((value, ctx) => {
    try {
      if (/^https?:\/\//i.test(value)) {
        value = new URL(value).pathname.split("/").filter(Boolean).pop() || "";
      }
      return decodeURIComponent(value).normalize("NFKC").toLowerCase()
        .replace(/\s+/gu, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    } catch {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter a valid article slug or HTTP(S) URL" });
      return z.NEVER;
    }
  }).pipe(z.string().min(1).max(180).regex(/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u, "Use letters (including Chinese), numbers, spaces or hyphens; URLs must contain an article path")),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(1000),
  category: z.string().trim().min(1).max(100),
  content: z.string().trim().min(1).max(300000),
  image: z.string().max(2048).refine(value => /^\/(?!\/)[^\s\\]*$/.test(value) || /^https:\/\/[^\s\\]+$/.test(value), "Use a site-relative or HTTPS image URL"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  tags: z.array(z.string().max(60)).max(20),
});
function refresh(slug: string) {
  revalidatePath("/admin/blog"); revalidatePath("/blog"); revalidatePath(`/blog/${slug}`); revalidatePath("/sitemap.xml");
}
function errorMessage(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return "This URL slug is already in use.";
  console.error("Blog operation failed", error);
  return "Unable to save changes. Please retry.";
}
export async function saveBlogPost(form: FormData): Promise<{ error: string } | undefined> {
  const admin = await getBlogAdmin();
  if (!admin) return { error: "Administrator access required." };
  const parsed = schema.safeParse({ ...Object.fromEntries(form), category: form.get("category") || "Uncategorized", image: form.get("image") || "/placeholder.jpg", tags: String(form.get("tags") || "").split(",").map(tag => tag.trim()).filter(Boolean) });
  if (!parsed.success) return { error: parsed.error.issues.map(issue => `${issue.path.join(".")}: ${issue.message}`).join("; ") };
  const { id, ...data } = parsed.data;
  if (fs.existsSync(path.join(process.cwd(), "content/blog", `${data.slug}.mdx`)) || fs.existsSync(path.join(process.cwd(), "app/(marketing)/blog", data.slug))) return { error: "This URL belongs to an existing file-based article. Choose a different slug." };
  try {
    const old = id ? await prisma.blogPost.findUnique({ where: { id } }) : null;
    if (id && !old) return { error: "Article not found." };
    if (old && old.slug !== data.slug) return { error: "Existing article URLs cannot be changed." };
    const write = { ...data, updatedById: admin.id, publishedAt: old?.publishedAt || (data.status === "PUBLISHED" ? new Date() : null) };
    if (old) {
      const version = String(form.get("updatedAt") || "");
      if (version !== old.updatedAt.toISOString()) return { error: "This article changed in another session. Reload before editing." };
      const result = await prisma.blogPost.updateMany({ where: { id, updatedAt: old.updatedAt }, data: write });
      if (!result.count) return { error: "This article changed in another session. Reload before editing." };
    } else await prisma.blogPost.create({ data: { ...write, authorName: admin.name || "VFitly Team", createdById: admin.id } });
  } catch (error) { return { error: errorMessage(error) }; }
  refresh(data.slug);
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
