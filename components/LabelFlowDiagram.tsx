import React, { useState } from 'react';
import { 
  ArrowDown, Radio, Headphones, Sparkles, Disc3, Globe2, Music, 
  Layers, Cpu, Share2, Play, ExternalLink, Zap, Activity, ShieldCheck
} from 'lucide-react';

const SpotifyIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Spotify">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.518 17.306c-.216.353-.674.467-1.027.25-2.822-1.724-6.376-2.115-10.562-1.158-.403.092-.806-.157-.899-.56-.092-.403.158-.806.56-.899 4.588-1.047 8.528-.601 11.678 1.34.353.216.467.674.25 1.027zm1.472-3.273c-.272.443-.853.582-1.296.31-3.23-1.986-8.156-2.56-11.977-1.4-1.498.151-.99-.245-1.141-.743-.151-.498.245-.99.743-1.141 4.38-1.33 9.805-.688 13.511 1.588.443.272.582.853.31 1.296zm.129-3.41c-3.874-2.3-10.274-2.513-13.99-1.385-.595.181-1.226-.156-1.407-.751-.181-.595.156-1.226.751-1.407 4.267-1.295 11.328-1.047 15.795 1.604.536.318.71 1.015.392 1.551-.318.536-1.015.71-1.551.392z"/>
  </svg>
);

const LabelFlowDiagram: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'avant' | 'bounce' | 'records'>('all');

  return (
    <section className="relative w-full py-20 md:py-32 bg-[#050505] overflow-hidden select-none">
      {/* Dynamic Laser & Pulse Styles */}
      <style>{`
        @keyframes laserPulse {
          0% {
            stroke-dashoffset: 100;
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0.2;
          }
        }

        @keyframes audioWave {
          0%, 100% { height: 4px; }
          50% { height: 18px; }
        }

        .laser-line {
          stroke-dasharray: 12, 12;
          animation: laserPulse 2.5s linear infinite;
        }

        .equalizer-bar-1 { animation: audioWave 0.8s ease-in-out infinite; }
        .equalizer-bar-2 { animation: audioWave 1.2s ease-in-out infinite 0.2s; }
        .equalizer-bar-3 { animation: audioWave 0.6s ease-in-out infinite 0.4s; }
        .equalizer-bar-4 { animation: audioWave 1.0s ease-in-out infinite 0.1s; }
      `}</style>

      {/* Atmospheric Background Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#FF7F50]/10 via-purple-600/5 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[300px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24 flex flex-col items-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-4 shadow-[0_0_20px_rgba(255,127,80,0.15)]">
            <span className="w-2 h-2 rounded-full bg-trillex-orange animate-pulse shadow-[0_0_8px_#FF7F50]" />
            <span className="text-trillex-orange text-[11px] font-mono font-bold tracking-[0.25em] uppercase">
              ECOSYSTEM & PIPELINE
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-sans font-extrabold text-white tracking-tight max-w-3xl leading-[1.1]">
            HOW THE TRILLEX ENGINE OPERATES
          </h2>
          
          <p className="text-white/50 text-xs sm:text-base font-mono mt-4 max-w-2xl leading-relaxed">
            A frictionless global ecosystem translating artistic vision into worldwide dancefloor resonance.
          </p>
        </div>

        {/* ======================================================== */}
        {/* DIAGRAM CONTAINER WITH CURVED CONDUIT SYSTEM             */}
        {/* ======================================================== */}
        <div className="relative flex flex-col items-center">

          {/* ======================================================== */}
          {/* LEVEL 1: MAIN LABEL COMMAND NODE                          */}
          {/* ======================================================== */}
          <div className="w-full max-w-3xl relative group">
            {/* Glowing Border Backdrop */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-trillex-orange/60 via-purple-500/40 to-trillex-orange/60 rounded-[32px] blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/15 rounded-[30px] p-6 sm:p-8 md:p-10 shadow-2xl">
              
              {/* Top Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-black border border-white/10 p-2 flex items-center justify-center shadow-[0_0_20px_rgba(255,127,80,0.2)]">
                    <img src="/trillex-logo.png" alt="Trillex Music Group" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-trillex-orange tracking-widest uppercase font-bold">
                        MAIN LABEL • GLOBAL HQ
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-sans font-black text-white tracking-tight">
                      TRILLEX MUSIC GROUP
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-white/50 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                    BKK • 2024
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full font-bold">
                    ACTIVE DIRECTORY
                  </span>
                </div>
              </div>

              {/* Core Mission & Functional Infrastructure */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7">
                  <p className="text-white/70 text-xs sm:text-sm font-mono leading-relaxed">
                    Provides centralized capital funding, master distribution, global sync licensing, and strategic A&R direction to our sub-label divisions.
                  </p>
                </div>

                <div className="md:col-span-5 grid grid-cols-2 gap-2 font-mono text-[10px] sm:text-[11px]">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2 text-white/80">
                    <Zap className="w-3.5 h-3.5 text-trillex-orange" />
                    <span>Global Sync</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2 text-white/80">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>A&R Pipeline</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2 text-white/80">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Master Rights</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2 text-white/80">
                    <Cpu className="w-3.5 h-3.5 text-trillex-orange" />
                    <span>Direct DSP Ingest</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ======================================================== */}
          {/* CONNECTOR 1: Branching SVG Laser Conduits (Desktop)       */}
          {/* ======================================================== */}
          <div className="w-full max-w-4xl h-20 md:h-28 relative my-2 hidden md:block">
            <svg className="w-full h-full" viewBox="0 0 800 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="laserGradOrange" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FF7F50" stopOpacity="1" />
                  <stop offset="100%" stopColor="#FF7F50" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="laserGradPurple" x1="50%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FF7F50" stopOpacity="1" />
                  <stop offset="100%" stopColor="#A855F7" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="laserGradEmerald" x1="50%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF7F50" stopOpacity="1" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Base Static Guide Lines */}
              <path d="M 400 0 C 400 60, 140 50, 140 120" stroke="rgba(168,85,247,0.2)" strokeWidth="2" fill="none" />
              <path d="M 400 0 L 400 120" stroke="rgba(16,185,129,0.2)" strokeWidth="2" fill="none" />
              <path d="M 400 0 C 400 60, 660 50, 660 120" stroke="rgba(255,127,80,0.2)" strokeWidth="2" fill="none" />

              {/* Animated Glowing Laser Pulses */}
              <path d="M 400 0 C 400 60, 140 50, 140 120" stroke="url(#laserGradPurple)" strokeWidth="2.5" fill="none" className="laser-line" />
              <path d="M 400 0 L 400 120" stroke="url(#laserGradEmerald)" strokeWidth="2.5" fill="none" className="laser-line" />
              <path d="M 400 0 C 400 60, 660 50, 660 120" stroke="url(#laserGradOrange)" strokeWidth="2.5" fill="none" className="laser-line" />

              {/* Center Origin Glowing Node */}
              <circle cx="400" cy="8" r="5" fill="#FF7F50" filter="drop-shadow(0 0 8px #FF7F50)" />
              
              {/* Destination Drop Nodes */}
              <circle cx="140" cy="112" r="4" fill="#A855F7" filter="drop-shadow(0 0 8px #A855F7)" />
              <circle cx="400" cy="112" r="4" fill="#10B981" filter="drop-shadow(0 0 8px #10B981)" />
              <circle cx="660" cy="112" r="4" fill="#FF7F50" filter="drop-shadow(0 0 8px #FF7F50)" />
            </svg>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 border border-white/10 px-3 py-1 rounded-full text-[9px] font-mono text-white/50 uppercase tracking-widest backdrop-blur-md">
              CURATED IMPRINT DISTRIBUTION
            </div>
          </div>

          {/* Mobile Fallback Connector */}
          <div className="flex md:hidden flex-col items-center my-4">
            <div className="w-0.5 h-10 bg-gradient-to-b from-trillex-orange to-purple-500" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 my-1">
              CURATED IMPRINTS
            </span>
          </div>

          {/* ======================================================== */}
          {/* LEVEL 2: SUB-LABEL IMPRINTS & GENRE SPECIALIZATIONS      */}
          {/* ======================================================== */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 relative">

            {/* --- 1. TRILLEX AVANT --- */}
            <div className="relative group rounded-3xl p-0.5 bg-gradient-to-b from-purple-500/40 via-purple-500/10 to-transparent hover:from-purple-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.25)] transition-all duration-500">
              <div className="bg-[#0C0A10]/95 backdrop-blur-2xl rounded-[23px] p-6 sm:p-7 flex flex-col justify-between h-full border border-purple-500/20">
                
                <div>
                  {/* Top Bar with Logo & Equalizer */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-black/60 border border-purple-500/40 p-2 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                      <img src="/Avant.png" alt="Trillex Avant" className="w-full h-full object-contain" />
                    </div>

                    {/* Animated Soundwave Equalizer */}
                    <div className="flex items-end gap-1 h-5 bg-purple-500/10 border border-purple-500/30 px-2.5 py-1 rounded-lg">
                      <span className="w-1 bg-purple-400 rounded-full equalizer-bar-1" />
                      <span className="w-1 bg-purple-400 rounded-full equalizer-bar-2" />
                      <span className="w-1 bg-purple-400 rounded-full equalizer-bar-3" />
                      <span className="w-1 bg-purple-400 rounded-full equalizer-bar-4" />
                    </div>
                  </div>

                  <div className="mb-2">
                    <span className="text-[9px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 font-bold">
                      SUB-LABEL 01
                    </span>
                  </div>

                  <h4 className="text-2xl font-bold font-sans text-white group-hover:text-purple-300 transition-colors">
                    TRILLEX AVANT
                  </h4>

                  <a 
                    href="https://www.instagram.com/trillexavant" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    data-hoverable="true"
                    className="inline-flex items-center gap-1 text-xs font-mono text-purple-400/80 hover:text-purple-300 transition-colors mt-1 mb-4"
                  >
                    <span>@trillexavant</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>

                  <p className="text-white/65 text-xs font-mono leading-relaxed mb-6">
                    Pioneering experimental soundscapes, melodic techno, cyber synthwave, and hypnotic underground electronic journeys.
                  </p>
                </div>

                {/* Footnote Specs */}
                <div className="pt-4 border-t border-purple-500/20 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-white/40">SONIC FOCUS</span>
                  <span className="text-purple-300 font-bold">Techno & Cyber</span>
                </div>

              </div>
            </div>

            {/* --- 2. TRILLEX BOUNCE --- */}
            <div className="relative group rounded-3xl p-0.5 bg-gradient-to-b from-emerald-500/40 via-emerald-500/10 to-transparent hover:from-emerald-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.25)] transition-all duration-500">
              <div className="bg-[#080E0B]/95 backdrop-blur-2xl rounded-[23px] p-6 sm:p-7 flex flex-col justify-between h-full border border-emerald-500/20">
                
                <div>
                  {/* Top Bar with Logo & Equalizer */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-black/60 border border-emerald-500/40 p-2 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      <img src="/Bounce.png" alt="Trillex Bounce" className="w-full h-full object-contain" />
                    </div>

                    {/* Animated Soundwave Equalizer */}
                    <div className="flex items-end gap-1 h-5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                      <span className="w-1 bg-emerald-400 rounded-full equalizer-bar-2" />
                      <span className="w-1 bg-emerald-400 rounded-full equalizer-bar-4" />
                      <span className="w-1 bg-emerald-400 rounded-full equalizer-bar-1" />
                      <span className="w-1 bg-emerald-400 rounded-full equalizer-bar-3" />
                    </div>
                  </div>

                  <div className="mb-2">
                    <span className="text-[9px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
                      SUB-LABEL 02
                    </span>
                  </div>

                  <h4 className="text-2xl font-bold font-sans text-white group-hover:text-emerald-300 transition-colors">
                    TRILLEX BOUNCE
                  </h4>

                  <a 
                    href="https://www.instagram.com/trillexbounce" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    data-hoverable="true"
                    className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400/80 hover:text-emerald-300 transition-colors mt-1 mb-4"
                  >
                    <span>@trillexbounce</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>

                  <p className="text-white/65 text-xs font-mono leading-relaxed mb-6">
                    High-octane Brazilian Phonk, heavy Bass House, raw hardstyle, and festival-crushing 160BPM high-energy anthems.
                  </p>
                </div>

                {/* Footnote Specs */}
                <div className="pt-4 border-t border-emerald-500/20 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-white/40">SONIC FOCUS</span>
                  <span className="text-emerald-300 font-bold">Phonk & Bass House</span>
                </div>

              </div>
            </div>

            {/* --- 3. TRILLEX RECORDS --- */}
            <div className="relative group rounded-3xl p-0.5 bg-gradient-to-b from-trillex-orange/40 via-trillex-orange/10 to-transparent hover:from-trillex-orange hover:shadow-[0_0_40px_rgba(255,127,80,0.25)] transition-all duration-500">
              <div className="bg-[#0E0A08]/95 backdrop-blur-2xl rounded-[23px] p-6 sm:p-7 flex flex-col justify-between h-full border border-trillex-orange/20">
                
                <div>
                  {/* Top Bar with Logo & Equalizer */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-black/60 border border-trillex-orange/40 p-2 flex items-center justify-center shadow-[0_0_15px_rgba(255,127,80,0.3)]">
                      <img src="/trillex-logo.png" alt="Trillex Records" className="w-full h-full object-contain" />
                    </div>

                    {/* Animated Soundwave Equalizer */}
                    <div className="flex items-end gap-1 h-5 bg-trillex-orange/10 border border-trillex-orange/30 px-2.5 py-1 rounded-lg">
                      <span className="w-1 bg-trillex-orange rounded-full equalizer-bar-3" />
                      <span className="w-1 bg-trillex-orange rounded-full equalizer-bar-1" />
                      <span className="w-1 bg-trillex-orange rounded-full equalizer-bar-4" />
                      <span className="w-1 bg-trillex-orange rounded-full equalizer-bar-2" />
                    </div>
                  </div>

                  <div className="mb-2">
                    <span className="text-[9px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-trillex-orange/10 text-trillex-orange border border-trillex-orange/30 font-bold">
                      MAIN IMPRINT
                    </span>
                  </div>

                  <h4 className="text-2xl font-bold font-sans text-white group-hover:text-trillex-orange transition-colors">
                    TRILLEX RECORDS
                  </h4>

                  <a 
                    href="https://www.instagram.com/trillexmusicgroup" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    data-hoverable="true"
                    className="inline-flex items-center gap-1 text-xs font-mono text-trillex-orange/80 hover:text-trillex-orange transition-colors mt-1 mb-4"
                  >
                    <span>@trillexmusicgroup</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>

                  <p className="text-white/65 text-xs font-mono leading-relaxed mb-6">
                    Global crossover vocal dance, melodic Afro-house, crossover chart releases, and flagship headline singles.
                  </p>
                </div>

                {/* Footnote Specs */}
                <div className="pt-4 border-t border-trillex-orange/20 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-white/40">SONIC FOCUS</span>
                  <span className="text-trillex-orange font-bold">Global Vocal Dance</span>
                </div>

              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* CONNECTOR 2: Converging SVG Conduits to Global Hub        */}
          {/* ======================================================== */}
          <div className="w-full max-w-4xl h-20 md:h-28 relative my-2 hidden md:block">
            <svg className="w-full h-full" viewBox="0 0 800 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="convergeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#34D399" stopOpacity="1" />
                </linearGradient>
              </defs>

              {/* Guide Lines */}
              <path d="M 140 0 C 140 70, 400 60, 400 120" stroke="rgba(168,85,247,0.2)" strokeWidth="2" fill="none" />
              <path d="M 400 0 L 400 120" stroke="rgba(16,185,129,0.2)" strokeWidth="2" fill="none" />
              <path d="M 660 0 C 660 70, 400 60, 400 120" stroke="rgba(255,127,80,0.2)" strokeWidth="2" fill="none" />

              {/* Glowing Moving Laser */}
              <path d="M 140 0 C 140 70, 400 60, 400 120" stroke="url(#laserGradPurple)" strokeWidth="2.5" fill="none" className="laser-line" />
              <path d="M 400 0 L 400 120" stroke="url(#laserGradEmerald)" strokeWidth="2.5" fill="none" className="laser-line" />
              <path d="M 660 0 C 660 70, 400 60, 400 120" stroke="url(#laserGradOrange)" strokeWidth="2.5" fill="none" className="laser-line" />

              <circle cx="400" cy="112" r="6" fill="#34D399" filter="drop-shadow(0 0 10px #34D399)" />
            </svg>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 border border-white/10 px-3 py-1 rounded-full text-[9px] font-mono text-white/50 uppercase tracking-widest backdrop-blur-md">
              DIRECT DSP & STREAMING PIPELINE
            </div>
          </div>

          {/* Mobile Fallback Connector */}
          <div className="flex md:hidden flex-col items-center my-4">
            <div className="w-0.5 h-10 bg-gradient-to-b from-emerald-500 to-emerald-400" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 my-1">
              DIRECT DSP PIPELINE
            </span>
          </div>

          {/* ======================================================== */}
          {/* LEVEL 3: OUTBOUND GLOBAL AUDIENCE & STREAMING CONSOLE    */}
          {/* ======================================================== */}
          <div className="w-full max-w-4xl relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/50 via-teal-500/30 to-emerald-500/50 rounded-[32px] blur-lg opacity-50 group-hover:opacity-90 transition-opacity duration-500" />

            <div className="relative bg-[#090D0B]/95 backdrop-blur-2xl border border-emerald-500/30 rounded-[30px] p-6 sm:p-8 md:p-10 shadow-2xl text-center flex flex-col items-center">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold tracking-widest uppercase mb-4 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                <Globe2 className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '12s' }} />
                <span>GLOBAL REACH & BROADCAST</span>
              </div>

              <h3 className="text-2xl sm:text-4xl md:text-5xl font-sans font-black text-white tracking-tight max-w-2xl mb-3">
                10,000,000+ FANS WORLDWIDE
              </h3>

              <p className="text-white/60 text-xs sm:text-sm font-mono max-w-xl mb-8 leading-relaxed">
                Direct-to-consumer delivery pushing master-quality audio directly to premier streaming platforms, club sound systems, and festival mainstages in 120+ countries.
              </p>

              {/* DSP Console Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full font-mono text-xs">
                
                <a
                  href="https://open.spotify.com/artist/trillex"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-hoverable="true"
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white/[0.03] hover:bg-[#1DB954]/20 border border-white/10 hover:border-[#1DB954]/50 text-white/80 hover:text-[#1DB954] transition-all duration-300 group/dsp"
                >
                  <SpotifyIcon className="w-4 h-4 text-[#1DB954] group-hover/dsp:scale-110 transition-transform" />
                  <span className="font-bold">Spotify</span>
                </a>

                <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white/[0.03] hover:bg-pink-500/20 border border-white/10 hover:border-pink-500/50 text-white/80 hover:text-pink-400 transition-all duration-300">
                  <Music className="w-4 h-4 text-pink-400" />
                  <span className="font-bold">Apple Music</span>
                </div>

                <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white/[0.03] hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 text-white/80 hover:text-red-400 transition-all duration-300">
                  <Play className="w-4 h-4 text-red-500" />
                  <span className="font-bold">YouTube</span>
                </div>

                <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white/[0.03] hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 text-white/80 hover:text-cyan-400 transition-all duration-300">
                  <Headphones className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold">Beatport</span>
                </div>

                <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 p-3 rounded-2xl bg-white/[0.03] hover:bg-trillex-orange/20 border border-white/10 hover:border-trillex-orange/50 text-white/80 hover:text-trillex-orange transition-all duration-300">
                  <Radio className="w-4 h-4 text-trillex-orange" />
                  <span className="font-bold">Festivals</span>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default LabelFlowDiagram;
