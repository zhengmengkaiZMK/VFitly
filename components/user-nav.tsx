"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { clearGuestUsage } from "@/lib/usage-tracker";

export function UserNav() {
  const { data: session, status } = useSession();
  const [membershipType, setMembershipType] = useState<string | null>(null);
  const pathname = usePathname();
  const isZh = pathname.startsWith("/zh");

  useEffect(() => {
    if (status !== "authenticated") {
      setMembershipType(null);
      return;
    }

    let isMounted = true;

    fetch("/api/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (isMounted) {
          setMembershipType(data?.user?.membershipType ?? null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setMembershipType(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [status]);

  if (status === "loading") {
    return (
      <div className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
    );
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="ghost" size="sm">
            {isZh ? "登录" : "Login"}
          </Button>
        </Link>
        <Link href="/signup">
          <Button size="sm">{isZh ? "注册" : "Sign Up"}</Button>
        </Link>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getMembershipBadge = (type?: string) => {
    switch (type) {
      case "PLUS":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
            Plus
          </span>
        );
      case "ULTRA":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
            Ultra
          </span>
        );
      case "PREMIUM":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
            {isZh ? "专业版" : "Professional"}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            {isZh ? "免费版" : "Free"}
          </span>
        );
    }
  };

  const currentMembershipType = membershipType ?? session.user.membershipType;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black">
              {getInitials(session.user.name || session.user.email)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
            <div className="pt-1">{getMembershipBadge(currentMembershipType)}</div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={isZh ? "/zh/dashboard" : "/dashboard"}>{isZh ? "仪表板" : "Dashboard"}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={isZh ? "/zh/pricing" : "/pricing"}>{isZh ? "升级会员" : "Upgrade"}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={isZh ? "/zh/settings" : "/settings"}>{isZh ? "设置" : "Settings"}</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 dark:text-red-400"
          onClick={() => {
            // 退出登录时清除游客使用记录，让用户可以重新开始
            clearGuestUsage();
            signOut({ callbackUrl: "/" });
          }}
        >
          {isZh ? "退出登录" : "Sign Out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
