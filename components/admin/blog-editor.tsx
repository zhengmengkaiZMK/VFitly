"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Markdown } from "tiptap-markdown";
import { BlogMarkdown } from "@/components/blog-markdown";
import { saveBlogPost, deleteBlogPost } from "@/app/actions/blog";

export type BlogEditorPost = { id: string; title: string; slug: string; description: string; category: string; tags: string[]; image: string; content: string; status: string; updatedAt: string };
export function BlogEditor({ post, links }: { post?: BlogEditorPost; links: { title: string; url: string }[] }) {
  const [content, setContent] = useState(post?.content || "");
  const [image, setImage] = useState(post?.image || "");
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  const editor = useEditor({ immediatelyRender: false, extensions: [StarterKit, Link.configure({ openOnClick: false }), Image, Markdown.configure({ html: false })], content: post?.content || "", onUpdate: ({ editor }) => { setContent(editor.storage.markdown.getMarkdown()); setDirty(true); }, editorProps: { attributes: { class: "prose dark:prose-invert max-w-none min-h-[360px] p-6 focus:outline-none" } } });
  useEffect(() => { const warn = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ""; } }; window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn); }, [dirty]);
  async function upload(file: File | undefined, cover: boolean) {
    if (!file) return; setBusy(true); setError("");
    try { const data = new FormData(); data.set("file", file); const response = await fetch("/api/admin/blog/images", { method: "POST", body: data }); const result = await response.json(); if (!response.ok) throw new Error(result.error); if (cover) setImage(result.url); else editor?.chain().focus().setImage({ src: result.url, alt: file.name }).run(); setDirty(true); }
    catch (error) { setError(error instanceof Error ? error.message : "Upload failed"); } finally { setBusy(false); }
  }
  const button = "rounded-lg border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50";
  const input = "mt-2 w-full rounded-lg border bg-background p-3";
  async function submit(data: FormData, status: "DRAFT" | "PUBLISHED") {
    data.set("status", status);
    setBusy(true); setError(""); setDirty(false);
    const result = await saveBlogPost(data);
    if (result?.error) { setError(result.error); setBusy(false); setDirty(true); }
  }
  return <form onChange={() => setDirty(true)} action={(data) => submit(data, "DRAFT")} className="space-y-6">
    <input type="hidden" name="id" value={post?.id || ""} /><input type="hidden" name="updatedAt" value={post?.updatedAt || ""} /><input type="hidden" name="content" value={content} /><input type="hidden" name="status" value={post?.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT"} />
    <fieldset disabled={busy} className="space-y-6 disabled:opacity-60">
      <div className="grid gap-5 md:grid-cols-2">{([ ["title", "Title", post?.title], ["slug", "URL slug", post?.slug], ["category", "Category", post?.category], ["tags", "Tags (comma separated)", post?.tags.join(", ")] ] as const).map(([name,label,value]) => <label key={name} className="block text-sm font-medium">{label}<input className={input} name={name} defaultValue={value || ""} required={name === "title" || name === "slug"} readOnly={name === "slug" && !!post} maxLength={name === "title" ? 200 : 180} /></label>)}</div>
      <label className="block text-sm font-medium">Description<textarea name="description" defaultValue={post?.description || ""} className={input} rows={3} maxLength={1000} /></label>
      <label className="block text-sm font-medium">Cover image URL<input name="image" value={image} onChange={e => setImage(e.target.value)} className={input} placeholder="/uploads/... or https://..." /></label>
      <label className="block text-sm">Upload cover (JPG, PNG, WebP; max 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 block" onChange={e => { void upload(e.target.files?.[0], true); e.target.value = ""; }} /></label>
      <div className="overflow-hidden rounded-xl border">
        <div className="flex flex-wrap gap-2 border-b bg-muted/30 p-3">
          {([ ["H2", () => editor?.chain().focus().toggleHeading({ level: 2 }).run()], ["H3", () => editor?.chain().focus().toggleHeading({ level: 3 }).run()], ["Bold", () => editor?.chain().focus().toggleBold().run()], ["Italic", () => editor?.chain().focus().toggleItalic().run()], ["Strike", () => editor?.chain().focus().toggleStrike().run()], ["Bullets", () => editor?.chain().focus().toggleBulletList().run()], ["Numbered", () => editor?.chain().focus().toggleOrderedList().run()], ["Quote", () => editor?.chain().focus().toggleBlockquote().run()], ["Code", () => editor?.chain().focus().toggleCodeBlock().run()], ["Divider", () => editor?.chain().focus().setHorizontalRule().run()], ["Undo", () => editor?.chain().focus().undo().run()], ["Redo", () => editor?.chain().focus().redo().run()] ] as const).map(([label, action]) => <button type="button" key={label} className={button} disabled={!editor || preview} onClick={action}>{label}</button>)}
          <button type="button" className={button} onClick={() => { const href = window.prompt("Link URL (https://... or /path)"); if (href && /^(https?:\/\/|\/(?!\/))/.test(href)) editor?.chain().focus().setLink({ href }).run(); }}>Link</button>
          <button type="button" className={button} onClick={() => editor?.chain().focus().unsetLink().run()}>Remove link</button>
          <select aria-label="Insert internal link" className={button} defaultValue="" onChange={e => { const link = links.find(link => link.url === e.target.value); if (link) editor?.chain().focus().insertContent({ type: "text", text: link.title, marks: [{ type: "link", attrs: { href: link.url } }] }).run(); e.target.value = ""; }}><option value="">Insert internal link</option>{links.map(link => <option key={link.url} value={link.url}>{link.title}</option>)}</select>
          <button type="button" className={button} onClick={() => setPreview(!preview)}>{preview ? "Edit" : "Preview"}</button>
        </div>
        {preview ? <article className="prose dark:prose-invert max-w-none p-6"><BlogMarkdown content={content} /></article> : <EditorContent editor={editor} />}
      </div>
      <label className="block text-sm">Insert body image<input type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 block" onChange={e => { void upload(e.target.files?.[0], false); e.target.value = ""; }} /></label>
      <p className="text-xs text-muted-foreground">Images use public URLs, including images uploaded to drafts. Existing article URLs cannot be changed.</p>
      <div className="flex flex-wrap gap-3"><button name="status" value="DRAFT" className={button}>Save draft</button><button formAction={(data) => submit(data, "PUBLISHED")} className="rounded-lg bg-primary px-5 py-2 text-primary-foreground">{post?.status === "PUBLISHED" ? "Update published article" : "Publish article"}</button>{post && <button type="button" className={button} onClick={async () => { if (!window.confirm("Permanently delete this article? Uploaded images will be retained.")) return; setBusy(true); const form = new FormData(); form.set("id", post.id); const result = await deleteBlogPost(form); if (result?.error) { setError(result.error); setBusy(false); } }}>Delete</button>}</div>
    </fieldset>
    {busy && <p role="status">Saving or uploading…</p>}{error && <p role="alert" className="text-red-600">{error}</p>}
  </form>;
}
