"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { IconHanger, IconHistory, IconMessageReport, IconSparkles, IconSettings, IconWallet } from "@tabler/icons-react";
import { UserInfoCard } from "./user-info-card";
import { ModelPhotoCard } from "./model-photo-card";
import { MembershipCard } from "./membership-card";
import { Skeleton } from "./skeleton";
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

interface UsageSummary {
  total: number;
  used: number;
  remaining: number;
}

export function DashboardContent() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<{
    defaultPersonImageUrl: string | null;
    memberSince: string;
    plan: DashboardPlan | null;
    credits: UsageSummary | null;
    walkVideoQuota: UsageSummary | null;
  } | null>(null);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    let isMounted = true;

    fetch("/api/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!isMounted || !data?.user) {
          return;
        }

        const remainingCredits = Number(data.credits?.balance ?? 0);
        const totalCredits = Number(data.credits?.monthlyAllowance ?? 0);

        setProfile({
          defaultPersonImageUrl: data.user.defaultModelImageUrl ?? null,
          memberSince: data.user.createdAt ?? new Date().toISOString(),
          plan: data.plan ?? null,
          credits: {
            total: totalCredits,
            used: Math.max(totalCredits - remainingCredits, 0),
            remaining: remainingCredits,
          },
          walkVideoQuota: data.walkVideoQuota
            ? {
                total: Number(data.walkVideoQuota.total ?? 0),
                used: Number(data.walkVideoQuota.used ?? 0),
                remaining: Number(data.walkVideoQuota.remaining ?? 0),
              }
            : null,
        });
      })
      .catch(() => {
        if (isMounted) {
          setProfile(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [status]);

  if (status === "loading") {
    return <DashboardSkeleton />;
  }

  if (!session) {
    return null;
  }

  const baseActions = [
    {
      title: "AI Try-On Studio",
      description: "Upload a person photo, select a garment and generate realistic fitting images.",
      href: "/dashboard/try-on",
      icon: IconSparkles,
    },
    {
      title: "Wardrobe Library",
      description: "Manage garment images, categories, colors and tags for reusable fashion assets.",
      href: "/dashboard/wardrobe",
      icon: IconHanger,
    },
    {
      title: "Generation History",
      description: "Review try-on jobs, generated images, credit costs and stored assets.",
      href: "/dashboard/history",
      icon: IconHistory,
    },
    {
      title: "Billing & Credits",
      description: "Use the SaaS payment foundation for future plans, credits and subscription logic.",
      href: "/pricing",
      icon: IconWallet,
    },
    {
      title: "Account Settings",
      description: "Manage profile, membership and account preferences from the existing settings area.",
      href: "/settings",
      icon: IconSettings,
    },
  ];

  const adminActions = session.user.role === "ADMIN"
    ? [
        {
          title: "Feedback Management",
          description: "Review user feedback messages and reply directly by email.",
          href: "/admin/feedback",
          icon: IconMessageReport,
        },
      ]
    : [];

  const actions = [...adminActions, ...baseActions];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-500">AI Fashion SaaS</p>
        <h1 className="mt-3 text-3xl font-bold text-black dark:text-white">Dashboard</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Welcome back, {session.user.name || session.user.email}. Your workspace is ready for wardrobe management and AI try-on generation.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <UserInfoCard
          user={{
            name: session.user.name || "User",
            email: session.user.email,
            membershipType: profile?.plan?.tier ?? session.user.membershipType,
            avatar: null,
            memberSince: profile?.memberSince ?? new Date().toISOString(),
          }}
          credits={profile?.credits ?? null}
          walkVideoQuota={profile?.walkVideoQuota ?? null}
        />
        <MembershipCard
          membershipType={profile?.plan?.tier ?? session.user.membershipType}
          expiresAt={null}
          plan={profile?.plan ?? null}
        />
        <ModelPhotoCard
          imageUrl={profile?.defaultPersonImageUrl ?? null}
          onImageChange={(imageUrl) =>
            setProfile((current) => ({
              defaultPersonImageUrl: imageUrl,
              memberSince: current?.memberSince ?? new Date().toISOString(),
              plan: current?.plan ?? null,
              credits: current?.credits ?? null,
              walkVideoQuota: current?.walkVideoQuota ?? null,
            }))
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className="group rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950/40 dark:text-blue-300">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold text-black dark:text-white">{action.title}</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{action.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <Skeleton className="mb-2 h-9 w-48" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-44 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
