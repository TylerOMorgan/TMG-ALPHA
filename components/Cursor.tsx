
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Cursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
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
        // Explicitly set centering using xPercent/yPercent (Replaces Tailwind -translate-x-1/2)
        gsap.set([cursorRef.current, followerRef.current], { 
            xPercent: -50, 
            yPercent: -50, 
            scale: 1,
            opacity: 0 
        });

        // --- PERFORMANCE OPTIMIZATION ---
        // Follower moves with extremely tight lag (0.06s) to ensure dot stays INSIDE the ring
        const xToFollower = gsap.quickTo(followerRef.current, "x", { duration: 0.06, ease: "power2.out" });
        const yToFollower = gsap.quickTo(followerRef.current, "y", { duration: 0.06, ease: "power2.out" });

        let isVisible = false;

        // --- MOVEMENT HANDLER ---
        const onMouseMove = (e: MouseEvent) => {
            // Fade in on first movement
            if (!isVisible) {
                gsap.to([cursorRef.current, followerRef.current], { opacity: 1, duration: 0.4 });
                isVisible = true;
            }

            // 1. Move Dot INSTANTLY (No lag, locked to mouse)
            gsap.set(cursorRef.current, { x: e.clientX, y: e.clientY });

            // 2. Move Follower (Tiny lag for smoothness, but stays close)
            xToFollower(e.clientX);
            yToFollower(e.clientY);
        };

        // --- HOVER HANDLER ---
        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            
            // OPTIMIZATION: Use a single selector string instead of multiple calls
            const isInteractive = target.closest('a, button, input, textarea, select, [data-hoverable="true"]');

            if (isInteractive) {
                // --- HOVER STATE ---
                // 1. Center Dot: Shrinks to invisible (To not block the text)
                gsap.to(cursorRef.current, { 
                    scale: 0, 
                    duration: 0.3,
                    ease: "power2.out"
                });

                // 2. Follower: Expands and becomes an Inversion Bubble
                gsap.to(followerRef.current, { 
                    scale: 1.25, // Reduced size by ~30% (was 1.8)
                    backgroundColor: '#EAEAEA', // White 
                    borderColor: 'transparent', 
                    mixBlendMode: 'difference',
                    duration: 0.3,
                    ease: "power2.out"
                });
            } else {
                // --- NORMAL STATE ---
                // 1. Center Dot: Visible
                gsap.to(cursorRef.current, { 
                    scale: 1, 
                    duration: 0.3,
                    ease: "power2.out"
                });

                // 2. Follower: Reset to Orange Outline Ring
                gsap.to(followerRef.current, { 
                    scale: 1, 
                    backgroundColor: 'transparent',
                    borderColor: '#FF7F50', // Trillex Orange
                    mixBlendMode: 'normal', // Reset blend mode
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        };

        // --- CLICK HANDLER ---
        const onMouseDown = () => {
            gsap.to(followerRef.current, { scale: 0.8, duration: 0.1 });
        };

        const onMouseUp = () => {
             // Scale restores automatically via mouseover logic
        };
        
        // --- VISIBILITY HANDLERS ---
        const onMouseLeave = () => {
            gsap.to([cursorRef.current, followerRef.current], { opacity: 0, duration: 0.3 });
            isVisible = false;
        };
        
        const onMouseEnter = () => {
            gsap.to([cursorRef.current, followerRef.current], { opacity: 1, duration: 0.3 });
            isVisible = true;
        };

        // Attach Listeners
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
    }); // End Context

    return () => ctx.revert();
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      {/* 
        FOLLOWER (The Ring) 
        - Z-Index 10000 
        - Added 'will-change-transform' to promote to GPU layer for smoother movement
      */}
      <div 
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-trillex-orange pointer-events-none z-[10000] will-change-transform"
      />

      {/* 
        CURSOR (The Dot)
        - Z-Index 10001 (Topmost)
        - Added 'will-change-transform' to promote to GPU layer
      */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[10001] will-change-transform"
      />
    </>
  );
};

export default Cursor;
