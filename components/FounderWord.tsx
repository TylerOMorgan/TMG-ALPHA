
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Linkedin } from 'lucide-react';
import Logo from './Logo';

gsap.registerPlugin(ScrollTrigger);

const FounderWord: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLHeadingElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Background Parallax Text
      gsap.to(bgTextRef.current, {
        yPercent: 50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        }
      });

      // 2. Quote Text Reveal (Lighting Effect)
      gsap.fromTo(quoteRef.current,
        { backgroundPosition: "100% 0%" }, 
        {
          backgroundPosition: "0% 0%", 
          ease: "none",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 85%",
            end: "bottom 65%",
            scrub: 0.5,
          }
        }
      );

      // 3. Animate Vertical Border growing (Entrance on Wrapper)
      gsap.fromTo(borderRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top",
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 3a. Shrink Line on Scroll (Animation on Inner Line)
      // Shrinks by 20% from top and 20% from bottom (leaving 60%)
      if (lineRef.current) {
        gsap.to(lineRef.current, {
          scaleY: 0.6,
          transformOrigin: "center", // Shrink from center to effect both top and bottom
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center", 
            end: "bottom bottom",
            scrub: true
          }
        });

        // 3b. Subtle Pulse/Shimmer for the Border
        // Applies to inner line to glow correctly
        gsap.to(lineRef.current, {
            boxShadow: "0 0 12px 2px rgba(255, 127, 80, 0.4)",
            repeat: -1,
            yoyo: true,
            duration: 2,
            ease: "sine.inOut"
        });
      }

      // 4. Stagger Info Reveal
      if (contentRef.current) {
        gsap.fromTo(Array.from(contentRef.current.children),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
            }
          }
        );
      }

      // 5. Logo Entrance
      gsap.fromTo(logoRef.current, 
        { scale: 0.8, opacity: 0, rotate: -15 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 1.5,
          ease: "elastic.out(1, 0.8)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
          }
        }
      );

    }, sectionRef);

    return () => {
        ctx.revert();
    };
  }, []);

  // Mouse Move - 3D Tilt Effect on Logo
  // OPTIMIZATION: Removed scroll listener entirely. 
  // Calculating rect directly here is cheaper than running a listener on every scroll pixel.
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!logoRef.current || !sectionRef.current) return;
    
    // Get fresh coordinates relative to viewport
    const rect = sectionRef.current.getBoundingClientRect();

    const { clientX, clientY } = e;
    
    // Calculate mouse position relative to center of section (-1 to 1)
    const x = ((clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((clientY - rect.top) / rect.height - 0.5) * 2;

    gsap.to(logoRef.current, {
        rotationY: x * 15, 
        rotationX: -y * 15,
        x: x * 20, 
        y: y * 20,
        transformPerspective: 1000,
        duration: 1,
        ease: "power2.out",
        overwrite: "auto"
    });
  };

  const handleMouseLeave = () => {
      if (!logoRef.current) return;
      gsap.to(logoRef.current, {
          rotationY: 0,
          rotationX: 0,
          x: 0,
          y: 0,
          duration: 1,
          ease: "elastic.out(1, 0.9)",
          overwrite: "auto"
      });
  };

  return (
    <section 
        ref={sectionRef} 
        className="relative w-full pt-24 md:pt-40 pb-20 bg-trillex-black text-white overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
    >
      {/* Background Parallax Text */}
      <h2 
        ref={bgTextRef} 
        className="absolute top-[-10%] right-0 text-[25vw] font-display font-bold text-white/[0.03] pointer-events-none select-none leading-none z-0 whitespace-nowrap will-change-transform"
      >
          VISION
      </h2>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-12 md:mb-16 opacity-0 animate-in fade-in fill-mode-forwards duration-1000 delay-300" style={{ animationFillMode: 'forwards' }}>
             <div className="w-4 h-4 rounded-full border-2 border-trillex-orange box-content p-0.5">
                <div className="w-full h-full bg-trillex-orange rounded-full animate-pulse" />
             </div>
             <h2 className="text-xl md:text-3xl font-display font-bold tracking-widest uppercase">
                 WORD FROM OUR FOUNDER
             </h2>
        </div>

        {/* Changed layout breakpoint to xl to accommodate tablets better (avoids text squishing) */}
        <div className="flex flex-col xl:flex-row justify-between items-center gap-12 lg:gap-20">
            
            {/* Left Content */}
            <div className="relative pl-8 md:pl-16 max-w-3xl">
                {/* Orange Vertical Line Wrapper */}
                <div 
                    ref={borderRef} 
                    className="absolute left-0 top-0 bottom-0 w-1 md:w-1.5 origin-top"
                >
                    {/* Actual Orange Line with Shrink Animation */}
                    <div 
                        ref={lineRef}
                        className="w-full h-full bg-trillex-orange rounded-full origin-center will-change-transform"
                    />
                </div>

                <div ref={contentRef} className="flex flex-col gap-6 md:gap-8">
                    {/* Gradient Text Quote */}
                    <p 
                        ref={quoteRef}
                        className="text-xl md:text-3xl lg:text-4xl leading-relaxed font-light italic text-transparent bg-clip-text pb-3 md:pb-4 pr-2"
                        style={{ 
                            backgroundImage: 'linear-gradient(90deg, #EAEAEA 0%, #EAEAEA 50%, #333333 100%)',
                            backgroundSize: '200% 100%',
                        }}
                    >
                        "At Trillex Music Group, we build everything on transparency and clear communication. Artists work with a full view of the process, from scouting to release. With an artist-first mindset and a structured daily workflow, we support each project with speed, clarity, and consistency. Our goal is simple: a label that earns trust through action and helps artists grow with confidence."
                    </p>
                    
                    <div className="w-16 h-1 bg-trillex-orange/50" />

                    <div className="flex flex-col gap-1">
                        <h3 className="text-2xl md:text-3xl text-trillex-orange font-display font-bold">
                            Almog Levi
                        </h3>
                        <span className="text-gray-400 font-mono text-xs md:text-sm tracking-wider">
                            Founder & CEO of Trillex Music Group
                        </span>
                        
                        <div className="flex items-center gap-4 mt-4">
                            <a 
                                href="https://www.linkedin.com/in/levitmg/" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/60 hover:text-trillex-orange transition-colors duration-300" 
                                data-hoverable="true" 
                                aria-label="LinkedIn"
                            >
                                <Linkedin size={24} />
                            </a>
                            <a 
                                href="https://www.instagram.com/almog_levi753/" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/60 hover:text-trillex-orange transition-colors duration-300" 
                                data-hoverable="true" 
                                aria-label="Instagram"
                            >
                                <Instagram size={24} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Graphic - Replaced with Logo. Adjusted sizing for tablet/desktop */}
            <div className="relative w-40 h-40 md:w-80 md:h-80 xl:w-96 xl:h-96 flex-shrink-0 perspective-1000 mt-8 xl:mt-0">
                <div ref={logoRef} className="w-full h-full will-change-transform">
                    <Logo className="w-full h-full text-white fill-current drop-shadow-2xl opacity-90" />
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default FounderWord;
