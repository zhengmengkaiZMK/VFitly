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
      title: "AI bridal try-on",
      description: "Try on wedding dresses at home with AI previews created from your photo and a dress image. Explore the look, not a guaranteed fit.",
      icon: <IconSparkles />,
    },
    {
      title: "Your bridal wardrobe",
      description: "Organize wedding dress images alongside your everyday clothes and accessories in one visual library.",
      icon: <IconHanger />,
    },
    {
      title: "Start with your photo",
      description: "Use a clear, well-lit photo and a dress image to explore bridal looks before visiting a boutique.",
      icon: <IconCamera />,
    },
    {
      title: "Organize bridal styles",
      description: "Use categories, colors and tags to find and revisit the dress ideas you want to compare.",
      icon: <IconPalette />,
    },
    {
      title: "User accounts",
      description: "Keep every wardrobe and generated result isolated by logged-in user inside the SaaS dashboard.",
      icon: <IconShieldLock />,
    },
    {
      title: "Bridal look videos",
      description: "Turn a generated wedding dress preview into an AI video to explore your bridal look in motion.",
      icon: <IconRotate360 />,
    },
    {
      title: "Save your bridal shortlist",
      description: "Download your favorite AI dress previews to discuss styling ideas with friends or your bridal consultant.",
      icon: <IconDownload />,
    },
    {
      title: "Revisit dress ideas",
      description: "Keep your source dress images and generated previews in your try-on history as you explore different bridal styles.",
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
