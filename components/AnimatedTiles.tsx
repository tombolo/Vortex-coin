"use client";
import React from "react";
import { FaFlask, FaCode, FaBolt, FaImage, FaMicrophone, FaLanguage, FaRobot, FaBrain, FaGlobe, FaChartLine } from "react-icons/fa";

const icons = [FaFlask, FaCode, FaBolt, FaImage, FaMicrophone, FaLanguage, FaRobot, FaBrain, FaGlobe, FaChartLine];
const palettes = [
  "#38bdf8", // sky-400
  "#22d3ee", // cyan-400
  "#34d399", // emerald-400
  "#fbbf24", // amber-400
  "#fb7185", // rose-400
  "#a78bfa", // violet-400
  "#60a5fa", // blue-400
  "#f97316", // orange-500
  "#84cc16", // lime-500
  "#e879f9", // fuchsia-400
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
