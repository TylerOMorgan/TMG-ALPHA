import React, { useState } from 'react';
import { 
  ArrowDown, Radio, Headphones, Sparkles, Disc3, Globe2, Music, 
  Layers, Cpu, Share2, Play, ExternalLink, Zap, ShieldCheck, ArrowRight, Send, Activity, Flame, Disc
} from 'lucide-react';

const SpotifyIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Spotify">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.518 17.306c-.216.353-.674.467-1.027.25-2.822-1.724-6.376-2.115-10.562-1.158-.403.092-.806-.157-.899-.56-.092-.403.158-.806.56-.899 4.588-1.047 8.528-.601 11.678 1.34.353.216.467.674.25 1.027zm1.472-3.273c-.272.443-.853.582-1.296.31-3.23-1.986-8.156-2.56-11.977-1.4-1.498.151-.99-.245-1.141-.743-.151-.498.245-.99.743-1.141 4.38-1.33 9.805-.688 13.511 1.588.443.272.582.853.31 1.296zm.129-3.41c-3.874-2.3-10.274-2.513-13.99-1.385-.595.181-1.226-.156-1.407-.751-.181-.595.156-1.226.751-1.407 4.267-1.295 11.328-1.047 15.795 1.604.536.318.71 1.015.392 1.551-.318.536-1.015.71-1.551.392z"/>
  </svg>
);

const LabelFlowDiagram: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
      
      {/* Precision Animations & Audio Waves */}
      <style>{`
        @keyframes floatCard1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes floatCard2 {
          0%, 100% { transform: translateY(-3px); }
          50% { transform: translateY(3px); }
        }
        @keyframes floatCard3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }

        .anim-float-1 { animation: floatCard1 4.5s ease-in-out infinite; }
        .anim-float-2 { animation: floatCard2 5.2s ease-in-out infinite 0.6s; }
        .anim-float-3 { animation: floatCard3 4.8s ease-in-out infinite 1.2s; }

        @keyframes dataFlowForward {
          0% { stroke-dashoffset: 48; }
          100% { stroke-dashoffset: 0; }
        }

        .data-pipe-anim {
          stroke-dasharray: 6, 10;
          animation: dataFlowForward 1.8s linear infinite;
        }

        @keyframes barPulse1 { 0%, 100% { height: 2px; } 50% { height: 11px; } }
        @keyframes barPulse2 { 0%, 100% { height: 9px; } 50% { height: 3px; } }
        @keyframes barPulse3 { 0%, 100% { height: 4px; } 50% { height: 12px; } }
        @keyframes barPulse4 { 0%, 100% { height: 10px; } 50% { height: 5px; } }
        @keyframes barPulse5 { 0%, 100% { height: 3px; } 50% { height: 9px; } }

        .eq-1 { animation: barPulse1 0.75s ease-in-out infinite; }
        .eq-2 { animation: barPulse2 1.05s ease-in-out infinite 0.15s; }
        .eq-3 { animation: barPulse3 0.65s ease-in-out infinite 0.3s; }
        .eq-4 { animation: barPulse4 0.95s ease-in-out infinite 0.2s; }
        .eq-5 { animation: barPulse5 0.85s ease-in-out infinite 0.4s; }
      `}</style>

      {/* Subtle Background Radial Depth */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-white/[0.015] rounded-full blur-[120px] pointer-events-none" />

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
        {/* DIAGRAM CONTAINER WITH DYNAMIC FLOW PIPELINES            */}
        {/* ======================================================== */}
        <div className="flex flex-col items-center relative">

          {/* ======================================================== */}
          {/* LEVEL 1: MAIN LABEL CORE NODE                             */}
          {/* ======================================================== */}
          <div 
            onMouseEnter={() => setHoveredCard('parent')}
            onMouseLeave={() => setHoveredCard(null)}
            className="w-full max-w-2xl bg-[#0A0A0A] border border-white/10 hover:border-white/25 rounded-2xl p-6 sm:p-8 transition-all duration-300 relative overflow-hidden shadow-2xl group"
          >
            {/* Ambient Top Highlight */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            {/* Top Meta Bar */}
            <div className="flex items-center justify-between pb-5 border-b border-white/5 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black border border-white/10 p-2 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <img src="/trillex-logo.png" alt="Trillex Music Group" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-trillex-orange tracking-widest uppercase font-semibold block">
                      PARENT COMPANY • BANGKOK HQ
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-sans text-white tracking-wide">
                    TRILLEX MUSIC GROUP
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-white/40 bg-white/5 border border-white/10 px-3 py-1 rounded-full whitespace-nowrap">
                  BKK • 2024
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-white/60 text-xs font-mono leading-relaxed mt-4 mb-5">
              Centralized infrastructure managing master distribution, global sync licensing, strategic A&R direction, and artist funding across our specialized sub-label network.
            </p>

            {/* Capability Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] text-white/70">
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 hover:border-white/15 transition-colors flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-trillex-orange flex-shrink-0" />
                <span>Global Sync</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 hover:border-white/15 transition-colors flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-white/60 flex-shrink-0" />
                <span>A&R Pipeline</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 hover:border-white/15 transition-colors flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-white/60 flex-shrink-0" />
                <span>Master Rights</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 hover:border-white/15 transition-colors flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-trillex-orange flex-shrink-0" />
                <span>Direct Ingest</span>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* CONNECTOR 1: Dynamic Branching Data Conduits (Desktop)   */}
          {/* ======================================================== */}
          <div className="w-full max-w-4xl h-20 md:h-24 relative hidden md:block my-1">
            <svg className="w-full h-full" viewBox="0 0 800 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 400 0 C 400 50, 140 50, 140 100" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="none" />
              <path d="M 400 0 L 400 100" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" />
              <path d="M 400 0 C 400 50, 660 50, 660 100" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="none" />

              <path d="M 400 0 C 400 50, 140 50, 140 100" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none" className="data-pipe-anim" />
              <path d="M 400 0 L 400 100" stroke="rgba(255,127,80,0.8)" strokeWidth="1.5" fill="none" className="data-pipe-anim" />
              <path d="M 400 0 C 400 50, 660 50, 660 100" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none" className="data-pipe-anim" />

              <circle r="3" fill="#FFFFFF">
                <animateMotion dur="2.4s" repeatCount="indefinite" path="M 400 0 C 400 50, 140 50, 140 100" />
              </circle>
              <circle r="3.5" fill="#FF7F50">
                <animateMotion dur="1.8s" repeatCount="indefinite" path="M 400 0 L 400 100" />
              </circle>
              <circle r="3" fill="#FFFFFF">
                <animateMotion dur="2.4s" repeatCount="indefinite" path="M 400 0 C 400 50, 660 50, 660 100" />
              </circle>

              <circle cx="400" cy="4" r="3.5" fill="#FF7F50" />
              <circle cx="140" cy="96" r="3" fill="#EAEAEA" />
              <circle cx="400" cy="96" r="3" fill="#EAEAEA" />
              <circle cx="660" cy="96" r="3" fill="#EAEAEA" />
            </svg>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-trillex-black border border-white/10 px-3 py-1 rounded-full text-[9px] font-mono text-white/50 uppercase tracking-widest backdrop-blur-md shadow-lg flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-trillex-orange animate-pulse" />
              <span>CURATED IMPRINT DISTRIBUTION</span>
            </div>
          </div>

          {/* Mobile Connector */}
          <div className="flex md:hidden flex-col items-center my-3">
            <div className="w-px h-8 bg-gradient-to-b from-trillex-orange to-white/40" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 my-1">
              CURATED IMPRINTS
            </span>
          </div>

          {/* ======================================================== */}
          {/* LEVEL 2: SUB-LABEL IMPRINTS CARDS                         */}
          {/* ======================================================== */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 relative">

            {/* --- 1. TRILLEX AVANT --- */}
            <div 
              onMouseEnter={() => setHoveredCard('avant')}
              onMouseLeave={() => setHoveredCard(null)}
              className="anim-float-1 bg-[#0A0A0A] border border-white/10 hover:border-white/30 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 group shadow-xl hover:-translate-y-1"
            >
              <div>
                
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-black border border-white/10 p-2 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <img src="/Avant.png" alt="Trillex Avant" className="w-full h-full object-contain" />
                  </div>

                  <div className="flex items-end gap-1 h-4 w-12 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-md overflow-hidden flex-shrink-0">
                    <span className="w-1 bg-white/80 rounded-full eq-1" />
                    <span className="w-1 bg-white/80 rounded-full eq-2" />
                    <span className="w-1 bg-white/80 rounded-full eq-3" />
                    <span className="w-1 bg-white/80 rounded-full eq-4" />
                    <span className="w-1 bg-white/80 rounded-full eq-5" />
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
                  <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-100" />
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

                <button
                  type="button"
                  onClick={() => handleDirectDemoSubmission('Trillex Avant')}
                  data-hoverable="true"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-trillex-orange text-white hover:text-black border border-white/10 hover:border-trillex-orange text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 group/btn shadow-sm hover:shadow-[0_0_20px_rgba(255,127,80,0.3)]"
                >
                  <Send className="w-3.5 h-3.5 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  <span>SUBMIT DEMO</span>
                </button>
              </div>
            </div>

            {/* --- 2. TRILLEX BOUNCE --- */}
            <div 
              onMouseEnter={() => setHoveredCard('bounce')}
              onMouseLeave={() => setHoveredCard(null)}
              className="anim-float-2 bg-[#0A0A0A] border border-white/10 hover:border-white/30 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 group shadow-xl hover:-translate-y-1"
            >
              <div>
                
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-black border border-white/10 p-2 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <img src="/Bounce.png" alt="Trillex Bounce" className="w-full h-full object-contain" />
                  </div>

                  <div className="flex items-end gap-1 h-4 w-12 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-md overflow-hidden flex-shrink-0">
                    <span className="w-1 bg-white/80 rounded-full eq-4" />
                    <span className="w-1 bg-white/80 rounded-full eq-1" />
                    <span className="w-1 bg-white/80 rounded-full eq-5" />
                    <span className="w-1 bg-white/80 rounded-full eq-2" />
                    <span className="w-1 bg-white/80 rounded-full eq-3" />
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
                  <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-100" />
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

                <button
                  type="button"
                  onClick={() => handleDirectDemoSubmission('Trillex Bounce')}
                  data-hoverable="true"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-trillex-orange text-white hover:text-black border border-white/10 hover:border-trillex-orange text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 group/btn shadow-sm hover:shadow-[0_0_20px_rgba(255,127,80,0.3)]"
                >
                  <Send className="w-3.5 h-3.5 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  <span>SUBMIT DEMO</span>
                </button>
              </div>
            </div>

            {/* --- 3. TRILLEX RECORDS --- */}
            <div 
              onMouseEnter={() => setHoveredCard('records')}
              onMouseLeave={() => setHoveredCard(null)}
              className="anim-float-3 bg-[#0A0A0A] border border-white/10 hover:border-white/30 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 group shadow-xl hover:-translate-y-1"
            >
              <div>
                
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-black border border-white/10 p-2 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <img src="/trillex-logo.png" alt="Trillex Records" className="w-full h-full object-contain" />
                  </div>

                  <div className="flex items-end gap-1 h-4 w-12 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-md overflow-hidden flex-shrink-0">
                    <span className="w-1 bg-white/80 rounded-full eq-2" />
                    <span className="w-1 bg-white/80 rounded-full eq-4" />
                    <span className="w-1 bg-white/80 rounded-full eq-1" />
                    <span className="w-1 bg-white/80 rounded-full eq-5" />
                    <span className="w-1 bg-white/80 rounded-full eq-3" />
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
                  <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-100" />
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
          {/* CONNECTOR 2: Converging Conduits to DSP Hub (Desktop)    */}
          {/* ======================================================== */}
          <div className="w-full max-w-4xl h-20 md:h-24 relative hidden md:block my-1">
            <svg className="w-full h-full" viewBox="0 0 800 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 140 0 C 140 50, 400 50, 400 100" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="none" />
              <path d="M 400 0 L 400 100" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" />
              <path d="M 660 0 C 660 50, 400 50, 400 100" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="none" />

              <path d="M 140 0 C 140 50, 400 50, 400 100" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none" className="data-pipe-anim" />
              <path d="M 400 0 L 400 100" stroke="rgba(255,127,80,0.8)" strokeWidth="1.5" fill="none" className="data-pipe-anim" />
              <path d="M 660 0 C 660 50, 400 50, 400 100" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none" className="data-pipe-anim" />

              <circle r="3" fill="#FFFFFF">
                <animateMotion dur="2.2s" repeatCount="indefinite" path="M 140 0 C 140 50, 400 50, 400 100" />
              </circle>
              <circle r="3.5" fill="#FF7F50">
                <animateMotion dur="1.7s" repeatCount="indefinite" path="M 400 0 L 400 100" />
              </circle>
              <circle r="3" fill="#FFFFFF">
                <animateMotion dur="2.2s" repeatCount="indefinite" path="M 660 0 C 660 50, 400 50, 400 100" />
              </circle>

              <circle cx="140" cy="4" r="3" fill="#EAEAEA" />
              <circle cx="400" cy="4" r="3" fill="#EAEAEA" />
              <circle cx="660" cy="4" r="3" fill="#EAEAEA" />
              <circle cx="400" cy="96" r="3.5" fill="#FF7F50" />
            </svg>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-trillex-black border border-white/10 px-3 py-1 rounded-full text-[9px] font-mono text-white/50 uppercase tracking-widest backdrop-blur-md shadow-lg flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              <span>DIRECT DSP & STREAMING PIPELINE</span>
            </div>
          </div>

          {/* Mobile Connector */}
          <div className="flex md:hidden flex-col items-center my-3">
            <div className="w-px h-8 bg-gradient-to-b from-white/40 to-emerald-400" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 my-1">
              DIRECT DSP PIPELINE
            </span>
          </div>

          {/* ======================================================== */}
          {/* LEVEL 3: GLOBAL DISTRIBUTION & DSP INGESTION CONSOLE     */}
          {/* ======================================================== */}
          <div 
            onMouseEnter={() => setHoveredCard('global')}
            onMouseLeave={() => setHoveredCard(null)}
            className="w-full max-w-3xl bg-[#0A0A0A] border border-white/10 hover:border-white/25 rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center transition-all duration-300 shadow-2xl relative overflow-hidden group mb-2"
          >
            {/* Ambient Highlight */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-mono font-semibold tracking-widest uppercase mb-3">
              <Globe2 className="w-3.5 h-3.5 text-trillex-orange animate-spin" style={{ animationDuration: '16s' }} />
              <span>GLOBAL DISTRIBUTION & DSP INGESTION</span>
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-sans text-white tracking-tight mb-2">
              DIRECT PIPELINES TO WORLDWIDE PLATFORMS
            </h3>

            <p className="text-white/50 text-xs sm:text-sm font-mono max-w-lg mb-6 leading-relaxed">
              Direct editorial pitching, Beatport chart positioning, sync licensing catalog syndication, and international radio rotation.
            </p>

            {/* DSP Console Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full font-mono text-xs">
              
              <a
                href="https://open.spotify.com/artist/trillex"
                target="_blank"
                rel="noopener noreferrer"
                data-hoverable="true"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/10 hover:border-white/30 text-white/80 hover:text-white transition-all duration-300 group/dsp shadow-sm"
              >
                <SpotifyIcon className="w-4 h-4 text-[#1DB954] group-hover/dsp:scale-110 transition-transform" />
                <span>Spotify Editorial</span>
              </a>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all duration-300">
                <Music className="w-4 h-4 text-pink-400" />
                <span>Apple Music</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all duration-300">
                <Headphones className="w-4 h-4 text-emerald-400" />
                <span>Beatport Top 100</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all duration-300">
                <Radio className="w-4 h-4 text-trillex-orange" />
                <span>Radio & Sync</span>
              </div>

            </div>

          </div>

          {/* ======================================================== */}
          {/* CONNECTOR 3: 4-Way Flow to Final Audience Destinies      */}
          {/* ======================================================== */}
          <div className="w-full max-w-5xl h-16 md:h-20 relative hidden md:block my-1">
            <svg className="w-full h-full" viewBox="0 0 1000 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 500 0 L 500 40" stroke="rgba(255,127,80,0.8)" strokeWidth="1.5" fill="none" />
              <path d="M 125 40 L 875 40" stroke="rgba(255,127,80,0.4)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
              
              {/* Vertical Drops to 4 Cards */}
              <path d="M 125 40 L 125 80" stroke="rgba(255,127,80,0.8)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
              <path d="M 375 40 L 375 80" stroke="rgba(255,127,80,0.8)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
              <path d="M 625 40 L 625 80" stroke="rgba(255,127,80,0.8)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
              <path d="M 875 40 L 875 80" stroke="rgba(255,127,80,0.8)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />

              <circle cx="500" cy="4" r="3.5" fill="#FF7F50" />
              <circle cx="125" cy="76" r="3" fill="#FF7F50" />
              <circle cx="375" cy="76" r="3" fill="#FF7F50" />
              <circle cx="625" cy="76" r="3" fill="#FF7F50" />
              <circle cx="875" cy="76" r="3" fill="#FF7F50" />
            </svg>
          </div>

          {/* Mobile Connector */}
          <div className="flex md:hidden flex-col items-center my-3">
            <div className="w-px h-8 bg-trillex-orange/50" />
          </div>

          {/* ======================================================== */}
          {/* LEVEL 4: 4 DANCEFLOOR & REAL-WORLD DESTINATION IMPACTS   */}
          {/* ======================================================== */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            
            {/* 1. Worldwide Listeners */}
            <div className="bg-[#0A0A0A] border border-white/10 hover:border-white/25 rounded-2xl p-5 transition-all duration-300 group shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/80 group-hover:text-trillex-orange transition-colors">
                    <Globe2 className="w-4 h-4" />
                  </div>
                  <div className="flex items-end gap-1 h-3.5 px-1 bg-white/5 rounded">
                    <span className="w-0.5 bg-white/60 rounded eq-1" />
                    <span className="w-0.5 bg-white/60 rounded eq-3" />
                    <span className="w-0.5 bg-white/60 rounded eq-2" />
                  </div>
                </div>

                <h5 className="text-sm font-bold font-sans text-white uppercase tracking-wider mb-1 group-hover:text-trillex-orange transition-colors">
                  WORLDWIDE LISTENERS
                </h5>

                <p className="text-white/50 text-xs font-mono leading-relaxed">
                  Millions streaming in 120+ countries daily across personal devices.
                </p>
              </div>
            </div>

            {/* 2. Club Dancefloors */}
            <div className="bg-[#0A0A0A] border border-white/10 hover:border-white/25 rounded-2xl p-5 transition-all duration-300 group shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/80 group-hover:text-trillex-orange transition-colors">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="flex items-end gap-1 h-3.5 px-1 bg-white/5 rounded">
                    <span className="w-0.5 bg-white/60 rounded eq-4" />
                    <span className="w-0.5 bg-white/60 rounded eq-1" />
                    <span className="w-0.5 bg-white/60 rounded eq-5" />
                  </div>
                </div>

                <h5 className="text-sm font-bold font-sans text-white uppercase tracking-wider mb-1 group-hover:text-trillex-orange transition-colors">
                  CLUB DANCEFLOORS
                </h5>

                <p className="text-white/50 text-xs font-mono leading-relaxed">
                  DJ sets across global club residencies, warehouse raves, and underground venues.
                </p>
              </div>
            </div>

            {/* 3. Festival Mainstages */}
            <div className="bg-[#0A0A0A] border border-white/10 hover:border-white/25 rounded-2xl p-5 transition-all duration-300 group shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/80 group-hover:text-trillex-orange transition-colors">
                    <Zap className="w-4 h-4 text-trillex-orange" />
                  </div>
                  <div className="flex items-end gap-1 h-3.5 px-1 bg-white/5 rounded">
                    <span className="w-0.5 bg-white/60 rounded eq-2" />
                    <span className="w-0.5 bg-white/60 rounded eq-5" />
                    <span className="w-0.5 bg-white/60 rounded eq-3" />
                  </div>
                </div>

                <h5 className="text-sm font-bold font-sans text-white uppercase tracking-wider mb-1 group-hover:text-trillex-orange transition-colors">
                  FESTIVAL MAINSTAGES
                </h5>

                <p className="text-white/50 text-xs font-mono leading-relaxed">
                  Peak-time anthems played by top headliners to crowds of 50,000+.
                </p>
              </div>
            </div>

            {/* 4. Curated Playlists */}
            <div className="bg-[#0A0A0A] border border-white/10 hover:border-white/25 rounded-2xl p-5 transition-all duration-300 group shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/80 group-hover:text-trillex-orange transition-colors">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div className="flex items-end gap-1 h-3.5 px-1 bg-white/5 rounded">
                    <span className="w-0.5 bg-white/60 rounded eq-3" />
                    <span className="w-0.5 bg-white/60 rounded eq-2" />
                    <span className="w-0.5 bg-white/60 rounded eq-4" />
                  </div>
                </div>

                <h5 className="text-sm font-bold font-sans text-white uppercase tracking-wider mb-1 group-hover:text-trillex-orange transition-colors">
                  CURATED PLAYLISTS
                </h5>

                <p className="text-white/50 text-xs font-mono leading-relaxed">
                  Heavy rotation across major editorial channels, algorithmic radio, and tastemakers.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default LabelFlowDiagram;
