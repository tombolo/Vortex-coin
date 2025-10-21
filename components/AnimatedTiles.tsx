"use client";
import React from "react";
import { FaFlask, FaCode, FaBolt, FaImage, FaMicrophone, FaLanguage, FaRobot, FaBrain, FaGlobe, FaChartLine } from "react-icons/fa";

const icons = [FaFlask, FaCode, FaBolt, FaImage, FaMicrophone, FaLanguage, FaRobot, FaBrain, FaGlobe, FaChartLine];
const palettes = [
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#22c55e",
  "#f97316",
  "#3b82f6",
  "#e11d48",
];

function Row({ index }: { index: number }) {
  const dir = index % 2 === 0 ? "normal" : "reverse";
  const Icon = icons[index % icons.length];
  return (
    <div className={`tiles-row tiles-row-${dir}`}>
      {Array.from({ length: 18 }).map((_, i) => {
        const I = icons[(i + index) % icons.length] || Icon;
        const bg = palettes[(i + index) % palettes.length];
        return (
          <div key={i} className="tile" style={{ background: bg }}>
            <I className="tile-icon" />
          </div>
        );
      })}
    </div>
  );
}

export default function AnimatedTiles() {
  return (
    <div className="tiles-scene">
      <div className="tiles-belt">
        {Array.from({ length: 5 }).map((_, r) => (
          <Row key={r} index={r} />
        ))}
      </div>
      <div className="tiles-overlay" />
    </div>
  );
}
