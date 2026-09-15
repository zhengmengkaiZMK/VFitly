"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * 把浮层内容渲染到 document.body，避免被祖先元素的
 * stacking context（z-index / transform / filter 等）限制，
 * 保证弹窗始终位于页面最上层。
 */
export function ModalLayer({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
}
