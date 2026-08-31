import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export const metadata = {
  title: "Feedback | Admin",
  description: "Review customer feedback submissions",
};

async function markFeedbackReviewed(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const feedbackId = String(formData.get("feedbackId") || "");
  if (!feedbackId) return;

  await prisma.feedback.update({
    where: { id: feedbackId },
    data: { status: "REVIEWED" },
  });

  revalidatePath("/admin/feedback");
}

export default async function AdminFeedbackPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            Admin
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white">
            User Feedback
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            Review feedback submitted from the contact page. Reply to users directly through your email client.
          </p>
        </div>
        <div className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-300">
          {feedbacks.length} submissions
        </div>
      </div>

      {feedbacks.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center dark:border-neutral-800 dark:bg-neutral-950">
          <h2 className="text-lg font-semibold text-neutral-950 dark:text-white">
            No feedback yet
          </h2>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            New customer feedback will appear here after users submit the form.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <article
              key={feedback.id}
              className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={`mailto:${feedback.email}`}
                      className="break-all text-sm font-semibold text-neutral-950 underline-offset-4 hover:underline dark:text-white"
                    >
                      {feedback.email}
                    </a>
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
                      {feedback.status}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {feedback.createdAt.toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-neutral-700 dark:text-neutral-200">
                    {feedback.message}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <a
                    href={`mailto:${feedback.email}`}
                    className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                  >
                    Reply by email
                  </a>
                  {feedback.status !== "REVIEWED" && (
                    <form action={markFeedbackReviewed}>
                      <input type="hidden" name="feedbackId" value={feedback.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900"
                      >
                        Mark reviewed
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
