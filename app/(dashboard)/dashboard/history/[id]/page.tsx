import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export const metadata = {
  keywords: ["AI virtual try-on"],
  title: "Try-On Detail | AI SaaS",
  description: "Inspect a VFitly AI virtual try-on result, including the generated image, source photos and garments, and generation details. Download or revisit your outfit preview.",
};

export default async function HistoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const job = await prisma.tryOnJob.findFirst({
    where: { id, userId: session.user.id },
    include: { wardrobeItem: true },
  });

  if (!job) notFound();

  const garmentUrls = Array.isArray(job.garmentImageUrls)
    ? job.garmentImageUrls.filter((item): item is string => typeof item === "string")
    : [job.garmentImageUrl];
  const jobMetadata = metadataToRecord(job.metadata);
  const walkVideoUrl = typeof jobMetadata.walkVideoUrl === "string" ? jobMetadata.walkVideoUrl : "";
  const walkVideoStatus = typeof jobMetadata.walkVideoStatus === "string" ? jobMetadata.walkVideoStatus : "";
  const walkVideoModel = typeof jobMetadata.walkVideoModel === "string" ? jobMetadata.walkVideoModel : "";

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Link href="/dashboard/history" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            ← Back to history
          </Link>
          <h1 className="mt-3 text-3xl font-bold text-black dark:text-white">Generation Detail</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Job ID: <span className="font-mono">{job.id}</span>
          </p>
        </div>
        <span className="w-fit rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
          {job.status} · {job.creditsCost} credit{job.creditsCost === 1 ? "" : "s"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
          <div className="border-b border-neutral-200 p-5 dark:border-neutral-800">
            <h2 className="text-lg font-semibold text-black dark:text-white">Result</h2>
          </div>
          <div className="relative aspect-[4/5] bg-neutral-100 dark:bg-neutral-900">
            {job.resultImageUrl ? (
              <Image src={job.resultImageUrl}  fill className="object-contain" sizes="(max-width: 1024px) 100vw, 60vw" priority alt="VFitly，AI virtual try-on，generate try-on image and try-on video" />
            ) : (
              <div className="flex h-full items-center justify-center text-neutral-500">No result image available</div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <h2 className="text-lg font-semibold text-black dark:text-white">Source images</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <AssetCard title="Person" url={job.personImageUrl} />
              {garmentUrls.map((url, index) => (
                <AssetCard key={`${url}-${index}`} title={index === 0 ? "Garment" : `Garment ${index + 1}`} url={url} />
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <h2 className="text-lg font-semibold text-black dark:text-white">Runway video</h2>
            {walkVideoUrl ? (
              <div className="mt-4 space-y-3">
                <video src={walkVideoUrl} controls playsInline className="aspect-[9/16] w-full rounded-2xl bg-black object-contain" />
                <a
                  href={walkVideoUrl}
                  download
                  className="inline-flex w-full items-center justify-center rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  Download runway video
                </a>
              </div>
            ) : (
              <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
                {walkVideoStatus === "PROCESSING" ? "Runway video is still being generated." : "No runway video has been generated for this record yet."}
              </p>
            )}
            {walkVideoStatus || walkVideoModel ? (
              <dl className="mt-4 space-y-2 text-sm">
                {walkVideoStatus ? <Row label="Video status" value={walkVideoStatus} /> : null}
                {walkVideoModel ? <Row label="Video model" value={walkVideoModel} /> : null}
              </dl>
            ) : null}
          </section>

          <section className="rounded-3xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <h2 className="text-lg font-semibold text-black dark:text-white">Metadata</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Row label="Created" value={job.createdAt.toLocaleString()} />
              <Row label="Updated" value={job.updatedAt.toLocaleString()} />
              <Row label="Wardrobe item" value={job.wardrobeItem?.name || "Direct upload"} />
              <Row label="Prompt" value={job.prompt || "Default try-on prompt"} />
              {job.error ? <Row label="Error" value={job.error} danger /> : null}
            </dl>
          </section>
        </aside>
      </div>
    </main>
  );
}

function AssetCard({ title, url }: { title: string; url: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="relative aspect-square">
        <Image src={url}  fill className="object-cover" sizes="160px" alt="VFitly，AI virtual try-on，generate try-on image and try-on video" />
      </div>
      <div className="p-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">{title}</div>
    </div>
  );
}

function Row({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-neutral-500">{label}</dt>
      <dd className={`mt-1 break-words ${danger ? "text-red-500" : "text-neutral-800 dark:text-neutral-200"}`}>{value}</dd>
    </div>
  );
}

function metadataToRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? { ...(value as Record<string, unknown>) } : {};
}
