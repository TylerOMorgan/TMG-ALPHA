import React from 'react';
import { Instagram, Mail } from 'lucide-react';

// Custom Discord Icon
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 127.14 96.36" 
    fill="currentColor" 
    className={className}
    aria-label="Discord"
  >
    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.42,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22c2.36-24.44-2.54-47.56-18.9-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
  </svg>
);

const Footer: React.FC = () => {
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const event = new CustomEvent('trillex-navigate', { 
        detail: { page: 'contact', section: 'email-ticker' } 
    });
    window.dispatchEvent(event);
  };

  return (
    <footer id="footer" className="w-full bg-trillex-black py-4 lg:py-6 border-t border-white/10 z-50 relative flex flex-col lg:flex-row gap-4 lg:gap-6 justify-center items-center text-[10px] md:text-xs lg:text-sm text-white/40 font-mono">
        <style>{`
          /* Hide scrollbar for Chrome, Safari and Opera */
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          /* Hide scrollbar for IE, Edge and Firefox */
          .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}</style>

        {/* Copyright */}
        <span className="order-2 lg:order-1 whitespace-nowrap lg:absolute lg:left-6">
            © 2026 TRILLEX MUSIC GROUP
        </span>
        
        {/* Navigation Links */}
        <div className="flex flex-nowrap items-center gap-x-2.5 sm:gap-x-4 lg:gap-x-6 order-1 lg:order-2 tracking-widest overflow-x-auto w-full lg:w-auto justify-center px-3 sm:px-6 lg:px-0 no-scrollbar">
            {/* 1. Brand/Loc */}
            <span className="text-white hover:text-trillex-orange transition-colors cursor-default whitespace-nowrap flex-shrink-0">
                BKK FOUNDED
            </span>
            
            <span className="text-white/20 select-none flex-shrink-0">/</span>
            
            {/* 2. Instagram */}
            <a 
                href="https://www.instagram.com/trillexmusicgroup/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 lg:gap-2 text-white hover:text-trillex-orange transition-colors group whitespace-nowrap flex-shrink-0" 
                data-hoverable="true"
            >
                <Instagram className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-[18px] lg:h-[18px] group-hover:scale-110 transition-transform"/>
                INSTAGRAM
            </a>

            <span className="text-white/20 select-none flex-shrink-0">/</span>
            
            {/* 3. Discord */}
            <a 
                href="https://discord.gg/trillex"
                target='_blank'
                className="flex items-center gap-1.5 lg:gap-2 text-white hover:text-trillex-orange transition-colors group whitespace-nowrap flex-shrink-0" 
                data-hoverable="true"
            >
                <DiscordIcon className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-[18px] lg:h-[18px] group-hover:scale-110 transition-transform"/>
                DISCORD
            </a>

            <span className="text-white/20 select-none flex-shrink-0">/</span>
            
            {/* 4. Email */}
            <a 
                href="#email-ticker" 
                onClick={handleEmailClick}
                className="flex items-center gap-1.5 lg:gap-2 text-white hover:text-trillex-orange transition-colors group whitespace-nowrap flex-shrink-0" 
                data-hoverable="true"
            >
                <Mail className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-[18px] lg:h-[18px] group-hover:scale-110 transition-transform"/>
                EMAIL
            </a>
        </div>
    </footer>
  );
};

export default Footer;