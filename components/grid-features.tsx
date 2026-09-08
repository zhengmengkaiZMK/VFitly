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
      title: "AI wedding dress try-on",
      description: "Try on wedding dresses at home with AI previews created from your photo and a dress image. Explore the look, not a guaranteed fit.",
      icon: <IconSparkles />,
    },
    {
      title: "One wardrobe, every occasion",
      description: "Keep wedding dress ideas, everyday clothes, occasion wear and accessories together in one visual library.",
      icon: <IconHanger />,
    },
    {
      title: "Try outfits on your photo",
      description: "Upload a clear, well-lit photo and a clothing image to preview anything from a bridal gown to a casual jacket.",
      icon: <IconCamera />,
    },
    {
      title: "Organize your personal style",
      description: "Use categories, colors and tags to revisit bridal favorites, plan workwear or find ideas for your next night out.",
      icon: <IconPalette />,
    },
    {
      title: "User accounts",
      description: "Keep every wardrobe and generated result isolated by logged-in user inside the SaaS dashboard.",
      icon: <IconShieldLock />,
    },
    {
      title: "See your look in motion",
      description: "Turn a generated outfit preview into an AI video, whether you are exploring a wedding dress, evening look or everyday outfit.",
      icon: <IconRotate360 />,
    },
    {
      title: "Save and share your favorites",
      description: "Download AI outfit previews to share styling ideas with friends, plan your wardrobe or bring a bridal shortlist to a fitting.",
      icon: <IconDownload />,
    },
    {
      title: "Revisit every outfit idea",
      description: "Find your source clothing images and generated previews in your try-on history, from wedding dress inspiration to everyday styling.",
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
