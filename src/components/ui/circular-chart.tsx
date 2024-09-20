"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CircularChartProps {
  percentage: number;
}

const CircularChart: React.FC<CircularChartProps> = ({ percentage }) => {
  const [currentPercentage, setCurrentPercentage] = useState(0);

  useEffect(() => {
    setCurrentPercentage(percentage);
  }, [percentage]);

  const circumference = 2 * Math.PI * 16; // 16 is the radius of the circle

  const getColor = (percent: number) => {
    if (percent === 0) return "bg-gray-900";
    if (percent < 20) return "#4CC790"; // green
    if (percent < 60) return "#ff9f00"; // orange
    return "#FF0000"; // red
  };

  const color = getColor(currentPercentage);

  return (
    <div className="w-full mx-auto my-2.5 relative ">
      <svg viewBox="0 0 36 36" className="w-full">
        <defs>
          <radialGradient
            id={`circleGradient-${currentPercentage}`}
            gradientUnits="userSpaceOnUse"
            cx="18"
            cy="18"
            r="18"
          >
            <motion.stop
              offset="0%"
              stopColor={color}
              animate={{ stopOpacity: currentPercentage / 100 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle
          className="fill-none stroke-gray-800 stroke-[3.8]"
          cx="18"
          cy="18"
          r="16"
        />
        <motion.circle
          className="fill-none stroke-[2.8]"
          cx="18"
          cy="18"
          r="16"
          stroke={color}
          strokeLinecap="round"
          fill={`url(#circleGradient-${currentPercentage})`}
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{
            strokeDasharray: `${
              (currentPercentage / 100) * circumference
            } ${circumference}`,
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[#666] text-xl sm:text-lg md:text-xl font-sans font-bold">
          {Math.round(currentPercentage)}%
        </span>
      </div>
    </div>
  );
};

export default CircularChart;
