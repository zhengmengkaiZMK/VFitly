"use client";

import React from "react";
import Balancer from "react-wrap-balancer";
import Link from "next/link";
import { Button } from "./button";

const faqs = [
  {
    question: "How can I try on wedding dresses at home with AI?",
    answer:
      "Upload a clear photo of yourself and an image of a wedding dress to generate a virtual bridal preview. Compare dress ideas and save your favorite looks before booking an in-person fitting.",
  },
  {
    question: "Does an AI wedding dress preview replace a real fitting?",
    answer:
      "No. VFitly creates AI visual previews, not measurements or fit guarantees. It does not ship dresses to your home. Check sizing, fabric, comfort and alterations with a bridal retailer or tailor.",
  },
  {
    question: "Can I generate videos to view an outfit from different angles?",
    answer:
      "Yes. The platform supports dynamic outfit showcase videos, helping you view the try-on result in motion and better understand the overall styling effect from multiple angles.",
  },
  {
    question: "How do you protect my personal information and photos?",
    answer:
      "We treat privacy seriously. Uploaded photos are used only to generate your requested try-on results, and we recommend avoiding sensitive images. Account and payment processes are handled through secure service providers.",
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer:
      "Yes. If you subscribe to a paid plan, you can cancel it at any time from your account or billing settings. Your access will remain available until the end of the current billing period.",
  },
  {
    question: "What should I do if the try-on result does not look accurate?",
    answer:
      "For better results, use clear, front-facing photos with good lighting and clothing images where the garment is easy to see. You can try another photo or outfit image to improve the final preview.",
  },
  {
    question: "How can I report a problem or send feedback?",
    answer:
      "If you run into an issue or have suggestions, please contact us through the support or feedback channel on the website. Sharing screenshots and a short description helps us respond faster.",
  },
];

export const CTA = () => {
  return (
    <>
      <section className="relative z-30 w-full overflow-hidden bg-white px-6 py-16 dark:bg-black md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-[-0.015em] text-neutral-950 dark:text-white md:text-5xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-10 divide-y divide-neutral-200 rounded-3xl border border-neutral-200 bg-neutral-50 px-5 dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900/70">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-base font-semibold text-neutral-950 marker:hidden dark:text-white">
                  <span>{faq.question}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-lg leading-none text-neutral-500 transition group-open:rotate-45 dark:border-neutral-700 dark:text-neutral-300">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-60 w-full overflow-hidden relative z-30">
      <div className="bg-white dark:bg-black">
        <div className="mx-auto w-full relative z-20 sm:max-w-[40rem] md:max-w-[48rem] lg:max-w-[64rem] xl:max-w-[80rem] bg-gradient-to-br from-slate-800 dark:from-neutral-900 to-gray-900 sm:rounded-2xl">
          <div className="relative -mx-6 sm:mx-0 sm:rounded-2xl overflow-hidden px-6 md:px-8">
            <div
              className="absolute inset-0 w-full h-full opacity-10 bg-noise fade-vignette [mask-image:radial-gradient(#fff,transparent,75%)]"
              style={{
                backgroundImage: "url(/noise.webp)",
                backgroundSize: "30%",
              }}
            />

            <div className="relative px-6 pb-14 pt-20 sm:px-10 sm:pb-20 lg:px-[4.5rem]">
              <h2 className="text-center text-balance mx-auto text-3xl md:text-5xl font-semibold tracking-[-0.015em] text-white">
                Ready to try on wedding dresses at home?
              </h2>
              <p className="mt-4 max-w-[30rem] text-center mx-auto text-base/6 text-neutral-200">
                <Balancer>
                  Start with your dream wedding dress, or explore an evening outfit, a workday look or a casual favorite. Upload your photo and a clothing image to preview your style and save the looks you love.
                </Balancer>
              </p>

              <div className="relative z-10 mx-auto flex justify-center mt-6">
                <Link href="/dashboard/try-on">
                  <Button>Create your workspace</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};
