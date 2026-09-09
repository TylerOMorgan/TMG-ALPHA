import React, { useEffect } from "react";
import Hero from "../Hero";
import Footer from "../Footer";

const Home: React.FC<{ isActive?: boolean }> = ({ isActive = true }) => {
  // Set page title (re-set when navigating back: all pages stay mounted)
  useEffect(() => {
    if (isActive) {
      document.title = "HOME - TRILLEX";
    }
  }, [isActive]);

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
