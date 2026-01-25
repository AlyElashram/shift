"use client";

interface LogoProps {
  variant?: "full" | "compact" | "icon";
  color?: "yellow" | "black" | "cream";
  className?: string;
}

export function Logo({
  variant = "full",
  color = "yellow",
  className = "",
}: LogoProps) {
  const colorMap = {
    yellow: "#FFD628",
    black: "#000000",
    cream: "#FCFBE4",
  };

  const fillColor = colorMap[color];

  if (variant === "icon") {
    // Just the "S" with racing lines
    return (
      <svg
        viewBox="0 0 60 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M5 8H15L10 20H20L15 32H5L10 20H0L5 8Z"
          fill={fillColor}
        />
        <rect x="20" y="19" width="40" height="2" fill={fillColor} />
      </svg>
    );
  }

  if (variant === "compact") {
    // SHIFT only with racing lines
    return (
      <svg
        viewBox="0 0 200 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* S */}
        <path
          d="M0 5C0 5 8 5 12 5C16 5 18 7 18 10C18 13 16 15 12 15H6C2 15 0 17 0 20C0 23 2 25 6 25H18"
          stroke={fillColor}
          strokeWidth="3"
          fill="none"
        />
        {/* H */}
        <path d="M25 5V25M25 15H40M40 5V25" stroke={fillColor} strokeWidth="3" />
        {/* Racing lines through I */}
        <rect x="47" y="14" width="100" height="2" fill={fillColor} />
        <rect x="47" y="19" width="80" height="2" fill={fillColor} />
        {/* I vertical */}
        <path d="M50 5V25" stroke={fillColor} strokeWidth="3" />
        {/* F */}
        <path d="M160 5H175M160 5V25M160 15H172" stroke={fillColor} strokeWidth="3" />
        {/* T */}
        <path d="M182 5H200M191 5V25" stroke={fillColor} strokeWidth="3" />
      </svg>
    );
  }

  // Full logo: SHIFT By Joe with racing lines
  return (
    <svg
      viewBox="0 0 320 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="SHIFT By Joe"
    >
      {/* S */}
      <path
        d="M2 10C2 10 8 8 14 8C22 8 26 12 26 18C26 24 22 28 14 28H8C4 28 2 30 2 34C2 38 4 42 10 42H26"
        stroke={fillColor}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* H */}
      <path
        d="M34 8V42M34 25H52M52 8V42"
        stroke={fillColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Racing lines (signature brand element) */}
      <rect x="58" y="23" width="140" height="2.5" fill={fillColor} rx="1" />
      <rect x="58" y="28" width="120" height="2.5" fill={fillColor} rx="1" />
      {/* I */}
      <path
        d="M64 8V42"
        stroke={fillColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* F */}
      <path
        d="M205 8H225M205 8V42M205 24H220"
        stroke={fillColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* T */}
      <path
        d="M235 8H260M247.5 8V42"
        stroke={fillColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* "By Joe" in italic script style */}
      <text
        x="115"
        y="22"
        fill={fillColor}
        fontFamily="'Playfair Display', serif"
        fontStyle="italic"
        fontSize="16"
        fontWeight="400"
      >
        By Joe
      </text>
    </svg>
  );
}

export default Logo;
