import React from "react";

// Optimization: Define static data outside component to avoid re-splitting on every render
export const TEXT =
  "Founded with a clear vision, Trillex Music Group runs on global scale, transparency, and precise execution. Our systems support artists with clear communication and fast action. We move with discipline and honesty, setting a higher standard for how a modern music company should operate.";
export const WORDS = TEXT.split(" ");
// Find the index of "on" in "...runs on" to set as the split point for the animation
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
      className="absolute inset-0 z-10 w-full h-full flex items-center justify-center bg-transparent pt-20 md:pt-24 pb-8 pointer-events-none select-none"
    >
      <div className="w-full max-w-7xl px-8 md:px-12 text-center flex flex-col items-center pointer-events-auto">
        {/* About Label */}
        <div className="w-full flex justify-start mb-4 sm:mb-6">
          <span className="text-trillex-orange text-xl font-mono font-bold tracking-widest uppercase">
            About
          </span>
        </div>

        <div className="text-[22px] sm:text-[28px] md:text-[40px] lg:text-[48px] font-zalando font-extrabold italic leading-tight flex flex-wrap justify-center gap-x-2 md:gap-x-4 gap-y-1 md:gap-y-2 tracking-normal">
          {WORDS.map((word, i) => (
            <span
              key={i}
              className="word will-change-[opacity,color]"
            >
              {word}
            </span>
          ))}
        </div>

        {/* Footer Text with Neon Glow and Scroll Reveal */}
        <div className="mt-6 sm:mt-8 text-trillex-orange text-lg md:text-2xl font-sans font-medium tracking-wider flex gap-x-2 flex-wrap justify-center relative z-20">
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
