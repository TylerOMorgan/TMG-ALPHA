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

  useEffect(() => {
    if (!isActive) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "top 35%",
            scrub: true,
          },
        },
      );
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
      data-nav-theme="light"
      className="relative flex min-h-screen w-full flex-col justify-between bg-[#EBE7DD] pt-20 pb-4 text-center text-trillex-ink sm:pt-24 sm:pb-5 md:pt-28 md:pb-6"
    >
      <div
        ref={contentRef}
        className="mx-auto my-auto flex w-full max-w-[1300px] flex-1 flex-col items-center justify-center px-5 py-2 will-change-transform sm:py-4 md:px-10"
      >
        <Logo className="h-8 w-auto text-[#333330] sm:h-9 md:h-11" />
        <div className="mt-4 sm:mt-5 md:mt-6">
          <Eyebrow text={CTA_EYEBROW} tone="light" align="center" />
        </div>
        <h2
          aria-label="YOUR RECORD COULD BE NEXT."
          className="mt-4 font-impact text-[10vw] leading-[1.0] text-[#2B2B28] sm:mt-5 sm:text-[8.5vw] md:text-[6.5vw] lg:text-[5.2vw] xl:text-[82px] 2xl:text-[98px]"
        >
          <span className="sr-only">YOUR RECORD COULD BE NEXT.</span>
          <span aria-hidden="true">
            <span className="block">YOUR RECORD</span>
            <span className="block">COULD BE NEXT.</span>
          </span>
        </h2>
        <p className="mt-3.5 max-w-xl text-xs font-light leading-relaxed text-trillex-ink/70 sm:mt-5 sm:text-sm md:text-[15px]">
          {CTA_COPY}
        </p>
        <a
          href="#demo-submission"
          onClick={handleDemo}
          data-hoverable="true"
          className="mt-6 inline-block w-full max-w-xs sm:max-w-none sm:w-auto bg-[#3C3A36] px-8 py-3.5 font-mono text-[11px] font-bold tracking-[0.22em] text-white transition-all duration-300 hover:bg-black hover:scale-[1.02] shadow-sm sm:mt-8 sm:px-11 sm:py-[17px] sm:tracking-[0.25em]"
        >
          {CTA_BUTTON}
        </a>
      </div>

      <div className="mx-auto w-full max-w-[1840px] border-t border-trillex-ink/15 px-4 py-4 font-mono text-[8.5px] tracking-[0.18em] text-trillex-ink/50 sm:flex sm:items-center sm:justify-between sm:px-6 sm:text-[9px] sm:tracking-[0.2em] md:px-10">
        <span className="block text-center sm:text-left">{CTA_FOOTER_LEFT}</span>
        <span className="mt-2 block text-center sm:mt-0 sm:text-right">{CTA_FOOTER_RIGHT}</span>
      </div>
    </section>
  );
};

export default React.memo(DemoCTA);
