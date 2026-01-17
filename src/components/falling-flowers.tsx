"use client";

import { useState, useEffect } from "react";

export const FallingFlowers = () => {
  const [isVisible, setIsVisible] = useState(true);
  const flowers = ["🌸", "🌸", "🌸", "🌸", "🌸", "🌸", "🌸", "🌸"];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="flower-container">
      {flowers.map((flower, index) => (
        <div key={index} className="flower">
          {flower}
        </div>
      ))}
    </div>
  );
};
