"use client";

import { usePathname } from "next/navigation";
import { User, Mail, Calendar, Coins, Video } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UsageSummary {
  total: number;
  used: number;
  remaining: number;
}

interface UserInfoCardProps {
  user: {
    name: string;
    email: string;
    membershipType: string;
    avatar: string | null;
    memberSince: string;
  };
  credits?: UsageSummary | null;
  walkVideoQuota?: UsageSummary | null;
}

export function UserInfoCard({ user, credits, walkVideoQuota }: UserInfoCardProps) {
  const pathname = usePathname();
  const isZh = pathname.startsWith("/zh");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isZh
      ? date.toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black text-lg">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-black dark:text-white">
            {user.name}
          </h3>
          <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
            {user.email}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <User className="h-4 w-4 text-neutral-400" />
          <span className="text-neutral-600 dark:text-neutral-300">
            {isZh ? "会员类型" : "Membership"}
          </span>
          <span className="ml-auto font-medium text-black dark:text-white">
            {getMembershipLabel(user.membershipType, isZh)}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Mail className="h-4 w-4 text-neutral-400" />
          <span className="text-neutral-600 dark:text-neutral-300">
            {isZh ? "邮箱" : "Email"}
          </span>
          <span className="ml-auto font-medium text-black dark:text-white truncate max-w-[180px]">
            {user.email}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Calendar className="h-4 w-4 text-neutral-400" />
          <span className="text-neutral-600 dark:text-neutral-300">
            {isZh ? "加入时间" : "Member Since"}
          </span>
          <span className="ml-auto font-medium text-black dark:text-white">
            {formatDate(user.memberSince)}
          </span>
        </div>
      </div>

      {credits && (
        <div className="mt-6 border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-black dark:text-white">
            <Coins className="h-4 w-4 text-blue-500" />
            {isZh ? "Credits 使用情况" : "Credits Summary"}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <UsageStat label={isZh ? "总额" : "Total"} value={credits.total} />
            <UsageStat label={isZh ? "已用" : "Used"} value={credits.used} />
            <UsageStat label={isZh ? "剩余" : "Left"} value={credits.remaining} />
          </div>
        </div>
      )}

      {walkVideoQuota && (
        <div className="mt-4 border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-black dark:text-white">
            <Video className="h-4 w-4 text-purple-500" />
            {isZh ? "视频生成次数" : "Video Generations"}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <UsageStat label={isZh ? "总次数" : "Total"} value={walkVideoQuota.total} />
            <UsageStat label={isZh ? "已用" : "Used"} value={walkVideoQuota.used} />
            <UsageStat label={isZh ? "剩余" : "Left"} value={walkVideoQuota.remaining} />
          </div>
        </div>
      )}
    </div>
  );
}

function UsageStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-neutral-50 px-2 py-3 dark:bg-neutral-800/60">
      <div className="text-base font-semibold text-black dark:text-white">{value.toLocaleString()}</div>
      <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{label}</div>
    </div>
  );
}

function getMembershipLabel(type: string, isZh: boolean): string {
  switch (type) {
    case "PLUS":
      return isZh ? "Plus 版" : "Plus";
    case "ULTRA":
      return isZh ? "Ultra 版" : "Ultra";
    case "PREMIUM":
      return isZh ? "专业版" : "Professional";
    default:
      return isZh ? "免费版" : "Free";
  }
}
