import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Logo from "../Logo";
import Footer from "../Footer";
import {
  CTA_TITLE,
  CTA_COPY,
  CTA_BUTTON,
} from "../../utils/artistsExperienceData";

gsap.registerPlugin(ScrollTrigger);

interface SectionProps {
  isActive?: boolean;
}

const DemoCTA: React.FC<SectionProps> = ({ isActive = true }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "top 35%",
            scrub: 1,
          },
        },
      );

      if (glowRef.current) {
        gsap.fromTo(
          glowRef.current,
          { scale: 0.8, opacity: 0.3 },
          {
            scale: 1.15,
            opacity: 0.7,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [isActive]);

  const handleDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = "#demo-submission";
    const event = new CustomEvent("trillex-navigate", {
      detail: { page: "contact", section: "demo-submission" },
    });
    window.dispatchEvent(event);
  };

  return (
    <section
      ref={sectionRef}
      data-nav-theme="dark"
      className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-gradient-to-b from-[#050505] via-[#090A09] to-[#040404] text-center text-white"
    >
      {/* Soft atmospheric ambient glow transitioning seamlessly into dark */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] sm:h-[700px] sm:w-[700px] rounded-full bg-gradient-to-tr from-[#FF7F50]/12 via-[#FF7F50]/10 to-transparent blur-[120px] will-change-transform"
      />

      {/* Decorative subtle grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"
      />

      {/* Top spacer balancing the footer and fixed navbar */}
      <div
        className="h-16 md:h-20 w-full shrink-0 pointer-events-none"
        aria-hidden="true"
      />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex w-full max-w-[1300px] flex-1 flex-col items-center justify-center px-5 py-12 will-change-transform sm:py-14 md:px-10 md:py-16"
      >
        <div className="flex items-center justify-center">
          <Logo className="h-[64px] w-auto text-white md:h-[110px] transition-transform duration-500 hover:scale-105" />
        </div>

        <h2
          aria-label="YOUR RECORD COULD BE NEXT."
          className="mt-4 font-impact text-[10vw] leading-[0.95] tracking-tight text-trillex-paper sm:mt-5 sm:text-[8.5vw] md:text-[6.5vw] lg:text-[5vw] xl:text-[82px] 2xl:text-[96px]"
        >
          <span className="sr-only">{CTA_TITLE}</span>
          <span aria-hidden="true">
            <span className="block">YOUR RECORD</span>
            <span className="block text-white">COULD BE NEXT.</span>
          </span>
        </h2>

        <p className="mt-3.5 max-w-xl text-sm font-light leading-relaxed text-white/70 sm:mt-5 sm:text-base md:text-lg">
          {CTA_COPY}
        </p>

        {/* Clear, high-contrast prominent Call to Action Button */}
        <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col items-center gap-2.5">
          <a
            href="#demo-submission"
            onClick={handleDemo}
            data-hoverable="true"
            className="group relative inline-flex w-full max-w-xs sm:max-w-none sm:w-auto items-center justify-center gap-3 rounded-xl bg-[#FF7F50] px-8 py-3.5 font-mono text-[12px] font-bold uppercase tracking-[0.22em] text-black shadow-[0_0_30px_rgba(255,127,80,0.4)] transition-all duration-300 hover:bg-[#FF7F50] hover:shadow-[0_0_50px_rgba(255,127,80,0.7)] hover:scale-105 active:scale-98 sm:px-14 sm:py-4.5 sm:text-[13px] sm:tracking-[0.24em]"
          >
            <span>{CTA_BUTTON}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
        </div>
      </div>

      <div className="relative z-10 w-full shrink-0">
        <Footer showScrollTop />
      </div>
    </section>
  );
};

export default React.memo(DemoCTA);
