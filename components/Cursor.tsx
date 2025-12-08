import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Cursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const particleContainerRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch devices to disable custom cursor
    const checkTouch = () => {
      if (typeof window !== 'undefined') {
        setIsTouch(window.matchMedia("(pointer: coarse)").matches);
      }
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  useEffect(() => {
    if (isTouch) return;
    if (!cursorRef.current || !followerRef.current) return;

    const ctx = gsap.context(() => {
        // --- INITIAL SETUP ---
        gsap.set([cursorRef.current, followerRef.current], { 
            xPercent: -50, 
            yPercent: -50, 
            scale: 1,
            opacity: 0 
        });

        // --- PERFORMANCE OPTIMIZATION (FAST) ---
        // Reverted to 0.06s for snappy, fast response
        const xToFollower = gsap.quickTo(followerRef.current, "x", { duration: 0.03, ease: "power2.out" });
        const yToFollower = gsap.quickTo(followerRef.current, "y", { duration: 0.03, ease: "power2.out" });

        let isVisible = false;
        let mouseX = 0;
        let mouseY = 0;

        // --- MOVEMENT HANDLER ---
        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!isVisible) {
                gsap.to([cursorRef.current, followerRef.current], { opacity: 1, duration: 0.3 });
                isVisible = true;
            }

            gsap.set(cursorRef.current, { x: e.clientX, y: e.clientY });
            xToFollower(e.clientX);
            yToFollower(e.clientY);
        };

        // --- HOVER HANDLER ---
        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive = target.closest('a, button, input, textarea, select, [data-hoverable="true"]');

            if (isInteractive) {
                gsap.to(cursorRef.current, { 
                    scale: 0, 
                    duration: 0.2, // Fast transition
                    ease: "power2.out"
                });

                gsap.to(followerRef.current, { 
                    scale: 1.25,
                    backgroundColor: '#FFFFFF', 
                    borderColor: 'transparent', 
                    mixBlendMode: 'difference',
                    duration: 0.2,
                    ease: "power2.out"
                });
            } else {
                gsap.to(cursorRef.current, { 
                    scale: 1, 
                    duration: 0.2,
                    ease: "power2.out"
                });

                gsap.to(followerRef.current, { 
                    scale: 1, 
                    backgroundColor: 'transparent',
                    borderColor: '#FF3300', // Bright Neon Orange
                    mixBlendMode: 'normal', 
                    duration: 0.2,
                    ease: "power2.out"
                });
            }
        };

        // --- PARTICLE SPAWNER (Fast, Bright, Visible) ---
        const spawnNotes = (x: number, y: number) => {
            if (!particleContainerRef.current) return;

            const symbols = ['♪', '♫', '♩', '♬', '♭', '♮', '♯'];
            
            // 1. HIGH VISIBILITY COLORS
            // #FF3300: Intense Neon Orange
            // #FFFFFF: White
            // #000000: Black
            const colors = ['#FF3300', '#000000', '#FFFFFF']; 
            
            // 2. PARTICLE COUNT (High density)
            const count = Math.floor(Math.random() * 6) + 9; // 9 to 14 notes

            for (let i = 0; i < count; i++) {
                const el = document.createElement('div');
                const symbol = symbols[Math.floor(Math.random() * symbols.length)];
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                el.innerText = symbol;
                
                el.style.position = 'fixed';
                el.style.left = '0';
                el.style.top = '0';
                el.style.fontSize = `${Math.random() * 8 + 16}px`; // Larger: 16px to 24px
                el.style.color = color;
                el.style.pointerEvents = 'none';
                el.style.zIndex = '10002'; 
                el.style.fontWeight = '900'; // Extra Bold for visibility
                el.style.userSelect = 'none';
                el.style.willChange = 'transform, opacity';
                
                // 3. GLOW / SHADOW for visibility on ANY background
                if (color === '#FFFFFF') {
                    // Strong dark drop shadow for white notes
                    el.style.textShadow = '1px 1px 2px rgba(0,0,0,0.8)'; 
                } else if (color === '#000000') {
                    // White outline for black notes
                    el.style.textShadow = '0px 0px 2px rgba(255,255,255,0.8)';
                } else {
                    // White glow for colored notes
                    el.style.textShadow = '0px 0px 4px rgba(255,255,255,0.7)';
                }
                
                particleContainerRef.current.appendChild(el);

                gsap.set(el, {
                    x: x,
                    y: y,
                    opacity: 1, // Full opacity start
                    scale: 0.5,
                    rotation: Math.random() * 360
                });

                // 4. FAST EXPLOSION PHYSICS
                const angle = Math.random() * Math.PI * 2;
                // Higher velocity (80-150px) for speed
                const velocity = 35 + Math.random() * 60; 
                
                const destX = x + Math.cos(angle) * velocity;
                const destY = y + Math.sin(angle) * velocity;

                gsap.to(el, {
                    x: destX,
                    y: destY, 
                    rotation: (Math.random() - 0.5) * 720, // Fast spin
                    scale: Math.random() * 0.5 + 0.5, // Random scale
                    opacity: 0,
                    duration: 0.8 + Math.random() * 0.8, // Fast! (0.4s to 0.8s)
                    ease: "power2.out", // Explosive ease
                    onComplete: () => {
                        if (el.parentNode) {
                            el.parentNode.removeChild(el);
                        }
                    }
                });
            }
        };

        // --- CLICK HANDLER ---
        const onMouseDown = () => {
            gsap.to(followerRef.current, { scale: 0.8, duration: 0.1, ease: "power2.out" }); // Snappy click
            spawnNotes(mouseX, mouseY);
        };

        const onMouseUp = () => {
             gsap.to(followerRef.current, { scale: 1, duration: 0.2, ease: "elastic.out(1, 0.3)", overwrite: 'auto' }); // Bouncy return
        };
        
        // --- VISIBILITY HANDLERS ---
        const onMouseLeave = () => {
            gsap.to([cursorRef.current, followerRef.current], { opacity: 0, duration: 0.2 });
            isVisible = false;
        };
        
        const onMouseEnter = () => {
            gsap.to([cursorRef.current, followerRef.current], { opacity: 1, duration: 0.2 });
            isVisible = true;
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseover', onMouseOver);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mouseleave', onMouseLeave);
        document.addEventListener('mouseenter', onMouseEnter);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseover', onMouseOver);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mouseleave', onMouseLeave);
            document.removeEventListener('mouseenter', onMouseEnter);
        };
    }); 

    return () => ctx.revert();
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      <div ref={particleContainerRef} className="pointer-events-none fixed inset-0 overflow-visible z-[10002]" />
      <div 
        ref={followerRef}
        // Bright Orange Border
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#FF3300] pointer-events-none z-[10000] will-change-transform"
      />
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[10001] will-change-transform"
      />
    </>
  );
};

export default Cursor;