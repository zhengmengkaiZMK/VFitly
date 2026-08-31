"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Password from "./password";
import { Button } from "./button";
import { Logo } from "./Logo";
import { GoogleSignInButton } from "./google-signin-button";
import { signIn } from "next-auth/react";
import { useState } from "react";

const formSchema = z.object({
  email: z
    .string({
      required_error: "Please enter email",
    })
    .email("Please enter valid email")
    .min(1, "Please enter email"),
  password: z
    .string({
      required_error: "Please enter password",
    })
    .min(1, "Please enter password"),
});

export type LoginUser = z.infer<typeof formSchema>;

export function LoginForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isZh = pathname.startsWith("/zh");
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginUser>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginUser) {
    try {
      setIsLoading(true);
      setError("");

      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (e) {
      setError(isZh ? "登录失败，请稍后重试" : "Login failed, please try again later");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <div className="flex items-center w-full justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div>
            <div className="flex">
              <Logo />
            </div>
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-black dark:text-white">
              {isZh ? "登录您的账户" : "Sign in to your account"}
            </h2>
          </div>

          <div className="mt-10">
            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}
            <div>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-neutral-700 dark:text-muted-dark"
                        >
                          {isZh ? "邮箱地址" : "Email address"}
                        </label>
                        <FormControl>
                          <div className="mt-2">
                            <input
                              id="email"
                              type="email"
                              placeholder="hello@johndoe.com"
                              className="block w-full bg-white dark:bg-neutral-900 px-4 rounded-md border-0 py-1.5  shadow-aceternity text-black placeholder:text-gray-400 focus:ring-2 focus:ring-neutral-400 focus:outline-none sm:text-sm sm:leading-6 dark:text-white"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium leading-6 text-neutral-700 dark:text-muted-dark"
                        >
                          {isZh ? "密码" : "Password"}
                        </label>
                        <FormControl>
                          <div className="mt-2">
                            <Password
                              id="password"
                              type="password"
                              placeholder="••••••••"
                              className="block w-full bg-white dark:bg-neutral-900 px-4 rounded-md border-0 py-1.5  shadow-aceternity text-black placeholder:text-gray-400 focus:ring-2 focus:ring-neutral-400 focus:outline-none sm:text-sm sm:leading-6 dark:text-white"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm leading-6">
                    <Link href="#" className="font-normal text-neutral-500">
                      {isZh ? "忘记密码？" : "Forgot password?"}
                    </Link>
                  </div>
                </div>

                <div>
                  <Button className="w-full" disabled={isLoading}>
                    {isLoading ? (isZh ? "登录中..." : "Signing in...") : (isZh ? "登录" : "Sign in")}
                  </Button>
                  <p
                    className={cn(
                      "text-sm text-neutral-500 text-center mt-4 text-muted dark:text-muted-dark"
                    )}
                  >
                    {isZh ? "还没有账户？" : "Don't have an account?"}{" "}
                    <Link href="/signup" className="text-black dark:text-white">
                      {isZh ? "注册" : "Sign up"}
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            <div className="mt-10">
              <div className="relative">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-neutral-300 dark:border-neutral-700" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white px-6 text-neutral-400 dark:text-neutral-500 dark:bg-black">
                    {isZh ? "或使用以下方式继续" : "Or continue with"}
                  </span>
                </div>
              </div>

              <div className="mt-6 w-full flex flex-col gap-3">
                <GoogleSignInButton callbackUrl={callbackUrl} />
              </div>

              <p className="text-neutral-600 dark:text-neutral-400 text-sm text-center mt-8">
                {isZh ? "点击登录即表示您同意我们的" : "By clicking on sign in, you agree to our"}{" "}
                <Link
                  href={isZh ? "/zh/terms" : "/terms"}
                  className="text-neutral-500 dark:text-neutral-300"
                >
                  {isZh ? "服务条款" : "Terms of Service"}
                </Link>{" "}
                {isZh ? "和" : "and"}{" "}
                <Link
                  href={isZh ? "/zh/privacy" : "/privacy"}
                  className="text-neutral-500 dark:text-neutral-300"
                >
                  {isZh ? "隐私政策" : "Privacy Policy"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}
