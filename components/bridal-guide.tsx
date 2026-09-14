import Link from "next/link";

const cardShell =
  "rounded-3xl border border-neutral-200 bg-white/65 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/60";

const card = `${cardShell} p-6`;

const body = "text-sm leading-6 text-neutral-600 dark:text-neutral-400";

const linkClass = "font-medium text-blue-600 underline underline-offset-4 dark:text-blue-400";

const steps = [
  {
    title: "Choose a Clear Photo",
    body: "Start with a full-body photo taken in even lighting. Choose an image where your outline is visible and your arms do not cover the area where the dress will appear. A straightforward pose and an uncluttered background make the preview easier to interpret. If you want to compare several gowns, reuse the same photo so changes in pose or lighting do not distract from the differences between dresses.",
  },
  {
    title: "Upload a Dress Image",
    body: "Choose an image that clearly shows one gown, including its neckline, waist, skirt, and any visible sleeves. A front-facing product photo is a useful starting point. Avoid collages or images where a bouquet, furniture, or another person hides important parts of the dress. Use photos you have permission to upload, and keep the original product page available so you can check details against the generated result.",
  },
  {
    title: "Compare Your Preview",
    body: "Generate a preview and review the overall silhouette first. Then look at the neckline, proportions, and visible details. If something looks inconsistent, try a clearer input before changing several settings at once. Keep useful results alongside the original dress images. The comparison should help you decide what to investigate next, rather than replace measurements, product descriptions, or a fitting appointment.",
  },
];

const comparisonPoints = [
  "Start with a specific styling question rather than trying every dress you find. You might compare an A-line skirt with a fuller ball gown, or explore how different necklines change the balance of a look. Keep your person photo unchanged and compare a small number of gowns at a time. This makes it easier to identify which features attract you.",
  "Consider the setting as well as the dress. A garden ceremony, a formal indoor venue, and a small city celebration may suggest different styling directions, but there is no single correct choice for any setting. Use the previews to notice your preferences, not to follow a rigid rule about what someone with your body shape should wear.",
  "Save the product links for your strongest options. Before arranging an appointment or ordering, confirm availability, size information, fabric details, and alteration options with the retailer. Small visual differences in a generated result should not outweigh confirmed information about the actual garment.",
];

export function BridalGuide() {
  return (
    <article className="relative z-10 w-full py-12 md:py-20">
      <header className="mx-auto max-w-3xl px-4 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-500">Bridal Guide</p>
        <h2 className="mt-4 text-3xl font-medium tracking-tight text-black dark:text-white md:text-5xl md:leading-tight">
          <span className="block text-balance">How to Try On Wedding Dresses at Home with AI</span>
        </h2>
        <p className="mt-5 text-sm text-muted dark:text-muted-dark md:text-base">
          <span className="block text-balance">
            Begin with a question you want the preview to help answer: which silhouette interests you, whether you prefer sleeves, or how a particular neckline changes the overall look. You do not need to have chosen your final gown. The tool above lets you start with one dress image and use the result as a reference for your next comparison.
          </span>
        </p>
      </header>

      <ol className="mx-auto mt-12 grid w-full max-w-5xl grid-cols-1 gap-4 px-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className={`group relative flex flex-col transition hover:-translate-y-0.5 hover:shadow-md ${card}`}
          >
            <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/10 text-sm font-semibold text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
              {index + 1}
            </span>
            <h3 className="text-lg font-semibold text-black dark:text-white">{step.title}</h3>
            <p className={`mt-3 ${body}`}>{step.body}</p>
          </li>
        ))}
      </ol>

      <section className="mx-auto mt-16 grid w-full max-w-5xl grid-cols-1 gap-8 px-4 md:mt-20 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-12">
        <div>
          <span className="block h-1 w-12 rounded-full bg-blue-500" />
          <h2 className="mt-5 text-2xl font-medium tracking-tight text-black dark:text-white md:text-3xl md:leading-snug">
            <span className="block text-balance">Compare Silhouettes, Necklines, and Bridal Details</span>
          </h2>
        </div>
        <ul className={`divide-y divide-neutral-200 px-6 dark:divide-neutral-800 ${cardShell}`}>
          {comparisonPoints.map((point, index) => (
            <li key={index} className="flex gap-4 py-5 first:pt-6 last:pb-6">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              <p className={body}>{point}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-16 w-full max-w-5xl px-4 md:mt-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-medium tracking-tight text-black dark:text-white md:text-3xl md:leading-snug">
            <span className="block text-balance">AI Previews, Home Samples, and Bridal Appointments</span>
          </h2>
          <p className="mt-5 text-sm text-muted dark:text-muted-dark md:text-base">
            <span className="block text-balance">
              There are different ways to explore wedding dresses without starting in a bridal salon. An AI preview creates a generated image from your inputs. A home sample service sends a physical gown for you to try, subject to the retailer’s availability, fees, and return conditions. A bridal appointment lets you examine available dresses in person and discuss adjustments with a consultant.
            </span>
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-blue-100 bg-blue-50/60 p-6 shadow-sm backdrop-blur dark:border-blue-950/60 dark:bg-blue-950/15">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">What VFitly does</span>
            <p className={`mt-3 ${body}`}>
              VFitly provides the image-based option. It does not send sample dresses or confirm how a particular gown will fit. Use it early in your search to explore visual preferences and prepare questions for a retailer.
            </p>
          </div>
          <div className={`flex flex-col justify-center ${card}`}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">When a real fitting wins</span>
            <p className={`mt-3 ${body}`}>
              If your main concern is fabric feel, comfort, support, or freedom of movement, a physical try-on is more informative. If you are still deciding which silhouettes or styling directions interest you, an AI preview can help organize that first stage of exploration.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-5xl px-4 md:mt-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-medium tracking-tight text-black dark:text-white md:text-3xl md:leading-snug">
            <span className="block text-balance">What Your Preview Can—and Cannot—Show</span>
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6 shadow-sm backdrop-blur dark:border-emerald-950/60 dark:bg-emerald-950/15">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600/15 text-xs font-bold text-emerald-700 dark:text-emerald-300">✓</span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">It can show</span>
            </div>
            <p className={`mt-4 ${body}`}>
              A generated preview can help you explore the appearance of a bridal look, including its broad silhouette and color relationships. It can also make an idea easier to discuss with someone helping you choose a dress.
            </p>
          </div>
          <div className="rounded-3xl border border-amber-100 bg-amber-50/60 p-6 shadow-sm backdrop-blur dark:border-amber-950/60 dark:bg-amber-950/15">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-600/15 text-xs font-bold text-amber-700 dark:text-amber-300">!</span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">It cannot show</span>
            </div>
            <p className={`mt-4 ${body}`}>
              It cannot confirm your size, the comfort of a bodice, the weight of a train, or how a fabric feels against your skin. Lace, beading, transparent layers, and small decorative details may be altered in the generated image. Always check those features against the original product information.
            </p>
          </div>
        </div>

        <div className={`mt-4 ${card}`}>
          <p className={body}>
            Treat a video preview in the same way: it is generated styling content, not evidence of the real gown’s movement or drape. Inspect the still image before making a video; motion is not a dependable way to correct an inaccurate sleeve or pattern. Before purchasing, review measurements and return conditions, and arrange a physical fitting where possible.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-5xl px-4 md:mt-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-medium tracking-tight text-black dark:text-white md:text-3xl md:leading-snug">
            <span className="block text-balance">Keep a Useful Bridal Shortlist</span>
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className={card}>
            <p className={body}>
              For each favorite, save the original dress image, the generated preview, the product link, and a short note explaining what you like. Specific notes—such as “prefer this neckline” or “want to compare a less full skirt”—are more useful than a simple ranking. Your <Link href="/dashboard/wardrobe" className={linkClass}>saved wardrobe</Link> can help you revisit pieces you expect to use again.
            </p>
          </div>
          <div className={card}>
            <p className={body}>
              Keep the shortlist manageable. Bring your strongest options and questions to a bridal appointment, or use them when asking a retailer about samples and sizing. Revisit the list as you learn more about comfort, availability, alterations, and budget. A useful preview helps you make the next decision; it does not need to settle every part of the purchase.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-5 rounded-3xl border border-neutral-200 bg-gradient-to-br from-white to-neutral-100 p-6 shadow-sm dark:border-neutral-800 dark:from-neutral-950 dark:to-neutral-900 md:flex-row">
          <p className={`md:max-w-2xl ${body}`}>
            Before starting another session, check <Link href="/pricing" className={linkClass}>plans and generation credits</Link>. Read our <Link href="/privacy" className={linkClass}>privacy policy</Link> before uploading personal photos, or <Link href="/contact" className={linkClass}>contact support</Link> if you need help with an upload or result.
          </p>
          <Link
            href="#bridal-preview"
            className="shrink-0 rounded-full border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-900"
          >
            Back to the preview
          </Link>
        </div>
      </section>
    </article>
  );
}
