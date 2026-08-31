"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoadingIndicator } from "@/components/loading-indicator";
import { IconCheck, IconDownload, IconHanger, IconPhoto, IconSparkles, IconUpload, IconVideo, IconX } from "@tabler/icons-react";
import { buildLoginRedirectUrl } from "@/lib/auth/login-redirect";
import { defaultTryOnPrompt, tryOnImageSizes } from "@/lib/wardrobe/constants";

type PreviewImage = {
  file?: File;
  preview: string;
  source: "default" | "upload" | "wardrobe";
};

type WardrobeItem = {
  id: string;
  name: string;
  category: string;
  color: string | null;
  imageUrl: string;
};

type TryOnJob = {
  id: string;
  personImageUrl: string;
  garmentImageUrl: string;
  resultImageUrl: string | null;
  status: string;
  error: string | null;
  prompt: string | null;
  jobType?: string;
  createdAt: string;
  metadata?: {
    walkVideoStatus?: string;
    walkVideoUrl?: string;
    walkVideoAssetKey?: string;
    walkVideoModel?: string;
    [key: string]: unknown;
  } | null;
  wardrobeItem?: WardrobeItem | null;
};

const MAX_FILE_BYTES = 12 * 1024 * 1024;

const defaultOutfitPrompt =
  "Realistic full-body outfit try-on using multiple selected wardrobe items. Combine one item per category into a coherent outfit, preserve the person's identity, pose, body shape, and natural proportions, keep fabrics realistic, avoid duplicate garments, no extra limbs, no text.";

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error || new Error("Unable to read this image."));
    reader.readAsDataURL(file);
  });
}

function UploadCard({
  title,
  description,
  value,
  disabled,
  onPick,
  onClear,
}: {
  title: string;
  description: string;
  value: PreviewImage | null;
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
      className={`rounded-3xl border bg-white p-4 shadow-sm transition dark:bg-neutral-900 ${
        dragging ? "border-blue-500 ring-4 ring-blue-100 dark:ring-blue-950/50" : "border-neutral-200 dark:border-neutral-800"
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
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-black dark:text-white">{title}</h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
        </div>
        {value && (
          <button
            type="button"
            onClick={onClear}
            disabled={disabled}
            className="rounded-full border border-neutral-200 p-2 text-neutral-500 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700"
            aria-label={`Remove ${title}`}
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
            <Image src={value.preview} alt={`${title} preview`} fill unoptimized className="object-contain" sizes="(max-width: 1024px) 100vw, 360px" />
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

export function TryOnContent() {
  const router = useRouter();
  const loginUrl = buildLoginRedirectUrl("/dashboard/try-on");
  const [jobs, setJobs] = useState<TryOnJob[]>([]);
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [selectedWardrobeIds, setSelectedWardrobeIds] = useState<string[]>([]);
  const [person, setPerson] = useState<PreviewImage | null>(null);
  const [garment, setGarment] = useState<PreviewImage | null>(null);
  const [aspectRatio, setAspectRatio] = useState(tryOnImageSizes[0].id);
  const [requirements, setRequirements] = useState("");
  const [outfitRequirements, setOutfitRequirements] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [outfitGenerating, setOutfitGenerating] = useState(false);
  const [error, setError] = useState("");
  const [savingGeneratedLookId, setSavingGeneratedLookId] = useState<string | null>(null);
  const [generatedLookMessage, setGeneratedLookMessage] = useState("");
  const [walkVideoJobId, setWalkVideoJobId] = useState<string | null>(null);
  const [walkVideoUrl, setWalkVideoUrl] = useState("");
  const [walkVideoMessage, setWalkVideoMessage] = useState("");
  const [showOutfitUpgradeModal, setShowOutfitUpgradeModal] = useState(false);

  useEffect(() => {
    Promise.all([loadJobs(), loadWardrobeItems()]).finally(() => setLoading(false));
  }, []);

  async function loadJobs() {
    const response = await fetch("/api/try-on");
    const data = await response.json();
    if (response.ok) {
      setJobs(data.jobs || []);
      if (data.user?.defaultModelImageUrl) {
        setPerson((current) => current ?? {
          preview: data.user.defaultModelImageUrl,
          source: "default",
        });
      }
    }
  }

  async function loadWardrobeItems() {
    const response = await fetch("/api/wardrobe?pageSize=60");
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setWardrobeItems((data.items || []).filter((item: WardrobeItem) => item.category !== "Generated Looks"));
    }
  }

  async function pickImage(file: File, setter: (value: PreviewImage) => void) {
    if (file.size > MAX_FILE_BYTES) {
      setError("The image is too large. Please choose an image under 12MB.");
      return;
    }

    setError("");
    try {
      const preview = await fileToDataUrl(file);
      setter({ file, preview, source: "upload" });
    } catch (readError) {
      setError(readError instanceof Error ? readError.message : "Unable to preview this image.");
    }
  }

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!person || !garment || generating) return;

    setGenerating(true);
    setError("");
    setGeneratedLookMessage("");

    const formData = new FormData();
    if (person.file) {
      formData.set("personImage", person.file);
    }
    if (!garment.file) {
      setError("Please upload a clothing image before generating.");
      setGenerating(false);
      return;
    }
    formData.set("garmentImage", garment.file);
    formData.set("size", aspectRatio);
    formData.set("prompt", requirements.trim() ? `${defaultTryOnPrompt}\n\nAdditional requirements: ${requirements.trim()}` : defaultTryOnPrompt);

    const response = await fetch("/api/try-on", {
      method: "POST",
      body: formData,
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401) {
        router.push(loginUrl);
        return;
      }
      if (response.status === 403) {
        setShowOutfitUpgradeModal(true);
      } else {
        setError(data.error || "Generation failed. Please try again later.");
      }
    } else {
      setJobs((current) => [data.job, ...current]);
    }

    setGenerating(false);
  }

  const selectedWardrobeItems = useMemo(
    () => selectedWardrobeIds
      .map((id) => wardrobeItems.find((item) => item.id === id))
      .filter((item): item is WardrobeItem => Boolean(item)),
    [selectedWardrobeIds, wardrobeItems],
  );

  function toggleWardrobeItem(item: WardrobeItem) {
    setError("");
    setSelectedWardrobeIds((current) => {
      if (current.includes(item.id)) {
        return current.filter((id) => id !== item.id);
      }

      const alreadySelectedSameCategory = current.some((id) => wardrobeItems.find((wardrobeItem) => wardrobeItem.id === id)?.category === item.category);
      if (alreadySelectedSameCategory) {
        setError(`You can only select one ${item.category} item for one outfit.`);
        return current;
      }

      if (current.length >= 4) {
        setError("Please select no more than 4 wardrobe items for one outfit.");
        return current;
      }

      return [...current, item.id];
    });
  }

  async function handleGenerateOutfit() {
    if (!person || selectedWardrobeItems.length < 2 || outfitGenerating) return;

    const categories = selectedWardrobeItems.map((item) => item.category);
    if (new Set(categories).size !== categories.length) {
      setError("Please select only one item from each wardrobe category.");
      return;
    }

    setOutfitGenerating(true);
    setError("");
    setGeneratedLookMessage("");

    const formData = new FormData();
    if (person.file) {
      formData.set("personImage", person.file);
    }
    formData.set("wardrobeItemIds", JSON.stringify(selectedWardrobeIds));
    formData.set("size", aspectRatio);
    formData.set(
      "prompt",
      outfitRequirements.trim()
        ? `${defaultOutfitPrompt}\n\nAdditional outfit requirements: ${outfitRequirements.trim()}`
        : defaultOutfitPrompt,
    );

    const response = await fetch("/api/try-on/outfit-generate", {
      method: "POST",
      body: formData,
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401) {
        router.push(loginUrl);
        return;
      }
      if (response.status === 403) {
        setShowOutfitUpgradeModal(true);
      } else {
        setError(data.error || "Outfit generation failed. Please try again later.");
      }
    } else {
      setJobs((current) => [data.job, ...current]);
    }

    setOutfitGenerating(false);
  }

  async function handleSaveGeneratedLook(job: TryOnJob) {
    if (!job.resultImageUrl || savingGeneratedLookId) return;

    setSavingGeneratedLookId(job.id);
    setError("");
    setGeneratedLookMessage("");

    const response = await fetch("/api/wardrobe/generated-look", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl: job.resultImageUrl,
        jobId: job.id,
        name: job.jobType === "MULTI_WARDROBE_OUTFIT" ? "Generated wardrobe outfit" : "Generated try-on look",
      }),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401) {
        router.push(loginUrl);
        return;
      }
      if (response.status === 403) {
        setShowOutfitUpgradeModal(true);
      } else {
        setError(data.error || "Failed to save generated look to wardrobe.");
      }
    } else {
      setGeneratedLookMessage(data.duplicated ? "This generated look is already in your wardrobe." : "Generated look saved to your wardrobe.");
    }

    setSavingGeneratedLookId(null);
  }

  async function handleGenerateWalkVideo(job: TryOnJob) {
    if (!job.resultImageUrl || walkVideoJobId) return;

    setWalkVideoJobId(job.id);
    setWalkVideoUrl("");
    setWalkVideoMessage("");
    setError("");

    try {
      const response = await fetch("/api/try-on/walk-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          router.push(loginUrl);
          return;
        }
        if (response.status === 403) {
          setShowOutfitUpgradeModal(true);
        } else {
          setError(data.error || "Failed to generate runway video.");
        }
        return;
      }

      const videoUrl = data.videoUrl as string | undefined;
      if (!videoUrl) {
        setError("The video was generated, but no playable video URL was returned.");
        return;
      }

      setWalkVideoUrl(videoUrl);
      setWalkVideoMessage("Runway video created successfully. You can also find it in this record's Generation history detail.");
      setJobs((current) => current.map((item) => item.id === job.id ? {
        ...item,
        metadata: {
          ...(item.metadata || {}),
          walkVideoStatus: "COMPLETED",
          walkVideoUrl: videoUrl,
          walkVideoModel: data.model || item.metadata?.walkVideoModel,
        },
      } : item));
    } catch {
      setError("The video request was interrupted. Please refresh the page or try again in a moment.");
    } finally {
      setWalkVideoJobId(null);
    }
  }

  const latestResult = useMemo(() => jobs.find((job) => job.resultImageUrl), [jobs]);
  const latestResultWalkVideoUrl = latestResult?.metadata?.walkVideoUrl || walkVideoUrl;
  const canGenerate = Boolean(person && garment) && !generating;
  const canGenerateOutfit = Boolean(person && selectedWardrobeItems.length >= 2) && !outfitGenerating;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-500">AI Try-On Studio</p>
          <h1 className="mt-3 text-3xl font-bold text-black dark:text-white">Generate realistic outfit previews</h1>
          <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
            Upload a person photo and a clothing image, choose the final aspect ratio, add optional requirements, and create a polished try-on result.
          </p>
        </div>
        <Link href="/dashboard/wardrobe" className="rounded-full border border-neutral-200 px-5 py-3 text-sm font-medium dark:border-neutral-700">
          Manage wardrobe
        </Link>
      </div>

      <form onSubmit={handleGenerate} className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <UploadCard
            title="Person Photo"
            description="We auto-load your saved full-body photo when available. Click the preview to upload a different one."
            value={person}
            disabled={generating}
            onPick={(file) => pickImage(file, setPerson)}
            onClear={() => setPerson(null)}
          />
          <UploadCard
            title="Clothing Image"
            description="Upload a single garment photo, flat-lay image, or product image."
            value={garment}
            disabled={generating}
            onPick={(file) => pickImage(file, setGarment)}
            onClear={() => setGarment(null)}
          />
        </div>

        <aside className="h-fit rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
              <IconSparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-black dark:text-white">Create try-on</h2>
              <p className="text-sm text-neutral-500">Use one person image plus one clothing image.</p>
            </div>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Aspect Ratio</span>
              <select
                value={aspectRatio}
                onChange={(event) => setAspectRatio(event.target.value)}
                disabled={generating}
                className="mt-2 w-full rounded-2xl border border-neutral-200 bg-transparent p-3 text-sm dark:border-neutral-800"
              >
                {tryOnImageSizes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Additional Requirements <small className="text-neutral-400">Optional</small></span>
              <textarea
                value={requirements}
                onChange={(event) => setRequirements(event.target.value)}
                rows={5}
                placeholder="Example: street style, black pants, soft natural lighting, keep the original background"
                disabled={generating}
                className="mt-2 w-full rounded-2xl border border-neutral-200 bg-transparent p-3 text-sm dark:border-neutral-800"
              />
            </label>

            {error && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30">{error}</p>}

            <button disabled={!canGenerate} className="w-full rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
              {generating ? "Generating..." : "Generate Try-On Image"}
            </button>

            {!person || !garment ? (
              <p className="text-center text-sm text-neutral-500">Upload both images to enable generation.</p>
            ) : null}
          </div>
        </aside>
      </form>

      <section className="mt-6 rounded-3xl border border-blue-100 bg-blue-50/40 p-6 shadow-sm dark:border-blue-950/60 dark:bg-blue-950/10">
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div className="flex gap-3">
            <div className="h-fit rounded-2xl bg-white p-3 text-blue-600 shadow-sm dark:bg-neutral-900 dark:text-blue-300">
              <IconHanger className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-black dark:text-white">Create outfit from wardrobe</h2>
              <p className="mt-1 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
                Select 2-4 wardrobe items from different categories, such as one dress and one pair of shoes.
              </p>
            </div>
          </div>
          <Link href="/dashboard/wardrobe" className="rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-medium dark:border-neutral-700 dark:bg-neutral-900">
            Add wardrobe items
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            {wardrobeItems.length ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {wardrobeItems.map((item) => {
                  const selected = selectedWardrobeIds.includes(item.id);
                  const disabledByCategory = !selected && selectedWardrobeItems.some((selectedItem) => selectedItem.category === item.category);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleWardrobeItem(item)}
                      disabled={outfitGenerating}
                      className={`group relative overflow-hidden rounded-2xl border bg-white p-2 text-left transition dark:bg-neutral-900 ${
                        selected
                          ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900"
                          : disabledByCategory
                            ? "border-neutral-200 opacity-45 dark:border-neutral-800"
                            : "border-neutral-200 hover:border-blue-300 dark:border-neutral-800"
                      }`}
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-neutral-100 dark:bg-black">
                        <Image src={item.imageUrl} alt={item.name} fill unoptimized className="object-cover" sizes="220px" />
                        {selected ? (
                          <span className="absolute right-2 top-2 rounded-full bg-blue-600 p-1 text-white">
                            <IconCheck className="h-4 w-4" />
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-2 min-w-0">
                        <p className="truncate text-sm font-medium text-black dark:text-white">{item.name}</p>
                        <p className="text-xs text-neutral-500">{item.category}{item.color ? ` · ${item.color}` : ""}</p>
                        {disabledByCategory ? <p className="mt-1 text-xs text-amber-600">One {item.category} only</p> : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white text-center dark:border-neutral-700 dark:bg-neutral-900">
                <IconHanger className="mb-3 h-10 w-10 text-neutral-400" />
                <h3 className="font-semibold text-black dark:text-white">No wardrobe items yet</h3>
                <p className="mt-2 max-w-sm text-sm text-neutral-500">Add garments to your wardrobe first, then combine different categories here.</p>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-3xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="font-semibold text-black dark:text-white">Selected outfit</h3>
            <p className="mt-1 text-sm text-neutral-500">{selectedWardrobeItems.length}/4 selected · one item per category</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {selectedWardrobeItems.length ? selectedWardrobeItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleWardrobeItem(item)}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-200"
                >
                  {item.category}: {item.name} ×
                </button>
              )) : <span className="text-sm text-neutral-500">Choose at least 2 different categories.</span>}
            </div>

            <label className="mt-5 block">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Outfit Requirements <small className="text-neutral-400">Optional</small></span>
              <textarea
                value={outfitRequirements}
                onChange={(event) => setOutfitRequirements(event.target.value)}
                rows={5}
                placeholder="Example: make the shoes clearly visible, elegant summer look, keep the model's pose"
                disabled={outfitGenerating}
                className="mt-2 w-full rounded-2xl border border-neutral-200 bg-transparent p-3 text-sm dark:border-neutral-800"
              />
            </label>

            <button
              type="button"
              disabled={!canGenerateOutfit}
              onClick={handleGenerateOutfit}
              className="mt-5 w-full rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
            >
              {outfitGenerating ? "Generating outfit..." : "Generate Wardrobe Outfit"}
            </button>

            {!person ? <p className="mt-3 text-center text-sm text-neutral-500">Upload or save a person photo first.</p> : null}
            {person && selectedWardrobeItems.length < 2 ? <p className="mt-3 text-center text-sm text-neutral-500">Select at least 2 wardrobe items.</p> : null}
          </aside>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">Final try-on result</h2>
        {generating || outfitGenerating ? (
          <LoadingIndicator
            title="Creating your try-on image"
            description="This usually takes 20-60 seconds. Please keep this page open."
            tone="blue"
            className="min-h-[420px]"
          />
        ) : latestResult?.resultImageUrl ? (
          <div className="space-y-4">
            {generatedLookMessage && <p className="rounded-2xl bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-300">{generatedLookMessage}</p>}
            {walkVideoMessage && <p className="rounded-2xl bg-purple-50 p-3 text-sm text-purple-700 dark:bg-purple-950/30 dark:text-purple-300">{walkVideoMessage}</p>}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
              <div className="relative min-h-[420px] overflow-hidden rounded-3xl bg-neutral-50 dark:bg-black">
                <Image src={latestResult.resultImageUrl} alt="Generated try-on result" fill className="object-contain" sizes="(max-width: 1024px) 100vw, 70vw" />
              </div>
              <div className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
                <p>Status: <span className="font-medium text-green-600">{latestResult.status}</span></p>
                <p>Created: {new Date(latestResult.createdAt).toLocaleString()}</p>
                <button
                  type="button"
                  onClick={() => handleSaveGeneratedLook(latestResult)}
                  disabled={savingGeneratedLookId === latestResult.id}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <IconHanger className="h-4 w-4" /> {savingGeneratedLookId === latestResult.id ? "Saving..." : "Save to Generated Looks"}
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerateWalkVideo(latestResult)}
                  disabled={walkVideoJobId === latestResult.id}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-purple-600 px-4 py-2 font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <IconVideo className="h-4 w-4" /> {walkVideoJobId === latestResult.id ? "Generating runway video..." : "Generate Runway Video"}
                </button>
                <a href={latestResult.resultImageUrl} download className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-4 py-2 font-medium text-white dark:bg-white dark:text-black">
                  <IconDownload className="h-4 w-4" /> Download Image
                </a>
                {walkVideoJobId === latestResult.id ? (
                  <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4 dark:border-purple-900/50 dark:bg-purple-950/20">
                    <LoadingIndicator title="Generating runway video" description="Creating a 5-second 9:16 walk video from this final try-on result. You can also check your generation history in your account dashboard later." tone="purple" />
                  </div>
                ) : null}
                {latestResultWalkVideoUrl ? (
                  <div className="space-y-3 rounded-2xl border border-neutral-200 p-3 dark:border-neutral-800">
                    <video src={latestResultWalkVideoUrl} controls playsInline className="aspect-[9/16] w-full rounded-xl bg-black object-contain" />
                    <a href={latestResultWalkVideoUrl} download className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 px-4 py-2 font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800">
                      <IconDownload className="h-4 w-4" /> Download Video
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : loading ? (
          <p className="text-neutral-500">Loading studio...</p>
        ) : (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 text-center dark:border-neutral-700">
            <IconPhoto className="mb-4 h-12 w-12 text-neutral-400" />
            <h3 className="text-lg font-semibold text-black dark:text-white">Your final try-on result will appear here</h3>
            <p className="mt-2 max-w-sm text-sm text-neutral-500">Upload both images, choose an aspect ratio, add optional requirements, then generate.</p>
          </div>
        )}
      </section>

      {showOutfitUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl shadow-black/40">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
              <IconSparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-white">Upgrade your plan</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Your current plan does not have enough quota or credits for this action. Upgrade to Plus or Ultra to unlock more try-on generations, wardrobe outfit creation, and 360° try-on videos.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push("/pricing")}
                className="inline-flex flex-1 items-center justify-center rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                View plans
              </button>
              <button
                type="button"
                onClick={() => setShowOutfitUpgradeModal(false)}
                className="inline-flex flex-1 items-center justify-center rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
