"use client";

import { Billboard as BillboardType } from "@/types";
import { motion } from "framer-motion";
import { Sparkles, Gift, Zap, Star } from "lucide-react";

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
        style={{
          background: data?.imageUrl
            ? `url(${data.imageUrl}) center/cover`
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px] rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-2xl group"
      >
        {/* Animated Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-neutral-900/90 via-neutral-900/80 to-neutral-900/90"
          animate={{
            background: [
              "linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.9) 100%)",
              "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.85) 100%)",
              "linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.9) 100%)",
            ],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Animated Mesh Gradient Background */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(255,215,0,0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(255,215,0,0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 20%, rgba(255,215,0,0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(255,215,0,0.3) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Enhanced Confetti/Sparkles with glow */}
          {SPARKLE_POSITIONS.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: pos.left,
                top: pos.top,
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0.2, 1, 0.2],
                scale: [0.5, 1.5, 0.5],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3 + (i % 4) * 0.5,
                repeat: Infinity,
                delay: (i % 5) * 0.3,
                ease: "easeInOut",
              }}
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(255,255,255,0.5)",
                    "0 0 20px rgba(255,215,0,0.8)",
                    "0 0 10px rgba(255,255,255,0.5)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                <Sparkles className="w-5 h-5 text-yellow-400 drop-shadow-lg" />
              </motion.div>
            </motion.div>
          ))}

          {/* Floating Stars */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute"
              style={{
                left: `${15 + i * 12}%`,
                top: `${10 + (i % 3) * 30}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1.2, 0.8],
                rotate: [0, 360],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            >
              <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
            </motion.div>
          ))}

          {/* Enhanced Floating Percentage Symbols with glow */}
          {[
            { left: "20%", top: "10%" },
            { left: "35%", top: "20%" },
            { left: "50%", top: "30%" },
            { left: "65%", top: "40%" },
            { left: "80%", top: "50%" },
          ].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute text-white/10 dark:text-white/5 font-black text-7xl md:text-9xl lg:text-[12rem] select-none pointer-events-none"
              style={{
                left: pos.left,
                top: pos.top,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 15, -15, 0],
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeInOut",
              }}
            >
              %
            </motion.div>
          ))}

          {/* Animated Grid Pattern */}
          <motion.div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-start gap-6 px-6 sm:px-12 md:px-16 lg:px-20 py-12">
          {/* Main Text with enhanced animations */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-4"
          >
            <motion.h1
              className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-tight font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.span
                className="block text-white mb-2 drop-shadow-2xl"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(255,255,255,0.5)",
                    "0 0 30px rgba(255,215,0,0.8)",
                    "0 0 20px rgba(255,255,255,0.5)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                CUỐI NĂM
              </motion.span>
              <motion.span
                className="block text-yellow-400 transform -rotate-1 drop-shadow-2xl"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [-1, 1, -1],
                  textShadow: [
                    "0 0 20px rgba(255,215,0,0.5)",
                    "0 0 40px rgba(255,215,0,1)",
                    "0 0 20px rgba(255,215,0,0.5)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                SALE
              </motion.span>
              <motion.span
                className="block text-white text-6xl sm:text-7xl md:text-8xl xl:text-9xl drop-shadow-2xl"
                animate={{
                  x: [0, 5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                TO !!
              </motion.span>
            </motion.h1>

            {/* Enhanced Ribbon Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className="inline-block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 border-2 border-yellow-600 px-6 py-3 rounded-xl shadow-xl relative overflow-hidden group"
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <p className="relative text-neutral-900 text-base md:text-lg font-medium uppercase tracking-wider">
                GIÁ TỐT KHỎI LO
              </p>
            </motion.div>
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

        {/* Enhanced Floating Gift Box */}
        <motion.div
          className="absolute bottom-8 left-8 hidden md:block z-20"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.2, rotate: 15 }}
        >
          <motion.div
            className="bg-gradient-to-br from-neutral-800 to-neutral-900 p-5 rounded-2xl border-2 border-yellow-500/50 shadow-2xl backdrop-blur-sm"
            animate={{
              boxShadow: [
                "0 0 20px rgba(255,215,0,0.3)",
                "0 0 40px rgba(255,215,0,0.6)",
                "0 0 20px rgba(255,215,0,0.3)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Gift className="w-8 h-8 text-yellow-400" />
          </motion.div>
        </motion.div>

        {/* Floating Discount Badge */}
        <motion.div
          className="absolute top-8 right-8 hidden lg:block z-20"
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 1, type: "spring" }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <motion.div
            className="bg-gradient-to-br from-red-500 to-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-red-400"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <p className="text-2xl font-bold">-50%</p>
            <p className="text-xs font-light">OFF</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Billboard;
