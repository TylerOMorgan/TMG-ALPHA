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
      ? "text-white/45"
      : tone === "light"
        ? "text-[#8F8B7C]"
        : "text-black/60";
  return (
    <div
      className={`flex items-center gap-2.5 ${align === "center" ? "justify-center" : "justify-start"}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone === "onSignal" ? "bg-black" : "bg-trillex-signal"}`}
      />
      <span
        className={`font-mono text-[10px] tracking-[0.28em] md:text-[11px] ${textColor}`}
      >
        {text}
      </span>
    </div>
  );
};

export default Eyebrow;
