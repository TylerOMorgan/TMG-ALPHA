import React from 'react';
import { Instagram, Headphones, Disc3, Radio, ExternalLink } from 'lucide-react';
import { ARTISTS_DATA, Artist } from '../utils/artistsData';

// Spotify SVG Icon Component
const SpotifyIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Spotify">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.518 17.306c-.216.353-.674.467-1.027.25-2.822-1.724-6.376-2.115-10.562-1.158-.403.092-.806-.157-.899-.56-.092-.403.158-.806.56-.899 4.588-1.047 8.528-.601 11.678 1.34.353.216.467.674.25 1.027zm1.472-3.273c-.272.443-.853.582-1.296.31-3.23-1.986-8.156-2.56-11.977-1.4-1.498.151-.99-.245-1.141-.743-.151-.498.245-.99.743-1.141 4.38-1.33 9.805-.688 13.511 1.588.443.272.582.853.31 1.296zm.129-3.41c-3.874-2.3-10.274-2.513-13.99-1.385-.595.181-1.226-.156-1.407-.751-.181-.595.156-1.226.751-1.407 4.267-1.295 11.328-1.047 15.795 1.604.536.318.71 1.015.392 1.551-.318.536-1.015.71-1.551.392z"/>
  </svg>
);

interface ArtistCardProps {
  artist: Artist;
}

const ArtistBannerCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const isAvant = artist.subLabel === 'Trillex Avant';
  const isBounce = artist.subLabel === 'Trillex Bounce';

  const badgeColor = isAvant 
    ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' 
    : isBounce 
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
    : 'bg-trillex-orange/10 text-trillex-orange border-trillex-orange/30';

  return (
    <div className="flex-shrink-0 w-[300px] sm:w-[340px] md:w-[380px] group/card bg-[#0D0D0D]/90 backdrop-blur-xl border border-white/10 hover:border-trillex-orange/60 rounded-2xl p-4 md:p-5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,127,80,0.15)] flex flex-col justify-between select-none">
      {/* Top Header: Image, Name, Badge */}
      <div className="flex items-start gap-4">
        {/* Artist Avatar Image */}
        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 group-hover/card:border-trillex-orange/50 transition-colors">
          <img 
            src={artist.image} 
            alt={artist.name} 
            className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500 will-change-transform"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[9px] md:text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider ${badgeColor}`}>
              {artist.subLabel}
            </span>
          </div>

          <h3 className="text-white font-bold font-sans text-base md:text-lg tracking-wide truncate group-hover/card:text-trillex-orange transition-colors">
            {artist.name}
          </h3>

          <p className="text-white/40 text-xs font-mono truncate">
            {artist.genre}
          </p>
        </div>
      </div>

      {/* Metrics Row: Stream Counts & Followers */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-white/70 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
          <Headphones className="w-3.5 h-3.5 text-trillex-orange flex-shrink-0" />
          <span className="text-white font-semibold">{artist.monthlyListeners}</span>
          <span className="text-white/40 text-[10px]">Monthly</span>
        </div>

        <div className="flex items-center gap-1.5 text-white/70 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
          <Radio className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span className="text-white font-semibold">{artist.followers}</span>
          <span className="text-white/40 text-[10px]">IG</span>
        </div>
      </div>

      {/* Action Links: Spotify & Instagram */}
      <div className="mt-4 flex items-center gap-2">
        <a
          href={artist.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-hoverable="true"
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-[#1DB954]/20 border border-white/10 hover:border-[#1DB954]/50 text-white/80 hover:text-[#1DB954] text-xs font-mono font-medium transition-all duration-300 group/link"
        >
          <SpotifyIcon className="w-3.5 h-3.5 text-[#1DB954] group-hover/link:scale-110 transition-transform" />
          <span>Spotify</span>
          <ExternalLink className="w-3 h-3 opacity-40 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" />
        </a>

        <a
          href={artist.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-hoverable="true"
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-500/50 text-white/80 hover:text-pink-400 text-xs font-mono font-medium transition-all duration-300 group/link"
        >
          <Instagram className="w-3.5 h-3.5 text-pink-400 group-hover/link:scale-110 transition-transform" />
          <span>Instagram</span>
          <ExternalLink className="w-3 h-3 opacity-40 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" />
        </a>
      </div>
    </div>
  );
};

const ArtistScrollBanner: React.FC = () => {
  // Create duplicated datasets for seamless 3x infinite loops
  const row1 = [...ARTISTS_DATA, ...ARTISTS_DATA, ...ARTISTS_DATA];
  const row2 = [...ARTISTS_DATA.slice().reverse(), ...ARTISTS_DATA.slice().reverse(), ...ARTISTS_DATA.slice().reverse()];

  return (
    <section className="relative w-full py-16 md:py-24 bg-trillex-black overflow-hidden select-none">
      {/* Dynamic CSS for smooth infinite scroll with pause on hover */}
      <style>{`
        @keyframes scrollLeft {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.333%, 0, 0);
          }
        }

        @keyframes scrollRight {
          0% {
            transform: translate3d(-33.333%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        .animate-scroll-left {
          animation: scrollLeft 38s linear infinite;
          will-change: transform;
        }

        .animate-scroll-right {
          animation: scrollRight 38s linear infinite;
          will-change: transform;
        }

        /* PAUSE ON HOVER: When hovering anywhere on the banner or cards */
        .marquee-container:hover .animate-scroll-left,
        .marquee-container:hover .animate-scroll-right {
          animation-play-state: paused !important;
        }

        @media (max-width: 768px) {
          .animate-scroll-left {
            animation-duration: 26s;
          }
          .animate-scroll-right {
            animation-duration: 26s;
          }
        }
      `}</style>

      {/* Section Header */}
      <div className="container mx-auto px-6 mb-10 md:mb-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 rounded-full bg-trillex-orange animate-pulse shadow-[0_0_8px_#FF7F50]" />
              <span className="text-trillex-orange text-xs font-mono font-bold tracking-[0.25em] uppercase">
                SCROLLING ARTIST BANNER
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-sans font-bold text-white tracking-tight">
              LIVE ROSTER STREAM
            </h2>
          </div>

          <div className="text-white/40 text-xs md:text-sm font-mono flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Hover to freeze stream • Click to stream or follow</span>
          </div>
        </div>
      </div>

      {/* Edge gradient masks for cinematic fade */}
      <div className="relative w-full marquee-container group">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-trillex-black to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-trillex-black to-transparent z-20" />

        {/* ROW 1: Scrolls Left */}
        <div className="flex overflow-hidden py-3">
          <div className="flex gap-4 md:gap-6 animate-scroll-left">
            {row1.map((artist, idx) => (
              <ArtistBannerCard key={`row1-${artist.id}-${idx}`} artist={artist} />
            ))}
          </div>
        </div>

        {/* ROW 2: Scrolls Right */}
        <div className="flex overflow-hidden py-3 mt-2">
          <div className="flex gap-4 md:gap-6 animate-scroll-right">
            {row2.map((artist, idx) => (
              <ArtistBannerCard key={`row2-${artist.id}-${idx}`} artist={artist} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtistScrollBanner;
