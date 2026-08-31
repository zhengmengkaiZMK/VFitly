"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { buildLoginRedirectUrl } from "@/lib/auth/login-redirect";

interface StripeCheckoutButtonProps {
  planId: string;
  onError?: (error: string) => void;
}

export function StripeCheckoutButton({ planId, onError }: StripeCheckoutButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isZh = pathname.startsWith("/zh");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    if (!session) {
      router.push(buildLoginRedirectUrl(pathname));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await response.json();

      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error || "Failed to start Stripe checkout.");
      }

      window.location.href = data.checkoutUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start Stripe checkout.";
      setError(message);
      onError?.(message);
      setLoading(false);
    }
  }

  return (
    <div className="mt-8">
      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      ) : null}
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading}
        className="relative z-10 block w-full items-center justify-center rounded-full border border-transparent bg-neutral-900 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-[0px_-1px_0px_0px_#FFFFFF40_inset,_0px_1px_0px_0px_#FFFFFF40_inset] transition duration-200 hover:bg-black/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90 md:text-sm"
      >
        {loading ? (
          <span className="inline-flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isZh ? "正在跳转..." : "Redirecting..."}
          </span>
        ) : session ? (
          isZh ? "使用 Stripe 安全支付" : "Pay securely with Stripe"
        ) : (
          isZh ? "登录后购买" : "Login to purchase"
        )}
      </button>
      <p className="mt-4 text-center text-xs text-neutral-500 dark:text-neutral-400">
        {isZh ? "由 Stripe 提供安全订阅支付" : "Secure subscription checkout powered by Stripe"}
      </p>
    </div>
  );
}
