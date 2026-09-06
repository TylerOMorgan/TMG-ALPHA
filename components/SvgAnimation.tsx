import React from 'react';

const SvgAnimation: React.FC = () => {
  return (
    <section 
      id="about-ecosystem-animation"
      className="relative w-full pt-8 sm:pt-12 md:pt-16 pb-16 sm:pb-24 md:pb-32 bg-trillex-black flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Subtle ambient gradient glow in the background matching the brand palette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] lg:w-[1100px] h-[300px] md:h-[450px] bg-gradient-to-r from-trillex-orange/10 via-cyan-500/5 to-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <div className="relative w-full aspect-[16/9] flex items-center justify-center">
          <object
            data="/Trillex%20Website%20SVG%20Animations.svg"
            type="image/svg+xml"
            className="w-full h-full object-contain pointer-events-none select-none"
            aria-label="Trillex Website SVG Animations"
          >
            <img
              src="/Trillex%20Website%20SVG%20Animations.svg"
              alt="Trillex Website SVG Animations"
              className="w-full h-full object-contain select-none"
              loading="lazy"
            />
          </object>
        </div>
      </div>
    </section>
  );
};

export default SvgAnimation;
