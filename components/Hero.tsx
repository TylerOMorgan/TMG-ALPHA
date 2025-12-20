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
const DESKTOP_TEXTURE_URL = '/HeroSectionV5.png';    
const TABLET_TEXTURE_URL = '/HeroSectionTablet.jpg'; 
const MOBILE_TEXTURE_URL = '/HeroSectionMobile.png'; 

// Preload textures to minimize swap lag
useTexture.preload(DESKTOP_TEXTURE_URL);
useTexture.preload(TABLET_TEXTURE_URL);
useTexture.preload(MOBILE_TEXTURE_URL);

// --- HOOK FOR DEVICE TYPE ---
const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const tabletQuery = window.matchMedia('(min-width: 768px) and (max-width: 1024px)');

    const handleDeviceChange = () => {
      if (mobileQuery.matches) setDeviceType('mobile');
      else if (tabletQuery.matches) setDeviceType('tablet');
      else setDeviceType('desktop');
    };

    handleDeviceChange();
    mobileQuery.addEventListener('change', handleDeviceChange);
    tabletQuery.addEventListener('change', handleDeviceChange);

    return () => {
      mobileQuery.removeEventListener('change', handleDeviceChange);
      tabletQuery.removeEventListener('change', handleDeviceChange);
    };
  }, []);

  return deviceType;
};

// --- SCENE CONTENT ---
const SceneContent = () => {
  const { viewport } = useThree();
  const deviceType = useDeviceType();

  const textureUrl = useMemo(() => {
    if (deviceType === 'mobile') return MOBILE_TEXTURE_URL;
    if (deviceType === 'tablet') return TABLET_TEXTURE_URL;
    return DESKTOP_TEXTURE_URL;
  }, [deviceType]);

  const texture = useTexture(textureUrl);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const shaderArgs = useMemo(() => ({
    uniforms: {
      uTexture: { value: null },
      uBeatSignal: { value: 0.0 }, 
      uIntensity: { value: 0.0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision mediump float; 
      
      uniform sampler2D uTexture;
      uniform float uBeatSignal; 
      uniform float uIntensity; 
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;
        
        // Chromatic shift based on signal
        float shift = 0.003 + (uBeatSignal * 0.012); 

        float r = texture2D(uTexture, uv - vec2(shift, 0.0)).r;
        float g = texture2D(uTexture, uv).g; 
        float b = texture2D(uTexture, uv + vec2(shift, 0.0)).b;

        vec3 color = vec3(r, g, b);

        float gray = dot(color, vec3(0.299, 0.587, 0.114));
        
        // Saturation pulse
        float satLevel = 1.1 + (uBeatSignal * 0.5);
        vec3 saturatedColor = mix(vec3(gray), color, satLevel);

        // Contrast pulse
        float contrast = 1.0 + (uBeatSignal * 0.15);
        vec3 finalColor = (saturatedColor - 0.5) * contrast + 0.5;

        gl_FragColor = vec4(finalColor * uIntensity, 1.0);
      }
    `
  }), []);

  useFrame((state) => {
    if (!materialRef.current) return;

    const time = state.clock.elapsedTime;
    const beatTime = time % 2.5;
    
    const smoothstep = (min: number, max: number, value: number) => {
      const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
      return x * x * (3 - 2 * x);
    };

    const lubVal = smoothstep(0.0, 0.1, beatTime) * smoothstep(0.4, 0.15, beatTime);
    const dubVal = smoothstep(0.4, 0.6, beatTime) * smoothstep(1.0, 0.5, beatTime);
    
    // --- INTENSITY UPDATE ---
    // Multiplied by 0.45 to set pulsating intensity to 45%
    const beatSignal = (lubVal + (dubVal * 0.7)) * 0.45;

    materialRef.current.uniforms.uBeatSignal.value = beatSignal;
    
    let targetOpacity = 1.0; 
    if (deviceType === 'tablet') targetOpacity = 0.9;
    if (deviceType === 'mobile') targetOpacity = 0.8;

    materialRef.current.uniforms.uIntensity.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uIntensity.value,
      targetOpacity,
      0.02
    );
    
    materialRef.current.uniforms.uTexture.value = texture;
  });

  return (
    <Mesh scale={[viewport.width, viewport.height, 1]}>
      <PlaneGeometry args={[1, 1, 1, 1]} /> 
      <ShaderMaterial
        ref={materialRef}
        args={[shaderArgs]}
        transparent
      />
    </Mesh>
  );
};

// --- HERO COMPONENT ---
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
    <div id="home" className="relative w-full h-[100vh] supports-[height:100dvh]:h-[100dvh] min-h-[500px] md:min-h-[600px] overflow-hidden bg-trillex-black">
      <div className="absolute inset-0 z-0 opacity-80">
        <Canvas 
            dpr={[1, 1.25]} 
            camera={{ position: [0, 0, 2] }}
            gl={{ 
              depth: false, 
              stencil: false, 
              antialias: false,
              powerPreference: "high-performance",
              preserveDrawingBuffer: false
            }}
            resize={{ debounce: 200 }} 
        >
          <Suspense fallback={null}>
             <SceneContent />
          </Suspense>
        </Canvas>
      </div>

      <div ref={textRef} className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none mix-blend-exclusion will-change-transform px-4 text-center">
        <div className="max-w-[95vw] 2xl:max-w-[1600px] flex flex-col items-center">
            <h1 className="text-[17vw] md:text-[15vw] xl:text-[13vw] 2xl:text-[220px] landscape:max-h-[550px]:text-[18vh] leading-none font-display font-bold text-white tracking-tighter animate-in fade-in duration-1000">
            TRILLEX
            </h1>
            <h2 className="text-sm sm:text-lg md:text-3xl landscape:max-h-[550px]:text-base font-sans font-bold text-white tracking-[0.3em] md:tracking-[0.5em] uppercase mt-2 mb-6 landscape:max-h-[550px]:mb-3 animate-in fade-in duration-1000 delay-150">
            MUSIC GROUP
            </h2>
        </div>
        
        <button 
            className="group relative pointer-events-auto mt-6 md:mt-16 px-6 py-3 md:px-14 md:py-5 overflow-hidden rounded-full border border-white/30 bg-white/10 backdrop-blur-md hover:border-trillex-orange/50 transition-all duration-500"
            onClick={(e) => {
                e.preventDefault();
                const event = new CustomEvent('trillex-navigate', { 
                    detail: { page: 'contact', section: 'contact-form' } 
                });
                window.dispatchEvent(event);
            }}
        >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent z-20 opacity-50" />
            <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-white/50 to-transparent z-20 opacity-50" />
            <div className="absolute inset-0 bg-trillex-orange translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
            
            <div className="relative flex items-center justify-center gap-2 z-10">
                <span className="md:hidden block font-display text-sm font-bold tracking-tighter leading-none uppercase text-white">
                    Get in touch
                </span>
                <div className="hidden md:flex relative overflow-hidden h-5 flex-col items-center">
                    <span className="block font-display text-xl font-bold tracking-tighter leading-none uppercase text-white transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-full">
                        Get in touch
                    </span>
                    <span className="absolute top-0 block font-display text-xl font-bold tracking-tighter leading-none uppercase text-black transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] translate-y-full group-hover:translate-y-0">
                        Get in touch
                    </span>
                </div>
                <div className="relative overflow-hidden w-4 h-4 md:w-5 md:h-5">
                     <ArrowUpRight strokeWidth={3} className="absolute inset-0 w-full h-full text-white transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] md:group-hover:translate-x-full md:group-hover:-translate-y-full" />
                     <ArrowUpRight strokeWidth={3} className="absolute inset-0 w-full h-full text-black transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] -translate-x-full translate-y-full hidden md:block md:group-hover:translate-x-0 md:group-hover:translate-y-0" />
                </div>
            </div>
        </button>
      </div>
    </div>
  );
};

export default Hero;