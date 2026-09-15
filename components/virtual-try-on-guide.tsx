import Link from "next/link";

const cardShell =
  "rounded-3xl border border-neutral-200 bg-white/65 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/60";

const card = `${cardShell} p-6`;

const body = "text-sm leading-6 text-neutral-600 dark:text-neutral-400";

const linkClass = "font-medium text-blue-600 underline underline-offset-4 dark:text-blue-400";

const steps = [
  {
    title: "Start with a Photo of Yourself",
    body: "Use a full-body photo taken in even light, with a simple background and a relaxed standing pose. Your outline should be easy to separate from what is behind you, and your arms should not cover the area where the garment will sit. Heavy filters, motion blur, cropped torsos and crowded backgrounds all make the result harder to judge, because you cannot tell whether an oddity came from the clothes or from the source photo. Only upload photos you own or have permission to use.",
  },
  {
    title: "Add the Clothes You Want to Try",
    body: "Upload a single garment image, or pick something you already saved in your wardrobe. A product photo, a flat-lay or a picture of the item on its own all work. Avoid collages and images where a bag, a piece of furniture or another person hides the part you care about. If the item is still on a shopping page, the product link tool can pull the garment images for you, including every colourway the retailer shows.",
  },
  {
    title: "Review and Compare the Result",
    body: "Generate the preview and look at the overall silhouette first, then check the neckline, proportions and visible details. If something looks inconsistent, try a clearer input before changing several settings at once. Keep the results you like next to the original product images so you can compare them later. A preview helps you decide what to investigate next; it does not replace measurements or a real fitting.",
  },
];

const tryOnPoints = [
  "Everyday pieces are the place to start: tops, shirts, knitwear, jeans, trousers, skirts and jackets. Change one item at a time and keep your person photo the same, so you can tell which garment made the difference.",
  "Occasion and seasonal wear often needs more thought, and that is where a preview helps most: dresses, formalwear, coats, shoes and accessories you would otherwise have to imagine from a single product shot.",
  "Variants of the same item are easy to line up when a retailer shows one piece in several colours or cuts. Generate each one against the same photo and the comparison becomes a real choice rather than a guess.",
];

export function VirtualTryOnGuide() {
  return (
    <article className="relative z-10 w-full pb-12 pt-2 md:pb-20 md:pt-4">
      <div className="mx-auto mb-12 max-w-5xl px-4 md:mb-16">
        <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800" />
      </div>

      <header className="mx-auto max-w-3xl px-4 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-500">Virtual Try On Guide</p>
        <h2 className="mt-4 text-3xl font-medium tracking-tight text-black dark:text-white md:text-5xl md:leading-tight">
          <span className="block text-balance">How Virtual Try On Works</span>
        </h2>
        <p className="mt-5 text-sm text-muted dark:text-muted-dark md:text-base">
          <span className="block text-balance">
            Virtual try on clothes shows you how a garment looks on a real person&apos;s photo before you spend money on it. Instead of guessing from a product image shot on a model, you upload a picture of yourself and an image of the garment, and AI builds a preview of the two together. The tool above runs the whole thing in your browser.
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
            <span className="block text-balance">Clothes You Can Try On</span>
          </h2>
        </div>
        <ul className={`divide-y divide-neutral-200 px-6 dark:divide-neutral-800 ${cardShell}`}>
          {tryOnPoints.map((point, index) => (
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
            <span className="block text-balance">AI Previews, Fitting Rooms, and Home Samples</span>
          </h2>
          <p className="mt-5 text-sm text-muted dark:text-muted-dark md:text-base">
            <span className="block text-balance">
              There are several ways to check how clothes look before buying, and they answer different questions. Virtual try on clothes creates a generated image from your photo and a garment image. A fitting room or an in-store appointment lets you handle the item in person. A home sample service sends a physical piece to try, subject to the retailer&apos;s availability, fees and return conditions.
            </span>
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-blue-100 bg-blue-50/60 p-6 shadow-sm backdrop-blur dark:border-blue-950/60 dark:bg-blue-950/15">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">What VFitly does</span>
            <p className={`mt-3 ${body}`}>
              VFitly provides the image-based option. It does not send clothing and it cannot confirm how a garment will fit. Use it early in your search to narrow down colours, cuts and styling directions, so you arrive at a shop or a checkout with a clearer idea of what you actually want.
            </p>
          </div>
          <div className={`flex flex-col justify-center ${card}`}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">When a real fitting wins</span>
            <p className={`mt-3 ${body}`}>
              If fabric feel, comfort, support or freedom of movement is what decides your purchase, a physical try on remains more informative. If you are still working out which styles interest you, a virtual try on is the faster way to narrow the list first.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-5xl px-4 md:mt-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-medium tracking-tight text-black dark:text-white md:text-3xl md:leading-snug">
            <span className="block text-balance">What a Preview Can—and Cannot—Show</span>
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6 shadow-sm backdrop-blur dark:border-emerald-950/60 dark:bg-emerald-950/15">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600/15 text-xs font-bold text-emerald-700 dark:text-emerald-300">✓</span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">It can show</span>
            </div>
            <p className={`mt-4 ${body}`}>
              A generated preview is good at broad visual questions. It shows an overall silhouette, how two colours sit next to each other, whether a longer hem changes the balance of an outfit, and whether a combination is worth investigating further. It gives you something concrete to look at instead of guessing.
            </p>
          </div>
          <div className="rounded-3xl border border-amber-100 bg-amber-50/60 p-6 shadow-sm backdrop-blur dark:border-amber-950/60 dark:bg-amber-950/15">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-600/15 text-xs font-bold text-amber-700 dark:text-amber-300">!</span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">It cannot show</span>
            </div>
            <p className={`mt-4 ${body}`}>
              It cannot answer fit questions. Nothing in a generated image tells you whether a waistband will feel tight after a meal, how much a fabric stretches, or how a garment behaves when you sit down or raise your arms. Lace, beading, transparent layers, fine prints and logos may be reinterpreted rather than reproduced exactly.
            </p>
          </div>
        </div>

        <div className={`mt-4 ${card}`}>
          <p className={body}>
            Treat a try-on video the same way: it is generated styling content, not evidence of how the real garment moves or drapes. Inspect the still image before making a video, because motion is not a dependable way to correct an inaccurate sleeve or pattern. Before buying, confirm measurements, materials and return conditions with the seller.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-5xl px-4 md:mt-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-medium tracking-tight text-black dark:text-white md:text-3xl md:leading-snug">
            <span className="block text-balance">Try On Clothes You Already Own</span>
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className={card}>
            <p className={body}>
              A wardrobe makes repeat try ons much faster. Save the garments you wear most, add a category, a colour and a few tags, then reuse the same item in later previews without uploading it again. Your <Link href="/dashboard/wardrobe" className={linkClass}>saved wardrobe</Link> also keeps the pieces you are considering side by side.
            </p>
          </div>
          <div className={card}>
            <p className={body}>
              Build outfits from two to four items in different categories, such as a top with trousers and a layer over it, or a dress with shoes. One item per category keeps the combination readable, and reusing the same person photo keeps the comparison honest. You can also <Link href="/dashboard/product-try-on" className={linkClass}>pull garments from a product link</Link> when the piece is still on a shopping page.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-5 rounded-3xl border border-neutral-200 bg-gradient-to-br from-white to-neutral-100 p-6 shadow-sm dark:border-neutral-800 dark:from-neutral-950 dark:to-neutral-900 md:flex-row">
          <p className={`md:max-w-2xl ${body}`}>
            Before starting another session, check <Link href="/pricing" className={linkClass}>plans and generation credits</Link>. Read our <Link href="/privacy" className={linkClass}>privacy policy</Link> before uploading personal photos, or <Link href="/contact" className={linkClass}>contact support</Link> if you need help with an upload or a result.
          </p>
          <Link
            href="#virtual-try-on"
            className="shrink-0 rounded-full border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-900"
          >
            Back to the try-on
          </Link>
        </div>
      </section>
    </article>
  );
}
