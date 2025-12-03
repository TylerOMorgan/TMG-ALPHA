
import React from 'react';

const JoinUs: React.FC = () => {
  return (
    <section 
        className="relative bg-trillex-black pt-16 md:pt-32 pb-20 overflow-hidden flex flex-col perspective-1000"
    >
      <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-10">
        
        <div className="flex items-center gap-4 mb-8">
            <div className="w-2 h-2 rounded-full bg-trillex-orange animate-pulse"></div>
            <span className="text-trillex-orange text-xs font-bold tracking-widest uppercase">CONTACT / SUBMISSIONS</span>
            <div className="w-2 h-2 rounded-full bg-trillex-orange animate-pulse"></div>
        </div>

      </div>
    </section>
  );
};

export default JoinUs;
