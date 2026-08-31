"use client";
import { DesktopNavbar } from "./desktop-navbar";
import { MobileNavbar } from "./mobile-navbar";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface NavBarProps {
  navItems?: { title: string; link: string }[];
}

export function NavBar({ navItems: customNavItems }: NavBarProps = {}) {
  const pathname = usePathname();
  const isZh = pathname.startsWith("/zh");

  const defaultNavItems = [
    {
      title: isZh ? "AI 试衣" : "AI Try-On",
      link: isZh ? "/zh/dashboard" : "/dashboard/try-on",
    },
    {
      title: isZh ? "商品试衣" : "Product Try-On",
      link: isZh ? "/zh/dashboard" : "/dashboard/product-try-on",
    },
    {
      title: isZh ? "衣橱" : "Wardrobe",
      link: isZh ? "/zh/dashboard" : "/dashboard/wardrobe",
    },
    {
      title: isZh ? "价格" : "Pricing",
      link: isZh ? "/zh/pricing" : "/pricing",
    },
    {
      title: isZh ? "联系我们" : "Contact",
      link: isZh ? "/zh/contact" : "/contact",
    },
  ];

  const navItems = customNavItems || defaultNavItems;

  return (
    <motion.nav
      initial={{
        y: -80,
      }}
      animate={{
        y: 0,
      }}
      transition={{
        ease: [0.6, 0.05, 0.1, 0.9],
        duration: 0.8,
      }}
      className="max-w-7xl  fixed top-4  mx-auto inset-x-0 z-50 w-[95%] lg:w-full"
    >
      <div className="hidden lg:block w-full">
        <DesktopNavbar navItems={navItems} />
      </div>
      <div className="flex h-full w-full items-center lg:hidden ">
        <MobileNavbar navItems={navItems} />
      </div>
    </motion.nav>
  );
}
