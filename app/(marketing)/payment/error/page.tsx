"use client";
import { FeedbackError } from "@/components/feedback-provider";

import { Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

function PaymentErrorContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isZh = pathname.startsWith("/zh");
  
  const errorMessage = searchParams.get("message") || (
    isZh ? "支付过程中发生错误" : "An error occurred during payment"
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-8 text-center border border-neutral-200 dark:border-neutral-800">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
            {isZh ? "支付失败" : "Payment Failed"}
          </h1>
          
          <FeedbackError message={errorMessage} />
          
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
            {isZh
              ? "如果问题持续存在，请联系客服。"
              : "If the problem persists, please contact support."}
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-full px-6 py-3 font-semibold transition"
            >
              {isZh ? "重试支付" : "Retry Payment"}
            </Link>
            
            <a
              href="mailto:support@example.com"
              className="inline-flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-full px-6 py-3 font-semibold transition"
            >
              <Mail className="h-4 w-4 mr-2" />
              {isZh ? "联系客服" : "Contact Support"}
            </a>
            
            <Link
              href="/"
              className="inline-flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isZh ? "返回首页" : "Back to Home"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PaymentErrorContent />
    </Suspense>
  );
}
