type FAQItem = {
  question: string;
  answer: string;
};

export function FaqList({ items, title = "Frequently Asked Questions" }: { items: FAQItem[]; title?: string }) {
  return (
    <section className="mx-auto mt-16 w-full max-w-4xl">
      <h2 className="text-center text-2xl font-semibold tracking-[-0.015em] text-neutral-950 dark:text-white md:text-3xl">{title}</h2>
      <div className="mt-8 divide-y divide-neutral-200 rounded-3xl border border-neutral-200 bg-neutral-50 px-5 dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900/70">
        {items.map((item) => (
          <details key={item.question} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-base font-semibold text-neutral-950 marker:hidden dark:text-white">
              <span>{item.question}</span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-lg leading-none text-neutral-500 transition group-open:rotate-45 dark:border-neutral-700 dark:text-neutral-300">
                +
              </span>
            </summary>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
