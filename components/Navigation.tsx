
import React from 'react';
import Logo from './Logo';

interface NavigationProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activePage, onNavigate }) => {

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, page: string) => {
    e.preventDefault();
    onNavigate(page);
  };

  const navLinks = [
    { name: 'HOME', id: 'home' },
    { name: 'ABOUT', id: 'about' },
    { name: 'CONTACT', id: 'contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 pointer-events-none">
      {/* Gradient Shadow Background - Adjusted to 75% opacity as requested */}
      <div className="absolute top-0 left-0 w-full h-32 md:h-48 bg-gradient-to-b from-black via-black/75 to-transparent z-0 pointer-events-none" />

      {/* Navigation Content */}
      <div className="relative w-full px-4 md:px-12 py-4 md:py-8 flex justify-between items-center mix-blend-difference z-10">
        {/* Logo - Left */}
        <a 
          href="#"
          onClick={(e) => handleClick(e, 'home')}
          className="pointer-events-auto text-white hover:text-trillex-orange transition-colors duration-300"
          data-hoverable="true"
          aria-label="Go to Home"
        >
          {/* Responsive height: Smaller on mobile */}
          <Logo className="h-[32px] md:h-[55px] w-auto fill-current" />
        </a>
        
        {/* Nav Links - Right */}
        {/* Adjusted gap for small mobile screens (gap-2 -> sm:gap-6) and added whitespace-nowrap for safety */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-6 md:gap-12 whitespace-nowrap">
          {navLinks.map((item) => {
            const isActive = activePage === item.id;
            return (
              <a 
                key={item.name} 
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`
                  relative group text-[10px] md:text-[13px] font-mono tracking-[0.15em] md:tracking-[0.2em] uppercase transition-all duration-300 ease-out py-2
                  ${isActive 
                    ? 'text-white font-bold scale-105 md:scale-110 [text-shadow:0_0_12px_rgba(255,255,255,0.6)]' 
                    : 'text-white font-semibold hover:text-white hover:font-bold hover:scale-105 md:hover:scale-110 hover:[text-shadow:0_0_12px_rgba(255,255,255,0.6)]'
                  }
                `}
                data-hoverable="true"
              >
                {item.name}
                <span className={`absolute bottom-0 md:-bottom-2 left-0 h-[1px] bg-white transition-all duration-300 ease-out ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
