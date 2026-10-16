import React, { useEffect, useState, useRef, Suspense, lazy } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmoothScroll from "./components/SmoothScroll";
import Cursor from "./components/Cursor";
import Navigation from "./components/Navigation";
import NotFound from "./components/pages/NotFound";
import { getPageFromLocation, getPageUrl } from "./utils/pageRouting";
import { pageLoaders } from "./utils/pageLoading";
import { requestLayoutRefresh } from "./utils/layoutRefresh";
// Mount a route on its first visit, then retain it to preserve local state.
const Home = lazy(pageLoaders.home);
const About = lazy(pageLoaders.about);
const Artists = lazy(pageLoaders.artists);
const Contact = lazy(pageLoaders.contact);

gsap.registerPlugin(ScrollTrigger);

const getPageFromHash = (): string => {
  if (typeof window === "undefined") return "home";
  return getPageFromLocation(window.location);
};

const PageContent: React.FC<{ isActive: boolean; children: React.ReactNode }> = ({ isActive, children }) => {
  // This effect commits only after the lazy page resolves its Suspense boundary.
  useEffect(() => {
    if (isActive) return requestLayoutRefresh();
  }, [isActive]);
  return <>{children}</>;
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState<string>(getPageFromHash);
  const [visitedPages, setVisitedPages] = useState(() => new Set([getPageFromHash()]));
  const [lastAboutPage, setLastAboutPage] = useState(activePage);
  const [scrollToSection, setScrollToSection] = useState<string | null>(null);
  const isAboutPage = ["about", "about2", "about3"].includes(activePage);
  const aboutPage = isAboutPage ? activePage : lastAboutPage;
  const aboutVariant = aboutPage === "about2" ? "waterline" : aboutPage === "about3" ? "original" : "submersion";
  const hasVisitedAbout = isAboutPage || ["about", "about2", "about3"].some((page) => visitedPages.has(page));

  useEffect(() => {
    setVisitedPages((previous) => previous.has(activePage) ? previous : new Set([...previous, activePage]));
    if (isAboutPage) setLastAboutPage(activePage);
  }, [activePage, isAboutPage]);

  // Track if it's the first load
  const isInitialLoad = useRef(true);

  const preloaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // Hash & Popstate Navigation Listener
  useEffect(() => {
    const handleHashChange = () => {
      const page = getPageFromHash();
      setActivePage(page);
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  // Global Navigation Listener
  useEffect(() => {
    const handleNav = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.page) {
        setActivePage(customEvent.detail.page);
        if (customEvent.detail.page === "contact") {
          if (!window.location.hash.includes("demo")) {
            window.history.pushState(null, "", getPageUrl("contact"));
          }
        } else {
          window.history.pushState(null, "", getPageUrl(customEvent.detail.page));
        }
      }
      if (customEvent.detail.section)
        setScrollToSection(customEvent.detail.section);
    };
    window.addEventListener("trillex-navigate", handleNav);
    return () => window.removeEventListener("trillex-navigate", handleNav);
  }, []);

  // Effect 1: Handle Page Change -> Scroll Top + Refresh layout + Preloader on Home
  useEffect(() => {
    // Trigger preloader when switching to Home (matching production behavior)
    if (activePage === "home") {
      setLoading(true);
    }

    // Always force instant scroll to top when changing pages
    if (typeof window !== "undefined" && (window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);

    // Resize Lenis & refresh ScrollTrigger after the newly-visible page paints
    return requestLayoutRefresh();
  }, [activePage]);

  // Effect 2: Handle Targeted Section Scrolling (Optimized)
  useEffect(() => {
    if (scrollToSection) {
      let rafId: number;
      let timeoutId: ReturnType<typeof setTimeout>;
      let attempts = 0;
      const maxAttempts = 120; // Approx 2 seconds at 60fps

      const checkElement = () => {
        const element = document.getElementById(scrollToSection);

        if (element) {
          // Element found!
          // Delay to ensure layout stability (WebGL context, fonts, etc)
          timeoutId = setTimeout(() => {
            const event = new CustomEvent("trillex-scroll-to", {
              detail: { targetId: scrollToSection },
            });
            window.dispatchEvent(event);
            setScrollToSection(null); // Reset target
          }, 600);
        } else {
          attempts++;
          if (attempts < maxAttempts) {
            rafId = requestAnimationFrame(checkElement);
          } else {
            // Stop trying if timed out
            setScrollToSection(null);
          }
        }
      };

      rafId = requestAnimationFrame(checkElement);

      return () => {
        cancelAnimationFrame(rafId);
        clearTimeout(timeoutId);
      };
    }
  }, [scrollToSection, activePage]);

  // Preloader Animation Logic
  useEffect(() => {
    if (!loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setLoading(false);
          isInitialLoad.current = false; // Subsequent loads will be faster
          if (typeof window !== "undefined") {
            (window as any).__trillexPreloaderDone = true;
            window.dispatchEvent(new CustomEvent("trillex-preloader-done"));
          }
          requestLayoutRefresh();
        },
      });
      const counter = { val: 0 };

      // Determine duration based on load type
      const counterDuration = isInitialLoad.current ? 2.2 : 0;
      const exitDuration = isInitialLoad.current ? 1.0 : 0.8;

      if (counterDuration > 0) {
        // Initial setup for logo
        if (logoRef.current) {
          gsap.set(logoRef.current, {
            filter: "drop-shadow(0 0 4px rgba(255, 127, 80, 0.2))",
          });
          logoRef.current.style.backgroundImage =
            "linear-gradient(to top, #FF7F50 0%, transparent 0%)";
        }

        // 1. Synchronized Counter & Liquid Logo Fill driven by a single unified tick
        tl.to(
          counter,
          {
            val: 100,
            duration: counterDuration,
            ease: "power2.inOut",
            onUpdate: () => {
              const val = Math.min(100, Math.max(0, counter.val));
              if (counterRef.current) {
                counterRef.current.textContent = Math.floor(val)
                  .toString()
                  .padStart(2, "0");
              }
              if (logoRef.current) {
                // Exact cap-height mapping for Space Grotesque Bold:
                // Glyphs sit between 11.2% (baseline) and 82.8% (cap-height) of the container
                const bottomOffset = 11.2;
                const topOffset = 82.8;
                const fillPct =
                  val <= 0
                    ? 0
                    : val >= 100
                      ? 100
                      : bottomOffset + (val / 100) * (topOffset - bottomOffset);

                const low = Math.max(0, fillPct - 0.2).toFixed(2);
                const high = Math.min(100, fillPct + 0.2).toFixed(2);
                logoRef.current.style.backgroundImage = `linear-gradient(to top, #FF7F50 ${low}%, transparent ${high}%)`;
              }
            },
          },
          0,
        );

        if (logoRef.current) {
          // Glow builds up smoothly as fill reaches 100%
          tl.to(
            logoRef.current,
            {
              filter: "drop-shadow(0 0 24px rgba(255, 127, 80, 0.7))",
              duration: counterDuration,
              ease: "power1.in",
            },
            0,
          );
        }

        // Brief 0.15s settle pause at 100
        tl.to({}, { duration: 0.15 });

        // 2. Smooth Content Fade & Float Up
        tl.to([logoRef.current, counterRef.current].filter(Boolean), {
          y: -24,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
        });

        // 3. Curtain Reveal sweeps away cleanly
        if (preloaderRef.current) {
          tl.to(
            preloaderRef.current,
            {
              yPercent: -100,
              duration: exitDuration,
              ease: "power4.inOut",
            },
            "<0.1",
          );
        }
      } else {
        if (logoRef.current) {
          logoRef.current.style.backgroundImage =
            "linear-gradient(to top, #FF7F50 100%, transparent 100%)";
          gsap.set(logoRef.current, {
            filter: "drop-shadow(0 0 24px rgba(255, 127, 80, 0.7))",
          });
        }
        if (counterRef.current) {
          counterRef.current.textContent = "100";
        }
        if (preloaderRef.current) {
          tl.to(preloaderRef.current, {
            yPercent: -100,
            duration: exitDuration,
            ease: "power4.inOut",
          });
        }
      }
    });

    return () => ctx.revert();
  }, [loading]);

  return (
    <>
      {/* Preloader Overlay */}
      {loading && (
        <div
          ref={preloaderRef}
          className="fixed inset-0 z-[10000] bg-trillex-black flex items-center justify-center overflow-hidden"
        >
          <div className="text-center relative flex flex-col items-center justify-center w-full">
            <div
              ref={logoRef}
              className="font-display font-bold text-[15vw] md:text-[12vw] leading-none tracking-tighter mb-6 select-none will-change-transform"
              style={{
                WebkitTextStroke: "1px #FF7F50",
                color: "transparent",
                backgroundImage:
                  "linear-gradient(to top, #FF7F50 0%, transparent 0%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                paddingLeft: "0.12em",
                paddingRight: "0.12em",
                willChange: "filter, transform",
              }}
            >
              TRILLEX
            </div>

            <div
              ref={counterRef}
              className="text-trillex-orange font-mono text-xl md:text-2xl font-bold tracking-widest will-change-transform"
            >
              00
            </div>
          </div>
        </div>
      )}

      {/* 
        Cursor moved OUTSIDE of SmoothScroll 
        This prevents Lenis transforms from breaking 'fixed' positioning 
      */}
      <Cursor />

      {/* Visited pages stay mounted; unopened routes do not download or render. */}
      <SmoothScroll>
        <Navigation activePage={activePage} onNavigate={setActivePage} />

        <main className="relative w-full bg-trillex-black min-h-screen">
          {activePage === "not-found" && <NotFound />}
          {(activePage === "home" || visitedPages.has("home")) && (
            <div style={{ display: activePage === "home" ? "block" : "none" }}>
              <Suspense fallback={null}>
                <PageContent isActive={activePage === "home"}>
                  <Home isActive={activePage === "home"} />
                </PageContent>
              </Suspense>
            </div>
          )}
          {/* One About version at a time keeps SVG IDs and pinned timelines isolated. */}
          {hasVisitedAbout && (
            <div style={{ display: isAboutPage ? "block" : "none" }}>
              <Suspense fallback={null}>
                <PageContent isActive={isAboutPage}>
                  <About key={aboutVariant} variant={aboutVariant} isActive={isAboutPage} />
                </PageContent>
              </Suspense>
            </div>
          )}
          {/* Artists */}
          {(activePage === "artists" || visitedPages.has("artists")) && (
            <div
              style={{ display: activePage === "artists" ? "block" : "none" }}
            >
              <Suspense fallback={null}>
                <PageContent isActive={activePage === "artists"}>
                  <Artists isActive={activePage === "artists"} />
                </PageContent>
              </Suspense>
            </div>
          )}
          {/* Contact */}
          {(activePage === "contact" || visitedPages.has("contact")) && (
            <div
              style={{ display: activePage === "contact" ? "block" : "none" }}
            >
              <Suspense fallback={null}>
                <PageContent isActive={activePage === "contact"}>
                  <Contact isActive={activePage === "contact"} />
                </PageContent>
              </Suspense>
            </div>
          )}
        </main>
      </SmoothScroll>
    </>
  );
};

export default App;
