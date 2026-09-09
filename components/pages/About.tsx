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
    <div className="bg-trillex-black min-h-screen pt-20 md:pt-24">
      <Manifesto isActive={isActive} />

      {/* Trillex Website SVG Animations */}
      <SvgAnimation isActive={isActive} />

      <Services />

      {/* Spacer between Services and FounderWord */}
      <div className="w-full h-24 md:h-48" />

      <FounderWord />
      <Footer />
    </div>
  );
};

export default React.memo(About);
