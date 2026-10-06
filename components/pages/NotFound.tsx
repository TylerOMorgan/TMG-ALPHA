import React, { useEffect } from "react";
import { getPageUrl } from "../../utils/pageRouting";
import InteractiveWaveform from "../InteractiveWaveform";

const NotFound: React.FC = () => {
  useEffect(() => {
    document.title = "404 — TRACK NOT FOUND | TRILLEX";
  }, []);

  const navigate = (event: React.MouseEvent<HTMLAnchorElement>, page: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.dispatchEvent(new CustomEvent("trillex-navigate", { detail: { page } }));
  };

  return (
    <section className="not-found-page relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-trillex-black px-5 pb-5 pt-24 text-white md:px-12 md:pb-7 md:pt-28" aria-labelledby="not-found-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center py-3 text-center motion-safe:animate-in">
        <p className="flex items-center gap-3 font-mono text-[10px] tracking-[0.23em] text-white/60 sm:text-xs">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-trillex-orange shadow-[0_0_12px_#FF7F5060]" />
          CATALOG ERROR <span className="text-white/25">/</span> 404
        </p>

        <div aria-hidden="true" className="relative my-4 flex w-full items-center justify-center sm:my-5">
          <span className="select-none bg-gradient-to-b from-[#ECEADE] via-[#8A8983] to-[#252522] bg-clip-text font-impact text-[clamp(120px,min(30vw,28svh),290px)] leading-[1] tracking-[-0.08em] text-transparent pr-[0.08em]">404</span>
        </div>

        <div className="-mt-2 mb-2 w-full max-w-[520px] sm:mb-4">
          <InteractiveWaveform />
        </div>

        <h1 id="not-found-title" className="max-w-4xl font-impact text-[clamp(25px,3.2vw,42px)] leading-[1.13] tracking-[-0.035em]">
          THIS TRACK COULDN’T<br className="sm:hidden" /> BE FOUND.
        </h1>
        <p className="mt-4 max-w-[290px] text-sm leading-relaxed text-white/55 sm:max-w-none sm:text-base">
          The page you’re looking for has moved or doesn’t exist.
        </p>

        <div className="mt-7 flex w-full max-w-[280px] flex-col items-stretch gap-3 sm:mt-8 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-8">
          <a href={getPageUrl("home")} onClick={(event) => navigate(event, "home")} data-hoverable="true" className="inline-flex min-h-12 items-center justify-center gap-4 rounded-full bg-trillex-orange px-7 py-3 font-mono text-xs font-bold tracking-[0.12em] text-black transition-colors hover:bg-[#ff9b76] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-trillex-orange">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m12 5-7 7 7 7M5 12h14" /></svg>
            BACK TO HOME
          </a>
          <a href={getPageUrl("artists")} onClick={(event) => navigate(event, "artists")} data-hoverable="true" className="group inline-flex min-h-12 items-center justify-center gap-1 font-mono text-xs tracking-[0.12em] text-white/80 transition-colors hover:text-trillex-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-trillex-orange">
            EXPLORE ARTISTS
            <img src="/arrow.png" alt="" aria-hidden="true" className="h-6 w-6 object-contain invert opacity-80" />
          </a>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 border-t border-white/10 pt-4 font-mono text-[9px] tracking-[0.16em] text-white/35 sm:text-[10px]">
        <span>TRILLEX MUSIC GROUP</span>
        <span>THE MUSIC CONTINUES.</span>
      </div>
    </section>
  );
};

export default NotFound;
