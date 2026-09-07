
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Updated services based on user request priority
const services = [
  { title: "Viral Marketing", img: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop" },
  { title: "DSP Pitching", img: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=800&auto=format&fit=crop" },
  { title: "Storytelling", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop" },
  { title: "Creative Services", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop" }, // Updated image
  { title: "Radio Promotion", img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop" },
  { title: "Narrative Development", img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop" },
  { title: "Advertising", img: "https://images.unsplash.com/photo-1557787163-1635e2efb160?q=80&w=800&auto=format&fit=crop" },
];

// Explicit Column Layouts
// Column 1 (Left)
const column1Items = [
  services[5],
  services[0], 
  services[1], 
  services[3], 
  services[4], 
  services[6], 
  services[2], 
  services[5],
  services[0],
  services[1]
];

// Column 2 (Inner Left)
const column2Items = [
  services[2], services[6], services[1], services[5], services[0], 
  services[4], services[3], services[2], services[6], services[1], services[5]
];

// Column 3 (Inner Right)
const column3Items = [
  services[4], services[3], services[0], services[6], services[2], 
  services[5], services[1], services[4], services[3], services[0]
];

// Column 4 (Right)
const column4Items = [
  services[6],
  services[2], 
  services[3], 
  services[4], 
  services[0], 
  services[1], 
  services[5], 
  services[6],
  services[2],
  services[3],
  services[4]
];

const Services: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);
  const col4Ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !gridRef.current) return;

    // Use MatchMedia for responsive animations that survive resizing/rotation
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      
      // 1. The Geometry: Responsive Tilt
      mm.add({
        isMobile: "(max-width: 767px)",
        isDesktop: "(min-width: 768px)",
      }, (context) => {
        const { isMobile } = context.conditions as { isMobile: boolean };
        
        gsap.set(gridRef.current, {
            rotationX: 20,
            rotationZ: isMobile ? -5 : -10, // Less rotation on mobile to save horizontal space
            scale: isMobile ? 1.05 : 1.1, 
        });
      });

      // 2. The Scroll Animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        }
      });

      // Move columns in ALTERNATING directions
      tl.to(col1Ref.current, { yPercent: -25, ease: "none" }, 0);
      tl.to(col2Ref.current, { yPercent: 25, ease: "none" }, 0);
      tl.to(col3Ref.current, { yPercent: -40, ease: "none" }, 0);
      tl.to(col4Ref.current, { yPercent: 15, ease: "none" }, 0);

      // 3. Foreground Text Parallax (balanced from +15% to -15% so text is centered at viewport center)
      gsap.fromTo(textRef.current, 
        { yPercent: 15 },
        {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );

    }, containerRef);

    return () => {
        ctx.revert();
        mm.revert();
    };
  }, []);

  return (
    <section 
      ref={containerRef} 
      // Increased height on mobile (130vh) to allow for smoother scrolling interaction of the tall columns
      className="relative w-full h-[130vh] md:h-[110vh] supports-[height:130dvh]:h-[130dvh] bg-trillex-black overflow-hidden perspective-[1000px] z-0"
      style={{ minHeight: '110vh', height: '110vh', backgroundColor: '#050505' }}
    >
      {/* 3D Skewed Grid Plane */}
      <div 
        ref={gridRef} 
        className="absolute inset-[-10%] md:inset-[-20%] w-[120%] md:w-[140%] h-[120%] md:h-[140%] flex justify-center gap-2 md:gap-6 will-change-transform opacity-60 pointer-events-none"
        style={{ transformStyle: 'preserve-3d', position: 'absolute', top: '-15%', left: '-15%', right: '-15%', bottom: '-15%' }}
      >
        {/* Column 1 - 45% on mobile, 40% on Tablet (perfect fit), 25% on Desktop */}
        <div ref={col1Ref} className="flex flex-col gap-4 md:gap-8 w-[45%] md:w-[40%] lg:w-1/4 pt-10 will-change-transform">
          {column1Items.map((s, i) => (
             <ServiceCard key={`c1-${i}`} item={s} />
          ))}
        </div>

        {/* Column 2 - Hidden on Mobile/Tablet. Visible on Desktop. */}
        <div ref={col2Ref} className="hidden lg:flex flex-col gap-6 md:gap-8 lg:w-1/4 -mt-32 will-change-transform">
          {column2Items.map((s, i) => (
             <ServiceCard key={`c2-${i}`} item={s} />
          ))}
        </div>

        {/* Column 3 - Hidden on Mobile/Tablet. Visible on Desktop. */}
        <div ref={col3Ref} className="hidden lg:flex flex-col gap-6 md:gap-8 lg:w-1/4 pt-32 will-change-transform">
          {column3Items.map((s, i) => (
             <ServiceCard key={`c3-${i}`} item={s} />
          ))}
        </div>

        {/* Column 4 - 45% on mobile, 40% on Tablet (perfect fit), 25% on Desktop */}
        <div ref={col4Ref} className="flex flex-col gap-4 md:gap-8 w-[45%] md:w-[40%] lg:w-1/4 -mt-12 will-change-transform">
          {column4Items.map((s, i) => (
             <ServiceCard key={`c4-${i}`} item={s} />
          ))}
        </div>
      </div>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-radial-gradient-fade pointer-events-none z-10" />

      {/* Foreground Text Layer */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-6">
        <div ref={textRef} className="text-center mix-blend-difference">
          <h2 className="text-trillex-orange text-xs md:text-sm lg:text-base font-mono tracking-[0.3em] md:tracking-[0.5em] mb-4 font-bold uppercase">
            What We Do
          </h2>
          {/* Responsive Text Sizing - Adjusted mobile to 10vw for better fit */}
          <h3 className="text-[10vw] md:text-[5vw] xl:text-[80px] leading-[1.1] font-display font-bold text-white tracking-tighter drop-shadow-2xl">
            Services We Provide
          </h3>
          <p className="mt-6 md:mt-8 text-white/80 max-w-xl mx-auto font-sans font-light tracking-wide text-sm md:text-lg">
             Go global effortlessly. Focus on creating; we handle the logistics.
          </p>
        </div>
      </div>
    </section>
  );
};

// Memoized Card Component
// Added pointer-events-auto to enable hover interactions on the card
const ServiceCard = React.memo(({ item }: { item: { title: string, img: string } }) => (
  <div 
    className="relative w-full aspect-[3/4] rounded-xl md:rounded-2xl overflow-hidden bg-white/5 shadow-2xl group border border-white/5 transition-all duration-500 ease-out hover:scale-105 hover:border-trillex-orange hover:shadow-[0_0_40px_rgba(255,127,80,0.6)] hover:z-50 pointer-events-auto"
    data-hoverable="true"
    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
  >
    <img 
      src={item.img} 
      alt={item.title} 
      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0"
      loading="lazy"
      decoding="async"
    />
    <div className="absolute inset-0 flex items-center justify-center p-2 md:p-4 z-10">
      <span className="text-white font-display font-bold text-2xl md:text-3xl lg:text-5xl uppercase tracking-tighter text-center opacity-70 md:opacity-50 group-hover:opacity-100 transition-all duration-300 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] scale-95 group-hover:scale-100 leading-none">
        {item.title}
      </span>
    </div>
  </div>
));

export default React.memo(Services);
