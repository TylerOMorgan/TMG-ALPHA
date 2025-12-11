import React, { useEffect } from 'react';
import Hero from '../Hero';
import Footer from '../Footer';

const Home: React.FC = () => {

  // Set page title
    useEffect(() => {
      document.title = 'HOME — TRILLEX';
    }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Hero />
      <div className="absolute bottom-0 left-0 w-full z-40">
        <Footer />
      </div>
    </div>
  );
};

export default Home;