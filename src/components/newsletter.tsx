// Giả định nội dung file newsletter.tsx (cần kiểm tra)
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Vui lòng nhập email hợp lệ.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Đăng ký thành công!");
      setEmail("");
    }, 1500);
  };

  return (
    <div className="row-start-3 md:row-start-auto md:col-span-1">
      <h4 className="text-lg mb-3 font-light text-black uppercase tracking-wider">
        Newsletter
      </h4>
      <p className="text-sm text-gray-600 mb-4 font-light">
        Đăng ký để nhận ưu đãi và tin tức mới nhất.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email-newsletter" className="sr-only">
            Email Address
          </Label>
          <div className="flex gap-2">
            <Input
              id="email-newsletter"
              type="email"
              placeholder="Email của bạn"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="flex-grow rounded-none border-gray-300 focus:border-black"
            />
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              variant="default"
              className="rounded-none"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
