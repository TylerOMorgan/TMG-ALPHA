
import React, { useState, useMemo, useCallback } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';

const EmailTicker: React.FC = () => {
  // Define content for each row
  const infoEmail = "info@trillexmusicgroup.com";
  const legalEmail = "legal@trillexmusicgroup.com";

  // OPTIMIZATION: Memoize repetitive arrays to prevent reallocation on every render frame
  const infoItems = useMemo(() => Array(6).fill(infoEmail), [infoEmail]);
  const legalItems = useMemo(() => Array(6).fill(legalEmail), [legalEmail]);

  const [toastVisible, setToastVisible] = useState(false);

  // OPTIMIZATION: Stable callback reference
  const handleCopy = useCallback((email: string) => {
    navigator.clipboard.writeText(email);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  }, []);

  return (
    <section id="email-ticker" className="w-full bg-[#050505] py-0 overflow-hidden select-none relative z-10 flex flex-col">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          animation: marquee 67s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 67s linear infinite;
        }
      `}</style>
      
      {/* Row 1: Info Email - Right to Left */}
      <div className="group relative flex w-full overflow-hidden items-center bg-[#050505] hover:bg-white/5 transition-colors duration-500">
        <div className="flex w-fit whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] will-change-transform py-4">
          {/* First Set */}
          <div className="flex items-center">
            {infoItems.map((email, i) => (
              <div key={`info-1-${i}`} className="flex items-center">
                <button 
                  onClick={() => handleCopy(email)}
                  className="text-[12vw] md:text-[5vw] leading-none font-display font-bold text-white/50 hover:text-trillex-orange hover:[text-shadow:0_0_2px_#FF7F50,0_0_10px_#FF7F50] transition-all duration-300 px-4 md:px-8 lowercase tracking-tight cursor-pointer"
                  data-hoverable="true"
                  aria-label={`Copy email ${email}`}
                >
                  {email}
                </button>
                <ArrowUpRight className="w-[8vw] h-[8vw] md:w-[3vw] md:h-[3vw] text-white/20" strokeWidth={2} />
              </div>
            ))}
          </div>

          {/* Duplicate Set for Loop */}
          <div className="flex items-center">
            {infoItems.map((email, i) => (
              <div key={`info-2-${i}`} className="flex items-center">
                <button 
                  onClick={() => handleCopy(email)}
                  className="text-[12vw] md:text-[5vw] leading-none font-display font-bold text-white/50 hover:text-trillex-orange hover:[text-shadow:0_0_2px_#FF7F50,0_0_10px_#FF7F50] transition-all duration-300 px-4 md:px-8 lowercase tracking-tight cursor-pointer"
                  data-hoverable="true"
                  aria-label={`Copy email ${email}`}
                >
                  {email}
                </button>
                <ArrowUpRight className="w-[8vw] h-[8vw] md:w-[3vw] md:h-[3vw] text-white/20" strokeWidth={2} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Legal Email - Left to Right */}
      <div className="group relative flex w-full overflow-hidden items-center bg-[#050505] hover:bg-white/5 transition-colors duration-500">
        <div className="flex w-fit whitespace-nowrap animate-marquee-reverse group-hover:[animation-play-state:paused] will-change-transform py-4">
          {/* First Set (Starts at -50% visually, so this is the "right side" content) */}
          <div className="flex items-center">
            {legalItems.map((email, i) => (
              <div key={`legal-1-${i}`} className="flex items-center">
                <button 
                  onClick={() => handleCopy(email)}
                  className="text-[12vw] md:text-[5vw] leading-none font-display font-bold text-white/50 hover:text-trillex-orange hover:[text-shadow:0_0_2px_#FF7F50,0_0_10px_#FF7F50] transition-all duration-300 px-4 md:px-8 lowercase tracking-tight cursor-pointer"
                  data-hoverable="true"
                  aria-label={`Copy email ${email}`}
                >
                  {email}
                </button>
                <ArrowUpRight className="w-[8vw] h-[8vw] md:w-[3vw] md:h-[3vw] text-white/20" strokeWidth={2} />
              </div>
            ))}
          </div>

          {/* Duplicate Set for Loop */}
          <div className="flex items-center">
            {legalItems.map((email, i) => (
              <div key={`legal-2-${i}`} className="flex items-center">
                <button 
                  onClick={() => handleCopy(email)}
                  className="text-[12vw] md:text-[5vw] leading-none font-display font-bold text-white/50 hover:text-trillex-orange hover:[text-shadow:0_0_2px_#FF7F50,0_0_10px_#FF7F50] transition-all duration-300 px-4 md:px-8 lowercase tracking-tight cursor-pointer"
                  data-hoverable="true"
                  aria-label={`Copy email ${email}`}
                >
                  {email}
                </button>
                <ArrowUpRight className="w-[8vw] h-[8vw] md:w-[3vw] md:h-[3vw] text-white/20" strokeWidth={2} />
              </div>
            ))}
          </div>
        </div>
      </div>

       {/* Toast Notification */}
       <div className={`fixed top-32 left-1/2 -translate-x-1/2 z-[10000] pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
          <div className="bg-black border border-white/20 text-white px-6 py-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center gap-4">
             <div className="w-6 h-6 rounded-full bg-trillex-orange flex items-center justify-center text-black shadow-[0_0_10px_rgba(255,127,80,0.5)]">
                 <Check size={14} strokeWidth={3} />
             </div>
             <div className="flex flex-col">
                <span className="font-display font-bold text-sm tracking-wide uppercase leading-none">Email Copied</span>
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest leading-none mt-1">Ready to paste</span>
             </div>
          </div>
       </div>

    </section>
  );
};

export default EmailTicker;
