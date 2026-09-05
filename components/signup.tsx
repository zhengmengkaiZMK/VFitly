"use client";

import { FeedbackError } from "@/components/feedback-provider";

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
import { useRouter, usePathname } from "next/navigation";
import Password from "./password";
import { Button } from "./button";
import { Logo } from "./Logo";
import { GoogleSignInButton } from "./google-signin-button";
import { useState } from "react";
import { signIn } from "next-auth/react";

const formSchema = z.object({
  name: z
    .string({
      required_error: "Please enter your name",
    })
    .min(1, "Please enter your name"),
  email: z
    .string({
      required_error: "Please enter email",
    })
    .email("Please enter a valid email")
    .min(1, "Please enter email"),
  password: z
    .string({
      required_error: "Please enter password",
    })
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export type SignupUser = z.infer<typeof formSchema>;

export function SignupForm() {
  const router = useRouter();
  const pathname = usePathname();
  const isZh = pathname.startsWith("/zh");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");

  const form = useForm<SignupUser>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 密码强度计算
  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const getStrengthText = () => {
    if (password.length === 0) return "";
    if (passwordStrength <= 2) return isZh ? "弱" : "Weak";
    if (passwordStrength <= 3) return isZh ? "中等" : "Medium";
    if (passwordStrength <= 4) return isZh ? "强" : "Strong";
    return isZh ? "很强" : "Very Strong";
  };

  const getStrengthColor = () => {
    if (password.length === 0) return "";
    if (passwordStrength <= 2) return "text-red-500";
    if (passwordStrength <= 3) return "text-yellow-500";
    if (passwordStrength <= 4) return "text-green-500";
    return "text-green-600";
  };

  async function onSubmit(values: SignupUser) {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || (isZh ? "注册失败" : "Registration failed"));
        return;
      }

      // 注册成功后自动登录
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/onboarding/profile-photo");
        router.refresh();
      }
    } catch (e) {
      setError(isZh ? "注册失败，请稍后重试" : "Registration failed, please try again later");
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
              {isZh ? "注册新账户" : "Sign up for an account"}
            </h2>
          </div>

          <div className="mt-10">
            <FeedbackError message={error} />
            <div>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium leading-6 text-neutral-700 dark:text-muted-dark"
                        >
                          {isZh ? "姓名" : "Full name"}
                        </label>
                        <FormControl>
                          <div className="mt-2">
                            <input
                              id="name"
                              type="name"
                              placeholder={isZh ? "张三" : "Manu Arora"}
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
                              onChange={(e) => {
                                field.onChange(e);
                                setPassword(e.target.value);
                              }}
                            />
                          </div>
                        </FormControl>
                        {password && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-300 ${
                                    passwordStrength <= 2
                                      ? "bg-red-500 w-1/3"
                                      : passwordStrength <= 3
                                      ? "bg-yellow-500 w-2/3"
                                      : passwordStrength <= 4
                                      ? "bg-green-500 w-5/6"
                                      : "bg-green-600 w-full"
                                  }`}
                                />
                              </div>
                              <span className={`text-xs font-medium ${getStrengthColor()}`}>
                                {getStrengthText()}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                              {isZh
                                ? "至少8位，包含小写字母、数字和特殊字符"
                                : "Min 8 chars, with lowercase letter, number & symbol"}
                            </p>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <Button className="w-full" disabled={isLoading}>
                    {isLoading ? (isZh ? "注册中..." : "Signing up...") : (isZh ? "注册" : "Sign Up")}
                  </Button>
                  <p
                    className={cn(
                      "text-sm text-neutral-500 text-center mt-4 text-muted dark:text-muted-dark"
                    )}
                  >
                    {isZh ? "已有账户？" : "Already have an account?"}{" "}
                    <Link href="/login" className="text-black dark:text-white">
                      {isZh ? "登录" : "Sign in"}
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

              <div className="mt-6 w-full flex items-center justify-center">
                <GoogleSignInButton callbackUrl="/onboarding/profile-photo" />
              </div>

              <p className="text-neutral-600 dark:text-neutral-400 text-sm text-center mt-8">
                {isZh ? "点击注册即表示您同意我们的" : "By clicking on sign up, you agree to our"}{" "}
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
