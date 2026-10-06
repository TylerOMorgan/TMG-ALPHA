import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const waveformPath = (pointerX = 300, intensity = 0, phase = 0): string => {
  const points = Array.from({ length: 151 }, (_, index) => {
    const x = index * 4;
    const t = x / 600;
    const envelope = Math.pow(Math.sin(Math.PI * t), 2);
    const texture = 0.45 + 0.55 * Math.pow(Math.sin(index * 0.31 - phase * 0.8), 2);
    const proximity = Math.exp(-Math.pow((x - pointerX) / 85, 2));
    const breathing = 0.9 + 0.1 * Math.cos(phase);
    const amplitude = envelope * (18 * texture * breathing + 14 * proximity * intensity);
    const y = 36 + Math.sin(index * 1.72 - phase * 1.6) * amplitude;
    return `${index === 0 ? "M" : "L"}${x},${y.toFixed(2)}`;
  });
  return points.join(" ");
};

const InteractiveWaveform: React.FC = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const state = useRef({ pointerX: 300, intensity: 0 });
  const tween = useRef<gsap.core.Tween | null>(null);
  const phase = useRef(0);

  const renderWaveform = () => pathRef.current?.setAttribute("d", waveformPath(state.current.pointerX, state.current.intensity, phase.current));

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animate = (_time: number, deltaTime: number) => {
      if (document.hidden) return;
      phase.current += Math.min(deltaTime, 64) / 1000 * 0.8;
      renderWaveform();
    };
    const syncMotion = () => {
      gsap.ticker.remove(animate);
      if (motionPreference.matches) tween.current?.kill();
      phase.current = 0;
      renderWaveform();
      if (!motionPreference.matches) gsap.ticker.add(animate);
    };
    syncMotion();
    motionPreference.addEventListener("change", syncMotion);
    return () => {
      gsap.ticker.remove(animate);
      motionPreference.removeEventListener("change", syncMotion);
      tween.current?.kill();
    };
  }, []);

  const reactToPointer = (pointerX: number, intensity: number) => {
    tween.current?.kill();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      state.current = { pointerX, intensity };
      renderWaveform();
      return;
    }
    tween.current = gsap.to(state.current, {
      pointerX,
      intensity,
      duration: intensity ? 0.25 : 0.6,
      ease: "power2.out",
      onUpdate: renderWaveform,
    });
  };

  return (
    <svg
      aria-hidden="true"
      className="h-[72px] w-full"
      viewBox="0 0 600 72"
      fill="none"
      preserveAspectRatio="none"
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        reactToPointer((event.clientX - bounds.left) / bounds.width * 600, 1);
      }}
      onPointerLeave={() => reactToPointer(state.current.pointerX, 0)}
      onPointerCancel={() => reactToPointer(state.current.pointerX, 0)}
    >
      <path ref={pathRef} d={waveformPath()} stroke="#FF7F50" strokeOpacity=".8" strokeWidth="1.25" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

export default InteractiveWaveform;
