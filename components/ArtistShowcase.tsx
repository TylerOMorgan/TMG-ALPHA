import React, { useState } from 'react';
import { Headphones, Radio, Sparkles, TrendingUp, Music2, ExternalLink, Play, Disc3, Award } from 'lucide-react';
import { ARTISTS_DATA, ROSTER_STATS, Artist } from '../utils/artistsData';

// Spotify SVG Icon Component
const SpotifyIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Spotify">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.518 17.306c-.216.353-.674.467-1.027.25-2.822-1.724-6.376-2.115-10.562-1.158-.403.092-.806-.157-.899-.56-.092-.403.158-.806.56-.899 4.588-1.047 8.528-.601 11.678 1.34.353.216.467.674.25 1.027zm1.472-3.273c-.272.443-.853.582-1.296.31-3.23-1.986-8.156-2.56-11.977-1.4-1.498.151-.99-.245-1.141-.743-.151-.498.245-.99.743-1.141 4.38-1.33 9.805-.688 13.511 1.588.443.272.582.853.31 1.296zm.129-3.41c-3.874-2.3-10.274-2.513-13.99-1.385-.595.181-1.226-.156-1.407-.751-.181-.595.156-1.226.751-1.407 4.267-1.295 11.328-1.047 15.795 1.604.536.318.71 1.015.392 1.551-.318.536-1.015.71-1.551.392z"/>
  </svg>
);

const ArtistShowcase: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const filterCategories = [
    'All',
    'Trillex Avant',
    'Trillex Bounce',
    'Trillex Records'
  ];

  const filteredArtists = selectedFilter === 'All'
    ? ARTISTS_DATA
    : ARTISTS_DATA.filter((artist) => artist.subLabel === selectedFilter);

  return (
    <section className="relative w-full py-16 md:py-24 bg-trillex-black overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-trillex-orange/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Roster Metrics Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-24">
          {[
            { label: 'TOTAL STREAMS', value: ROSTER_STATS.totalStreams, icon: TrendingUp, detail: 'Across all DSPs' },
            { label: 'MONTHLY LISTENERS', value: ROSTER_STATS.monthlyListeners, icon: Headphones, detail: 'Active audience' },
            { label: 'ROSTER TALENT', value: ROSTER_STATS.rosterArtists, icon: Sparkles, detail: 'Producers & artists' },
            { label: 'GLOBAL RELEASES', value: ROSTER_STATS.globalReleases, icon: Disc3, detail: 'Original tracks' }
          ].map((stat, i) => (
            <div 
              key={i}
              className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-5 md:p-6 flex flex-col justify-between hover:border-trillex-orange/40 hover:bg-white/[0.02] transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] md:text-xs font-mono text-white/50 tracking-widest uppercase">
                  {stat.label}
                </span>
                <stat.icon className="w-4 h-4 text-trillex-orange group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="text-2xl md:text-4xl font-bold font-sans text-white tracking-tight group-hover:text-trillex-orange transition-colors">
                  {stat.value}
                </div>
                <div className="text-[10px] md:text-xs font-mono text-white/40 mt-1">
                  {stat.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section Title & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 rounded-full bg-trillex-orange animate-pulse shadow-[0_0_8px_#FF7F50]" />
              <span className="text-trillex-orange text-xs font-mono font-bold tracking-[0.25em] uppercase">
                SPOTLIGHT ROSTER
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-sans font-bold text-white tracking-tight">
              FEATURED ARTISTS
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {filterCategories.map((cat) => {
              const isActive = selectedFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  data-hoverable="true"
                  className={`
                    px-4 py-2 rounded-full text-xs font-mono transition-all duration-300 border
                    ${isActive
                      ? 'bg-trillex-orange text-black font-bold border-trillex-orange shadow-[0_0_20px_rgba(255,127,80,0.4)] scale-105'
                      : 'bg-white/5 text-white/60 hover:text-white border-white/10 hover:border-white/30 hover:bg-white/10'
                    }
                  `}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredArtists.map((artist) => {
            const isAvant = artist.subLabel === 'Trillex Avant';
            const isBounce = artist.subLabel === 'Trillex Bounce';

            const badgeColor = isAvant 
              ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' 
              : isBounce 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : 'bg-trillex-orange/10 text-trillex-orange border-trillex-orange/30';

            return (
              <div 
                key={artist.id}
                className="group relative bg-[#0C0C0C] border border-white/10 hover:border-trillex-orange/50 rounded-3xl overflow-hidden transition-all duration-500 flex flex-col justify-between hover:shadow-[0_10px_40px_rgba(0,0,0,0.8)] hover:-translate-y-1"
              >
                {/* Image & Imprint Header */}
                <div className="relative h-64 md:h-72 w-full overflow-hidden">
                  <img 
                    src={artist.image} 
                    alt={artist.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/40 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className={`text-[10px] font-mono px-3 py-1 rounded-full border backdrop-blur-md uppercase tracking-wider ${badgeColor}`}>
                      {artist.subLabel}
                    </span>

                    {artist.verified && (
                      <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-mono text-emerald-400">
                        <Award className="w-3 h-3" />
                        <span>VERIFIED</span>
                      </div>
                    )}
                  </div>

                  {/* Soundwave equalizer indicator overlay */}
                  <div className="absolute bottom-4 right-4 flex items-end gap-1 h-5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10">
                    <span className="w-1 bg-trillex-orange rounded-full animate-[pulse_1s_ease-in-out_infinite] h-3" />
                    <span className="w-1 bg-trillex-orange rounded-full animate-[pulse_1.4s_ease-in-out_infinite] h-4" />
                    <span className="w-1 bg-trillex-orange rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2" />
                    <span className="w-1 bg-trillex-orange rounded-full animate-[pulse_1.2s_ease-in-out_infinite] h-3.5" />
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-white/40 text-xs font-mono uppercase tracking-wider mb-1">
                      {artist.role} • {artist.genre}
                    </div>

                    <h3 className="text-2xl font-bold font-sans text-white group-hover:text-trillex-orange transition-colors mb-3">
                      {artist.name}
                    </h3>

                    <p className="text-white/60 text-xs md:text-sm line-clamp-2 leading-relaxed mb-6">
                      {artist.bio}
                    </p>
                  </div>

                  {/* Top Track & Stats Block */}
                  <div>
                    {/* Top Track Pill */}
                    <div className="mb-4 bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-7 h-7 rounded-lg bg-trillex-orange/10 flex items-center justify-center text-trillex-orange flex-shrink-0">
                          <Music2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-[10px] text-white/40 font-mono uppercase tracking-wider">TOP RELEASE</div>
                          <div className="text-xs text-white font-medium truncate font-mono">{artist.topTrack}</div>
                        </div>
                      </div>
                      <Play className="w-3.5 h-3.5 text-white/40 group-hover:text-trillex-orange transition-colors flex-shrink-0" />
                    </div>

                    {/* Follower & Stream Count Metrics */}
                    <div className="grid grid-cols-3 gap-2 text-center py-3 border-y border-white/5 mb-5 font-mono text-xs">
                      <div>
                        <div className="text-white font-bold text-sm text-trillex-orange">{artist.monthlyListeners}</div>
                        <div className="text-white/40 text-[10px]">Monthly</div>
                      </div>
                      <div className="border-x border-white/5">
                        <div className="text-white font-bold text-sm">{artist.totalStreams}</div>
                        <div className="text-white/40 text-[10px]">Streams</div>
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm text-pink-400">{artist.followers}</div>
                        <div className="text-white/40 text-[10px]">Followers</div>
                      </div>
                    </div>

                    {/* Social & Streaming Action Links */}
                    <div className="flex items-center gap-3">
                      <a 
                        href={artist.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-hoverable="true"
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1DB954]/10 hover:bg-[#1DB954] text-[#1DB954] hover:text-black border border-[#1DB954]/30 hover:border-[#1DB954] text-xs font-mono font-bold transition-all duration-300 shadow-[0_0_15px_rgba(29,185,84,0.1)]"
                      >
                        <SpotifyIcon className="w-4 h-4" />
                        <span>Spotify</span>
                      </a>

                      <a 
                        href={artist.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-hoverable="true"
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-pink-500/10 hover:bg-pink-500 text-pink-400 hover:text-white border border-pink-500/30 hover:border-pink-500 text-xs font-mono font-bold transition-all duration-300 shadow-[0_0_15px_rgba(236,72,153,0.1)]"
                      >
                        <Radio className="w-4 h-4" />
                        <span>Instagram</span>
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ArtistShowcase;
