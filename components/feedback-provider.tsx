"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type FeedbackKind = "error" | "login" | "upgrade";
type Feedback = { kind: FeedbackKind; message: string; href?: string };
type FeedbackContextValue = {
  showError: (message: string) => void;
  requireLogin: (message?: string, href?: string) => void;
  requireUpgrade: (message?: string, href?: string) => void;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isZh = pathname.startsWith("/zh");
  const [queue, setQueue] = useState<Feedback[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousPath = useRef(pathname);
  const previousQueue = useRef<Feedback[]>([]);
  const active = queue[0];

  const enqueue = useCallback((feedback: Feedback) => {
    setQueue((current) => current.some((item) => item.kind === feedback.kind && item.message === feedback.message && item.href === feedback.href)
      ? current : [...current, feedback]);
  }, []);
  const dismiss = useCallback(() => setQueue((current) => current.slice(1)), []);
  const requireLogin = useCallback((message?: string, href?: string) => {
    enqueue({ kind: "login", message: message || (isZh ? "请先登录后继续操作。" : "Please sign in to continue."), href });
  }, [enqueue, isZh]);
  const requireUpgrade = useCallback((message?: string, href?: string) => {
    enqueue({ kind: "upgrade", message: message || (isZh ? "当前套餐额度不足或不支持此功能，请查看会员套餐。" : "Your current plan does not include this feature or has reached its limit. Please view our plans to continue."), href });
  }, [enqueue, isZh]);
  const showError = useCallback((message: string) => {
    if (!message.trim()) return;
    if (/please (sign in|log in)|sign in (to continue|first)|authentication required|unauthorized|请先?登录|未登录|登录已过期/i.test(message)) {
      requireLogin(message);
    } else if (/upgrade (your |to |required)|requires? (a |an )?(paid|premium|pro) (plan|subscription)|请升级|购买会员|会员专享/i.test(message)) {
      requireUpgrade(message);
    } else {
      enqueue({ kind: "error", message });
    }
  }, [enqueue, requireLogin, requireUpgrade]);
  const value = useMemo(() => ({ showError, requireLogin, requireUpgrade }), [showError, requireLogin, requireUpgrade]);

  useEffect(() => {
    if (previousPath.current !== pathname) {
      previousPath.current = pathname;
      const stale = previousQueue.current;
      setQueue((current) => current.filter((item) => !stale.includes(item)));
    }
  }, [pathname]);

  useEffect(() => {
    previousQueue.current = queue;
  }, [queue]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!active || !dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [active]);

  function proceed() {
    if (!active) return;
    const callbackUrl = `${window.location.pathname}${window.location.search}`;
    const prefix = isZh ? "/zh" : "";
    const href = active.href || (active.kind === "login"
      ? `${prefix}/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : `${prefix}/pricing`);
    setQueue([]);
    router.push(href);
  }

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      {active && (
        <dialog
          ref={dialogRef}
          aria-labelledby="feedback-title"
          aria-describedby="feedback-description"
          aria-modal="true"
          onCancel={(event) => { event.preventDefault(); dismiss(); }}
          onClick={(event) => {
            if (event.target !== event.currentTarget) return;
            const rect = event.currentTarget.getBoundingClientRect();
            if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dismiss();
          }}
          className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border border-neutral-200 bg-white p-6 text-neutral-900 shadow-2xl backdrop:bg-black/[0.55] backdrop:backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 id="feedback-title" className="text-xl font-semibold">
              {active.kind === "login" ? (isZh ? "请先登录" : "Sign in required") : active.kind === "upgrade" ? (isZh ? "升级会员套餐" : "Upgrade your plan") : (isZh ? "操作未完成" : "Something went wrong")}
            </h2>
            <button type="button" onClick={dismiss} aria-label={isZh ? "关闭" : "Close"} className="rounded-full px-2 text-2xl leading-6 text-neutral-500 hover:bg-neutral-100 focus-visible:outline-purple-500 dark:hover:bg-neutral-800">×</button>
          </div>
          <p id="feedback-description" className="max-h-[50vh] overflow-y-auto whitespace-pre-wrap break-words text-sm leading-6 text-neutral-600 dark:text-neutral-300">{active.message}</p>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button type="button" onClick={dismiss} className="rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800">
              {active.kind === "error" ? (isZh ? "知道了" : "Got it") : (isZh ? "暂时不用" : "Not now")}
            </button>
            {active.kind !== "error" && <button type="button" onClick={proceed} className="rounded-full bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700">
              {active.kind === "login" ? (isZh ? "去登录" : "Sign in") : (isZh ? "查看套餐" : "View plans")}
            </button>}
          </div>
        </dialog>
      )}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) throw new Error("useFeedback must be used within FeedbackProvider");
  return context;
}

export function FeedbackError({ message }: { message: string | null | undefined }) {
  const { showError } = useFeedback();
  const previousMessage = useRef<string | null | undefined>(null);
  useEffect(() => {
    if (message && message !== previousMessage.current) showError(message);
    previousMessage.current = message;
  }, [message, showError]);
  return null;
}
