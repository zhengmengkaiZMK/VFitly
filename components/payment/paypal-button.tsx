"use client";
import { FeedbackError, useFeedback } from "@/components/feedback-provider";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { buildLoginRedirectUrl } from "@/lib/auth/login-redirect";

interface PayPalButtonProps {
  planId: string;
  amount: number;
  planName: string;
  billingCycle: "MONTHLY" | "YEARLY";
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function PayPalButton({
  planId,
  amount,
  planName,
  billingCycle,
  onSuccess,
  onError,
}: PayPalButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isZh = pathname.startsWith("/zh");

  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState<string>("");

  // 加载PayPal SDK
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    
    if (!clientId) {
      setError(isZh ? "PayPal未配置" : "PayPal not configured");
      return;
    }

    // 检查脚本是否已加载
    if (window.paypal) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    script.async = true;
    
    script.onload = () => {
      setScriptLoaded(true);
    };
    
    script.onerror = () => {
      setError(isZh ? "PayPal加载失败" : "Failed to load PayPal");
    };

    document.body.appendChild(script);

    return () => {
      // 清理
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [isZh]);

  // 渲染PayPal按钮
  useEffect(() => {
    if (!scriptLoaded || !window.paypal) {
      return;
    }

    const container = document.getElementById(`paypal-button-${planId}`);
    if (!container) return;

    // 清空容器
    container.innerHTML = "";

    window.paypal
      .Buttons({
        style: {
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "paypal",
        },
        
        // 创建订单
        createOrder: async () => {
          try {
            console.log("[PayPal] 开始创建订单...", { planId });

            const response = await fetch("/api/payment/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ planId }),
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.error || "Failed to create order");
            }

            console.log("[PayPal] 订单创建成功:", data.orderID);
            return data.orderID;
          } catch (err: any) {
            console.error("[PayPal] 创建订单失败:", err);
            setError(err.message);
            onError?.(err.message);
            throw err;
          }
        },

        // 批准支付后
        onApprove: async (data: any) => {
          try {
            setLoading(true);

            console.log("[PayPal] 支付已批准，捕获中...", data.orderID);

            const response = await fetch("/api/payment/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderID: data.orderID }),
            });

            const result = await response.json();

            if (!response.ok) {
              throw new Error(result.error || "Failed to capture payment");
            }

            console.log("[PayPal] 支付成功:", result);

            // 刷新用户session以更新membershipType
            try {
              await fetch("/api/user/refresh-session");
              
              // 强制重新加载页面session
              window.location.href = `/payment/success?paymentId=${result.paymentId}`;
            } catch (sessionError) {
              console.error("[PayPal] 刷新session失败:", sessionError);
              // 即使session刷新失败也继续
              router.push(`/payment/success?paymentId=${result.paymentId}`);
            }

            // 调用成功回调
            onSuccess?.();
          } catch (err: any) {
            console.error("[PayPal] 捕获支付失败:", err);
            setError(err.message);
            onError?.(err.message);
            setLoading(false);
            router.push(`/payment/error?message=${encodeURIComponent(err.message)}`);
          }
        },

        // 取消支付
        onCancel: () => {
          console.log("[PayPal] 支付已取消");
          setLoading(false);
        },

        // 支付错误
        onError: (err: any) => {
          console.error("[PayPal] 支付错误:", err);
          const errorMessage = err.message || "Payment failed";
          setError(errorMessage);
          onError?.(errorMessage);
          setLoading(false);
        },
      })
      .render(`#paypal-button-${planId}`);
  }, [scriptLoaded, planId, router, onSuccess, onError]);

  // 检查登录状态
  if (!session) {
    return (
      <button
        className="bg-neutral-900 relative z-10 hover:bg-black/90 border border-transparent text-white md:text-sm transition duration-200 items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40_inset,_0px_1px_0px_0px_#FFFFFF40_inset] mt-8 rounded-full py-2.5 px-3.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10 block w-full"
        onClick={() => router.push(buildLoginRedirectUrl(pathname))}
      >
        {isZh ? "登录后购买" : "Login to Purchase"}
      </button>
    );
  }

  return (
    <div className="mt-8">
      <FeedbackError message={error} />
      {/* 加载中 */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-600 dark:text-neutral-400" />
          <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
            {isZh ? "处理中..." : "Processing..."}
          </span>
        </div>
      )}

      {/* PayPal按钮容器 */}
      <div
        id={`paypal-button-${planId}`}
        className={loading ? "opacity-50 pointer-events-none" : ""}
      />

      {/* 安全提示 */}
      {!loading && scriptLoaded && (
        <p className="mt-4 text-xs text-center text-neutral-500 dark:text-neutral-400">
          {isZh
            ? "由PayPal提供安全支付保障"
            : "Secure payment powered by PayPal"}
        </p>
      )}
    </div>
  );
}

// 全局类型声明
declare global {
  interface Window {
    paypal?: any;
  }
}
