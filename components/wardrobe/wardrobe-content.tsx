"use client";

import { FeedbackError, useFeedback } from "@/components/feedback-provider";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IconEdit, IconHanger, IconPlus, IconTrash } from "@tabler/icons-react";
import { buildLoginRedirectUrl } from "@/lib/auth/login-redirect";
import { wardrobeCategories } from "@/lib/wardrobe/constants";

type WardrobeItem = {
  id: string;
  name: string;
  category: string;
  color: string | null;
  secondaryColor: string | null;
  tags: string[];
  imageUrl: string;
  createdAt: string;
};

export function WardrobeContent() {
  const { requireLogin } = useFeedback();
  const loginUrl = buildLoginRedirectUrl("/dashboard/wardrobe");
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingItem, setEditingItem] = useState<WardrobeItem | null>(null);
  const [selectedImageName, setSelectedImageName] = useState("No image selected");

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    setError("");

    const response = await fetch("/api/wardrobe");
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        requireLogin(undefined, loginUrl);
        return;
      }
      setError(data.error || "衣橱加载失败");
    } else {
      setItems(data.items || []);
    }

    setLoading(false);
  }

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSaving(true);
    setError("");

    try {
      const formData = new FormData(form);
      const response = await fetch("/api/wardrobe", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          requireLogin(undefined, loginUrl);
          return;
        }
        setError(data.error || "衣物上传失败");
      } else {
        setItems((current) => [data.item, ...current]);
        form.reset();
        setSelectedImageName("No image selected");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "衣物上传失败");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const response = await fetch(`/api/wardrobe/${id}`, { method: "DELETE" });

    if (response.status === 401) {
      requireLogin(undefined, loginUrl);
      return;
    }

    if (response.ok) {
      setItems((current) => current.filter((item) => item.id !== id));
    }
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingItem) return;

    const formData = new FormData(event.currentTarget);
    const response = await fetch(`/api/wardrobe/${editingItem.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        category: formData.get("category"),
        color: formData.get("color"),
        secondaryColor: formData.get("secondaryColor"),
        tags: String(formData.get("tags") || "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }),
    });
    const data = await response.json();

    if (response.ok) {
      setItems((current) => current.map((item) => (item.id === data.item.id ? data.item : item)));
      setEditingItem(null);
    } else {
      if (response.status === 401) {
        requireLogin(undefined, loginUrl);
        return;
      }
      setError(data.error || "保存失败");
    }
  }

  const generatedLooks = useMemo(() => items.filter((item) => item.category === "Generated Looks"), [items]);
  const garmentItems = useMemo(() => items.filter((item) => item.category !== "Generated Looks"), [items]);
  const uploadCategories = useMemo(() => wardrobeCategories.filter((category) => category !== "Generated Looks"), []);

  const stats = useMemo(() => {
    const categories = new Set(garmentItems.map((item) => item.category));
    return [
      { label: "Garments", value: garmentItems.length },
      { label: "Saved looks", value: generatedLooks.length },
      { label: "Ready for try-on", value: garmentItems.length },
    ];
  }, [garmentItems, generatedLooks]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-500">Wardrobe Library</p>
          <h1 className="mt-3 text-3xl font-bold text-black dark:text-white">Manage your fashion assets</h1>
          <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
            Upload garment images, organize metadata and prepare reusable clothing assets for AI try-on generation.
          </p>
        </div>
        <a href="/dashboard/try-on" className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white dark:bg-white dark:text-black">
          Open try-on studio
        </a>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-sm text-neutral-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-black dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        <form onSubmit={handleUpload} className="h-fit rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
              <IconPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-black dark:text-white">Upload garment</h2>
              <p className="text-sm text-neutral-500">PNG, JPG, WEBP, max 12MB</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-neutral-200 p-3 text-sm dark:border-neutral-800 dark:bg-black">
              <span className="truncate text-neutral-500">{selectedImageName}</span>
              <span className="shrink-0 rounded-full bg-neutral-900 px-4 py-2 font-medium text-white dark:bg-white dark:text-black">
                Choose Image
              </span>
              <input
                required
                name="image"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => setSelectedImageName(event.target.files?.[0]?.name || "No image selected")}
              />
            </label>
            <input name="name" placeholder="Garment name" className="w-full rounded-2xl border border-neutral-200 bg-transparent p-3 text-sm dark:border-neutral-800" />
            <select name="category" className="w-full rounded-2xl border border-neutral-200 bg-transparent p-3 text-sm dark:border-neutral-800">
              {uploadCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <input name="color" placeholder="Primary color" className="w-full rounded-2xl border border-neutral-200 bg-transparent p-3 text-sm dark:border-neutral-800" />
            <input name="tags" placeholder="Tags, comma separated" className="w-full rounded-2xl border border-neutral-200 bg-transparent p-3 text-sm dark:border-neutral-800" />
            <FeedbackError message={error} />
            <button disabled={saving} className="w-full rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white disabled:opacity-50">
              {saving ? "Uploading..." : "Add to wardrobe"}
            </button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-black dark:text-white">Garment assets</h2>
                <p className="text-sm text-neutral-500">Reusable clothing images for AI try-on generation.</p>
              </div>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                {garmentItems.length} items
              </span>
            </div>

            {loading ? (
              <p className="text-neutral-500">Loading wardrobe...</p>
            ) : garmentItems.length === 0 ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 text-center dark:border-neutral-700">
                <IconHanger className="mb-4 h-12 w-12 text-neutral-400" />
                <h3 className="text-lg font-semibold text-black dark:text-white">No garments yet</h3>
                <p className="mt-2 max-w-sm text-sm text-neutral-500">Upload your first clothing image to build the library for virtual try-on.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {garmentItems.map((item) => (
                  <div key={item.id} className="overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-black">
                    <div className="relative aspect-square bg-white dark:bg-neutral-950">
                      <Image src={item.imageUrl}  fill className="object-contain p-4" sizes="(max-width: 768px) 100vw, 33vw" alt="VFitly，AI virtual try-on，generate try-on image and try-on video" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-black dark:text-white">{item.name}</h3>
                          <p className="text-sm text-neutral-500">{item.category}{item.color ? ` · ${item.color}` : ""}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingItem(item)} className="rounded-full border border-neutral-200 p-2 dark:border-neutral-700" aria-label="Edit garment">
                            <IconEdit className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="rounded-full border border-neutral-200 p-2 text-red-500 dark:border-neutral-700" aria-label="Delete garment">
                            <IconTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {item.tags?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-white px-2 py-1 text-xs text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-black dark:text-white">Saved try-on looks</h2>
                <p className="text-sm text-neutral-500">Final AI outfit results saved from your try-on studio.</p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                {generatedLooks.length} looks
              </span>
            </div>

            {loading ? (
              <p className="text-neutral-500">Loading saved looks...</p>
            ) : generatedLooks.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-neutral-300 p-8 text-center dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-black dark:text-white">No saved looks yet</h3>
                <p className="mt-2 text-sm text-neutral-500">Save your favorite generated try-on results and they will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {generatedLooks.map((item) => (
                  <div key={item.id} className="overflow-hidden rounded-3xl border border-blue-100 bg-blue-50/40 dark:border-blue-900/40 dark:bg-blue-950/10">
                    <div className="relative aspect-[2/3] bg-white dark:bg-neutral-950">
                      <Image src={item.imageUrl}  fill className="object-contain" sizes="(max-width: 768px) 100vw, 33vw" alt="VFitly，AI virtual try-on，generate try-on image and try-on video" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-black dark:text-white">{item.name}</h3>
                          <p className="text-sm text-neutral-500">AI try-on result</p>
                        </div>
                        <button onClick={() => handleDelete(item.id)} className="rounded-full border border-neutral-200 p-2 text-red-500 dark:border-neutral-700" aria-label="Delete saved look">
                          <IconTrash className="h-4 w-4" />
                        </button>
                      </div>
                      {item.tags?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-white px-2 py-1 text-xs text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleUpdate} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-neutral-900">
            <h2 className="text-xl font-semibold text-black dark:text-white">Edit garment</h2>
            <div className="mt-5 space-y-4">
              <input name="name" defaultValue={editingItem.name} className="w-full rounded-2xl border border-neutral-200 bg-transparent p-3 text-sm dark:border-neutral-800" />
              <select name="category" defaultValue={editingItem.category} className="w-full rounded-2xl border border-neutral-200 bg-transparent p-3 text-sm dark:border-neutral-800">
                {wardrobeCategories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
              <input name="color" defaultValue={editingItem.color || ""} className="w-full rounded-2xl border border-neutral-200 bg-transparent p-3 text-sm dark:border-neutral-800" />
              <input name="secondaryColor" defaultValue={editingItem.secondaryColor || ""} className="w-full rounded-2xl border border-neutral-200 bg-transparent p-3 text-sm dark:border-neutral-800" />
              <input name="tags" defaultValue={editingItem.tags?.join(", ") || ""} className="w-full rounded-2xl border border-neutral-200 bg-transparent p-3 text-sm dark:border-neutral-800" />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setEditingItem(null)} className="rounded-full border border-neutral-200 px-4 py-2 text-sm dark:border-neutral-700">Cancel</button>
                <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white">Save</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
