import React, { useEffect } from "react";
import Manifesto from "../Manifesto";
import SvgAnimation from "../SvgAnimation";
import Services from "../Services";
import FounderWord from "../FounderWord";
import Footer from "../Footer";
import AboutVariantAnimation from "../about/AboutVariantAnimation";
import SubmergeManifesto from "../about/SubmergeManifesto";

interface AboutProps {
  isActive?: boolean;
  variant?: "original" | "waterline" | "submersion";
}

const About: React.FC<AboutProps> = ({ isActive = true, variant = "original" }) => {
  // Set page title
  useEffect(() => {
    if (isActive) {
      const label = variant === "waterline" ? "ABOUT 2" : variant === "submersion" ? "ABOUT 3" : "ABOUT";
      document.title = `${label} — TRILLEX`;
    }
  }, [isActive, variant]);

  return (
    <div className="bg-trillex-black min-h-screen" data-about-variant={variant}>
      {/* Pinned Hero Stage: Combined Manifesto Reveal & Ecosystem SVG Unfolding Animation */}
      <div
        id="about-hero-stage"
        className="relative w-full h-screen min-h-[580px] overflow-hidden select-none"
      >
        {variant === "submersion" ? <SubmergeManifesto /> : <Manifesto isActive={isActive} />}
        {variant === "original" ? (
          <SvgAnimation isActive={isActive} />
        ) : (
          <AboutVariantAnimation isActive={isActive} variant={variant} />
        )}
      </div>

      <Services isActive={isActive} />

      {/* Spacer between Services and FounderWord */}
      <div className="w-full h-12 md:h-36 lg:h-48" />

      <FounderWord />
      <Footer showScrollTop />
    </div>
  );
};

export default React.memo(About);
