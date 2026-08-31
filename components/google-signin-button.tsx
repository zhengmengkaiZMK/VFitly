"use client";

import { usePathname } from "next/navigation";
import { signIn } from "next-auth/react";
import { IconBrandGoogle } from "@tabler/icons-react";
import { Button } from "./button";

interface GoogleSignInButtonProps {
  callbackUrl?: string;
  disabled?: boolean;
}

export function GoogleSignInButton({ callbackUrl = "/dashboard/try-on", disabled = false }: GoogleSignInButtonProps) {
  const pathname = usePathname();
  const isZh = pathname.startsWith("/zh");

  const handleClick = () => {
    if (!disabled) {
      signIn("google", { callbackUrl });
    }
  };

  return (
    <Button 
      type="button"
      onClick={handleClick} 
      disabled={disabled}
      className="w-full py-1.5"
    >
      <IconBrandGoogle className="h-5 w-5" />
      <span className="text-sm font-semibold leading-6">
        {isZh ? "Google" : "Google"}
      </span>
    </Button>
  );
}
