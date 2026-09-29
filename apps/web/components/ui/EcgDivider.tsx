import React from "react";

interface EcgDividerProps {
  className?: string;
  variant?: "truth" | "muted" | "false";
  height?: number;
}

export const EcgDivider: React.FC<EcgDividerProps> = ({
  className = "",
  variant = "truth",
  height = 32,
}) => {
  const colorMap = {
    truth: "#2DD4BF",
    muted: "#7D8B99",
    false: "#FF5A5F",
  };

  const strokeColor = colorMap[variant] || colorMap.truth;

  return (
    <div
      className={`relative w-full flex items-center justify-center overflow-hidden py-2 ${className}`}
      data-testid="ecg-divider"
      role="separator"
      aria-label="Separador clínico ECG"
    >
      <svg
        viewBox="0 0 600 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-4xl h-8 opacity-80"
        style={{ height: `${height}px` }}
      >
        {/* Baseline faint track */}
        <line
          x1="0"
          y1="20"
          x2="600"
          y2="20"
          stroke="#1C2633"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* ECG Lead II wave pattern */}
        <path
          d="M0 20 L160 20 L175 20 Q185 18 190 20 L200 20 L208 12 L215 28 L222 2 L230 36 L237 17 L244 20 L260 20 Q275 14 285 20 L300 20 L460 20 L475 20 Q485 18 490 20 L500 20 L508 12 L515 28 L522 2 L530 36 L537 17 L544 20 L560 20 Q575 14 585 20 L600 20"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-ecg"
        />
      </svg>
    </div>
  );
};
