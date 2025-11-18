"use client";

import { Billboard as BillboardType } from "@/types";
import { motion } from "framer-motion";

interface BillboardProps {
  data: BillboardType;
}

const Billboard: React.FC<BillboardProps> = ({ data }) => {
  return (
    <div className="w-full pt-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full aspect-[2.5/1] md:aspect-[3/1] rounded-xl overflow-hidden bg-center bg-cover"
        style={{ backgroundImage: `url(${data?.imageUrl})` }}
      >
        {/* Overlay gradient đẹp mắt */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        {/* Nội dung */}
        <div className="relative h-full flex flex-col justify-center items-start text-left gap-6 px-6 sm:px-12">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-extrabold text-white text-4xl sm:text-5xl lg:text-6xl max-w-xl leading-tight drop-shadow-2xl"
          >
            {data?.label}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-white/90 text-lg sm:text-xl max-w-lg leading-relaxed"
          >
            Discover new collections and exclusive offers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <button className="px-10 py-3 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all shadow-lg">
              Shop Now
            </button>

            <button className="px-10 py-3 bg-white/20 text-white font-semibold rounded-full border border-white/40 hover:bg-white/30 backdrop-blur-sm transition-all">
              Learn More
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Billboard;
