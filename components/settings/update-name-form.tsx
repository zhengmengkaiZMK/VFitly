"use client";
import { FeedbackError } from "@/components/feedback-provider";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/button";

const nameSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
});

type NameFormValues = z.infer<typeof nameSchema>;

interface UpdateNameFormProps {
  currentName: string;
  currentEmail: string;
}

export function UpdateNameForm({ currentName, currentEmail }: UpdateNameFormProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { update: updateSession } = useSession();
  const isZh = pathname.startsWith("/zh");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const form = useForm<NameFormValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: currentName,
    },
  });

  async function onSubmit(values: NameFormValues) {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/user/update-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: values.name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || (isZh ? "更新失败" : "Update failed"));
        return;
      }

      // 更新session中的用户名
      await updateSession({
        ...data.user,
      });

      setSuccess(isZh ? "用户名更新成功" : "Name updated successfully");
      router.refresh();
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
          {isZh ? "个人信息" : "Personal Information"}
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {isZh
            ? "更新您的账户信息"
            : "Update your account information"}
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
          {/* Email (只读) */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-neutral-700 dark:text-neutral-300 mb-2"
            >
              {isZh ? "邮箱地址" : "Email address"}
            </label>
            <input
              id="email"
              type="email"
              value={currentEmail}
              disabled
              className="block w-full bg-neutral-100 dark:bg-neutral-800 px-4 rounded-md border-0 py-2 text-neutral-500 dark:text-neutral-400 cursor-not-allowed sm:text-sm"
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {isZh ? "邮箱地址不可修改" : "Email address cannot be changed"}
            </p>
          </div>

          {/* Name */}
          <div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-neutral-700 dark:text-neutral-300 mb-2"
                  >
                    {isZh ? "用户名" : "Name"}
                  </label>
                  <FormControl>
                    <input
                      id="name"
                      type="text"
                      placeholder={isZh ? "请输入用户名" : "Enter your name"}
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
                  ? "保存中..."
                  : "Saving..."
                : isZh
                ? "保存更改"
                : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
