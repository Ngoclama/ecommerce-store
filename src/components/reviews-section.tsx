"use client";

import { useState } from "react";
import { Star, ThumbsUp, ThumbsDown, User } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/use-auth";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
}

interface ReviewsSectionProps {
  productId: string;
  averageRating?: number;
  totalReviews?: number;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  productId,
  averageRating = 0,
  totalReviews = 0,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { requireAuth } = useAuth();

  const reviews: Review[] = [];

  const handleShowForm = () => {
    if (!requireAuth("viết đánh giá")) {
      return;
    }
    setShowForm(true);
  };

  const handleSubmitReview = () => {
    if (!requireAuth("gửi đánh giá")) {
      return;
    }

    setShowForm(false);
    setRating(0);
    setComment("");
  };

  return (
    <div className="border-t border-gray-200 pt-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-light text-black mb-2 uppercase tracking-wider">
            Reviews
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
            <span className="text-gray-600 text-xs font-light">
              {averageRating.toFixed(1)} ({totalReviews} reviews)
            </span>
          </div>
        </div>
        <Button
          onClick={handleShowForm}
          variant="outline"
          className="rounded-none text-xs font-light uppercase tracking-wider"
        >
          Write review
        </Button>
      </div>

      {/* Review Form - Aigle Style */}
      {showForm && (
        <div className="bg-white p-6 mb-6 border border-gray-300">
          <h4 className="text-sm font-light text-black mb-4 uppercase tracking-wider">
            Write your review
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-light text-gray-700 mb-2 uppercase tracking-wider">
                Rating *
              </label>
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setRating(i + 1)}
                    className={cn(
                      "w-10 h-10 rounded-none transition-all border border-gray-300",
                      i < rating
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-400 hover:border-black"
                    )}
                  >
                    <Star className="w-4 h-4 mx-auto" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-light text-gray-700 mb-2 uppercase tracking-wider">
                Comment *
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience about this product..."
                className="min-h-[120px] rounded-none border-gray-300 text-sm font-light"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setRating(0);
                  setComment("");
                }}
                className="rounded-none text-xs font-light uppercase tracking-wider"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={rating === 0 || !comment.trim()}
                variant="outline"
                className="rounded-none text-xs font-light uppercase tracking-wider"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List - Aigle Style */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-300">
          <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-sm font-light">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-200 pb-6 last:border-0"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-black" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-black text-sm font-light uppercase tracking-wide">
                      {review.userName}
                    </span>
                    {review.verified && (
                      <span className="text-xs bg-gray-100 text-black px-2 py-0.5 border border-gray-300 font-light uppercase">
                        Verified
                      </span>
                    )}
                    <span className="text-xs text-gray-600 font-light">
                      {review.date}
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
                  <p className="text-gray-700 mb-3 text-sm font-light">
                    {review.comment}
                  </p>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-xs font-light text-gray-600 hover:text-black transition">
                      <ThumbsUp className="w-4 h-4" />
                      Helpful ({review.helpful})
                    </button>
                    <button className="flex items-center gap-1 text-xs font-light text-gray-600 hover:text-black transition">
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
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
