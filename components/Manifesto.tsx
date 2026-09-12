import React from "react";

// Static data defined outside component to avoid re-splitting on every render
export const TEXT =
  "Founded with a clear vision, Trillex Music Group runs on global scale, transparency, and precise execution. Our systems support artists with clear communication and fast action. We move with discipline and honesty, setting a higher standard for how a modern music company should operate.";
export const WORDS = TEXT.split(" ");
export const PIVOT_INDEX = WORDS.findIndex(
  (word, i) => word === "on" && WORDS[i - 1] === "runs",
);

export const FOOTER_TEXT = "Established in BKK 2024";
export const FOOTER_WORDS = FOOTER_TEXT.split(" ");

interface ManifestoProps {
  isActive?: boolean;
}

const Manifesto: React.FC<ManifestoProps> = () => {
  return (
    <section
      id="about-manifesto"
      style={{ top: "20px" }}
      className="absolute inset-x-0 top-[20px] z-10 w-full flex justify-center bg-transparent pt-28 pb-12 sm:pb-16 pointer-events-none select-none"
    >
      <div className="max-w-7xl px-8 md:px-12 text-center flex flex-col items-center pointer-events-auto">
        {/* About Label */}
        <div className="w-full flex justify-start mb-8">
          <span className="text-trillex-orange text-xl font-mono font-bold tracking-widest uppercase">
            About
          </span>
        </div>

        <div className="text-[22px] sm:text-[28px] md:text-[40px] lg:text-[48px] font-zalando font-extrabold italic leading-tight flex flex-wrap justify-center gap-x-2 md:gap-x-4 gap-y-1 md:gap-y-2 tracking-normal">
          {WORDS.map((word, i) => (
            <span
              key={i}
              className="word transition-colors duration-200 will-change-[opacity,color]"
            >
              {word}
            </span>
          ))}
        </div>

        {/* Footer Text with Neon Glow and Scroll Reveal */}
        <div className="mt-10 sm:mt-12 text-trillex-orange text-lg md:text-2xl font-sans font-medium tracking-wider flex gap-x-2 flex-wrap justify-center relative z-20">
          {FOOTER_WORDS.map((word, i) => (
            <span
              key={i}
              className="footer-word will-change-[opacity,text-shadow]"
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Manifesto);
