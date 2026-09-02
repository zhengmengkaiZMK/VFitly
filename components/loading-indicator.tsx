"use client";

import { useEffect, useState } from "react";
import { IconSparkles } from "@tabler/icons-react";

type LoadingIndicatorProps = {
  title: string;
  description?: string;
  tone?: "blue" | "purple" | "cyan";
  className?: string;
  showProgress?: boolean;
};

const toneClassNames = {
  blue: "text-blue-500 border-blue-100 bg-blue-50/40 dark:border-blue-950/60 dark:bg-blue-950/10",
  purple: "text-purple-500 border-purple-100 bg-purple-50/40 dark:border-purple-950/60 dark:bg-purple-950/10",
  cyan: "text-cyan-500 border-cyan-100 bg-cyan-50/40 dark:border-cyan-950/60 dark:bg-cyan-950/10",
};

export function LoadingIndicator({ title, description, tone = "blue", className = "min-h-[320px]", showProgress = true }: LoadingIndicatorProps) {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (!showProgress) return;

    setProgress(1);
    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      const elapsedSeconds = (Date.now() - startedAt) / 1000;
      const nextProgress = Math.min(95, Math.max(1, Math.round(100 * (1 - Math.exp(-elapsedSeconds / 18)))));
      setProgress((current) => Math.max(current, nextProgress));
    }, 800);

    return () => window.clearInterval(interval);
  }, [showProgress]);

  return (
    <div className={`flex ${className} flex-col items-center justify-center rounded-3xl border border-dashed text-center ${toneClassNames[tone]}`}>
      <div className="relative mb-3 flex h-16 w-16 items-center justify-center">
        <span className="absolute h-full w-full animate-ping rounded-full bg-current opacity-20" />
        <span className="absolute h-full w-full animate-pulse rounded-full bg-current opacity-10" />
        <IconSparkles className="relative h-10 w-10 animate-pulse" />
      </div>
      {showProgress ? (
        <div className="mb-4 text-2xl font-bold tabular-nums text-black dark:text-white" aria-live="polite">
          {progress}%
        </div>
      ) : null}
      <h3 className="text-lg font-semibold text-black dark:text-white">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm text-neutral-500">{description}</p> : null}
    </div>
  );
}
