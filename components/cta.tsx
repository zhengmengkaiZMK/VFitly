"use client";

import React from "react";
import Balancer from "react-wrap-balancer";
import Link from "next/link";
import { Button } from "./button";

import { bridalFaqs as faqs } from "@/lib/bridal-content";

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
                Start Exploring Your Bridal Look
              </h2>
              <p className="mt-4 max-w-[30rem] text-center mx-auto text-base/6 text-neutral-200">
                <Balancer>
                  Begin with a clear photo and one gown you want to explore. Compare your preview with the original dress image, then keep your favorite ideas for your next bridal appointment.
                </Balancer>
              </p>

              <div className="relative z-10 mx-auto flex justify-center mt-6">
                <Link href="#bridal-preview">
                  <Button>Start your bridal preview</Button>
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
