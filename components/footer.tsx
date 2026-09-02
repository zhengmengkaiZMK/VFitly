"use client";
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
          </div>
          <div className="grid grid-cols-2 gap-10 items-start mt-10 md:mt-0">
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
          </div>
        </div>
      </div>
    </div>
  );
};
