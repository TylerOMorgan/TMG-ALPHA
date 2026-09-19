import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Eyebrow from "./Eyebrow";
import Logo from "../Logo";
import {
  CTA_EYEBROW,
  CTA_TITLE,
  CTA_COPY,
  CTA_BUTTON,
  CTA_FOOTER_LEFT,
  CTA_FOOTER_RIGHT,
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
      className="relative flex min-h-[90vh] w-full flex-col justify-between overflow-hidden bg-gradient-to-b from-[#050505] via-[#090A09] to-[#040404] pt-24 pb-8 text-center text-white sm:pt-28 sm:pb-10 md:pt-36 md:pb-12"
    >
      {/* Soft atmospheric ambient glow transitioning seamlessly into dark */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] sm:h-[700px] sm:w-[700px] rounded-full bg-gradient-to-tr from-[#E58A1E]/12 via-[#FF7F50]/10 to-transparent blur-[120px] will-change-transform"
      />

      {/* Decorative subtle grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"
      />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto my-auto flex w-full max-w-[1300px] flex-1 flex-col items-center justify-center px-5 py-6 will-change-transform sm:py-8 md:px-10"
      >
        <div className="flex items-center justify-center">
          <Logo className="h-9 w-auto text-white sm:h-11 md:h-13 transition-transform duration-500 hover:scale-105" />
        </div>

        <div className="mt-6 sm:mt-8">
          <Eyebrow text={CTA_EYEBROW} tone="dark" align="center" />
        </div>

        <h2
          aria-label="YOUR RECORD COULD BE NEXT."
          className="mt-5 font-impact text-[11vw] leading-[0.95] tracking-tight text-trillex-paper sm:mt-6 sm:text-[9vw] md:text-[7vw] lg:text-[5.5vw] xl:text-[88px] 2xl:text-[104px]"
        >
          <span className="sr-only">{CTA_TITLE}</span>
          <span aria-hidden="true">
            <span className="block">YOUR RECORD</span>
            <span className="block text-white">COULD BE NEXT.</span>
          </span>
        </h2>

        <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-white/70 sm:mt-6 sm:text-base md:text-lg">
          {CTA_COPY}
        </p>

        {/* Clear, high-contrast prominent Call to Action Button */}
        <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col items-center gap-3">
          <a
            href="#demo-submission"
            onClick={handleDemo}
            data-hoverable="true"
            className="group relative inline-flex w-full max-w-xs sm:max-w-none sm:w-auto items-center justify-center gap-3 bg-[#E58A1E] px-8 py-4 font-mono text-[12px] font-bold uppercase tracking-[0.22em] text-black shadow-[0_0_30px_rgba(229,138,30,0.4)] transition-all duration-300 hover:bg-[#FF9626] hover:shadow-[0_0_50px_rgba(229,138,30,0.7)] hover:scale-105 active:scale-98 sm:px-14 sm:py-5 sm:text-[13px] sm:tracking-[0.24em]"
          >
            <span>{CTA_BUTTON}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
          <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-white/40">
            A&amp;R TEAM REVIEWS EVERY SUBMISSION
          </span>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1840px] border-t border-white/10 px-4 py-6 font-mono text-[8.5px] tracking-[0.18em] text-white/45 sm:flex sm:items-center sm:justify-between sm:px-6 sm:text-[9.5px] sm:tracking-[0.2em] md:px-10">
        <span className="block text-center sm:text-left">{CTA_FOOTER_LEFT}</span>
        <span className="mt-2 block text-center sm:mt-0 sm:text-right">
          {CTA_FOOTER_RIGHT}
        </span>
      </div>
    </section>
  );
};

export default React.memo(DemoCTA);
