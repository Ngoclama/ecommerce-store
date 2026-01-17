import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ═══════════════════════════════════════════════════════
      // 1. TẾT COLOR PALETTE
      // ═══════════════════════════════════════════════════════
      colors: {
        tet: {
          // Reds
          red: "#C81D25", // Primary red Tết
          "red-dark": "#9B111E", // Dark red
          "red-light": "#D32F2F", // Light red
          "red-pale": "#FEE2E4", // Very light red

          // Golds
          gold: "#F5C542", // Primary gold
          "gold-dark": "#E0A000", // Dark gold
          "gold-light": "#FFD54F", // Light gold
          "gold-pale": "#FEF3C7", // Very light gold

          // Whites & Neutrals
          "warm-white": "#FFF9F0", // Warm white/cream
          ivory: "#F5F0E8", // Ivory
          neutral: "#F3F4F6", // Neutral gray

          // Accents
          green: "#4CAF50", // Spring green
          "green-light": "#66BB6A", // Light green
        },
      },

      // ═══════════════════════════════════════════════════════
      // 2. FONTS
      // ═══════════════════════════════════════════════════════
      fontFamily: {
        script: ["Dancing Script", "cursive"], // Heading
        playfair: ["Playfair Display", "serif"], // Fancy
        sans: ["Inter", "system-ui", "sans-serif"], // Body
      },

      // ═══════════════════════════════════════════════════════
      // 3. GRADIENTS
      // ═══════════════════════════════════════════════════════
      backgroundImage: {
        // Primary gradient: Red → Gold
        "gradient-tet":
          "linear-gradient(135deg, #C81D25 0%, #D32F2F 50%, #F5C542 100%)",
        "gradient-tet-rev":
          "linear-gradient(135deg, #F5C542 0%, #D32F2F 50%, #C81D25 100%)",

        // Subtle gradients for backgrounds
        "gradient-tet-subtle":
          "linear-gradient(135deg, rgba(200, 29, 37, 0.05) 0%, rgba(245, 197, 66, 0.05) 100%)",
        "gradient-tet-bg":
          "linear-gradient(180deg, #FFF9F0 0%, #F5F0E8 50%, #FFF9F0 100%)",

        // Dark mode variants
        "gradient-tet-dark":
          "linear-gradient(135deg, #9B111E 0%, #7A0D17 50%, #D4A124 100%)",
      },

      // ═══════════════════════════════════════════════════════
      // 4. SHADOWS
      // ═══════════════════════════════════════════════════════
      boxShadow: {
        // Tết shadows
        tet: "0 8px 16px rgba(200, 29, 37, 0.15)",
        "tet-sm": "0 2px 8px rgba(200, 29, 37, 0.1)",
        "tet-lg": "0 16px 24px rgba(200, 29, 37, 0.2)",

        // Gold glow
        "tet-gold": "0 0 12px rgba(245, 197, 66, 0.3)",
        "tet-gold-glow": "0 0 20px rgba(245, 197, 66, 0.5)",

        // Hover states
        "tet-hover": "0 12px 20px rgba(200, 29, 37, 0.25)",
      },

      // ═══════════════════════════════════════════════════════
      // 5. ANIMATIONS
      // ═══════════════════════════════════════════════════════
      animation: {
        float: "float 3s ease-in-out infinite",
        "bounce-slow": "bounce 2s ease-in-out infinite",
        "glow-tet": "glow-tet 2s ease-in-out infinite",
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
        sway: "sway 2s ease-in-out infinite",
      },

      // ═══════════════════════════════════════════════════════
      // 6. KEYFRAMES
      // ═══════════════════════════════════════════════════════
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "glow-tet": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(200, 29, 37, 0.5)" },
          "50%": { boxShadow: "0 0 15px rgba(245, 197, 66, 0.8)" },
        },
        "pulse-gold": {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 8px rgba(245, 197, 66, 0.3)",
          },
          "50%": {
            opacity: "0.8",
            boxShadow: "0 0 16px rgba(245, 197, 66, 0.6)",
          },
        },
        sway: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(1.5deg)" },
        },
      },

      // ═══════════════════════════════════════════════════════
      // 7. TRANSITIONS
      // ═══════════════════════════════════════════════════════
      transitionDuration: {
        tet: "250ms",
        "tet-slow": "300ms",
      },

      // ═══════════════════════════════════════════════════════
      // 8. BORDER RADIUS
      // ═══════════════════════════════════════════════════════
      borderRadius: {
        tet: "8px",
        "tet-lg": "12px",
      },
    },
  },
  plugins: [],
};
export default config;
