"use client";

import { Billboard as BillboardType } from "@/types";
import { motion } from "framer-motion";
import { Sparkles, Gift, Zap } from "lucide-react";
import { Button } from "./ui/button";

// Fixed positions for sparkles to avoid hydration mismatch
const SPARKLE_POSITIONS = [
  { left: "10%", top: "15%" },
  { left: "25%", top: "30%" },
  { left: "40%", top: "20%" },
  { left: "55%", top: "45%" },
  { left: "70%", top: "35%" },
  { left: "85%", top: "25%" },
  { left: "15%", top: "60%" },
  { left: "30%", top: "70%" },
  { left: "45%", top: "55%" },
  { left: "60%", top: "80%" },
  { left: "75%", top: "65%" },
  { left: "90%", top: "50%" },
  { left: "20%", top: "10%" },
  { left: "35%", top: "40%" },
  { left: "50%", top: "25%" },
  { left: "65%", top: "60%" },
  { left: "80%", top: "75%" },
  { left: "5%", top: "50%" },
  { left: "95%", top: "30%" },
  { left: "12%", top: "85%" },
];

interface BillboardProps {
  data: BillboardType;
}

const Billboard: React.FC<BillboardProps> = ({ data }) => {
  return (
    <div className="w-full relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full min-h-[400px] md:min-h-[500px] rounded-xl overflow-hidden border border-neutral-700"
        style={{
          background: data?.imageUrl
            ? `url(${data.imageUrl}) center/cover`
            : "rgb(23 15% 9%)",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-neutral-900/80" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Confetti/Sparkles */}
          {SPARKLE_POSITIONS.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: pos.left,
                top: pos.top,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2 + (i % 3) * 0.5,
                repeat: Infinity,
                delay: (i % 4) * 0.5,
              }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>
          ))}

          {/* Floating Percentage Symbols */}
          {[
            { left: "20%", top: "10%" },
            { left: "35%", top: "20%" },
            { left: "50%", top: "30%" },
            { left: "65%", top: "40%" },
            { left: "80%", top: "50%" },
          ].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute text-white/20 font-black text-6xl md:text-8xl"
              style={{
                left: pos.left,
                top: pos.top,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              %
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center items-start gap-6 px-6 sm:px-12 md:px-16 py-12">
          {/* Main Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight">
              <span className="block text-white mb-2">CUỐI NĂM</span>
              <span className="block text-yellow-500 transform -rotate-1">
                SALE
              </span>
              <span className="block text-white text-6xl sm:text-7xl md:text-8xl">
                TO !!
              </span>
            </h1>

            {/* Ribbon Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="inline-block bg-yellow-500 border border-neutral-700 px-4 py-2 rounded-lg"
            >
              <p className="text-neutral-900 text-base md:text-lg uppercase">
                GIÁ TỐT KHỎI LO
              </p>
            </motion.div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 pt-4"
          >
            <Button
              size="lg"
              className="bg-yellow-500 text-neutral-900 hover:bg-yellow-600 border border-neutral-700 rounded-lg"
            >
              MUA NGAY
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-neutral-800/50 text-neutral-200 border border-neutral-700 hover:bg-neutral-800 rounded-lg"
            >
              XEM THÊM
            </Button>
          </motion.div>
        </div>

        {/* Right Side Product Image Area (if image provided) */}
        {data?.imageUrl && (
          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
            <div className="relative h-full">
              <motion.img
                src={data.imageUrl}
                alt={data.label}
                className="absolute right-0 top-1/2 -translate-y-1/2 h-[80%] object-contain"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </div>
          </div>
        )}

        {/* Floating Gift Box */}
        <motion.div
          className="absolute bottom-8 left-8 hidden md:block"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <div className="bg-neutral-800 p-4 rounded-xl border border-neutral-700">
            <Gift className="w-6 h-6 text-yellow-500" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Billboard;
