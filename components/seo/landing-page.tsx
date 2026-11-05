import Link from "next/link";
import { Button } from "@/components/button";
import { FaqList } from "@/components/faq-list";
import { SITE_NAME } from "@/lib/seo";
import type { LandingPageContent } from "@/lib/seo-landings/types";

// 所有 SEO 落地页共用的服务端模板。纯静态渲染，不依赖登录态，
// 保证搜索引擎未登录也能抓到完整的产品说明（避免登录墙后的空页面）。

function SectionTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="mt-16 text-2xl font-semibold tracking-[-0.015em] text-neutral-950 dark:text-white md:text-3xl"
    >
      {children}
    </h2>
  );
}

export function LandingPage({ content }: { content: LandingPageContent }) {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.10),transparent_35%),radial-gradient(circle_at_80%_10%,_rgba(168,85,247,0.08),transparent_30%)]" />
      <div className="mx-auto w-full max-w-4xl px-6 pb-24 pt-28 md:pt-36">
        {/* 面包屑 */}
        <nav aria-label="Breadcrumb" className="text-sm text-neutral-500 dark:text-neutral-400">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-neutral-800 dark:hover:text-neutral-200">
                {SITE_NAME}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-neutral-800 dark:text-neutral-200">
              {content.breadcrumb}
            </li>
          </ol>
        </nav>

        {/* H1 + 直接答案（GEO 可引用块） */}
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white md:text-5xl">
          {content.h1}
        </h1>
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/70">
          <p className="text-base leading-7 text-neutral-700 dark:text-neutral-200">{content.answer}</p>
        </div>
        <p className="mt-6 text-base leading-7 text-neutral-600 dark:text-neutral-300">{content.intro}</p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link href={content.ctaHref}>
            <Button>{content.ctaLabel}</Button>
          </Link>
          <Link
            href="/pricing"
            className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-900"
          >
            See pricing and free credits
          </Link>
        </div>

        {/* How It Works */}
        <SectionTitle id="how-it-works">How It Works</SectionTitle>
        <ol className="mt-6 grid gap-4 md:grid-cols-2">
          {content.howItWorks.map((step, index) => (
            <li
              key={step.title}
              className="rounded-2xl border border-neutral-200 bg-white/70 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white dark:bg-white dark:text-neutral-900">
                  {index + 1}
                </span>
                <h3 className="font-semibold text-neutral-950 dark:text-white">{step.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{step.description}</p>
            </li>
          ))}
        </ol>

        {/* What You Can Try */}
        <SectionTitle>What You Can Try</SectionTitle>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {content.whatYouCanTry.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-neutral-200 bg-white/70 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60"
            >
              <h3 className="font-semibold text-neutral-950 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Supported Inputs */}
        <SectionTitle>Supported Inputs</SectionTitle>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {content.supportedInputs.map((input) => (
            <li
              key={input}
              className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white/70 px-4 py-3 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-300"
            >
              <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-500" />
              {input}
            </li>
          ))}
        </ul>

        {/* Tips for Better Results */}
        <SectionTitle>Tips for Better Results</SectionTitle>
        <ul className="mt-6 space-y-3">
          {content.tips.map((tip) => (
            <li key={tip} className="flex items-start gap-3 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-500" />
              {tip}
            </li>
          ))}
        </ul>

        {/* What the Result Can and Cannot Show */}
        <SectionTitle>What the Result Can and Cannot Show</SectionTitle>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white/70 p-6 dark:border-neutral-800 dark:bg-neutral-900/60">
            <h3 className="font-semibold text-neutral-950 dark:text-white">What it can show</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {content.canShow.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white/70 p-6 dark:border-neutral-800 dark:bg-neutral-900/60">
            <h3 className="font-semibold text-neutral-950 dark:text-white">What it cannot do</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {content.cannotShow.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Privacy and Pricing */}
        <SectionTitle>Privacy and Image Handling</SectionTitle>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-600 dark:text-neutral-300">{content.privacy}</p>

        <SectionTitle>Free Credits and Pricing</SectionTitle>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-600 dark:text-neutral-300">{content.pricing}</p>

        {/* FAQ */}
        <FaqList items={content.faqs} />

        {/* 相关页面内链 */}
        <section className="mt-16">
          <h2 className="text-xl font-semibold tracking-[-0.015em] text-neutral-950 dark:text-white">Related pages</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {content.related.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group rounded-2xl border border-neutral-200 bg-white/70 p-5 transition hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-600"
              >
                <span className="font-semibold text-neutral-900 group-hover:underline dark:text-white">{link.label}</span>
                <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{link.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
