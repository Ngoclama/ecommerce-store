"use client";

export const DecorativeLanterns = () => {
  return (
    <div className="fixed w-full h-full pointer-events-none z-0 overflow-hidden top-0 left-0">
      {/* Top Left Lantern */}
      <div className="absolute top-4 left-4 text-4xl opacity-20 animate-pulse">
        🏮
      </div>

      {/* Top Right Lantern */}
      <div className="absolute top-4 right-4 text-4xl opacity-20 animate-pulse animation-delay-1000">
        🏮
      </div>

      {/* Bottom Left Lantern */}
      <div className="absolute bottom-20 left-4 text-3xl opacity-15 animate-pulse animation-delay-2000">
        🧧
      </div>

      {/* Bottom Right Lantern */}
      <div className="absolute bottom-20 right-4 text-3xl opacity-15 animate-pulse animation-delay-3000">
        🧧
      </div>

      {/* Floating decorations */}
      <div className="absolute top-1/4 left-1/3 text-5xl opacity-10 floating-decoration">
        ✨
      </div>

      <div className="absolute bottom-1/3 right-1/4 text-5xl opacity-10 floating-decoration animation-delay-1000">
        ✨
      </div>
    </div>
  );
};
