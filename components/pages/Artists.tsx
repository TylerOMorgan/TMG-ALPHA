import React, { useEffect, useState } from "react";
import ArtistsHero from "../artists/ArtistsHero";
import LanesManifesto from "../artists/LanesManifesto";
import SpotifyProof from "../artists/SpotifyProof";
import SoundIdProof from "../artists/SoundIdProof";
import RecordsRail from "../artists/RecordsRail";
import WorkWithUs from "../artists/WorkWithUs";
import DemoCTA from "../artists/DemoCTA";
import { FLOATING_BADGE } from "../../utils/artistsExperienceData";

const Artists: React.FC<{ isActive?: boolean }> = ({ isActive = true }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (isActive) {
      document.title = "ARTISTS — TRILLEX MUSIC GROUP";
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const currentScroll = window.scrollY || document.documentElement.scrollTop;
      const progress = Math.min(1, Math.max(0, currentScroll / totalHeight));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isActive]);

  return (
    <div className="relative min-h-screen bg-trillex-black">
      {/* Active orange underline style for ARTISTS nav link */}
      {isActive && (
        <style>{`
          nav a[href="#artists"] span {
            background-color: #E58A1E !important;
            height: 2px !important;
          }
        `}</style>
      )}

      {/* 2px right-edge orange scroll progress indicator */}
      {isActive && (
        <div
          className="fixed top-0 right-0 z-50 w-[2px] pointer-events-none bg-[#E58A1E] transition-all duration-75 ease-out"
          style={{ height: `${scrollProgress * 100}%` }}
          aria-hidden="true"
        />
      )}

      {/* Main Page Sections */}
      <ArtistsHero isActive={isActive} />
      <LanesManifesto isActive={isActive} />
      <SpotifyProof isActive={isActive} />
      <SoundIdProof isActive={isActive} />
      <RecordsRail isActive={isActive} />
      <WorkWithUs isActive={isActive} />
      <DemoCTA isActive={isActive} />

      {/* Fixed bottom-right translucent concept pill badge */}
      {isActive && (
        <div className="fixed bottom-6 right-6 md:bottom-7 md:right-8 z-50 pointer-events-none flex items-center gap-2 rounded-sm border border-white/20 bg-[#0A0A0A]/90 px-3.5 py-1.5 backdrop-blur-md shadow-lg">
          <span className="h-1.5 w-1.5 rounded-full bg-[#E58A1E] shrink-0" />
          <span className="font-mono text-[9px] uppercase tracking-[0.20em] text-white/70 whitespace-nowrap">
            {FLOATING_BADGE}
          </span>
        </div>
      )}
    </div>
  );
};

export default React.memo(Artists);
