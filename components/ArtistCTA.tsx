import React from 'react';
import { ArrowUpRight, Music, Sparkles, Send, Disc } from 'lucide-react';

const SpotifyIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Spotify">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.518 17.306c-.216.353-.674.467-1.027.25-2.822-1.724-6.376-2.115-10.562-1.158-.403.092-.806-.157-.899-.56-.092-.403.158-.806.56-.899 4.588-1.047 8.528-.601 11.678 1.34.353.216.467.674.25 1.027zm1.472-3.273c-.272.443-.853.582-1.296.31-3.23-1.986-8.156-2.56-11.977-1.4-1.498.151-.99-.245-1.141-.743-.151-.498.245-.99.743-1.141 4.38-1.33 9.805-.688 13.511 1.588.443.272.582.853.31 1.296zm.129-3.41c-3.874-2.3-10.274-2.513-13.99-1.385-.595.181-1.226-.156-1.407-.751-.181-.595.156-1.226.751-1.407 4.267-1.295 11.328-1.047 15.795 1.604.536.318.71 1.015.392 1.551-.318.536-1.015.71-1.551.392z"/>
  </svg>
);

const ArtistCTA: React.FC = () => {
  const handleSignWithUs = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState(null, '', '#demo-submission');
    const event = new CustomEvent('trillex-navigate', {
      detail: { page: 'contact', section: 'contact-form' }
    });
    window.dispatchEvent(event);
  };

  const handleGeneralInquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState(null, '', '#general-inquiry');
    const event = new CustomEvent('trillex-navigate', {
      detail: { page: 'contact', section: 'contact-form' }
    });
    window.dispatchEvent(event);
  };

  return (
    <section className="relative w-full py-20 md:py-32 bg-trillex-black overflow-hidden border-t border-white/10">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[600px] md:h-[900px] border border-white/5 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] border border-trillex-orange/10 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-trillex-orange/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        
        {/* Label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-trillex-orange animate-pulse" />
          <span className="text-trillex-orange text-xs font-mono font-bold tracking-[0.3em] uppercase">
            ELEVATE YOUR VISION
          </span>
          <div className="w-2 h-2 rounded-full bg-trillex-orange animate-pulse" />
        </div>

        {/* Big Headline */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-bold text-white tracking-tight max-w-4xl leading-[1.1] mb-6">
          READY TO AMPLIFY YOUR SOUND ON A GLOBAL SCALE?
        </h2>

        {/* Description */}
        <p className="text-white/60 text-sm md:text-lg font-mono max-w-2xl leading-relaxed mb-10 md:mb-12">
          Whether you are an established producer aiming for international distribution or an emerging visionary, Trillex Music Group provides the infrastructure to build lasting careers.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full justify-center max-w-xl">
          {/* Primary CTA: Sign with Us */}
          <a
            href="#demo-submission"
            onClick={handleSignWithUs}
            data-hoverable="true"
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-trillex-orange hover:bg-[#ff8f66] text-black font-bold font-mono text-sm md:text-base transition-all duration-300 shadow-[0_0_30px_rgba(255,127,80,0.4)] hover:shadow-[0_0_50px_rgba(255,127,80,0.6)] hover:scale-105 group"
          >
            <Send className="w-5 h-5 text-black group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            <span className="tracking-wider uppercase">SIGN WITH US</span>
          </a>

          {/* Secondary CTA: Listen Now */}
          <a
            href="https://open.spotify.com/artist/trillex"
            target="_blank"
            rel="noopener noreferrer"
            data-hoverable="true"
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/40 text-white font-bold font-mono text-sm md:text-base transition-all duration-300 hover:scale-105 group"
          >
            <SpotifyIcon className="w-5 h-5 text-[#1DB954] group-hover:scale-110 transition-transform" />
            <span className="tracking-wider uppercase">LISTEN NOW</span>
            <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
          </a>
        </div>

        {/* Sub-label footer note */}
        <div className="mt-12 text-xs font-mono text-white/30 flex items-center gap-4">
          <span>TRILLEX AVANT</span>
          <span>•</span>
          <span>TRILLEX BOUNCE</span>
          <span>•</span>
          <span>TRILLEX RECORDS</span>
        </div>

      </div>
    </section>
  );
};

export default ArtistCTA;
