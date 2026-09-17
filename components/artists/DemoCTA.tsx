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
      className="relative w-full bg-[#EBE7DD] pb-10 pt-24 text-center text-trillex-ink sm:pt-28 md:pt-36 lg:pt-40"
    >
      <div
        ref={contentRef}
        className="mx-auto flex max-w-[1300px] flex-col items-center px-5 will-change-transform md:px-10"
      >
        <Logo className="h-9 w-auto text-[#333330] md:h-11" />
        <div className="mt-9">
          <Eyebrow text={CTA_EYEBROW} tone="light" align="center" />
        </div>
        <h2 className="mt-6 font-impact text-[10vw] leading-[1.0] text-[#2B2B28] sm:mt-7 sm:text-[9vw] md:text-[7.1vw]">
          <span className="block">YOUR RECORD</span>
          <span className="block">COULD BE NEXT.</span>
        </h2>
        <p className="mt-5 max-w-xl text-sm font-light leading-relaxed text-trillex-ink/70 sm:mt-7 md:text-[15px]">
          {CTA_COPY}
        </p>
        <a
          href="#demo-submission"
          onClick={handleDemo}
          data-hoverable="true"
          className="mt-8 inline-block w-full sm:w-auto bg-[#3C3A36] px-8 py-4 font-mono text-[11px] font-bold tracking-[0.22em] text-white transition-all duration-300 hover:bg-black hover:scale-[1.02] shadow-sm sm:mt-10 sm:px-11 sm:py-[18px] sm:tracking-[0.25em]"
        >
          {CTA_BUTTON}
        </a>
      </div>

      <div className="mx-auto mt-16 flex max-w-[1840px] flex-col gap-3 border-t border-trillex-ink/15 px-4 pt-5 font-mono text-[8.5px] tracking-[0.18em] text-trillex-ink/50 sm:mt-20 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-[9px] sm:tracking-[0.2em] md:px-10">
        <span>{CTA_FOOTER_LEFT}</span>
        <span>{CTA_FOOTER_RIGHT}</span>
      </div>
    </section>
  );
};

export default React.memo(DemoCTA);
