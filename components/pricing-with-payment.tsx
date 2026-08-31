"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { getAllPlans } from "@/constants/pricing-plans";
import { cn } from "@/lib/utils";
import { StripeCheckoutButton } from "./payment/stripe-checkout-button";

const paidPlans = getAllPlans().filter((plan) => plan.membershipType !== "FREE");
const freePlan = getAllPlans().find((plan) => plan.membershipType === "FREE")!;

export function PricingWithPayment() {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession();
  const isZh = pathname.startsWith("/zh");

  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const visiblePlans = [
    freePlan,
    ...paidPlans.filter((plan) => plan.billingCycle === billingCycle),
  ];
  const selectedPlan = selectedPlanId ? getAllPlans().find((plan) => plan.id === selectedPlanId) : null;

  return (
    <>
      <div className="relative">
        <div className="mx-auto mb-12 flex w-fit items-center overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800">
          {[
            { label: isZh ? "月付" : "Monthly", value: "MONTHLY" as const },
            { label: isZh ? "年付" : "Yearly", value: "YEARLY" as const },
          ].map((tab) => (
            <button
              key={tab.value}
              className={cn(
                "relative rounded-md p-4 text-sm font-medium",
                billingCycle === tab.value ? "text-white dark:text-black" : "text-gray-500 dark:text-muted-dark",
              )}
              onClick={() => setBillingCycle(tab.value)}
            >
              {billingCycle === tab.value && (
                <motion.span
                  layoutId="pricing-cycle"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  className="absolute inset-0 bg-black dark:bg-white"
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          {visiblePlans.map((plan) => {
            const featured = plan.tier === "PLUS";
            const isFree = plan.membershipType === "FREE";
            const originalYearly = plan.billingCycle === "YEARLY" && !isFree ? Math.round((plan.amount / 0.8) * 10) / 10 : null;

            return (
              <div
                key={plan.id}
                className={cn(
                  featured
                    ? "relative bg-[radial-gradient(164.75%_100%_at_50%_0%,#334155_0%,#0F172A_48.73%)] shadow-2xl"
                    : "bg-white dark:bg-black",
                  "flex h-full flex-col justify-between rounded-2xl px-6 py-8 sm:mx-8 md:mx-0",
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className={cn(featured ? "text-white" : "text-muted dark:text-muted-dark", "text-base font-semibold leading-7")}>
                      {isZh ? plan.nameZh : plan.name.replace(` ${plan.billingCycle === "MONTHLY" ? "Monthly" : "Yearly"}`, "")}
                    </h3>
                    {plan.tier === "ULTRA" ? (
                      <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">Ultra</span>
                    ) : null}
                  </div>

                  <p className="mt-4">
                    <motion.span
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      key={plan.id}
                      className={cn("inline-block text-4xl font-bold tracking-tight", featured ? "text-white" : "text-neutral-900 dark:text-neutral-200")}
                    >
                      {isFree ? (isZh ? "免费" : "Free") : plan.billingCycle === "MONTHLY" ? `$${plan.amount}/mo` : `$${plan.amount}/yr`}
                    </motion.span>
                    {originalYearly ? (
                      <span className={cn("ml-2 text-sm line-through", featured ? "text-neutral-400" : "text-neutral-500")}>${originalYearly}/yr</span>
                    ) : null}
                  </p>

                  <p className={cn(featured ? "text-neutral-300" : "text-neutral-600 dark:text-neutral-300", "mt-6 min-h-12 text-sm leading-7")}>
                    {isFree
                      ? isZh
                        ? "适合首次体验 AI 试衣和商品链接解析。"
                        : "Start exploring AI try-on and product-link preview."
                      : isZh
                        ? `${plan.monthlyCredits} 积分/月，${plan.billingCycle === "YEARLY" ? "年付按月发放积分。" : "每月重置。"}`
                        : `${plan.monthlyCredits} credits/month. ${plan.billingCycle === "YEARLY" ? "Credits are granted monthly." : "Credits reset monthly."}`}
                  </p>

                  <ul role="list" className={cn(featured ? "text-neutral-300" : "text-neutral-600 dark:text-neutral-300", "mt-8 space-y-3 text-sm leading-6 sm:mt-10")}>
                    {(isZh ? plan.featuresZh : plan.features).map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <IconCircleCheckFilled className={cn(featured ? "text-white" : "text-muted dark:text-muted-dark", "h-6 w-5 flex-none")} aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    if (!isFree) {
                      setSelectedPlanId(plan.id);
                      return;
                    }

                    router.push(status === "authenticated" ? "/dashboard" : "/login");
                  }}
                  disabled={isFree && status === "loading"}
                  className={cn(
                    featured
                      ? "bg-white text-black shadow-sm hover:bg-white/90 focus-visible:outline-white"
                      : "border border-transparent bg-neutral-900 text-white hover:bg-black/90",
                    "relative z-10 mt-8 block w-full items-center justify-center rounded-full px-3.5 py-2.5 text-center text-sm font-semibold shadow-[0px_-1px_0px_0px_#FFFFFF40_inset,_0px_1px_0px_0px_#FFFFFF40_inset] transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10 md:text-sm",
                  )}
                >
                  {isFree ? (isZh ? "开始使用" : "Get Started") : isZh ? "立即订阅" : "Subscribe Now"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedPlan ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setSelectedPlanId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelectedPlanId(null)} className="absolute right-4 top-4 text-neutral-400 transition hover:text-neutral-600 dark:hover:text-neutral-200">
                <X className="h-5 w-5" />
              </button>

              <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">{isZh ? "完成支付" : "Complete Payment"}</h2>
              <p className="mb-6 text-neutral-600 dark:text-neutral-400">
                {isZh ? `您选择了 ${selectedPlan.nameZh}` : `You selected the ${selectedPlan.name}`}
              </p>

              <div className="mb-6 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-800">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">{isZh ? "方案" : "Plan"}</span>
                  <span className="font-semibold text-black dark:text-white">{isZh ? selectedPlan.nameZh : selectedPlan.name}</span>
                </div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">{isZh ? "月度积分" : "Monthly credits"}</span>
                  <span className="font-semibold text-black dark:text-white">{selectedPlan.monthlyCredits}</span>
                </div>
                <div className="flex items-center justify-between border-t border-neutral-200 pt-2 dark:border-neutral-700">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">{isZh ? "总计" : "Total"}</span>
                  <span className="text-xl font-bold text-black dark:text-white">${selectedPlan.amount}</span>
                </div>
              </div>

              <StripeCheckoutButton
                planId={selectedPlan.id}
                onError={(error) => console.error("Payment error:", error)}
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
