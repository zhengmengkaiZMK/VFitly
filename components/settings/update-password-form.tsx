"use client";
import { FeedbackError } from "@/components/feedback-provider";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/button";
import Password from "@/components/password";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function UpdatePasswordForm() {
  const pathname = usePathname();
  const isZh = pathname.startsWith("/zh");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [newPassword, setNewPassword] = useState("");

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
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

  const passwordStrength = getPasswordStrength(newPassword);
  const getStrengthText = () => {
    if (newPassword.length === 0) return "";
    if (passwordStrength <= 2) return isZh ? "弱" : "Weak";
    if (passwordStrength <= 3) return isZh ? "中等" : "Medium";
    if (passwordStrength <= 4) return isZh ? "强" : "Strong";
    return isZh ? "很强" : "Very Strong";
  };

  const getStrengthColor = () => {
    if (newPassword.length === 0) return "";
    if (passwordStrength <= 2) return "text-red-500";
    if (passwordStrength <= 3) return "text-yellow-500";
    if (passwordStrength <= 4) return "text-green-500";
    return "text-green-600";
  };

  async function onSubmit(values: PasswordFormValues) {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/user/update-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || (isZh ? "密码更新失败" : "Password update failed"));
        return;
      }

      setSuccess(isZh ? "密码更新成功" : "Password updated successfully");
      form.reset();
      setNewPassword("");
    } catch (e) {
      setError(
        isZh
          ? "更新失败，请稍后重试"
          : "Update failed, please try again later"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
          {isZh ? "修改密码" : "Change Password"}
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {isZh
            ? "确保您的账户安全"
            : "Keep your account secure"}
        </p>
      </div>

      <FeedbackError message={error} />

      {success && (
        <div className="mb-4 p-3 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Current Password */}
          <div>
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium leading-6 text-neutral-700 dark:text-neutral-300 mb-2"
                  >
                    {isZh ? "当前密码" : "Current Password"}
                  </label>
                  <FormControl>
                    <Password
                      id="currentPassword"
                      placeholder="••••••••"
                      className="block w-full bg-white dark:bg-neutral-900 px-4 rounded-md border border-neutral-300 dark:border-neutral-700 py-2 text-black dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-400 focus:outline-none sm:text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* New Password */}
          <div>
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium leading-6 text-neutral-700 dark:text-neutral-300 mb-2"
                  >
                    {isZh ? "新密码" : "New Password"}
                  </label>
                  <FormControl>
                    <Password
                      id="newPassword"
                      placeholder="••••••••"
                      className="block w-full bg-white dark:bg-neutral-900 px-4 rounded-md border border-neutral-300 dark:border-neutral-700 py-2 text-black dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-400 focus:outline-none sm:text-sm"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setNewPassword(e.target.value);
                      }}
                    />
                  </FormControl>
                  {newPassword && (
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
                          ? "至少8位，包含大小写字母、数字和特殊字符"
                          : "Min 8 chars, with upper/lower case, number & symbol"}
                      </p>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium leading-6 text-neutral-700 dark:text-neutral-300 mb-2"
                  >
                    {isZh ? "确认新密码" : "Confirm New Password"}
                  </label>
                  <FormControl>
                    <Password
                      id="confirmPassword"
                      placeholder="••••••••"
                      className="block w-full bg-white dark:bg-neutral-900 px-4 rounded-md border border-neutral-300 dark:border-neutral-700 py-2 text-black dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-400 focus:outline-none sm:text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? isZh
                  ? "更新中..."
                  : "Updating..."
                : isZh
                ? "更新密码"
                : "Update Password"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
