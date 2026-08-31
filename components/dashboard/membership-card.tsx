"use client";

import { usePathname } from "next/navigation";
import { Crown, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../button";
import { PRICING_PLANS } from "@/constants/pricing-plans";
import type { BillingCycle, PlanTier } from "@/types/payment";

interface DashboardPlan {
  id: string;
  name: string;
  nameZh: string;
  tier: PlanTier;
  billingCycle: BillingCycle;
  amount: number;
  currency: string;
  monthlyCredits: number;
  features: string[];
  featuresZh: string[];
}

interface MembershipCardProps {
  membershipType: string;
  expiresAt: string | null;
  plan?: DashboardPlan | null;
}

export function MembershipCard({
  membershipType,
  expiresAt,
  plan,
}: MembershipCardProps) {
  const pathname = usePathname();
  const isZh = pathname.startsWith("/zh");
  const fallbackPlan = getFallbackPlan(membershipType);
  const currentPlan = plan ?? fallbackPlan;
  const isFree = currentPlan.tier === "FREE";
  const features = isZh ? currentPlan.featuresZh : currentPlan.features;
  const pricingHref = isZh ? "/zh/pricing" : "/pricing";

  const billingLabel = isZh
    ? currentPlan.billingCycle === "YEARLY"
      ? "年付"
      : "月付"
    : currentPlan.billingCycle === "YEARLY"
    ? "Yearly"
    : "Monthly";

  const priceLabel = currentPlan.amount === 0
    ? isZh
      ? "免费"
      : "Free"
    : `$${currentPlan.amount}/${currentPlan.billingCycle === "YEARLY" ? "year" : "month"}`;

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="rounded-lg bg-yellow-100 p-2 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
          <Crown className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
            {isZh ? "当前套餐" : "Current Plan"}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-black dark:text-white">
            {isZh ? currentPlan.nameZh : currentPlan.name}
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {priceLabel} · {billingLabel} · {currentPlan.monthlyCredits.toLocaleString()} {isZh ? "credits / 月" : "credits / month"}
          </p>
        </div>
      </div>

      <div className="mb-4 rounded-lg bg-neutral-50 p-3 text-sm dark:bg-neutral-800/60">
        <div className="flex items-center justify-between gap-3">
          <span className="text-neutral-600 dark:text-neutral-300">{isZh ? "套餐等级" : "Plan Tier"}</span>
          <span className="font-semibold text-black dark:text-white">{currentPlan.tier}</span>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <p className="text-sm font-medium text-black dark:text-white">
          {isZh ? "会员权益与功能" : "Benefits & Features"}
        </p>
        {features.map((feature) => (
          <BenefitItem key={feature} text={feature} />
        ))}
      </div>

      {expiresAt && !isFree ? (
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <Calendar className="h-4 w-4" />
          <span>
            {isZh ? "到期时间：" : "Expires: "}
            {new Date(expiresAt).toLocaleDateString(isZh ? "zh-CN" : "en-US")}
          </span>
        </div>
      ) : isFree ? (
        <Link href={pricingHref} className="block">
          <Button className="w-full" size="sm">
            {isZh ? "升级会员" : "Upgrade Now"}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      ) : null}
    </div>
  );
}

function getFallbackPlan(membershipType: string) {
  if (membershipType === "PLUS") return PRICING_PLANS.PLUS_MONTHLY;
  if (membershipType === "ULTRA") return PRICING_PLANS.ULTRA_MONTHLY;
  return PRICING_PLANS.FREE;
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
      <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
      <span>{text}</span>
    </div>
  );
}
