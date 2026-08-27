import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Disc3, Instagram, ArrowUpRight, Music2, Sparkles, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface SubLabelCardProps {
  name: string;
  logo: string;
  tagline: string;
  description: string;
  instagramHandle: string;
  instagramUrl: string;
  genres: string[];
  accentColor: string;
  glowColor: string;
  vibeBadge: string;
  vibeIcon: React.ReactNode;
}

const SUB_LABELS: SubLabelCardProps[] = [
  {
    name: 'Trillex Avant',
    logo: './Avant.png',
    tagline: 'Emotive & Atmospheric Soundscapes',
    description:
      'Home to sophisticated underground electronic records, melodic textures, and deep sonic narratives designed for emotional depth and immersive listening.',
    instagramHandle: '@trillexavant',
    instagramUrl: 'https://www.instagram.com/trillexavant',
    genres: ['Melodic House', 'Progressive House', 'Deep House', 'Techno', 'Ambient'],
    accentColor: '#FF7F50',
    glowColor: 'rgba(255, 127, 80, 0.25)',
    vibeBadge: 'DEEP & MELODIC',
    vibeIcon: <Sparkles className="w-3.5 h-3.5 text-trillex-orange" />
  },
  {
    name: 'Trillex Bounce',
    logo: './Bounce.png',
    tagline: 'High-Energy Club & Festival Anthems',
    description:
      'Engineered for peak-time dancefloors, massive drops, and festival energy. Delivering punchy club records with cutting-edge production and relentless groove.',
    instagramHandle: '@trillexbounce',
    instagramUrl: 'https://www.instagram.com/trillexbounce',
    genres: ['Tech House', 'Bass House', 'EDM', 'Future Rave', 'Trap / Club'],
    accentColor: '#FF7F50',
    glowColor: 'rgba(255, 127, 80, 0.25)',
    vibeBadge: 'PEAK-TIME ENERGY',
    vibeIcon: <Zap className="w-3.5 h-3.5 text-trillex-orange" />
  }
];

const SubLabels: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.sublabel-card');
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleDemoNavigation = (subLabelName: string) => {
    const event = new CustomEvent('trillex-navigate', {
      detail: { page: 'contact', section: 'contact-form' }
    });
    window.location.hash = '#demo-submission';
    window.dispatchEvent(event);
  };

  return (
    <section
      id="sub-labels"
      ref={sectionRef}
      className="relative w-full bg-trillex-black py-16 md:py-24 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-trillex-orange/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-trillex-orange animate-pulse" />
            <span className="text-trillex-orange text-xs md:text-sm font-mono font-bold tracking-[0.25em] uppercase">
              IMPRINTS & DIVISIONS
            </span>
            <div className="w-2 h-2 rounded-full bg-trillex-orange animate-pulse" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tighter uppercase mb-5">
            Two Imprints. <span className="text-trillex-orange">Distinct Soundscapes.</span>
          </h2>

          <p className="max-w-2xl text-white/60 text-sm md:text-base font-sans leading-relaxed">
            Trillex Music Group operates two specialized sub-labels tailored to distinct electronic sonic directions, ensuring focused curation, targeted DSP pitching, and community alignment.
          </p>
        </div>

        {/* Sub-Label Cards Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {SUB_LABELS.map((subLabel) => (
            <div
              key={subLabel.name}
              className="sublabel-card group relative bg-[#0B0B0B] border border-white/10 hover:border-trillex-orange/40 rounded-3xl p-8 md:p-10 flex flex-col justify-between transition-all duration-500 hover:shadow-[0_15px_45px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* Subtle top gradient glow on hover */}
              <div 
                className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-[90px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ backgroundColor: subLabel.glowColor }}
              />

              <div>
                {/* Header: Badge & Instagram */}
                <div className="flex items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    {subLabel.vibeIcon}
                    <span className="text-[11px] font-mono font-bold tracking-widest text-white/80 uppercase">
                      {subLabel.vibeBadge}
                    </span>
                  </div>

                  <a
                    href={subLabel.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-mono text-white/50 hover:text-trillex-orange transition-colors group/link py-1 px-2.5 rounded-lg hover:bg-white/5"
                    data-hoverable="true"
                    aria-label={`Visit ${subLabel.name} Instagram`}
                  >
                    <Instagram size={14} className="group-hover/link:scale-110 transition-transform" />
                    <span>{subLabel.instagramHandle}</span>
                    <ArrowUpRight size={12} className="opacity-60 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
                  </a>
                </div>

                {/* Logo & Identity */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-black/60 border border-white/10 p-3 flex items-center justify-center shrink-0 group-hover:border-trillex-orange/50 transition-colors shadow-inner">
                    <img
                      src={subLabel.logo}
                      alt={`${subLabel.name} logo`}
                      className="w-full h-full object-contain filter drop-shadow-[0_2px_10px_rgba(255,127,80,0.3)] transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight uppercase mb-1">
                      {subLabel.name}
                    </h3>
                    <p className="text-sm font-mono text-trillex-orange font-medium tracking-wide">
                      {subLabel.tagline}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8">
                  {subLabel.description}
                </p>

                {/* Accepted Genres Box */}
                <div className="mb-10 bg-white/[0.03] border border-white/5 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3.5 text-xs font-mono font-bold tracking-wider text-white/50 uppercase">
                    <Music2 size={14} className="text-trillex-orange" />
                    <span>Accepted Genres</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {subLabel.genres.map((genre) => (
                      <span
                        key={genre}
                        className="text-xs md:text-sm font-medium px-3.5 py-1.5 rounded-full bg-white/5 text-white/90 border border-white/10 hover:border-trillex-orange/50 hover:bg-trillex-orange/10 hover:text-white transition-all duration-300 cursor-default select-none"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
                  Open for Submissions
                </span>

                <button
                  onClick={() => handleDemoNavigation(subLabel.name)}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-trillex-orange text-white hover:text-black font-mono font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-[0_0_20px_rgba(255,127,80,0)] hover:shadow-[0_0_25px_rgba(255,127,80,0.4)]"
                  data-hoverable="true"
                >
                  <Disc3 size={16} className="group-hover/btn:rotate-180 transition-transform duration-700" />
                  <span>Submit Demo</span>
                  <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SubLabels;
