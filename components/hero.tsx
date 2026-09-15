"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./button";

export const Hero = () => {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden pb-12 pt-24 md:pt-40 relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(168,85,247,0.16),transparent_30%)]" />
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeOut", duration: 0.5 }}
        className="mx-auto mb-6 rounded-full border border-neutral-200 bg-white/70 px-4 py-2 text-sm text-neutral-600 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-300"
      >
        AI Virtual Try On — Clothes, Dresses, Shoes & Everyday Wear
      </motion.div>

      <h1
        className="relative z-10 mx-auto mt-6 max-w-6xl text-center text-3xl font-semibold tracking-tight md:text-5xl lg:text-7xl"
      >
        <span className="block text-balance">
          Virtual try on clothes with AI
        </span>
      </h1>

      <motion.p
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeOut", duration: 0.5, delay: 0.15 }}
        className="relative z-10 mx-auto mt-6 max-w-3xl text-center text-base text-muted dark:text-muted-dark md:text-xl"
      >
        <span className="block text-balance">
          See how a top, dress, jacket or pair of shoes looks on your own photo before you buy it. Upload one clear picture of yourself and a garment image, generate a preview, and compare the styles you are deciding between. This is a visual preview, not a size or fit guarantee.
        </span>
      </motion.p>

      <motion.div
        initial={{ y: 32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeOut", duration: 0.5, delay: 0.3 }}
        className="relative z-10 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
      >
        <Link href="#virtual-try-on">
          <Button>Start your virtual try on</Button>
        </Link>
        <Link
          href="/dashboard/try-on"
          className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-900"
        >
          Open try-on studio
        </Link>
      </motion.div>

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeOut", duration: 0.5, delay: 0.4 }}
        className="relative z-10 mx-auto mt-12 w-full max-w-5xl px-4"
      >
        <div className="rounded-[2rem] border border-neutral-200 bg-gradient-to-br from-white to-neutral-100 p-2 shadow-2xl shadow-neutral-200/70 dark:border-neutral-800 dark:from-neutral-950 dark:to-neutral-900 dark:shadow-black/40">
          <div className="pointer-events-none absolute inset-4 rounded-[2rem] ring-1 ring-inset ring-white/70 dark:ring-white/10" />
          <div className="overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-black dark:border-neutral-800">
            <video
              className="h-auto max-h-[70vh] w-full object-contain"
              src="/product-demo.mp4"
              controls
              playsInline
              preload="metadata"
            />
          </div>
        </div>
      </motion.div>

      <h2 className="relative z-10 mx-auto mt-14 px-4 text-center text-2xl font-semibold tracking-tight text-black dark:text-white md:text-3xl">
        What You Can Do with VFitly
      </h2>
      <motion.div
        initial={{ y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeOut", duration: 0.5, delay: 0.45 }}
        className="relative z-10 mx-auto mt-6 grid w-full max-w-5xl grid-cols-1 gap-4 px-4 md:grid-cols-3"
      >
        {[
          ["Try On Any Garment", "Apply a top, dress, jacket or pair of shoes to your own photo and compare the result."],
          ["Save Clothes to Reuse", "Keep garment images in a wardrobe so you can bring them back into later try-ons."],
          ["See the Look in Motion", "Turn a try-on image into a short video to watch how the outfit reads as it moves."],
        ].map(([title, description]) => (
          <div key={title} className="rounded-3xl border border-neutral-200 bg-white/65 p-6 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/60">
            <h3 className="font-semibold text-black dark:text-white">{title}</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
