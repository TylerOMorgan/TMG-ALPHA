import React from 'react';
import { ArrowDown, Radio, Headphones, Sparkles, Disc3, Globe2, Music, Layers, Cpu, Share2, Play } from 'lucide-react';

const SpotifyIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Spotify">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.518 17.306c-.216.353-.674.467-1.027.25-2.822-1.724-6.376-2.115-10.562-1.158-.403.092-.806-.157-.899-.56-.092-.403.158-.806.56-.899 4.588-1.047 8.528-.601 11.678 1.34.353.216.467.674.25 1.027zm1.472-3.273c-.272.443-.853.582-1.296.31-3.23-1.986-8.156-2.56-11.977-1.4-1.498.151-.99-.245-1.141-.743-.151-.498.245-.99.743-1.141 4.38-1.33 9.805-.688 13.511 1.588.443.272.582.853.31 1.296zm.129-3.41c-3.874-2.3-10.274-2.513-13.99-1.385-.595.181-1.226-.156-1.407-.751-.181-.595.156-1.226.751-1.407 4.267-1.295 11.328-1.047 15.795 1.604.536.318.71 1.015.392 1.551-.318.536-1.015.71-1.551.392z"/>
  </svg>
);

const LabelFlowDiagram: React.FC = () => {
  return (
    <section className="relative w-full py-16 md:py-24 bg-trillex-black overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-trillex-orange/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-14 md:mb-20 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 rounded-full bg-trillex-orange animate-pulse shadow-[0_0_8px_#FF7F50]" />
            <span className="text-trillex-orange text-xs font-mono font-bold tracking-[0.25em] uppercase">
              LABEL ARCHITECTURE & WORKFLOW
            </span>
            <span className="w-2 h-2 rounded-full bg-trillex-orange animate-pulse shadow-[0_0_8px_#FF7F50]" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-white tracking-tight">
            HOW THE LABEL OPERATES
          </h2>
          <p className="text-white/50 text-xs sm:text-sm font-mono mt-3 max-w-xl">
            From strategic A&R direction down through dedicated genre imprints and direct to dancefloors across the globe.
          </p>
        </div>

        {/* Diagram Flow Container */}
        <div className="flex flex-col items-center relative">
          
          {/* ======================================================== */}
          {/* LEVEL 1: MAIN LABEL CORE                                  */}
          {/* ======================================================== */}
          <div className="w-full max-w-2xl bg-gradient-to-b from-[#141414] to-[#0A0A0A] border-2 border-trillex-orange/40 rounded-3xl p-6 md:p-8 relative shadow-[0_0_40px_rgba(255,127,80,0.15)] group hover:border-trillex-orange transition-all duration-500">
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-trillex-orange animate-ping" />
                <span className="text-xs font-mono font-bold text-trillex-orange uppercase tracking-widest">
                  TIER 01 • PARENT COMPANY
                </span>
              </div>
              <span className="text-[10px] font-mono bg-trillex-orange/10 text-trillex-orange px-3 py-1 rounded-full border border-trillex-orange/30">
                BANGKOK HQ
              </span>
            </div>

            {/* Title & Core Overview */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl sm:text-3xl font-sans font-extrabold text-white tracking-tight">
                  TRILLEX MUSIC GROUP
                </h3>
                <p className="text-white/60 text-xs sm:text-sm font-mono mt-1">
                  Global Infrastructure, Capital Allocation, Master Rights & Strategic A&R
                </p>
              </div>
            </div>

            {/* Core Capability Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-[11px] text-white/80">
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-trillex-orange flex-shrink-0" />
                <span>Direct Ingest</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center gap-2">
                <Layers className="w-4 h-4 text-trillex-orange flex-shrink-0" />
                <span>A&R Direction</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-trillex-orange flex-shrink-0" />
                <span>Global Sync</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-trillex-orange flex-shrink-0" />
                <span>Artist Capital</span>
              </div>
            </div>
          </div>

          {/* CONNECTOR 1: Flow Beam Down to Sub-Labels */}
          <div className="flex flex-col items-center my-4 md:my-6 relative">
            <div className="w-0.5 h-10 md:h-14 bg-gradient-to-b from-trillex-orange via-white/50 to-white/20" />
            <div className="w-6 h-6 rounded-full bg-trillex-orange/20 border border-trillex-orange flex items-center justify-center -mt-3 shadow-[0_0_10px_#FF7F50]">
              <ArrowDown className="w-3.5 h-3.5 text-trillex-orange" />
            </div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 mt-1">
              CURATED IMPRINT DISTRIBUTION
            </span>
          </div>

          {/* ======================================================== */}
          {/* LEVEL 2: SUB-LABEL IMPRINTS & HUBS                        */}
          {/* ======================================================== */}
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              
              {/* 1. TRILLEX AVANT */}
              <div className="bg-[#0C0C0C] border border-purple-500/30 hover:border-purple-500/80 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                      SUB-LABEL 01
                    </span>
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold border border-purple-500/40">
                      <Music className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold font-sans text-white group-hover:text-purple-400 transition-colors">
                        TRILLEX AVANT
                      </h4>
                      <div className="text-[11px] font-mono text-purple-400/80">
                        @trillexavant
                      </div>
                    </div>
                  </div>

                  <p className="text-white/60 text-xs font-mono leading-relaxed mb-4">
                    Pioneering experimental soundscapes, melodic techno, cyber synthwave, and leftfield electronic compositions.
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span>FOCUS: Underground & Cyber</span>
                  <span className="text-purple-400 font-semibold">1.4M+ Streams</span>
                </div>
              </div>

              {/* 2. TRILLEX BOUNCE */}
              <div className="bg-[#0C0C0C] border border-emerald-500/30 hover:border-emerald-500/80 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      SUB-LABEL 02
                    </span>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/40">
                      <Disc3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold font-sans text-white group-hover:text-emerald-400 transition-colors">
                        TRILLEX BOUNCE
                      </h4>
                      <div className="text-[11px] font-mono text-emerald-400/80">
                        @trillexbounce
                      </div>
                    </div>
                  </div>

                  <p className="text-white/60 text-xs font-mono leading-relaxed mb-4">
                    High-velocity Brazilian Phonk, energetic Bass House, raw hardstyle, and festival-grade club anthems.
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span>FOCUS: High-Energy & Bass</span>
                  <span className="text-emerald-400 font-semibold">2.8M+ Streams</span>
                </div>
              </div>

              {/* 3. TRILLEX RECORDS */}
              <div className="bg-[#0C0C0C] border border-trillex-orange/30 hover:border-trillex-orange/80 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,127,80,0.15)] flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-trillex-orange/10 text-trillex-orange border border-trillex-orange/30">
                      MAIN IMPRINT
                    </span>
                    <div className="w-2 h-2 rounded-full bg-trillex-orange animate-pulse" />
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-trillex-orange/20 flex items-center justify-center text-trillex-orange font-bold border border-trillex-orange/40">
                      <Radio className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold font-sans text-white group-hover:text-trillex-orange transition-colors">
                        TRILLEX RECORDS
                      </h4>
                      <div className="text-[11px] font-mono text-trillex-orange/80">
                        @trillexmusicgroup
                      </div>
                    </div>
                  </div>

                  <p className="text-white/60 text-xs font-mono leading-relaxed mb-4">
                    Global crossover vocal dance, melodic house, Afro-tech rhythms, and flagship collaborative singles.
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span>FOCUS: Global Crossover</span>
                  <span className="text-trillex-orange font-semibold">5.0M+ Streams</span>
                </div>
              </div>

            </div>
          </div>

          {/* CONNECTOR 2: Converging Conduits to Global Pipeline */}
          <div className="flex flex-col items-center my-4 md:my-6 relative">
            <div className="w-0.5 h-10 md:h-14 bg-gradient-to-b from-white/30 via-emerald-400/50 to-emerald-400" />
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center -mt-3 shadow-[0_0_10px_#34d399]">
              <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 mt-1">
              DIRECT DSP & STREAMING PIPELINE
            </span>
          </div>

          {/* ======================================================== */}
          {/* LEVEL 3: GLOBAL DISTRIBUTION & OUTBOUND LISTENERS         */}
          {/* ======================================================== */}
          <div className="w-full max-w-4xl bg-[#090909] border border-white/10 rounded-3xl p-6 md:p-8 text-center relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Globe2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-emerald-400 tracking-widest uppercase">
                TIER 03 • GLOBAL STREAMING & AUDIENCE
              </span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-sans font-extrabold text-white tracking-tight mb-2">
              OUT TO 10M+ GLOBAL LISTENERS
            </h3>
            
            <p className="text-white/50 text-xs sm:text-sm font-mono max-w-xl mx-auto mb-6">
              Simultaneous global distribution delivering crystal-clear lossless master audio to premier platforms and festival stages.
            </p>

            {/* Platform Badges Row */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 font-mono text-xs text-white/70">
              <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                <SpotifyIcon className="w-4 h-4 text-[#1DB954]" />
                <span>Spotify</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                <Music className="w-4 h-4 text-pink-400" />
                <span>Apple Music</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                <Play className="w-4 h-4 text-red-500" />
                <span>YouTube Music</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                <Headphones className="w-4 h-4 text-cyan-400" />
                <span>Beatport</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                <Radio className="w-4 h-4 text-trillex-orange" />
                <span>Live Festivals & Radio</span>
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default LabelFlowDiagram;
