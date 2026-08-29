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
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-trillex-orange animate-pulse" />
          <span className="text-trillex-orange text-xs font-mono font-bold tracking-[0.3em] uppercase">
            ROSTER / ARTISTS
          </span>
          <div className="w-2 h-2 rounded-full bg-trillex-orange animate-pulse" />
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-extrabold text-white tracking-tight leading-[1.05] max-w-5xl mb-6">
          GLOBAL REACH. UNCOMPROMISING SOUND.
        </h1>

        <p className="text-white/60 text-sm sm:text-base md:text-xl font-mono max-w-2xl leading-relaxed">
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
