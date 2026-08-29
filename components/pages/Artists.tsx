import React, { useEffect } from 'react';
import ArtistScrollBanner from '../ArtistScrollBanner';
import ArtistShowcase from '../ArtistShowcase';
import ArtistCTA from '../ArtistCTA';
import Footer from '../Footer';

const Artists: React.FC = () => {
  useEffect(() => {
    document.title = 'ARTISTS & ROSTER — TRILLEX MUSIC GROUP';
  }, []);

  return (
    <div className="bg-trillex-black min-h-screen pt-28 md:pt-36">
      {/* Page Hero Header */}
      <section className="container mx-auto px-6 pb-8 md:pb-12 text-center flex flex-col items-center">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit mb-6 backdrop-blur-sm">
          <span className="text-xs font-mono text-white/80 tracking-widest uppercase">
            Roster &bull; Artists
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-white tracking-tight leading-[1.05] max-w-5xl mb-6">
          GLOBAL REACH. <br className="hidden sm:inline" />
          <span className="text-trillex-orange">UNCOMPROMISING SOUND.</span>
        </h1>

        <p className="text-white/60 text-base sm:text-lg md:text-xl font-sans font-light max-w-2xl leading-relaxed">
          Home to ground-breaking electronic producers, sound architects, and genre-defining acts across our global imprint network.
        </p>
      </section>

      {/* Two-Row Auto-Scrolling Infinite Marquee Banner with Pause-on-Hover */}
      <ArtistScrollBanner />

      {/* Full Filterable Showcase Grid */}
      <ArtistShowcase />

      {/* Bottom Call to Action Section */}
      <ArtistCTA />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default Artists;
