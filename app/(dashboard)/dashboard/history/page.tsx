import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export const metadata = {
  title: "Try-On History | AI SaaS",
  description: "View generated AI try-on records and image assets",
};

export default async function TryOnHistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const jobs = await prisma.tryOnJob.findMany({
    where: { userId: session.user.id },
    include: { wardrobeItem: true },
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-500">AI Try-On Assets</p>
          <h1 className="mt-3 text-3xl font-bold text-black dark:text-white">Generation History</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            Review every try-on job, result image, credit cost and source garments stored for your account.
          </p>
        </div>
        <Link
          href="/dashboard/try-on"
          className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black"
        >
          Create new try-on
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center dark:border-neutral-800 dark:bg-neutral-950">
          <h2 className="text-xl font-semibold text-black dark:text-white">No generation records yet</h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Upload a full-body photo and a garment image to create your first AI try-on result.
          </p>
          <Link
            href="/dashboard/try-on"
            className="mt-6 inline-flex rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Start generating
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/dashboard/history/${job.id}`}
              className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-950"
            >
              <div className="relative aspect-[4/5] bg-neutral-100 dark:bg-neutral-900">
                {job.resultImageUrl ? (
                  <Image src={job.resultImageUrl} alt="AI try-on result" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-neutral-500">{job.status}</div>
                )}
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-900 shadow-sm dark:bg-black/80 dark:text-white">
                  {job.status}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="truncate text-base font-semibold text-black dark:text-white">
                    {job.wardrobeItem?.name || "Uploaded garment"}
                  </h2>
                  <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                    {job.creditsCost} credit{job.creditsCost === 1 ? "" : "s"}
                  </span>
                </div>
                <p className="mt-2 text-xs text-neutral-500">{job.createdAt.toLocaleString()}</p>
                {job.error ? <p className="mt-3 line-clamp-2 text-sm text-red-500">{job.error}</p> : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
