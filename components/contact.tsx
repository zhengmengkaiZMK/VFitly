"use client";
import { FeedbackError } from "@/components/feedback-provider";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Button } from "./button";

const formSchema = z.object({
  email: z
    .string({ required_error: "Please enter your email address" })
    .email("Please enter a valid email address"),
  message: z
    .string({ required_error: "Please enter your feedback" })
    .min(10, "Please enter at least 10 characters")
    .max(3000, "Feedback must be 3000 characters or less"),
});

export type FeedbackFormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: FeedbackFormValues) {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message:
            data.message ||
            "Thanks for your feedback. We'll review it and reply by email if needed.",
        });
        form.reset();
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Failed to submit feedback. Please try again.",
        });
      }
    } catch (error) {
      console.error("Feedback form error:", error);
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <div className="relative z-20 flex w-full items-center justify-center px-4 py-4 sm:px-6 lg:flex-none lg:px-20 lg:py-12 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Feedback
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-black dark:text-white">
              Tell us what you think
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted dark:text-muted-dark">
              Share your questions, bugs, or product suggestions. Our team will review your message and contact you by email if needed.
            </p>
          </div>

          <div className="py-10">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-neutral-700 dark:text-muted-dark"
                    >
                      Email address
                    </label>
                    <FormControl>
                      <div className="mt-2">
                        <input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          className="block w-full rounded-md border-0 bg-white px-4 py-2 text-black shadow-aceternity placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-white sm:text-sm sm:leading-6"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium leading-6 text-neutral-700 dark:text-muted-dark"
                    >
                      Feedback
                    </label>
                    <FormControl>
                      <div className="mt-2">
                        <textarea
                          rows={7}
                          id="message"
                          placeholder="Describe your feedback here..."
                          className="block w-full resize-none rounded-md border-0 bg-white px-4 py-2 text-black shadow-aceternity placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-white sm:text-sm sm:leading-6"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit feedback"}
              </Button>

              <FeedbackError message={submitStatus.type === "error" ? submitStatus.message : ""} />
              {submitStatus.type === "success" && (
                <div
                  className={cn(
                    "rounded-lg border p-4 text-sm",
                    submitStatus.type === "success"
                      ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                  )}
                >
                  {submitStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </Form>
  );
}
