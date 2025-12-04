import React, { useRef, useEffect, Suspense, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

// Define R3F elements to bypass TS errors
const Mesh = 'mesh' as any;
const PlaneGeometry = 'planeGeometry' as any;
const ShaderMaterial = 'shaderMaterial' as any;

// --- CONFIGURATION ---
const DESKTOP_TEXTURE_URL = '/HeroSectionV5.png'; // 16:9 Aspect Ratio
const MOBILE_TEXTURE_URL = '/HeroSectionPhone.png'; // 9:16 Aspect Ratio (Vertical)

// OPTIMIZATION: Preload BOTH textures immediately so they are in GPU memory
useTexture.preload(DESKTOP_TEXTURE_URL);
useTexture.preload(MOBILE_TEXTURE_URL);

// --- OPTIMIZED HOOK ---
// Uses matchMedia instead of 'resize' listener for better battery life/performance
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    
    // Set initial value
    setIsMobile(media.matches);

    // Only update state when we actually cross the breakpoint
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  return isMobile;
};

const SceneContent = () => {
  const { viewport, mouse } = useThree();
  const isMobile = useIsMobile();

  // Select texture based on device
  const textureUrl = isMobile ? MOBILE_TEXTURE_URL : DESKTOP_TEXTURE_URL;
  const texture = useTexture(textureUrl);
  
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseTarget = useRef(new THREE.Vector2(0, 0));

  const shaderArgs = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: null },
      uMouse: { value: new THREE.Vector2(0, 0) },
      // Pass intensity as a uniform to control effect strength per device
      uIntensity: { value: 1.0 } 
    },
    vertexShader: `
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uIntensity;

      void main() {
        vUv = uv;
        vec3 pos = position;
        
        float dist = distance(uv, uMouse);
        // Dampen the wave effect based on uIntensity (lower on mobile)
        pos.z += sin(dist * 10.0 - uTime) * 0.1 * uIntensity * (1.0 - dist);
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      uniform vec2 uMouse;
      uniform float uIntensity;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;
        
        float dist = distance(uv, uMouse);
        // Dampen the RGB shift on mobile
        float shift = 0.02 * uIntensity * (1.0 - dist);

        float r = texture2D(uTexture, uv + vec2(shift, 0.0)).r;
        float g = texture2D(uTexture, uv).g;
        float b = texture2D(uTexture, uv - vec2(shift, 0.0)).b;

        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      // 1. Mouse Interaction
      mouseTarget.current.set((mouse.x + 1) / 2, (mouse.y + 1) / 2);
      
      // OPTIMIZATION: Slower lerp on mobile for smoother feel, faster on desktop
      const lerpSpeed = isMobile ? 0.05 : 0.1;
      materialRef.current.uniforms.uMouse.value.lerp(mouseTarget.current, lerpSpeed);
      
      // 2. Adjust Intensity based on device
      // 0.3 on mobile (subtle), 1.0 on desktop (strong)
      const targetIntensity = isMobile ? 0.3 : 1.0;
      materialRef.current.uniforms.uIntensity.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uIntensity.value,
        targetIntensity,
        0.1
      );

      // 3. Time
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <Mesh scale={[viewport.width, viewport.height, 1]}>
      <PlaneGeometry args={[1, 1, 32, 32]} />
      <ShaderMaterial
        ref={materialRef}
        args={[shaderArgs]}
        uniforms-uTexture-value={texture}
        transparent
      />
    </Mesh>
  );
};

const Hero: React.FC = () => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.to(textRef.current, {
        yPercent: 50,
        ease: "none",
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    // "supports-[height:100dvh]" handles mobile browser address bars perfectly
    <div id="home" className="relative w-full h-[100vh] supports-[height:100dvh]:h-[100dvh] min-h-[500px] md:min-h-[600px] overflow-hidden bg-trillex-black">
      
      <div className="absolute inset-0 z-0 opacity-60">
        <Canvas 
            dpr={[1, 2]} // Limits quality to 2x (retina) even on 3x screens to save battery
            camera={{ position: [0, 0, 2] }}
            performance={{ min: 0.5 }} // Dynamically degrades quality if FPS drops
        >
          {/* Suspense handles the momentary switch between Desktop/Mobile images */}
          <Suspense fallback={null}>
             <SceneContent />
          </Suspense>
        </Canvas>
      </div>

      <div ref={textRef} className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none mix-blend-exclusion will-change-transform px-4 text-center">
        <div className="max-w-[90vw] 2xl:max-w-[1600px] flex flex-col items-center">
            {/* Typography scales seamlessly from phone to large desktop */}
            <h1 className="text-[18.975vw] md:text-[15.18vw] xl:text-[13.915vw] 2xl:text-[228px] landscape:max-h-[550px]:text-[20vh] leading-none font-display font-bold text-white tracking-tighter animate-in fade-in duration-1000">
            TRILLEX
            </h1>
            <h2 className="text-xl md:text-3xl landscape:max-h-[550px]:text-lg font-sans font-bold text-white tracking-[0.5em] uppercase mt-2 mb-6 landscape:max-h-[550px]:mb-3 animate-in fade-in duration-1000 delay-150">
            MUSIC GROUP
            </h2>
        </div>
        
        <button 
            className="group relative pointer-events-auto mt-8 md:mt-16 landscape:max-h-[550px]:mt-6 px-10 py-4 md:px-14 md:py-5 landscape:max-h-[550px]:py-3 overflow-hidden rounded-full border border-white/30 bg-white/15 backdrop-blur-[130px] shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_5px_rgba(255,255,255,0.1)] hover:border-trillex-orange/50 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300"
            data-hoverable="true"
            onClick={(e) => {
                e.preventDefault();
                const event = new CustomEvent('trillex-navigate', { 
                    detail: { page: 'contact', section: 'contact-form' } 
                });
                window.dispatchEvent(event);
            }}
        >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)] z-20 pointer-events-none" />
            <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-[linear-gradient(180deg,rgba(255,255,255,0.8),transparent,rgba(255,255,255,0.3))] z-20 pointer-events-none" />
            <div className="absolute inset-0 bg-trillex-orange translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
            <div className="relative flex items-center justify-center gap-2 z-10">
                <div className="relative overflow-hidden h-5 flex flex-col items-center">
                    <span className="block font-display text-lg md:text-xl landscape:max-h-[550px]:text-base font-bold tracking-tighter leading-none uppercase text-white transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-full">
                        Get in touch
                    </span>
                    <span className="absolute top-0 block font-display text-lg md:text-xl landscape:max-h-[550px]:text-base font-bold tracking-tighter leading-none uppercase text-black transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] translate-y-full group-hover:translate-y-0">
                        Get in touch
                    </span>
                </div>
                <div className="relative overflow-hidden w-5 h-5 landscape:max-h-[550px]:w-4 landscape:max-h-[550px]:h-4">
                     <ArrowUpRight strokeWidth={3} className="absolute inset-0 w-5 h-5 landscape:max-h-[550px]:w-4 landscape:max-h-[550px]:h-4 text-white transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-full group-hover:-translate-y-full" />
                     <ArrowUpRight strokeWidth={3} className="absolute inset-0 w-5 h-5 landscape:max-h-[550px]:w-4 landscape:max-h-[550px]:h-4 text-black transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] -translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0" />
                </div>
            </div>
        </button>
      </div>
      
      <div className="absolute bottom-12 supports-[height:100dvh]:bottom-8 md:bottom-10 left-0 w-full flex justify-center z-20 pointer-events-none">
        <div className="text-white/70 text-xs md:text-sm animate-bounce tracking-widest font-mono">
            SCROLL TO EXPLORE
        </div>
      </div>
    </div>
  );
};

export default Hero;