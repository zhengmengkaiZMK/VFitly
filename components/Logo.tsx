"use client";
import Image from "next/image";
import { Link } from "next-view-transitions";
import React from "react";
import { usePathname } from "next/navigation";

export const Logo = ({ lazy = false }: { lazy?: boolean }) => {
  const pathname = usePathname();
  const isZh = pathname.startsWith("/zh");
  const homeLink = isZh ? "/zh" : "/";

  return (
    <Link
      href={homeLink}
      className="mr-4 flex items-center px-2 py-1 relative z-20"
      aria-label="VFitly Home"
    >
      <Image
        src="/logo1.png"
        width={1947}
        height={624}
        priority={!lazy}
        loading={lazy ? "lazy" : undefined}
        className="h-8 w-auto object-contain dark:hidden" alt="VFitly，AI virtual try-on，generate try-on image and try-on video"
      />
      <Image
        src="/logo2.png"
        width={1947}
        height={624}
        priority={!lazy}
        loading={lazy ? "lazy" : undefined}
        className="hidden h-8 w-auto object-contain dark:block" alt="VFitly，AI virtual try-on，generate try-on image and try-on video"
      />
    </Link>
  );
};
