import React from "react";

interface EyebrowProps {
  text: string;
  tone?: "dark" | "light" | "onSignal";
  align?: "left" | "center";
}

const Eyebrow: React.FC<EyebrowProps> = ({
  text,
  tone = "dark",
  align = "left",
}) => {
  const textColor =
    tone === "dark"
      ? "text-white/90"
      : tone === "light"
        ? "text-[#3D3A32]"
        : "text-black/85";

  const dotBg =
    tone === "onSignal"
      ? "bg-black"
      : "bg-trillex-signal shadow-[0_0_8px_rgba(222,138,30,0.6)]";

  return (
    <div
      className={`flex items-center gap-2.5 sm:gap-3 ${align === "center" ? "justify-center" : "justify-start"}`}
    >
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${dotBg}`}
      />
      <span
        className={`font-mono text-[11px] font-medium tracking-[0.22em] sm:text-xs md:text-[13px] md:tracking-[0.25em] uppercase ${textColor}`}
      >
        {text}
      </span>
    </div>
  );
};

export default Eyebrow;
