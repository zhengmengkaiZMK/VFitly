"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CreditCard, Crown, Loader2, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";

import { getPlanById } from "@/constants/pricing-plans";

type BillingData = {
  user: {
    membershipType: string;
    subscriptionStatus?: string | null;
    currentPeriodStart?: string | null;
    currentPeriodEnd?: string | null;
  };
  credits: {
    balance: number;
    monthlyAllowance: number;
    currentCycle: string;
    resetAt: string;
  };
  plan?: {
    id: string;
    name: string;
    nameZh: string;
    tier: string;
    billingCycle: "MONTHLY" | "YEARLY";
    amount: number;
    currency: string;
    monthlyCredits: number;
    features?: string[];
  } | null;
};

export default function BillingPage() {
  const [data, setData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/me")
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Failed to load billing data.");
        return payload;
      })
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load billing data."))
      .finally(() => setLoading(false));
  }, []);

  const plan = useMemo(() => {
    if (data?.plan) return data.plan;
    if (!data?.user.membershipType || data.user.membershipType === "FREE") return getPlanById("FREE");
    return getPlanById(`${data.user.membershipType}_MONTHLY`) || getPlanById("FREE");
  }, [data]);

  async function openPortal() {
    setPortalLoading(true);
    setError("");

    try {
      const response = await fetch("/api/stripe/create-portal-session", { method: "POST" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Failed to open billing portal.");
      window.location.href = payload.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open billing portal.");
      setPortalLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 px-4 py-16 dark:bg-neutral-950">
        <div className="mx-auto flex max-w-5xl items-center justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-neutral-500" />
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-neutral-50 px-4 py-16 dark:bg-neutral-950">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900/60 dark:bg-neutral-900">
          <h1 className="text-2xl font-bold text-neutral-950 dark:text-white">Billing unavailable</h1>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400">{error}</p>
          <Link href="/dashboard" className="mt-6 inline-flex rounded-full bg-black px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-black">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = data?.user.membershipType && data.user.membershipType !== "FREE";
  const periodEnd = data?.user.currentPeriodEnd ? new Date(data.user.currentPeriodEnd).toLocaleDateString() : null;
  const resetAt = data?.credits.resetAt ? new Date(data.credits.resetAt).toLocaleDateString() : null;

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-12 dark:bg-neutral-950">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              <CreditCard className="mr-2 h-4 w-4" /> Subscription & credits
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">Billing</h1>
            <p className="mt-3 max-w-2xl text-neutral-600 dark:text-neutral-400">
              Manage your AI Try-On subscription, payment method, renewal, and monthly credits.
            </p>
          </div>
          <Link href="/pricing" className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800">
            View plans <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 lg:col-span-2">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  <Crown className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">{plan?.name || data?.user.membershipType || "Free"}</h2>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                  Status: <span className="font-medium text-neutral-950 dark:text-white">{data?.user.subscriptionStatus || (isPaid ? "active" : "free")}</span>
                </p>
                {periodEnd && (
                  <p className="mt-1 text-neutral-600 dark:text-neutral-400">Current period ends on {periodEnd}</p>
                )}
              </div>

              {isPaid ? (
                <button
                  onClick={openPortal}
                  disabled={portalLoading}
                  className="inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-neutral-100"
                >
                  {portalLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                  Manage subscription
                </button>
              ) : (
                <Link href="/pricing" className="inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-100">
                  Upgrade plan
                </Link>
              )}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {(plan?.features || []).slice(0, 4).map((feature) => (
                <div key={feature} className="flex items-start rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800/60">
                  <ShieldCheck className="mr-3 mt-0.5 h-5 w-5 text-green-500" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{feature}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Credits</h2>
            <div className="mt-6">
              <div className="text-5xl font-bold text-neutral-950 dark:text-white">{data?.credits.balance ?? 0}</div>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">available credits</p>
            </div>
            <div className="mt-6 space-y-3 border-t border-neutral-200 pt-5 text-sm dark:border-neutral-800">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Monthly allowance</span>
                <span className="font-medium text-neutral-950 dark:text-white">{data?.credits.monthlyAllowance ?? 0}</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Current cycle</span>
                <span className="font-medium text-neutral-950 dark:text-white">{data?.credits.currentCycle || "-"}</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Last reset</span>
                <span className="font-medium text-neutral-950 dark:text-white">{resetAt || "-"}</span>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-neutral-950 dark:text-white">Need more capacity?</h2>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                Upgrade to Plus or Ultra to unlock product link try-on, multi-item outfits, and higher monthly credits.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh status
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
