"use client";

import { FeedbackError, useFeedback } from "@/components/feedback-provider";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoadingIndicator } from "@/components/loading-indicator";
import { ModalLayer } from "@/components/modal-layer";
import { buildLoginRedirectUrl } from "@/lib/auth/login-redirect";
import { downloadMediaFile } from "@/lib/download-file";
import {
  IconDownload,
  IconExternalLink,
  IconLink,
  IconPhoto,
  IconSparkles,
  IconTrash,
  IconUpload,
  IconX,
} from "@tabler/icons-react";

type PreviewFile = {
  file?: File;
  preview: string;
  source: "default" | "upload";
};

type ExtractedGarment = {
  id: string;
  imageUrl: string;
  label: string;
  source: "meta" | "json-ld" | "html" | "amazon" | "ebay" | "tiktok-shop" | "shopee" | "temu" | "aliexpress" | "taobao";
};


type TryOnResult = {
  id: string;
  jobId?: string;
  label: string;
  garmentUrl: string;
  resultUrl?: string;
  status: "success" | "failed";
  error?: string;
};

const MAX_FILE_BYTES = 12 * 1024 * 1024;

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error || new Error("Unable to read this image."));
    reader.readAsDataURL(file);
  });
}

function PersonUploadCard({
  value,
  disabled,
  onPick,
  onClear,
}: {
  value: PreviewFile | null;
  disabled?: boolean;
  onPick: (file: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    const file = Array.from(files || []).find((item) => item.type.startsWith("image/"));
    if (file) onPick(file);
  }

  return (
    <div
      className={`rounded-3xl border bg-white p-5 shadow-sm transition dark:bg-neutral-900 ${
        dragging ? "border-purple-500 ring-4 ring-purple-100 dark:ring-purple-950/50" : "border-neutral-200 dark:border-neutral-800"
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (!disabled) handleFiles(event.dataTransfer.files);
      }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-black dark:text-white">Person Photo</h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Upload the person image that will receive every extracted garment.</p>
        </div>
        {value && (
          <button
            type="button"
            onClick={onClear}
            disabled={disabled}
            className="rounded-full border border-neutral-200 p-2 text-neutral-500 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700"
            aria-label="Remove person photo"
          >
            <IconX className="h-4 w-4" />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 text-center disabled:cursor-not-allowed disabled:opacity-70 dark:border-neutral-700 dark:bg-black"
      >
        {value ? (
          <>
            <Image src={value.preview}  fill unoptimized className="object-contain" sizes="(max-width: 1024px) 100vw, 420px" alt="VFitly，AI virtual try-on，generate try-on image and try-on video" />
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              {value.source === "default" ? "Using saved full-body photo · Click to change" : "Uploaded photo · Click to change"}
            </span>
          </>
        ) : (
          <span className="flex flex-col items-center px-5 text-sm text-neutral-500">
            <IconUpload className="mb-3 h-8 w-8" />
            <strong className="text-neutral-800 dark:text-neutral-200">Click or drag to upload</strong>
            <small className="mt-1">PNG, JPG, WEBP up to 12MB</small>
          </span>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        disabled={disabled}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />
    </div>
  );
}

export function ProductTryOnContent() {
  const { requireLogin, requireUpgrade, showError } = useFeedback();
  const [downloadingImageId, setDownloadingImageId] = useState<string | null>(null);
  const router = useRouter();
  const loginUrl = buildLoginRedirectUrl("/dashboard/product-try-on");
  const [productUrl, setProductUrl] = useState("");
  const [person, setPerson] = useState<PreviewFile | null>(null);
  const [garments, setGarments] = useState<ExtractedGarment[]>([]);
  const [selectedGarmentIds, setSelectedGarmentIds] = useState<string[]>([]);
  const [results, setResults] = useState<TryOnResult[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [savingWardrobe, setSavingWardrobe] = useState(false);
  const [savingGeneratedResultId, setSavingGeneratedResultId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const resultSectionRef = useRef<HTMLElement>(null);
  const [walkVideoJobId, setWalkVideoJobId] = useState<string | null>(null);
  const [walkVideoUrls, setWalkVideoUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!generating) return;
    resultSectionRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "start",
    });
  }, [generating]);

  useEffect(() => {
    setSelectedGarmentIds(garments.map((garment) => garment.id));
  }, [garments]);

  useEffect(() => {
    let mounted = true;

    fetch("/api/me", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!mounted || !data?.user?.defaultModelImageUrl) return;
        setPerson((current) => current ?? {
          preview: data.user.defaultModelImageUrl,
          source: "default",
        });
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  async function pickPersonImage(file: File) {
    if (file.size > MAX_FILE_BYTES) {
      setError("The image is too large. Please choose an image under 12MB.");
      return;
    }

    setError("");
    try {
      const preview = await fileToDataUrl(file);
      setPerson({ file, preview, source: "upload" });
    } catch (readError) {
      setError(readError instanceof Error ? readError.message : "Unable to preview this image.");
    }
  }

  async function handleExtract(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (extracting || generating) return;

    setExtracting(true);
    setError("");
    setMessage("");
    setResults([]);

    const response = await fetch("/api/product-try-on/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productUrl }),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401) {
        requireLogin(undefined, loginUrl);
        setExtracting(false);
        return;
      }
      if (response.status === 403 && data.requiresLogin) {
        setShowLoginModal(true);
      } else {
        setError(data.error || "Failed to extract product garment images.");
      }
    } else {
      setGarments(data.garments || []);
    }

    setExtracting(false);
  }

  async function handleGenerate() {
    if (!person || selectedGarmentCount === 0 || generating) return;

    setGenerating(true);
    setError("");
    setMessage("");
    setResults([]);

    const formData = new FormData();
    if (person.file) {
      formData.set("personImage", person.file);
    }
    formData.set("garments", JSON.stringify(selectedGarments));

    const response = await fetch("/api/product-try-on/generate", {
      method: "POST",
      body: formData,
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401) {
        requireLogin(undefined, loginUrl);
        setGenerating(false);
        setSavingWardrobe(false);
        return;
      }
      if (response.status === 403) {
        if (data.requiresLogin) {
          setShowLoginModal(true);
        } else {
          setShowUpgradeModal(true);
        }
      } else {
        setError(data.error || "Failed to generate product try-on images.");
      }
    } else {
      const generatedResults: TryOnResult[] = data.results || [];
      setResults(generatedResults);
      const failures = generatedResults.filter((result) => result.status === "failed");
      if (failures.length) setError(failures.map((result) => `${result.label}: ${result.error || "This image failed to generate."}`).join("\n"));
    }

    setGenerating(false);
  }

  async function handleSaveToWardrobe() {
    if (selectedGarmentCount === 0 || savingWardrobe) {
      setError("Please select at least one product image to save to your wardrobe.");
      return;
    }

    setSavingWardrobe(true);
    setError("");
    setMessage("");

    const response = await fetch("/api/product-try-on/add-to-wardrobe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productUrl, garments: selectedGarments }),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401) {
        requireLogin(undefined, loginUrl);
        setGenerating(false);
        setSavingWardrobe(false);
        return;
      }
      if (response.status === 403) {
        if (data.requiresLogin) {
          setShowLoginModal(true);
        } else {
          setShowUpgradeModal(true);
        }
      } else {
        setError(data.error || "Failed to save product images to your wardrobe.");
      }
    } else {
      const savedCount = Array.isArray(data.results) ? data.results.filter((item: { status?: string }) => item.status === "saved").length : 0;
      const skippedCount = Array.isArray(data.results) ? data.results.filter((item: { status?: string }) => item.status === "skipped").length : 0;
      setMessage(`${savedCount} item${savedCount === 1 ? "" : "s"} saved to your wardrobe${skippedCount ? `, ${skippedCount} already existed` : ""}.`);
    }

    setSavingWardrobe(false);
  }

  async function handleSaveGeneratedResult(result: TryOnResult) {
    if (!result.resultUrl || savingGeneratedResultId) return;

    setSavingGeneratedResultId(result.id);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/wardrobe/generated-look", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: result.resultUrl,
          jobId: result.jobId,
          name: `Generated product look - ${result.label}`,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401 || data.requiresLogin) {
          requireLogin(data.error, loginUrl);
        } else if (response.status === 403) {
          requireUpgrade(data.error);
        } else {
          showError(data.error || "Failed to save generated look to wardrobe.");
        }
      } else {
        setMessage(data.duplicated ? "This generated look is already in your wardrobe." : "Generated look saved to your wardrobe.");
      }
    } catch {
      showError("Unable to save the generated look. Please try again.");
    } finally {
      setSavingGeneratedResultId(null);
    }
  }

  async function handleDownloadImage(result: TryOnResult) {
    if (!result.resultUrl || downloadingImageId) return;

    setDownloadingImageId(result.id);
    try {
      await downloadMediaFile(result.resultUrl, `vfitly-product-try-on-${result.id}.png`);
    } catch {
      showError("Unable to download this image. Please try again.");
    } finally {
      setDownloadingImageId(null);
    }
  }

  async function handleGenerateWalkVideo(result: TryOnResult) {
    if (!result.jobId || !result.resultUrl || walkVideoJobId) return;

    const jobId = result.jobId;
    setWalkVideoJobId(jobId);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/try-on/walk-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          requireLogin(undefined, loginUrl);
          return;
        }
        if (response.status === 403) {
          if (data.requiresLogin) setShowLoginModal(true);
          else setShowUpgradeModal(true);
          return;
        }
        throw new Error(data.error || "Failed to generate runway video.");
      }
      if (!data.videoUrl) throw new Error("The video task finished, but no playable video URL was returned.");
      setWalkVideoUrls((current) => ({ ...current, [jobId]: data.videoUrl }));
    } catch (videoError) {
      setError(videoError instanceof Error ? videoError.message : "Failed to generate runway video.");
    } finally {
      setWalkVideoJobId(null);
    }
  }

  const selectedGarments = useMemo(
    () => garments.filter((garment) => selectedGarmentIds.includes(garment.id)),
    [garments, selectedGarmentIds],
  );
  const selectedGarmentCount = selectedGarments.length;
  const canGenerate = Boolean(person && garments.length > 0) && !extracting && !generating;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <FeedbackError message={error} />
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-purple-500">Product Link Try-On</p>
          <h1 className="mt-3 text-3xl font-bold text-black dark:text-white">Product link try on: batch try-on from any product URL</h1>
          <p className="mt-2 max-w-3xl text-neutral-600 dark:text-neutral-400">
            Paste a product URL to collect the garment images published on that page, then generate one try-on result per garment. Product link try on keeps the same person photo across the batch, so removing the variants you do not need is the fastest way to compare what is left.
          </p>
        </div>
        <Link href="/dashboard/try-on" className="rounded-full border border-neutral-200 px-5 py-3 text-sm font-medium dark:border-neutral-700">
          Single image try-on
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section className="space-y-6">
          <form onSubmit={handleExtract} className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-purple-50 p-3 text-purple-600 dark:bg-purple-950/40 dark:text-purple-300">
                <IconLink className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-black dark:text-white">1. Extract garment images from a product link</h2>
                <p className="text-sm text-neutral-500">Works best with public product pages that expose product images in HTML or structured metadata.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <input
                value={productUrl}
                onChange={(event) => setProductUrl(event.target.value)}
                disabled={extracting || generating}
                placeholder="https://example.com/products/dress"
                className="min-h-12 flex-1 rounded-2xl border border-neutral-200 bg-transparent px-4 text-sm outline-none transition focus:border-purple-500 dark:border-neutral-800"
              />
              <button
                type="submit"
                disabled={!productUrl.trim() || extracting || generating}
                className="rounded-full bg-purple-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {extracting ? "Extracting..." : "Get Garment Variants"}
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
              <div>
                <h2 className="text-lg font-semibold text-black dark:text-white">2. Review extracted images</h2>
                <p className="text-sm text-neutral-500">Delete images you do not want to use before generating try-on results, or select only the ones you want to save to your wardrobe.</p>
              </div>
              <div className="flex w-full flex-col gap-2 rounded-2xl bg-neutral-50 p-2 dark:bg-black/30 lg:w-auto lg:min-w-fit">
                <span className="whitespace-nowrap rounded-full bg-white px-3 py-2 text-center text-sm font-medium text-neutral-600 shadow-sm dark:bg-neutral-800 dark:text-neutral-300">{selectedGarmentCount} selected</span>
                {garments.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedGarmentIds(garments.map((garment) => garment.id))}
                      className="whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      Select all
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedGarmentIds([])}
                      className="whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      Clear selection
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveToWardrobe}
                      disabled={savingWardrobe || extracting || generating || selectedGarmentCount === 0}
                      className="col-span-2 whitespace-nowrap rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-1"
                    >
                      {savingWardrobe ? "Saving..." : "Save selected to wardrobe"}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            {message && <p className="mb-4 rounded-2xl bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-300">{message}</p>}

            {extracting ? (
              <LoadingIndicator
                title="Extracting product images"
                description="We are reading the product page and finding garment images. This may take a little while."
                tone="purple"
                className="min-h-72"
              />
            ) : garments.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {garments.map((garment, index) => {
                  const checked = selectedGarmentIds.includes(garment.id);

                  return (
                    <article
                      key={garment.id}
                      role="button"
                      tabIndex={0}
                      aria-pressed={checked}
                      onClick={() => setSelectedGarmentIds((current) => (current.includes(garment.id) ? current.filter((id) => id !== garment.id) : [...current, garment.id]))}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedGarmentIds((current) => (current.includes(garment.id) ? current.filter((id) => id !== garment.id) : [...current, garment.id]));
                        }
                      }}
                      className={`group overflow-hidden rounded-2xl border-2 bg-neutral-50 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-purple-100 dark:bg-black dark:focus:ring-purple-950/50 ${
                        checked
                          ? "border-purple-500 shadow-[0_0_0_4px_rgba(168,85,247,0.12)] dark:border-purple-400"
                          : "border-neutral-200 hover:border-purple-200 dark:border-neutral-800 dark:hover:border-purple-900"
                      }`}
                    >
                      <div className="relative aspect-[4/5] bg-white dark:bg-neutral-950">
                        <Image src={garment.imageUrl}  fill unoptimized loading="lazy" className="object-contain" sizes="(max-width: 768px) 100vw, 280px" alt="VFitly，AI virtual try-on，generate try-on image and try-on video" />
                        <div className={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur ${checked ? "bg-purple-600 text-white" : "bg-white/90 text-neutral-600 dark:bg-black/70 dark:text-neutral-200"}`}>
                          {checked ? "Selected" : "Click to select"}
                        </div>
                      </div>
                      <div className="space-y-3 p-4">
                        <div>
                          <p className="line-clamp-2 text-sm font-medium text-black dark:text-white">{garment.label || `Product image ${index + 1}`}</p>
                          <p className="mt-1 text-xs uppercase tracking-wide text-neutral-400">Source: {garment.source}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <a href={garment.imageUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-neutral-200 px-3 py-2 text-xs font-medium dark:border-neutral-700">
                            <IconExternalLink className="h-4 w-4" /> Open
                          </a>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setGarments((current) => current.filter((item) => item.id !== garment.id));
                            }}
                            disabled={generating || savingWardrobe}
                            className="inline-flex items-center justify-center rounded-full border border-red-100 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-950/60 dark:hover:bg-red-950/30"
                          >
                            <IconTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 text-center dark:border-neutral-700">
                <IconPhoto className="mb-4 h-12 w-12 text-neutral-400" />
                <h3 className="text-lg font-semibold text-black dark:text-white">Extracted garment images will appear here</h3>
                <p className="mt-2 max-w-md text-sm text-neutral-500">Paste a public product URL and click the extraction button to find product images.</p>
              </div>
            )}
          </section>
        </section>

        <aside className="space-y-6">
          <PersonUploadCard value={person} disabled={generating} onPick={pickPersonImage} onClear={() => setPerson(null)} />

          <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-purple-50 p-3 text-purple-600 dark:bg-purple-950/40 dark:text-purple-300">
                <IconSparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-black dark:text-white">3. Generate the try-on batch</h2>
                <p className="text-sm text-neutral-500">One final image will be generated for every remaining garment.</p>
              </div>
            </div>


            <button
              type="button"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              {generating ? `Generating ${garments.length} results...` : "Start AI Try-On"}
            </button>

            {!person || garments.length === 0 ? (
              <p className="mt-3 text-center text-sm text-neutral-500">Upload a person image and keep at least one product image to enable generation.</p>
            ) : null}
          </section>
        </aside>
      </div>

      <section ref={resultSectionRef} className="mt-6 scroll-mt-24 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-semibold text-black dark:text-white">Product link try-on results</h2>
            <p className="mt-1 text-sm text-neutral-500">Successful and failed images are shown independently, so one failed variant will not block the whole batch.</p>
          </div>
          {results.length > 0 && <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">{results.filter((item) => item.status === "success").length} / {results.length} completed</span>}
        </div>

        {generating ? (
          <LoadingIndicator
            title="Creating batch try-on images"
            description="This may take a few minutes depending on the number of selected garment images. You can also check your generation history in your account dashboard later."
            tone="purple"
            className="min-h-96"
          />
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {results.map((result) => (
              <article key={result.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-black">
                <div className="relative aspect-[4/5] bg-white dark:bg-neutral-950">
                  {result.resultUrl ? (
                    <Image src={result.resultUrl}  fill unoptimized loading="lazy" className="object-contain" sizes="(max-width: 768px) 100vw, 360px" alt="VFitly，AI virtual try-on，generate try-on image and try-on video" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center p-6 text-center text-sm text-red-500">
                      <IconX className="mb-3 h-8 w-8" />
                      {result.error || "This image failed to generate."}
                    </div>
                  )}
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <p className="line-clamp-2 text-sm font-medium text-black dark:text-white">{result.label}</p>
                    <p className={`mt-1 text-xs font-medium uppercase tracking-wide ${result.status === "success" ? "text-green-600" : "text-red-600"}`}>{result.status}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a href={result.garmentUrl} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-neutral-200 px-3 py-2 text-xs font-medium dark:border-neutral-700">
                      Garment
                    </a>
                    {result.resultUrl && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSaveGeneratedResult(result)}
                          disabled={Boolean(savingGeneratedResultId)}
                          className="inline-flex w-full items-center justify-center rounded-full bg-purple-600 px-3 py-2 text-xs font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {savingGeneratedResultId === result.id ? "Saving..." : "Save to Generated Looks"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleGenerateWalkVideo(result)}
                          disabled={!result.jobId || Boolean(walkVideoJobId)}
                          className="inline-flex w-full items-center justify-center rounded-full border border-neutral-200 px-3 py-2 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700"
                        >
                          {walkVideoJobId === result.jobId ? "Generating runway video..." : "Generate Runway Video"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadImage(result)}
                          disabled={Boolean(downloadingImageId)}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-3 py-2 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
                        >
                          <IconDownload className="h-4 w-4" /> {downloadingImageId === result.id ? "Downloading..." : "Download Image"}
                        </button>
                      </>
                    )}
                  </div>
                  {result.jobId && walkVideoJobId === result.jobId && (
                    <LoadingIndicator title="Creating runway video" description="This may take a few minutes. Please keep this page open." tone="purple" />
                  )}
                  {result.jobId && walkVideoUrls[result.jobId] && (
                    <div className="space-y-3">
                      <video src={walkVideoUrls[result.jobId]} controls playsInline className="w-full rounded-2xl bg-black" />
                      <a href={walkVideoUrls[result.jobId]} download className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 px-3 py-2 text-xs font-medium dark:border-neutral-700">
                        <IconDownload className="h-4 w-4" /> Download Video
                      </a>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex min-h-96 flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 text-center dark:border-neutral-700">
            <IconPhoto className="mb-4 h-12 w-12 text-neutral-400" />
            <h3 className="text-lg font-semibold text-black dark:text-white">Batch try-on results will appear here</h3>
            <p className="mt-2 max-w-md text-sm text-neutral-500">Extract product images, remove unwanted variants, upload a person image, then start AI try-on.</p>
          </div>
        )}
      </section>

      {showUpgradeModal && (
        <ModalLayer>
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl shadow-black/40">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-400/10 text-purple-200">
                <IconSparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-white">Upgrade to unlock more try-ons</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Your current plan has reached the free wardrobe limit or this feature requires Plus / Ultra. Upgrade your plan to save more garments and generate product link try-on images.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => router.push("/pricing")}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl bg-purple-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-purple-200"
                >
                  View plans
                </button>
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(false)}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        </ModalLayer>
      )}

      {showLoginModal && (
        <ModalLayer>
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl shadow-black/40">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-400/10 text-purple-200">
                <IconSparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-white">Sign in to keep creating</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Guest mode includes 2 free Product Try On uses per day. Sign in to continue and save your generated looks.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={loginUrl}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl bg-purple-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-purple-200"
                >
                  Sign in
                </Link>
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        </ModalLayer>
      )}
    </div>
  );
}
