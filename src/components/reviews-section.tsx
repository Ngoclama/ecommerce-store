"use client";

import { useState, useEffect } from "react";
import { Star, User, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/use-auth";
import { useAuth as useClerkAuth } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";
import Image from "next/image";
import ReviewMediaUpload from "./review-media-upload";

interface Review {
  id: string;
  rating: number;
  content: string | null;
  imageUrls: string[];
  videoUrls?: string[];
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    imageUrl: string | null;
  };
  adminResponse: string | null;
}

interface ReviewsSectionProps {
  productId: string;
  storeId?: string;
  averageRating?: number;
  totalReviews?: number;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  productId,
  storeId,
  averageRating: initialAverageRating = 0,
  totalReviews: initialTotalReviews = 0,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [averageRating, setAverageRating] = useState(initialAverageRating);
  const [totalReviews, setTotalReviews] = useState(initialTotalReviews);
  const [mounted, setMounted] = useState(false);
  const { requireAuth, isAuthenticated } = useAuth();
  const { getToken } = useClerkAuth();

  // Set mounted state để tránh hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl || !storeId) {
          console.warn("API URL or Store ID not configured");
          setLoading(false);
          return;
        }

        const baseUrl = apiUrl.replace(/\/$/, "");
        const url = `${baseUrl}/api/${storeId}/reviews?productId=${productId}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();
          setReviews(data);

          
          if (data.length > 0) {
            const sum = data.reduce(
              (acc: number, r: Review) => acc + r.rating,
              0
            );
            setAverageRating(sum / data.length);
            setTotalReviews(data.length);
          } else {
            setAverageRating(0);
            setTotalReviews(0);
          }
        }
      } catch (error) {
        console.error("[REVIEWS_FETCH_ERROR]", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId && storeId) {
      fetchReviews();
    }
  }, [productId, storeId]);

  const handleShowForm = () => {
    if (!requireAuth("viết đánh giá")) {
      return;
    }
    setShowForm(true);
  };

  const handleSubmitReview = async () => {
    if (!requireAuth("gửi đánh giá")) {
      return;
    }

    if (rating === 0 || !comment.trim()) {
      toast.error("Vui lòng chọn đánh giá và nhập bình luận");
      return;
    }

    if (!storeId) {
      toast.error("Không tìm thấy thông tin cửa hàng");
      return;
    }

    try {
      setSubmitting(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        toast.error("Chưa cấu hình API URL");
        return;
      }

      const baseUrl = apiUrl.replace(/\/$/, "");
      const url = `${baseUrl}/api/${storeId}/reviews`;

      // Lấy token từ Clerk
      const token = await getToken();
      if (!token) {
        toast.error("Bạn cần đăng nhập để đánh giá sản phẩm");
        return;
      }

      const response = await axios.post(
        url,
        {
          productId,
          rating,
          content: comment.trim(),
          imageUrls: imageUrls,
          videoUrls: videoUrls,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data) {
        toast.success("Đánh giá của bạn đã được gửi thành công!");
        setShowForm(false);
        setRating(0);
        setComment("");
        setImageUrls([]);
        setVideoUrls([]);

        
        const reviewsResponse = await fetch(
          `${baseUrl}/api/${storeId}/reviews?productId=${productId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        if (reviewsResponse.ok) {
          const data = await reviewsResponse.json();
          setReviews(data);
          if (data.length > 0) {
            const sum = data.reduce(
              (acc: number, r: Review) => acc + r.rating,
              0
            );
            setAverageRating(sum / data.length);
            setTotalReviews(data.length);
          }
        }
      }
    } catch (error: any) {
      console.error("[REVIEW_SUBMIT_ERROR]", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể gửi đánh giá. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-light text-black dark:text-white mb-2 uppercase tracking-wider">
            Đánh giá
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < Math.round(averageRating)
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-gray-400"
                  )}
                />
              ))}
            </div>
            <span className="text-gray-600 dark:text-gray-400 text-xs font-light">
              {averageRating.toFixed(1)} ({totalReviews} đánh giá)
            </span>
          </div>
        </div>
        {mounted && isAuthenticated && (
          <Button
            onClick={handleShowForm}
            variant="outline"
            className="rounded-none text-xs font-light uppercase tracking-wider border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white"
          >
            Viết đánh giá
          </Button>
        )}
      </div>

      {}
      {showForm && (
        <div className="bg-white dark:bg-gray-900 p-6 mb-6 border border-gray-300 dark:border-gray-700">
          <h4 className="text-sm font-light text-black dark:text-white mb-4 uppercase tracking-wider">
            Viết đánh giá của bạn
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-light text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                Đánh giá *
              </label>
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    className={cn(
                      "w-10 h-10 rounded-none transition-all border",
                      i < rating
                        ? "bg-gray-400 dark:bg-gray-500 text-white border-gray-400 dark:border-gray-500"
                        : "bg-white dark:bg-gray-800 text-gray-400 border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white"
                    )}
                  >
                    <Star className="w-4 h-4 mx-auto" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-light text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                Bình luận *
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                className="min-h-[120px] rounded-none border-gray-300 dark:border-gray-700 text-sm font-light bg-white dark:bg-gray-800 text-black dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-light text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                Hình ảnh / Video (tùy chọn)
              </label>
              <ReviewMediaUpload
                images={imageUrls}
                videos={videoUrls}
                onImagesChange={setImageUrls}
                onVideosChange={setVideoUrls}
                disabled={submitting}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setRating(0);
                  setComment("");
                  setImageUrls([]);
                  setVideoUrls([]);
                }}
                disabled={submitting}
                className="rounded-none text-xs font-light uppercase tracking-wider border-gray-300 dark:border-gray-700"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={rating === 0 || !comment.trim() || submitting}
                variant="default"
                className="rounded-none text-xs font-light uppercase tracking-wider bg-gray-400 dark:bg-gray-500 text-white hover:bg-gray-900 dark:hover:bg-gray-900 hover:shadow-lg hover:shadow-gray-400/30 transition-all duration-300 ease-in-out hover:scale-[1.01] active:scale-[0.99]"
              >
                {submitting ? "Đang gửi..." : "Gửi đánh giá"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {}
      {loading ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-light">
            Đang tải đánh giá...
          </p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
          <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-sm font-light">
            Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-200 dark:border-gray-800 pb-6 last:border-0"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 rounded-full">
                  {review.user.imageUrl ? (
                    <Image
                      src={review.user.imageUrl}
                      alt={review.user.name || review.user.email}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5 text-black dark:text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-black dark:text-white text-sm font-light uppercase tracking-wide">
                      {review.user.name || review.user.email.split("@")[0]}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-light">
                      {format(new Date(review.createdAt), "dd/MM/yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < review.rating
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-gray-400"
                        )}
                      />
                    ))}
                  </div>
                  {review.content && (
                    <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm font-light">
                      {review.content}
                    </p>
                  )}
                  {(review.imageUrls?.length > 0 ||
                    (review.videoUrls && review.videoUrls.length > 0)) && (
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {review.imageUrls?.map((url, idx) => (
                        <div
                          key={`img-${idx}`}
                          className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700"
                        >
                          <Image
                            src={url}
                            alt={`Review image ${idx + 1}`}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                      ))}
                      {review.videoUrls?.map((url, idx) => (
                        <div
                          key={`vid-${idx}`}
                          className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
                        >
                          <video
                            src={url}
                            className="w-full h-full object-cover"
                            controls
                            muted
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {}
                  {review.adminResponse && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-black dark:border-white">
                      <div className="flex items-start gap-2 mb-2">
                        <MessageCircle className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                        <span className="text-xs font-light text-black dark:text-white uppercase tracking-wider">
                          Phản hồi từ cửa hàng
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-light">
                        {review.adminResponse}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
