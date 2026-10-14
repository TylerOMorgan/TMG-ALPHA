import React from "react";

import { WORDS, FOOTER_WORDS } from "../Manifesto";
import "./variants.css";

interface ManifestoProps {
  isActive?: boolean;
}

const SubmergeWord: React.FC<{ text: string; className?: string }> = ({ text, className = "" }) => (
  <span className={`submerge-anchor ${className}`}>
    <span className="submerge-source">{text}</span>
    <span className="submerge-ink" aria-hidden="true">
      {Array.from(text).map((letter, i) => (
        <span key={i} className="submerge-glyph">{letter}</span>
      ))}
    </span>
  </span>
);

const SubmergeManifesto: React.FC<ManifestoProps> = () => {
  return (
    <section
      id="about-manifesto"
      className="absolute inset-x-0 top-0 md:top-[20px] z-10 w-full flex justify-center bg-transparent pt-20 md:pt-28 pb-6 sm:pb-12 md:pb-16 pointer-events-none select-none"
    >
      <div className="max-w-7xl px-4 sm:px-8 md:px-12 text-center flex flex-col items-center pointer-events-auto">
        {/* About Label */}
        <div className="about-label-wrapper w-full flex justify-start mb-2 sm:mb-4 md:mb-8">
          <span className="text-trillex-orange text-sm sm:text-base md:text-xl font-mono font-bold tracking-widest uppercase">
            <SubmergeWord text="About" />
          </span>
        </div>

        <div className="manifesto-headline text-[19px] sm:text-[26px] md:text-[40px] lg:text-[48px] font-zalando font-extrabold italic leading-[1.28] flex flex-wrap justify-center gap-x-1.5 sm:gap-x-2 md:gap-x-4 gap-y-1 md:gap-y-2 tracking-normal">
          {WORDS.map((word, i) => (
            <SubmergeWord
              key={i}
              className="word transition-colors duration-200 will-change-[opacity,color]"
              text={word}
            />
          ))}
        </div>

        {/* Footer Text with Neon Glow and Scroll Reveal */}
        <div className="manifesto-footer mt-5 sm:mt-8 md:mt-12 text-trillex-orange text-sm sm:text-lg md:text-2xl font-sans font-medium tracking-wider flex gap-x-2 flex-wrap justify-center relative z-20">
          {FOOTER_WORDS.map((word, i) => (
            <SubmergeWord
              key={i}
              className="footer-word will-change-[opacity,text-shadow]"
              text={word}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(SubmergeManifesto);
