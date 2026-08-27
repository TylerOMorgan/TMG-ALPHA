import React, { useEffect } from 'react';
import Manifesto from '../Manifesto';
import SubLabels from '../SubLabels';
import Services from '../Services';
import FounderWord from '../FounderWord';
import Footer from '../Footer';

const About: React.FC = () => {

  // Set page title
  useEffect(() => {
    document.title = 'ABOUT — TRILLEX';
  }, []);
  
  return (
    <div className="bg-trillex-black min-h-screen pt-28">
      <Manifesto />
      
      {/* Sub-Labels Imprints Showcase */}
      <SubLabels />

      <Services />

      {/* Spacer between Services and FounderWord */}
      <div className="w-full h-24 md:h-48" />

      <FounderWord />
      <Footer />
    </div>
  );
};

export default About;