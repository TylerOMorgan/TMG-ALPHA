import React from 'react';
import { 
  ArrowDown, Radio, Headphones, Sparkles, Disc3, Globe2, Music, 
  Layers, Cpu, Share2, Play, ExternalLink, Zap, ShieldCheck, ArrowRight, Send
} from 'lucide-react';

const SpotifyIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Spotify">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.518 17.306c-.216.353-.674.467-1.027.25-2.822-1.724-6.376-2.115-10.562-1.158-.403.092-.806-.157-.899-.56-.092-.403.158-.806.56-.899 4.588-1.047 8.528-.601 11.678 1.34.353.216.467.674.25 1.027zm1.472-3.273c-.272.443-.853.582-1.296.31-3.23-1.986-8.156-2.56-11.977-1.4-1.498.151-.99-.245-1.141-.743-.151-.498.245-.99.743-1.141 4.38-1.33 9.805-.688 13.511 1.588.443.272.582.853.31 1.296zm.129-3.41c-3.874-2.3-10.274-2.513-13.99-1.385-.595.181-1.226-.156-1.407-.751-.181-.595.156-1.226.751-1.407 4.267-1.295 11.328-1.047 15.795 1.604.536.318.71 1.015.392 1.551-.318.536-1.015.71-1.551.392z"/>
  </svg>
);

const LabelFlowDiagram: React.FC = () => {
  
  const handleDirectDemoSubmission = (subLabelName: 'Trillex Avant' | 'Trillex Bounce' | 'Select') => {
    try {
      sessionStorage.setItem('trillex_selected_sublabel', subLabelName);
    } catch {
      // ignore storage failure if disabled
    }

    window.history.pushState(null, '', '#demo-submission');
    
    // Dispatch navigation to contact page demo form
    window.dispatchEvent(new CustomEvent('trillex-navigate', {
      detail: { page: 'contact', section: 'contact-form' }
    }));

    // Pre-select sub-label in contact form
    window.dispatchEvent(new CustomEvent('trillex-set-sublabel', {
      detail: { subLabel: subLabelName }
    }));
  };

  return (
    <section className="relative w-full py-16 md:py-24 bg-trillex-black overflow-hidden select-none">
      
      {/* Precision Audio Wave Animation (strictly contained) */}
      <style>{`
        @keyframes containedWave1 {
          0%, 100% { height: 3px; }
          50% { height: 10px; }
        }
        @keyframes containedWave2 {
          0%, 100% { height: 8px; }
          50% { height: 3px; }
        }
        @keyframes containedWave3 {
          0%, 100% { height: 4px; }
          50% { height: 11px; }
        }
        @keyframes containedWave4 {
          0%, 100% { height: 9px; }
          50% { height: 4px; }
        }

        .bar-anim-1 { animation: containedWave1 0.9s ease-in-out infinite; }
        .bar-anim-2 { animation: containedWave2 1.1s ease-in-out infinite 0.15s; }
        .bar-anim-3 { animation: containedWave3 0.7s ease-in-out infinite 0.3s; }
        .bar-anim-4 { animation: containedWave4 1.0s ease-in-out infinite 0.2s; }
      `}</style>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-14 md:mb-20 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-trillex-orange animate-pulse" />
            <span className="text-trillex-orange text-xs font-mono font-bold tracking-[0.25em] uppercase">
              ECOSYSTEM & PIPELINE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-trillex-orange animate-pulse" />
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-sans font-bold text-white tracking-tight">
            HOW THE TRILLEX ENGINE OPERATES
          </h2>
          
          <p className="text-white/50 text-xs sm:text-sm font-mono mt-3 max-w-xl">
            A structured global ecosystem translating artistic vision into worldwide dancefloor resonance.
          </p>
        </div>

        {/* ======================================================== */}
        {/* DIAGRAM CONTAINER                                         */}
        {/* ======================================================== */}
        <div className="flex flex-col items-center relative">

          {/* ======================================================== */}
          {/* LEVEL 1: MAIN LABEL CORE NODE                             */}
          {/* ======================================================== */}
          <div className="w-full max-w-2xl bg-[#0A0A0A] border border-white/10 hover:border-white/20 rounded-2xl p-6 sm:p-8 transition-colors duration-300">
            
            {/* Top Meta Bar */}
            <div className="flex items-center justify-between pb-5 border-b border-white/5 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black border border-white/10 p-2 flex items-center justify-center flex-shrink-0">
                  <img src="/trillex-logo.png" alt="Trillex Music Group" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-trillex-orange tracking-widest uppercase font-semibold block">
                    PARENT COMPANY • BANGKOK HQ
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold font-sans text-white tracking-wide">
                    TRILLEX MUSIC GROUP
                  </h3>
                </div>
              </div>

              <span className="text-[10px] font-mono text-white/40 bg-white/5 border border-white/10 px-3 py-1 rounded-full whitespace-nowrap">
                BKK • 2024
              </span>
            </div>

            {/* Description */}
            <p className="text-white/60 text-xs font-mono leading-relaxed mt-4 mb-5">
              Centralized infrastructure managing master distribution, global sync licensing, strategic A&R direction, and artist funding across our specialized sub-label network.
            </p>

            {/* Capability Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] text-white/70">
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-trillex-orange flex-shrink-0" />
                <span>Global Sync</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-white/60 flex-shrink-0" />
                <span>A&R Pipeline</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-white/60 flex-shrink-0" />
                <span>Master Rights</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-trillex-orange flex-shrink-0" />
                <span>Direct Ingest</span>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* CONNECTOR 1: Clean Minimal SVG Branches (Desktop)        */}
          {/* ======================================================== */}
          <div className="w-full max-w-4xl h-16 md:h-20 relative hidden md:block">
            <svg className="w-full h-full" viewBox="0 0 800 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 400 0 C 400 40, 140 40, 140 80" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
              <path d="M 400 0 L 400 80" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
              <path d="M 400 0 C 400 40, 660 40, 660 80" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />

              <circle cx="400" cy="4" r="3" fill="#FF7F50" />
              <circle cx="140" cy="76" r="3" fill="#EAEAEA" />
              <circle cx="400" cy="76" r="3" fill="#EAEAEA" />
              <circle cx="660" cy="76" r="3" fill="#EAEAEA" />
            </svg>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-trillex-black border border-white/10 px-3 py-0.5 rounded-full text-[9px] font-mono text-white/40 uppercase tracking-widest">
              CURATED IMPRINT DISTRIBUTION
            </div>
          </div>

          {/* Mobile Connector */}
          <div className="flex md:hidden flex-col items-center my-3">
            <div className="w-px h-8 bg-white/20" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 my-1">
              CURATED IMPRINTS
            </span>
          </div>

          {/* ======================================================== */}
          {/* LEVEL 2: SUB-LABEL IMPRINTS CARDS                         */}
          {/* ======================================================== */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 relative">

            {/* --- 1. TRILLEX AVANT --- */}
            <div className="bg-[#0A0A0A] border border-white/10 hover:border-white/25 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-colors duration-300 group">
              <div>
                
                {/* Header: Logo, SubLabel Tag & Audio Indicator */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-black border border-white/10 p-2 flex items-center justify-center flex-shrink-0">
                    <img src="/Avant.png" alt="Trillex Avant" className="w-full h-full object-contain" />
                  </div>

                  {/* Clean contained audio indicator */}
                  <div className="flex items-end gap-1 h-4 w-11 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-md overflow-hidden flex-shrink-0">
                    <span className="w-1 bg-white/70 rounded-full bar-anim-1" />
                    <span className="w-1 bg-white/70 rounded-full bar-anim-2" />
                    <span className="w-1 bg-white/70 rounded-full bar-anim-3" />
                    <span className="w-1 bg-white/70 rounded-full bar-anim-4" />
                  </div>
                </div>

                <div className="mb-1">
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-white/60 border border-white/10">
                    SUB-LABEL 01
                  </span>
                </div>

                <h4 className="text-xl font-bold font-sans text-white group-hover:text-trillex-orange transition-colors">
                  TRILLEX AVANT
                </h4>

                <a 
                  href="https://www.instagram.com/trillexavant" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-hoverable="true"
                  className="inline-flex items-center gap-1 text-xs font-mono text-white/40 hover:text-white transition-colors mt-0.5 mb-3"
                >
                  <span>@trillexavant</span>
                  <ExternalLink className="w-3 h-3 opacity-40" />
                </a>

                <p className="text-white/60 text-xs font-mono leading-relaxed mb-5">
                  Pioneering experimental soundscapes, melodic techno, cyber synthwave, and hypnotic underground electronic journeys.
                </p>
              </div>

              <div>
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40 mb-4">
                  <span>SONIC FOCUS</span>
                  <span className="text-white/80">Techno & Cyber</span>
                </div>

                {/* Direct Demo Submission Button */}
                <button
                  type="button"
                  onClick={() => handleDirectDemoSubmission('Trillex Avant')}
                  data-hoverable="true"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-trillex-orange text-white hover:text-black border border-white/10 hover:border-trillex-orange text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 group/btn"
                >
                  <Send className="w-3.5 h-3.5 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  <span>SUBMIT DEMO</span>
                </button>
              </div>
            </div>

            {/* --- 2. TRILLEX BOUNCE --- */}
            <div className="bg-[#0A0A0A] border border-white/10 hover:border-white/25 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-colors duration-300 group">
              <div>
                
                {/* Header: Logo, SubLabel Tag & Audio Indicator */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-black border border-white/10 p-2 flex items-center justify-center flex-shrink-0">
                    <img src="/Bounce.png" alt="Trillex Bounce" className="w-full h-full object-contain" />
                  </div>

                  {/* Clean contained audio indicator */}
                  <div className="flex items-end gap-1 h-4 w-11 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-md overflow-hidden flex-shrink-0">
                    <span className="w-1 bg-white/70 rounded-full bar-anim-3" />
                    <span className="w-1 bg-white/70 rounded-full bar-anim-1" />
                    <span className="w-1 bg-white/70 rounded-full bar-anim-4" />
                    <span className="w-1 bg-white/70 rounded-full bar-anim-2" />
                  </div>
                </div>

                <div className="mb-1">
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-white/60 border border-white/10">
                    SUB-LABEL 02
                  </span>
                </div>

                <h4 className="text-xl font-bold font-sans text-white group-hover:text-trillex-orange transition-colors">
                  TRILLEX BOUNCE
                </h4>

                <a 
                  href="https://www.instagram.com/trillexbounce" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-hoverable="true"
                  className="inline-flex items-center gap-1 text-xs font-mono text-white/40 hover:text-white transition-colors mt-0.5 mb-3"
                >
                  <span>@trillexbounce</span>
                  <ExternalLink className="w-3 h-3 opacity-40" />
                </a>

                <p className="text-white/60 text-xs font-mono leading-relaxed mb-5">
                  High-octane Brazilian Phonk, heavy Bass House, raw hardstyle, and festival-crushing 160BPM high-energy club anthems.
                </p>
              </div>

              <div>
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40 mb-4">
                  <span>SONIC FOCUS</span>
                  <span className="text-white/80">Phonk & Bass House</span>
                </div>

                {/* Direct Demo Submission Button */}
                <button
                  type="button"
                  onClick={() => handleDirectDemoSubmission('Trillex Bounce')}
                  data-hoverable="true"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-trillex-orange text-white hover:text-black border border-white/10 hover:border-trillex-orange text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 group/btn"
                >
                  <Send className="w-3.5 h-3.5 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  <span>SUBMIT DEMO</span>
                </button>
              </div>
            </div>

            {/* --- 3. TRILLEX RECORDS --- */}
            <div className="bg-[#0A0A0A] border border-white/10 hover:border-white/25 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-colors duration-300 group">
              <div>
                
                {/* Header: Logo, SubLabel Tag & Audio Indicator */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-black border border-white/10 p-2 flex items-center justify-center flex-shrink-0">
                    <img src="/trillex-logo.png" alt="Trillex Records" className="w-full h-full object-contain" />
                  </div>

                  {/* Clean contained audio indicator */}
                  <div className="flex items-end gap-1 h-4 w-11 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-md overflow-hidden flex-shrink-0">
                    <span className="w-1 bg-white/70 rounded-full bar-anim-2" />
                    <span className="w-1 bg-white/70 rounded-full bar-anim-4" />
                    <span className="w-1 bg-white/70 rounded-full bar-anim-1" />
                    <span className="w-1 bg-white/70 rounded-full bar-anim-3" />
                  </div>
                </div>

                <div className="mb-1">
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-white/60 border border-white/10">
                    MAIN IMPRINT
                  </span>
                </div>

                <h4 className="text-xl font-bold font-sans text-white group-hover:text-trillex-orange transition-colors">
                  TRILLEX RECORDS
                </h4>

                <a 
                  href="https://www.instagram.com/trillexmusicgroup" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-hoverable="true"
                  className="inline-flex items-center gap-1 text-xs font-mono text-white/40 hover:text-white transition-colors mt-0.5 mb-3"
                >
                  <span>@trillexmusicgroup</span>
                  <ExternalLink className="w-3 h-3 opacity-40" />
                </a>

                <p className="text-white/60 text-xs font-mono leading-relaxed mb-5">
                  Global crossover vocal dance, melodic Afro-house, crossover chart releases, and flagship headline singles.
                </p>
              </div>

              <div>
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40 mb-4">
                  <span>SONIC FOCUS</span>
                  <span className="text-white/80">Global Vocal Dance</span>
                </div>

                {/* Direct Demo Submission Button */}
                <button
                  type="button"
                  onClick={() => handleDirectDemoSubmission('Select')}
                  data-hoverable="true"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/15 text-white border border-white/10 hover:border-white/30 text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 group/btn"
                >
                  <Send className="w-3.5 h-3.5 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  <span>SUBMIT DEMO</span>
                </button>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* CONNECTOR 2: Converging Lines to DSP Hub (Desktop)       */}
          {/* ======================================================== */}
          <div className="w-full max-w-4xl h-16 md:h-20 relative hidden md:block">
            <svg className="w-full h-full" viewBox="0 0 800 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 140 0 C 140 40, 400 40, 400 80" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
              <path d="M 400 0 L 400 80" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
              <path d="M 660 0 C 660 40, 400 40, 400 80" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />

              <circle cx="140" cy="4" r="3" fill="#EAEAEA" />
              <circle cx="400" cy="4" r="3" fill="#EAEAEA" />
              <circle cx="660" cy="4" r="3" fill="#EAEAEA" />
              <circle cx="400" cy="76" r="3" fill="#FF7F50" />
            </svg>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-trillex-black border border-white/10 px-3 py-0.5 rounded-full text-[9px] font-mono text-white/40 uppercase tracking-widest">
              DIRECT DSP & STREAMING PIPELINE
            </div>
          </div>

          {/* Mobile Connector */}
          <div className="flex md:hidden flex-col items-center my-3">
            <div className="w-px h-8 bg-white/20" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 my-1">
              DIRECT DSP PIPELINE
            </span>
          </div>

          {/* ======================================================== */}
          {/* LEVEL 3: GLOBAL DISTRIBUTION & 10M+ LISTENERS             */}
          {/* ======================================================== */}
          <div className="w-full max-w-3xl bg-[#0A0A0A] border border-white/10 hover:border-white/20 rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center transition-colors duration-300">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-mono font-semibold tracking-widest uppercase mb-3">
              <Globe2 className="w-3.5 h-3.5 text-trillex-orange" />
              <span>GLOBAL REACH & BROADCAST</span>
            </div>

            <h3 className="text-xl sm:text-3xl font-bold font-sans text-white tracking-tight mb-2">
              OUT TO 10M+ GLOBAL LISTENERS
            </h3>

            <p className="text-white/50 text-xs sm:text-sm font-mono max-w-lg mb-6 leading-relaxed">
              Direct-to-consumer delivery pushing master-quality audio directly to premier streaming platforms and live stages worldwide.
            </p>

            {/* DSP Console Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full font-mono text-xs">
              
              <a
                href="https://open.spotify.com/artist/trillex"
                target="_blank"
                rel="noopener noreferrer"
                data-hoverable="true"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/10 hover:border-white/30 text-white/80 hover:text-white transition-all duration-300"
              >
                <SpotifyIcon className="w-4 h-4 text-[#1DB954]" />
                <span>Spotify</span>
              </a>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white/70">
                <Music className="w-4 h-4 text-pink-400" />
                <span>Apple Music</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white/70">
                <Play className="w-4 h-4 text-red-500" />
                <span>YouTube</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white/70">
                <Headphones className="w-4 h-4 text-cyan-400" />
                <span>Beatport</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white/70">
                <Radio className="w-4 h-4 text-trillex-orange" />
                <span>Live Festivals</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default LabelFlowDiagram;
