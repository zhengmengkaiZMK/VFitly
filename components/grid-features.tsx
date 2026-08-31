"use client";

import { cn } from "@/lib/utils";
import {
  IconCamera,
  IconHanger,
  IconSparkles,
  IconPalette,
  IconShieldLock,
  IconRotate360,
  IconDownload,
  IconHistory,
} from "@tabler/icons-react";

export const GridFeatures = () => {
  const features = [
    {
      title: "Realistic AI try-on",
      description: "Generate fitting visuals from a person image and a selected garment while preserving pose, light and body shape.",
      icon: <IconSparkles />,
    },
    {
      title: "Wardrobe management",
      description: "Upload, classify and manage tops, dresses, outerwear, shoes and accessories in one visual library.",
      icon: <IconHanger />,
    },
    {
      title: "Image-first workflow",
      description: "Save upload assets and generated looks with a workflow designed for fashion ecommerce and creators.",
      icon: <IconCamera />,
    },
    {
      title: "Style metadata",
      description: "Track categories, colors and tags so garments are easy to find and reuse across try-on sessions.",
      icon: <IconPalette />,
    },
    {
      title: "User accounts",
      description: "Keep every wardrobe and generated result isolated by logged-in user inside the SaaS dashboard.",
      icon: <IconShieldLock />,
    },
    {
      title: "360° Outfit Video",
      description: "Generate dynamic try-on videos and view the outfit from every angle with a 360° showcase effect.",
      icon: <IconRotate360 />,
    },
    {
      title: "Download results",
      description: "Preview generated try-on images and download finished visuals for campaigns, listings or social posts.",
      icon: <IconDownload />,
    },
    {
      title: "Generation history",
      description: "Keep a record of try-on jobs, prompts, source garments and generated outputs for future iteration.",
      icon: <IconHistory />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
};

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover:opacity-100 transition duration-200 group absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover:opacity-100 transition duration-200 group absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10">{icon}</div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover:bg-blue-500 transition duration-200" />
        <span className="group-hover:translate-x-2 transition duration-200 inline-block">
          {title}
        </span>
      </div>
      <p className="text-sm text-muted dark:text-muted-dark max-w-xs mx-auto relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
