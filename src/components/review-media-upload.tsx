"use client";

import { useState, useRef } from "react";
import { ImagePlus, Video, X, Upload } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth as useClerkAuth } from "@clerk/nextjs";

interface ReviewMediaUploadProps {
  images: string[];
  videos: string[];
  onImagesChange: (urls: string[]) => void;
  onVideosChange: (urls: string[]) => void;
  disabled?: boolean;
}

const ReviewMediaUpload: React.FC<ReviewMediaUploadProps> = ({
  images,
  videos,
  onImagesChange,
  onVideosChange,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { getToken } = useClerkAuth();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        toast.error("API URL not configured");
        return;
      }

      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        // Kiểm tra kích thước (max 5MB cho ảnh)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`Ảnh ${file.name} quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB.`);
          continue;
        }

        // Kiểm tra định dạng
        if (!file.type.startsWith("image/")) {
          toast.error(`File ${file.name} không phải là hình ảnh.`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        // Lấy token từ Clerk
        const token = await getToken();
        
        // Upload lên API
        const response = await fetch(`${apiUrl}/api/upload`, {
          method: "POST",
          body: formData,
          headers: token ? {
            Authorization: `Bearer ${token}`,
          } : {},
        });

        if (response.ok) {
          const data = await response.json();
          if (data.url) {
            uploadedUrls.push(data.url);
            toast.success(`Đã upload ảnh ${file.name} thành công`);
          } else {
            toast.error(`Upload thành công nhưng không có URL trả về`);
          }
        } else {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
          toast.error(`Không thể upload ảnh ${file.name}: ${errorData.error || response.statusText}`);
        }
      }

      if (uploadedUrls.length > 0) {
        onImagesChange([...images, ...uploadedUrls]);
      }
    } catch (error: any) {
      console.error("[REVIEW_UPLOAD] Error uploading images:", error);
      toast.error(`Lỗi khi upload ảnh: ${error.message || "Vui lòng thử lại."}`);
    } finally {
      setUploading(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        toast.error("API URL not configured");
        return;
      }

      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        // Kiểm tra kích thước (max 64MB cho video)
        if (file.size > 64 * 1024 * 1024) {
          toast.error(`Video ${file.name} quá lớn. Vui lòng chọn video nhỏ hơn 64MB.`);
          continue;
        }

        // Kiểm tra định dạng
        if (!file.type.startsWith("video/")) {
          toast.error(`File ${file.name} không phải là video.`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        // Lấy token từ Clerk
        const token = await getToken();
        
        // Upload lên API
        const response = await fetch(`${apiUrl}/api/upload`, {
          method: "POST",
          body: formData,
          headers: token ? {
            Authorization: `Bearer ${token}`,
          } : {},
        });

        if (response.ok) {
          const data = await response.json();
          if (data.url) {
            uploadedUrls.push(data.url);
            toast.success(`Đã upload video ${file.name} thành công`);
          } else {
            toast.error(`Upload thành công nhưng không có URL trả về`);
          }
        } else {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
          toast.error(`Không thể upload video ${file.name}: ${errorData.error || response.statusText}`);
        }
      }

      if (uploadedUrls.length > 0) {
        onVideosChange([...videos, ...uploadedUrls]);
      }
    } catch (error) {
      console.error("Error uploading videos:", error);
      toast.error("Lỗi khi upload video. Vui lòng thử lại.");
    } finally {
      setUploading(false);
      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }
    }
  };

  const removeImage = (url: string) => {
    onImagesChange(images.filter((img) => img !== url));
  };

  const removeVideo = (url: string) => {
    onVideosChange(videos.filter((vid) => vid !== url));
  };

  return (
    <div className="space-y-4">
      {/* Images Preview */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((url, index) => (
            <div
              key={index}
              className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 group"
            >
              <Image
                src={url}
                alt={`Review image ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Videos Preview */}
      {videos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {videos.map((url, index) => (
            <div
              key={index}
              className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 group bg-gray-100 dark:bg-gray-800"
            >
              <video
                src={url}
                className="w-full h-full object-cover"
                controls={false}
                muted
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeVideo(url)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Buttons */}
      {!disabled && (
        <div className="flex gap-2">
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploading || disabled}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            multiple
            onChange={handleVideoUpload}
            className="hidden"
            disabled={uploading || disabled}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => imageInputRef.current?.click()}
            disabled={uploading || disabled}
            className="rounded-none text-xs font-light uppercase tracking-wider border-gray-300 dark:border-gray-700"
          >
            <ImagePlus className="w-4 h-4 mr-2" />
            {uploading ? "Đang tải..." : "Thêm ảnh"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => videoInputRef.current?.click()}
            disabled={uploading || disabled}
            className="rounded-none text-xs font-light uppercase tracking-wider border-gray-300 dark:border-gray-700"
          >
            <Video className="w-4 h-4 mr-2" />
            {uploading ? "Đang tải..." : "Thêm video"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewMediaUpload;

