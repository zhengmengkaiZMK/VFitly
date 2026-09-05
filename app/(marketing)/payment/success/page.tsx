"use client";
import { FeedbackError } from "@/components/feedback-provider";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock, Loader2 } from "lucide-react";

type PaymentDetails = {
  id: string;
  status: string;
  amount?: number;
  currency?: string;
  planId?: string;
  provider?: string;
  stripeCheckoutSessionId?: string;
  stripeStatus?: string | null;
  paymentStatus?: string | null;
  message?: string;
};

type MembershipInfo = {
  membershipType?: string;
  membershipExpiresAt?: string | null;
};

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isZh = pathname.startsWith("/zh");

  const paymentId = searchParams.get("paymentId");
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [membershipInfo, setMembershipInfo] = useState<MembershipInfo | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const statusUrl = sessionId
      ? `/api/stripe/session-status/${encodeURIComponent(sessionId)}`
      : paymentId
        ? `/api/payment/status/${encodeURIComponent(paymentId)}`
        : "";

    if (!statusUrl) {
      setError(isZh ? "缺少支付 ID 或 Stripe Session ID" : "Missing payment ID or Stripe session ID");
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(statusUrl).then((res) => res.json()),
      fetch("/api/user/refresh-session").then((res) => res.json()),
    ])
      .then(([paymentData, userInfo]) => {
        if (paymentData.error) {
          setError(paymentData.error);
        } else {
          setPaymentDetails(paymentData);
        }

        if (!userInfo.error && userInfo.user) {
          setMembershipInfo(userInfo.user);
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, [paymentId, sessionId, isZh]);

  const isProcessing = useMemo(() => {
    if (!paymentDetails) return false;
    return ["PENDING", "PROCESSING", "OPEN"].includes(paymentDetails.status?.toUpperCase());
  }, [paymentDetails]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600 dark:text-blue-400" />
          <p className="text-neutral-600 dark:text-neutral-400">
            {isZh ? "正在验证支付状态..." : "Verifying payment..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !paymentDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
        <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600 dark:bg-red-900/30 dark:text-red-300">
            !
          </div>
          <h1 className="mb-2 text-2xl font-bold text-black dark:text-white">
            {isZh ? "验证失败" : "Verification failed"}
          </h1>
          <FeedbackError message={error || (isZh ? "无法验证支付状态" : "Cannot verify payment status")} />
          <Link href="/dashboard/billing" className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 font-medium text-white transition hover:bg-black">
            {isZh ? "查看账单" : "View billing"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg dark:border-neutral-800 dark:bg-neutral-900 md:p-12">
        <div className="mb-8 text-center">
          <div className={`mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full ${isProcessing ? "bg-amber-100 dark:bg-amber-900/30" : "bg-green-100 dark:bg-green-900/30"}`}>
            {isProcessing ? (
              <Clock className="h-12 w-12 text-amber-600 dark:text-amber-400" />
            ) : (
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            )}
          </div>

          <h1 className="mb-3 text-3xl font-bold text-black dark:text-white md:text-4xl">
            {isProcessing
              ? isZh ? "支付已提交" : "Payment submitted"
              : isZh ? "支付成功！" : "Payment successful!"}
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            {isProcessing
              ? isZh ? "Stripe 正在通过 Webhook 激活您的订阅，请稍后刷新账单页查看最新状态。" : "Stripe is activating your subscription via webhook. Please refresh billing shortly."
              : isZh ? "感谢您的购买，您的订阅和积分已开始同步。" : "Thank you for your purchase. Your subscription and credits are being synced."}
          </p>
        </div>

        <div className="mb-6 rounded-xl bg-neutral-100 p-6 dark:bg-neutral-800">
          <h2 className="mb-4 text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
            {isZh ? "订单详情" : "Order details"}
          </h2>
          <div className="space-y-3">
            <DetailRow label={isZh ? "订单 ID" : "Order ID"} value={`${paymentDetails.id.slice(0, 12)}...`} mono />
            <DetailRow label={isZh ? "支付渠道" : "Provider"} value={paymentDetails.provider || (sessionId ? "STRIPE" : "PAYPAL")} />
            {paymentDetails.planId && <DetailRow label={isZh ? "方案" : "Plan"} value={paymentDetails.planId} />}
            {typeof paymentDetails.amount === "number" && (
              <DetailRow label={isZh ? "金额" : "Amount"} value={`$${paymentDetails.amount.toFixed(2)} ${paymentDetails.currency || "USD"}`} />
            )}
            <DetailRow label={isZh ? "状态" : "Status"} value={paymentDetails.status} badge />
            {membershipInfo?.membershipType && <DetailRow label={isZh ? "当前会员" : "Current plan"} value={membershipInfo.membershipType} />}
            {membershipInfo?.membershipExpiresAt && (
              <DetailRow label={isZh ? "到期时间" : "Expires at"} value={new Date(membershipInfo.membershipExpiresAt).toLocaleDateString()} />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/dashboard/billing" className="inline-flex flex-1 items-center justify-center rounded-full bg-black px-6 py-3 text-center font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-100">
            {isZh ? "查看账单" : "View billing"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link href="/dashboard/try-on" className="flex-1 rounded-full bg-neutral-200 px-6 py-3 text-center font-semibold text-black transition hover:bg-neutral-300 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700">
            {isZh ? "开始试衣" : "Start try-on"}
          </Link>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, mono = false, badge = false }: { label: string; value: string; mono?: boolean; badge?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-neutral-600 dark:text-neutral-400">{label}</span>
      {badge ? (
        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">{value}</span>
      ) : (
        <span className={`${mono ? "font-mono text-sm" : "font-semibold"} text-right text-black dark:text-white`}>{value}</span>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
