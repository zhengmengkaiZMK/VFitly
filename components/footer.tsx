"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Logo } from "./Logo";
import { usePathname } from "next/navigation";

export const Footer = () => {
  const pathname = usePathname();
  const isZh = pathname.startsWith("/zh");

  const links = [
    {
      name: isZh ? "价格" : "Pricing",
      href: isZh ? "/zh/pricing" : "/pricing",
    },
    {
      name: "Blog",
      href: "/blog",
    },
    {
      name: "Docs",
      href: "/docs",
    },
    {
      name: isZh ? "联系我们" : "Contact",
      href: isZh ? "/zh/contact" : "/contact",
    },
  ];
  const legal = [
    {
      name: isZh ? "隐私政策" : "Privacy Policy",
      href: isZh ? "/zh/privacy" : "/privacy",
    },
    {
      name: isZh ? "服务条款" : "Terms of Service",
      href: isZh ? "/zh/terms" : "/terms",
    },
  ];
  return (
    <div className="relative">
      <div className="border-t border-neutral-100  dark:border-neutral-800 px-8 pt-20 pb-32 relative bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto text-sm text-neutral-500 dark:text-neutral-400 flex sm:flex-row flex-col justify-between items-start ">
          <div>
            <div className="mr-4  md:flex mb-4">
              <Logo />
            </div>
            <div>{isZh ? "版权所有" : "Copyright"} &copy; 2025 VFitly</div>
            <div className="mt-2">{isZh ? "保留所有权利" : "All rights reserved"}</div>
            <a
              href="https://www.producthunt.com/products/vfitly?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-vfitly"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex"
              aria-label="View VFitly on Product Hunt"
            >
              <Image
                
                width={250}
                height={54}
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1239982&theme=light&t=1788409534364" alt="VFitly，AI virtual try-on，generate try-on image and try-on video"
              />
            </a>
            <a
              href="https://drchecker.net/item/vfitly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex"
              aria-label="Check the VFitly domain rating on DR Checker"
            >
              <Image
                unoptimized
                width={280}
                height={64}
                src="https://drchecker.net/api/badge?domain=vfitly.com"
                alt="DR Checker - Domain Rating"
                className="h-[64px] w-auto max-w-full sm:h-[120px]"
              />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-10 items-start mt-10 md:mt-0 lg:grid-cols-3">
            <div className="flex justify-center space-y-4 flex-col mt-4">
              {links.map((link) => (
                <Link
                  key={link.name}
                  className="transition-colors hover:text-black text-muted dark:text-muted-dark dark:hover:text-neutral-400 text-xs sm:text-sm"
                  href={link.href}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex justify-center space-y-4 flex-col mt-4">
              {legal.map((link) => (
                <Link
                  key={link.name}
                  className="transition-colors hover:text-black text-muted dark:text-muted-dark dark:hover:text-neutral-400 text-xs sm:text-sm"
                  href={link.href}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex justify-center space-y-4 flex-col mt-4">
              <a
                href="https://mossai.org"
                title="MossAI Tools"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-black text-muted dark:text-muted-dark dark:hover:text-neutral-400 text-xs sm:text-sm"
              >
                MossAI Tools
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
