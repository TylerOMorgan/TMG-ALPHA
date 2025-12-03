
import React from 'react';
import { Instagram, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Dispatch custom event to navigate to Contact page and scroll to email ticker
    const event = new CustomEvent('trillex-navigate', { 
        detail: { page: 'contact', section: 'email-ticker' } 
    });
    window.dispatchEvent(event);
  };

  return (
    <footer id="footer" className="w-full bg-trillex-black py-4 lg:py-6 border-t border-white/10 z-50 relative flex flex-col lg:flex-row gap-4 lg:gap-6 justify-center items-center px-6 text-[10px] md:text-xs lg:text-sm text-white/40 font-mono">
        <span className="order-2 lg:order-1 whitespace-nowrap lg:absolute lg:left-6">© 2025 TRILLEX MUSIC GROUP</span>
        
        <div className="flex flex-wrap justify-center items-center gap-x-4 lg:gap-x-6 gap-y-2 order-1 lg:order-2 tracking-widest">
            <span className="text-white hover:text-trillex-orange transition-colors cursor-default whitespace-nowrap">
                BKK FOUNDED
            </span>
            
            <span className="text-white/20 select-none">/</span>
            
            <a 
                href="https://www.instagram.com/trillexmusicgroup/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 lg:gap-2 text-white hover:text-trillex-orange transition-colors group whitespace-nowrap" 
                data-hoverable="true"
            >
                <Instagram className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-[18px] lg:h-[18px] group-hover:scale-110 transition-transform"/>
                INSTAGRAM
            </a>

            <span className="text-white/20 select-none">/</span>
            
            <a 
                href="#email-ticker" 
                onClick={handleEmailClick}
                className="flex items-center gap-1.5 lg:gap-2 text-white hover:text-trillex-orange transition-colors group whitespace-nowrap" 
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
