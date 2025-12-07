"use client";

import { useEffect, useState } from "react";
import { Upload, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadLoadingProps {
  fileName: string;
  progress?: number;
  status?: "uploading" | "success" | "error";
  previewUrl?: string;
  errorMessage?: string;
}

export const ImageUploadLoading: React.FC<ImageUploadLoadingProps> = ({
  fileName,
  progress = 0,
  status = "uploading",
  previewUrl,
  errorMessage,
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  // Smooth progress animation
  useEffect(() => {
    if (status === "uploading") {
      const timer = setInterval(() => {
        setDisplayProgress((prev) => {
          if (prev < progress) {
            return Math.min(prev + 2, progress);
          }
          return prev;
        });
      }, 50);
      return () => clearInterval(timer);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, status]);

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "success":
        return "Tải lên thành công";
      case "error":
        return errorMessage || "Tải lên thất bại";
      default:
        return "Đang tải lên...";
    }
  };

  return (
    <div className="relative w-full max-w-sm bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-lg overflow-hidden animate-in fade-in slide-in-from-right-5 duration-300">
      {/* Preview Image */}
      {previewUrl && (
        <div className="relative w-full h-32 bg-neutral-100 dark:bg-neutral-900">
          <Image
            src={previewUrl}
            alt={fileName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 384px"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">{getStatusIcon()}</div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
              {fileName}
            </p>
            <p
              className={`text-xs mt-1 ${
                status === "error"
                  ? "text-red-500"
                  : status === "success"
                  ? "text-green-500"
                  : "text-neutral-500 dark:text-neutral-400"
              }`}
            >
              {getStatusText()}
            </p>
          </div>
        </div>

        {/* Progress Bar - Only show when uploading */}
        {status === "uploading" && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>Tiến độ</span>
              <span className="font-medium">
                {Math.round(displayProgress)}%
              </span>
            </div>
            <div className="relative h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              {/* Background */}
              <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-700 rounded-full" />

              {/* Progress Fill */}
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${displayProgress}%` }}
              >
                {/* Shimmer Effect */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                  style={{ width: "50%" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {status === "error" && errorMessage && (
          <div className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Success Checkmark */}
      {status === "success" && (
        <div className="absolute top-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
          <CheckCircle2 className="h-5 w-5 text-white" />
        </div>
      )}
    </div>
  );
};

// Multiple uploads container
interface ImageUploadLoadingListProps {
  uploads: Array<{
    id: string;
    fileName: string;
    progress?: number;
    status?: "uploading" | "success" | "error";
    previewUrl?: string;
    errorMessage?: string;
  }>;
}

export const ImageUploadLoadingList: React.FC<ImageUploadLoadingListProps> = ({
  uploads,
}) => {
  if (uploads.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {uploads.map((upload) => (
        <div
          key={upload.id}
          className="animate-in slide-in-from-right-5 fade-in duration-300"
        >
          <ImageUploadLoading
            fileName={upload.fileName}
            progress={upload.progress}
            status={upload.status}
            previewUrl={upload.previewUrl}
            errorMessage={upload.errorMessage}
          />
        </div>
      ))}
    </div>
  );
};
