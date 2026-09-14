"use client";
import { FeedbackError } from "@/components/feedback-provider";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle2, Loader2, UploadCloud } from "lucide-react";

export default function ProfilePhotoOnboardingPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => Boolean(file) && !loading, [file, loading]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] || null;
    setError("");
    setFile(nextFile);
    setPreviewUrl(nextFile ? URL.createObjectURL(nextFile) : null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setError("Please upload a full-body photo first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("profilePhoto", file);

      const response = await fetch("/api/me/profile-photo", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save your photo.");
      }

      router.push("/dashboard/try-on");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save your photo.");
    } finally {
      setLoading(false);
    }
  }

  function skipForNow() {
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#eef2ff_0%,#f8fafc_42%,#ffffff_100%)] px-4 py-10 text-neutral-950 dark:bg-[radial-gradient(circle_at_top,#111827_0%,#020617_55%,#000_100%)] dark:text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <section>
            <div className="mb-6 inline-flex items-center rounded-full border border-neutral-200 bg-white/70 px-4 py-2 text-sm text-neutral-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-neutral-300">
              <Camera className="mr-2 h-4 w-4" />
              AI Try-On setup
            </div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
              Upload your default full-body photo
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
              This photo is used as your default model image when generating try-on results. Choose a clear, front-facing full-body photo for the best output.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-neutral-600 dark:text-neutral-300 sm:grid-cols-3">
              {[
                "Clear full body",
                "Good lighting",
                "Simple background",
              ].map((item) => (
                <div key={item} className="flex items-center rounded-2xl border border-neutral-200 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-white/10">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-neutral-950/90">
            <label className="group flex min-h-[420px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-dashed border-neutral-300 bg-neutral-50 text-center transition hover:border-neutral-900 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-white dark:hover:bg-neutral-800">
              {previewUrl ? (
                <Image src={previewUrl}  width={800} height={1000} className="h-full max-h-[520px] w-full object-contain" alt="VFitly，AI virtual try-on，generate try-on image and try-on video" />
              ) : (
                <div className="p-8">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black">
                    <UploadCloud className="h-8 w-8" />
                  </div>
                  <p className="text-lg font-semibold">Click to upload your photo</p>
                  <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">PNG, JPG or WebP. Full-body photos work best.</p>
                </div>
              )}
              <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleFileChange} />
            </label>

            <FeedbackError message={error} />

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-black px-6 py-3 font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                Save and start try-on
              </button>
              <button
                type="button"
                onClick={skipForNow}
                className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-6 py-3 font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900"
              >
                Skip for now
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
