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

      {/* Fixed Bottom-Right Motion Concept Pill */}
      {isActive && (
        <div
          className="fixed bottom-4 right-4 z-40 hidden items-center gap-2 rounded border border-white/20 bg-black/85 px-3 py-1.5 backdrop-blur-sm pointer-events-none select-none md:flex"
          role="status"
          aria-label={FLOATING_BADGE}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-trillex-signal" />
          <span className="font-mono text-[9px] tracking-[0.2em] text-white/70 uppercase">
            {FLOATING_BADGE}
          </span>
        </div>
      )}

      {/* Main Page Sections */}
      <ArtistsHero isActive={isActive} />
      <LanesManifesto isActive={isActive} />
      <SpotifyProof isActive={isActive} />
      <SoundIdProof isActive={isActive} />
      <RecordsRail isActive={isActive} />
      <WorkWithUs isActive={isActive} />
      <DemoCTA isActive={isActive} />
    </div>
  );
};

export default React.memo(Artists);
