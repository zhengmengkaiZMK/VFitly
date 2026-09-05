"use client";
import { FeedbackError } from "@/components/feedback-provider";

import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildLoginRedirectUrl } from "@/lib/auth/login-redirect";

interface ModelPhotoCardProps {
  imageUrl: string | null;
  onImageChange: (imageUrl: string) => void;
}

export function ModelPhotoCard({ imageUrl, onImageChange }: ModelPhotoCardProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("modelImage", file);

      const response = await fetch("/api/me/profile-photo", {
        method: "PATCH",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push(buildLoginRedirectUrl("/dashboard"));
          return;
        }
        throw new Error(data.error || "Failed to update full-body photo.");
      }

      const nextImageUrl = data.user?.defaultModelImageUrl;
      if (!nextImageUrl) {
        throw new Error("Full-body photo was not returned.");
      }

      onImageChange(nextImageUrl);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Failed to update full-body photo.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="border-b border-neutral-200 p-6 dark:border-neutral-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-500">Default model</p>
            <h2 className="mt-2 text-xl font-semibold text-black dark:text-white">Full-body photo</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
              This photo is used as your default model image for AI try-on generations.
            </p>
          </div>
          <ImageIcon className="h-6 w-6 shrink-0 text-neutral-400" />
        </div>
      </div>

      <div className="p-6">
        <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-950">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Default full-body model photo"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain"
            />
          ) : (
            <div className="px-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                <Camera className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-black dark:text-white">No full-body photo yet</h3>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                Upload a clear full-body photo to speed up future try-on flows.
              </p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {imageUrl ? "You can replace this photo anytime." : "PNG, JPG or WebP images are supported."}
          </p>
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            {imageUrl ? "Replace full-body photo" : "Upload full-body photo"}
          </Button>
        </div>
        <FeedbackError message={uploadError} />
      </div>
    </div>
  );
}
