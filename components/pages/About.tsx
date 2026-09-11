import React, { useEffect } from 'react';
import Manifesto from '../Manifesto';
import SvgAnimation from '../SvgAnimation';
import Services from '../Services';
import FounderWord from '../FounderWord';
import Footer from '../Footer';

interface AboutProps {
  isActive?: boolean;
}

const About: React.FC<AboutProps> = ({ isActive = true }) => {

  // Set page title
  useEffect(() => {
    if (isActive) {
      document.title = 'ABOUT — TRILLEX';
    }
  }, [isActive]);
  
  return (
    <div className="bg-trillex-black min-h-screen">
      {/* Pinned Hero Stage: Combined Manifesto Reveal & Ecosystem SVG Unfolding Animation */}
      <div
        id="about-hero-stage"
        className="relative w-full h-screen min-h-[580px] overflow-hidden select-none"
      >
        <Manifesto isActive={isActive} />
        <SvgAnimation isActive={isActive} />
      </div>

      <Services />

      {/* Spacer between Services and FounderWord */}
      <div className="w-full h-24 md:h-48" />

      <FounderWord />
      <Footer />
    </div>
  );
};

export default React.memo(About);
