import React, { useEffect } from "react";
import ArtistsHero from "../artists/ArtistsHero";
import SpotifyProof from "../artists/SpotifyProof";
import SoundIdProof from "../artists/SoundIdProof";
import DemoCTA from "../artists/DemoCTA";

const Artists: React.FC<{ isActive?: boolean }> = ({ isActive = true }) => {
  useEffect(() => {
    if (isActive) {
      document.title = "ARTISTS — TRILLEX MUSIC GROUP";
    }
  }, [isActive]);

  return (
    <div className="relative min-h-screen bg-trillex-black overflow-x-hidden">
      {/* Active orange underline style for ARTISTS nav link */}
      {isActive && (
        <style>{`
          nav a[href="#artists"] span {
            background-color: #FF7F50 !important;
            height: 2px !important;
          }
        `}</style>
      )}

      {/* Main Page Sections */}
      <ArtistsHero isActive={isActive} />
      <SpotifyProof isActive={isActive} />
      <SoundIdProof isActive={isActive} />
      <DemoCTA isActive={isActive} />
    </div>
  );
};

export default React.memo(Artists);
