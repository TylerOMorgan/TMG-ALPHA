import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, User, ChevronDown, Check, ArrowRight, Globe, Instagram, MessageSquare, Music, Users, Loader2, AlertCircle, LucideIcon, Disc, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Webhook URLs
const DEMO_WEBHOOK_URL = import.meta.env.VITE_DEMO_WEBHOOK_URL;
const GENERAL_WEBHOOK_URL = import.meta.env.VITE_GENERAL_WEBHOOK_URL;

// --- SPOTLIGHT DROPDOWN ITEM COMPONENT ---
interface DropdownItemProps {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ children, onClick, active }) => {
  const itemRef = useRef<HTMLLIElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <li
      ref={itemRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative px-4 py-3 cursor-pointer text-sm transition-colors flex items-center justify-between overflow-hidden
        ${active ? 'bg-trillex-orange/10 text-trillex-orange' : 'text-white/70 hover:text-white hover:bg-white/5'}
      `}
    >
      {/* The White Circle / Spotlight Effect */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(circle 400px at ${position.x}px ${position.y}px, rgba(255, 255, 255, 0.1), transparent 80%)`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 font-medium tracking-wide flex items-center gap-4">
        {children}
      </div>
      {active && <Check size={16} className="relative z-10 text-trillex-orange shrink-0" />}
    </li>
  );
};

// --- CUSTOM SELECT COMPONENT ---
type SelectOption = string | { label: string; value: string; image: string };

interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  icon: LucideIcon;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ 
  label, 
  value, 
  onChange, 
  options, 
  icon: Icon,
  onMouseEnter,
  onMouseLeave
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Helper to get display data from the current value
  const getSelectedDisplay = () => {
    const selectedOption = options.find(opt => 
      typeof opt === 'string' ? opt === value : opt.value === value
    );

    if (!selectedOption || value === 'Select') return null;

    if (typeof selectedOption === 'string') {
      return <span>{selectedOption}</span>;
    }
    
    // --- MODIFIED: Increased image size for selected state ---
    return (
      <div className="flex items-center gap-4">
        <img src={selectedOption.image} alt="" className="w-12 h-12 object-contain" />
        <span className="text-lg font-medium">{selectedOption.label}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2 relative z-20" ref={containerRef}>
      <label className="text-xs font-mono text-white/70 uppercase tracking-wider pl-1">
        {label}<span className="text-trillex-orange">*</span>
      </label>
      
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors w-5 h-5 pointer-events-none z-10" />
        
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className={`w-full bg-white/5 border ${isOpen ? 'border-trillex-orange/50 ring-1 ring-trillex-orange/50' : 'border-white/10'} rounded-xl pl-12 pr-4 py-4 text-base text-left text-white outline-none transition-all duration-300 flex items-center justify-between group hover:bg-white/10`}
        >
          <span className={`${value === 'Select' ? 'text-white/50' : 'text-white'}`}>
            {value === 'Select' ? 'Select' : getSelectedDisplay()}
          </span>
          <ChevronDown 
            className={`text-white/30 transition-transform duration-300 w-5 h-5 ${isOpen ? 'rotate-180 text-trillex-orange' : ''}`} 
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 w-full mt-2 bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 animate-in fade-in zoom-in-95 duration-200">
            <ul className="flex flex-col max-h-80 overflow-y-auto py-1">
              {options.map((option) => {
                const optValue = typeof option === 'string' ? option : option.value;
                const optLabel = typeof option === 'string' ? option : option.label;
                const optImage = typeof option === 'string' ? null : option.image;

                return (
                  <DropdownItem
                      key={optValue}
                      active={value === optValue}
                      onClick={() => handleSelect(optValue)}
                  >
                      {/* --- MODIFIED: Increased image size for dropdown list --- */}
                      {optImage && (
                        <img src={optImage} alt="" className="w-16 h-16 object-contain rounded-md" />
                      )}
                      <span className={optImage ? "text-lg font-medium" : ""}>{optLabel}</span>
                  </DropdownItem>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper to get initial tab from URL hash
const getInitialTab = (): 'general' | 'demo' => {
  if (typeof window === 'undefined') return 'general';
  const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
  if (['demo-submission', 'demo-submissions', 'demo', 'demos'].includes(hash)) {
    return 'demo';
  }
  return 'general';
};

// --- MAIN CONTACT FORM COMPONENT ---
const ContactForm: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const formWrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const isFirstRender = useRef(true);
  const isAnimating = useRef(false);
  const directionRef = useRef<'ltr' | 'rtl'>('ltr');

  const [activeTab, setActiveTab] = useState<'general' | 'demo'>(getInitialTab);
  
  const [toast, setToast] = useState<{ show: boolean; title: string; subtitle: string; type: 'success' | 'error' }>({
    show: false,
    title: '',
    subtitle: '',
    type: 'success'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync tab on hashchange & browser back/forward
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
      if (['demo-submission', 'demo-submissions', 'demo', 'demos'].includes(hash)) {
        if (activeTab !== 'demo') {
          handleTabChange('demo', false);
        }
      } else if (['general-inquiry', 'general-enquiry', 'inquiry', 'enquiry', 'general'].includes(hash)) {
        if (activeTab !== 'general') {
          handleTabChange('general', false);
        }
      }
    };

    window.addEventListener('hashchange', handleHashSync);
    window.addEventListener('popstate', handleHashSync);
    return () => {
      window.removeEventListener('hashchange', handleHashSync);
      window.removeEventListener('popstate', handleHashSync);
    };
  }, [activeTab]);

  // Update page title when tab changes
  useEffect(() => {
    document.title = activeTab === 'demo' ? 'DEMO SUBMISSION — TRILLEX' : 'GENERAL INQUIRY — TRILLEX';
  }, [activeTab]);

  const [generalForm, setGeneralForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [demoForm, setDemoForm] = useState({
    subLabel: 'Select',
    artistName: '',
    songTitle: '',
    isCollab: 'Select',
    collaborators: '',
    demoLink: '',
    contactEmail: '',
    hasProfile: 'Select',
    profileLink: '',
    message: ''
  });

  const disableCursor = () => document.body.classList.add('no-custom-cursor');
  const enableCursor = () => document.body.classList.remove('no-custom-cursor');

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (formWrapperRef.current) {
        gsap.fromTo(formWrapperRef.current,
            { y: 40, opacity: 0 }, 
            {
                y: 0, 
                opacity: 1, 
                duration: 0.8, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );
      }
    }, containerRef);

    return () => {
        ctx.revert();
        if (toastTimerRef.current) {
            clearTimeout(toastTimerRef.current);
        }
        enableCursor();
    };
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
    }

    if (contentRef.current) {
        const startX = directionRef.current === 'ltr' ? -50 : 50;

        gsap.fromTo(contentRef.current,
            { opacity: 0, x: startX },
            { 
                opacity: 1, 
                x: 0, 
                duration: 0.5, 
                ease: "power2.out", 
                clearProps: "transform",
                onComplete: () => {
                    isAnimating.current = false;
                }
            }
        );
    }
  }, [activeTab]);

  const handleTabChange = (tab: 'general' | 'demo', updateUrl = true) => {
    if (activeTab === tab || isAnimating.current) return;

    if (updateUrl) {
      const targetHash = tab === 'demo' ? '#demo-submission' : '#general-inquiry';
      if (window.location.hash !== targetHash) {
        window.history.pushState(null, '', targetHash);
      }
    }

    isAnimating.current = true;

    let exitX = 0;
    if (activeTab === 'general' && tab === 'demo') {
        directionRef.current = 'rtl';
        exitX = -50;
    } else {
        directionRef.current = 'ltr';
        exitX = 50;
    }

    if (contentRef.current) {
        gsap.to(contentRef.current, {
            opacity: 0,
            x: exitX,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => setActiveTab(tab)
        });
    } else {
        setActiveTab(tab);
        isAnimating.current = false;
    }
  };

  const showToast = (title: string, subtitle: string, type: 'success' | 'error' = 'success') => {
    if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
    }
    
    setToast({ show: true, title, subtitle, type });
    
    toastTimerRef.current = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
    }, 4000); 
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Email Copied', 'Ready to paste', 'success');
  };

  const sendGeneralToWebhook = async (formData: typeof generalForm) => {
    const payload = {
        ...formData,
        submittedAt: new Date().toISOString(),
        formType: 'General Inquiry',
        source: 'Trillex Website'
    };

    const response = await fetch(GENERAL_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Webhook Error: ${response.statusText}`);
    }
  };

  const sendDemoToWebhook = async (formData: typeof demoForm) => {
    const payload = {
        ...formData,
        submittedAt: new Date().toISOString(),
        formType: 'Demo Submission',
        source: 'Trillex Website'
    };

    const response = await fetch(DEMO_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Webhook Error: ${response.statusText}`);
    }
  };

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    try {
        await sendGeneralToWebhook(generalForm);
        showToast('Message Sent', 'We will get back to you shortly', 'success');
        setGeneralForm({ name: '', email: '', subject: '', message: '' });

    } catch (err: any) {
        console.error('Webhook Error:', err);
        showToast('Submission Failed', 'Please check your connection and try again.', 'error');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const link = demoForm.demoLink.trim();
    const isValidLink = link.startsWith('https://soundcloud.com') || link.startsWith('https://on.soundcloud.com');

    if (!isValidLink) {
        showToast('Invalid Link', 'Must start with https://soundcloud.com', 'error');
        return; 
    }

    if (demoForm.subLabel === 'Select') {
        showToast('Missing Field', 'Please select a label', 'error');
        return;
    }

    if (demoForm.isCollab === 'Select') {
        showToast('Missing Field', 'Is this a collaboration?', 'error');
        return;
    }
    if (demoForm.hasProfile === 'Select') {
        showToast('Missing Field', 'Do you have an artist profile?', 'error');
        return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
        await sendDemoToWebhook(demoForm);
        showToast('Demo Submitted', 'Our A&R team is listening', 'success');
        setDemoForm({
            subLabel: 'Select',
            artistName: '',
            songTitle: '',
            isCollab: 'Select',
            collaborators: '',
            demoLink: '',
            contactEmail: '',
            hasProfile: 'Select',
            profileLink: '',
            message: ''
        });
    } catch (err: any) {
        console.error('Webhook Error:', err);
        showToast('Submission Failed', 'Please check your connection and try again.', 'error');
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- RENDERING FORMS ---
  const renderGeneralForm = () => (
    <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            <div className="flex flex-col pt-4">
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit mb-8 backdrop-blur-sm">
                    <span className="text-xs font-mono text-white/80 tracking-widest uppercase">Contact Us</span>
                </div>
                
                <h2 className="text-4xl md:text-7xl font-display font-bold text-white tracking-tight leading-[1.1] mb-6 uppercase">
                    GET IN <span className="text-trillex-orange">TOUCH.</span>
                </h2>
                
                <p className="text-lg md:text-xl text-white/60 font-light mb-2">
                    Or just reach out manually to 
                </p>
                <button 
                    type="button"
                    onClick={() => handleCopy("info@trillexmusicgroup.com")} 
                    className="text-lg md:text-xl text-trillex-orange hover:text-white transition-colors border-b border-trillex-orange/30 hover:border-white pb-1 w-fit text-left cursor-pointer"
                    data-hoverable="true"
                >
                    info@trillexmusicgroup.com
                </button>

                <div className="flex mt-12 lg:mt-20 p-6 bg-white/5 rounded-2xl border border-white/10 w-full max-w-sm backdrop-blur-md">
                     <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-full bg-trillex-orange/20 flex items-center justify-center text-trillex-orange">
                             <Globe size={24} />
                         </div>
                         <div>
                             <h4 className="text-white font-bold">Global HQ</h4>
                             <p className="text-white/40 text-sm">Bangkok, Thailand</p>
                         </div>
                     </div>
                </div>
            </div>

            <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-trillex-orange/5 rounded-full blur-[100px] pointer-events-none" />
                
                <form onSubmit={handleGeneralSubmit} className="flex flex-col gap-5 md:gap-6 relative z-10">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono text-white/70 uppercase tracking-wider pl-1">Full Name</label>
                        <div className="relative group/input">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-trillex-orange transition-colors w-5 h-5 pointer-events-none" />
                            <input 
                                required
                                type="text" 
                                placeholder="Enter your full name..." 
                                value={generalForm.name}
                                onChange={(e) => setGeneralForm({...generalForm, name: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-base text-white placeholder-white/20 focus:border-trillex-orange/50 focus:bg-white/10 focus:ring-1 focus:ring-trillex-orange/50 outline-none transition-all duration-300"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono text-white/70 uppercase tracking-wider pl-1">Email Address</label>
                        <div className="relative group/input">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-trillex-orange transition-colors w-5 h-5 pointer-events-none" />
                            <input 
                                required
                                type="email" 
                                placeholder="Enter your email address..." 
                                value={generalForm.email}
                                onChange={(e) => setGeneralForm({...generalForm, email: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-base text-white placeholder-white/20 focus:border-trillex-orange/50 focus:bg-white/10 focus:ring-1 focus:ring-trillex-orange/50 outline-none transition-all duration-300"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono text-white/70 uppercase tracking-wider pl-1">Subject</label>
                        <div className="relative group/input">
                            <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-trillex-orange transition-colors w-5 h-5 pointer-events-none" />
                            <input 
                                required
                                type="text" 
                                placeholder="Enter subject..." 
                                value={generalForm.subject}
                                onChange={(e) => setGeneralForm({...generalForm, subject: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-base text-white placeholder-white/20 focus:border-trillex-orange/50 focus:bg-white/10 focus:ring-1 focus:ring-trillex-orange/50 outline-none transition-all duration-300"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono text-white/70 uppercase tracking-wider pl-1">Message</label>
                        <div className="relative">
                            <textarea 
                                required
                                maxLength={500}
                                placeholder="Enter your main text here..." 
                                value={generalForm.message}
                                onChange={(e) => setGeneralForm({...generalForm, message: e.target.value})}
                                className="w-full h-48 md:h-96 bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-base text-white placeholder-white/20 focus:border-trillex-orange/50 focus:bg-white/10 focus:ring-1 focus:ring-trillex-orange/50 outline-none transition-all duration-300 resize-none"
                            />
                            <span className="absolute bottom-3 right-4 text-[10px] text-white/20 font-mono">
                                {generalForm.message.length}/500
                            </span>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="mt-4 w-full bg-trillex-orange text-black font-bold text-lg rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-white transition-all duration-300 shadow-[0_4px_20px_rgba(255,127,80,0.25)] hover:shadow-[0_4px_30px_rgba(255,255,255,0.3)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} /> Sending...
                            </>
                        ) : (
                            <>
                                Submit Form <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                </form>
            </div>
        </div>
    </div>
  );

  const renderDemoForm = () => (
    <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            <div className="flex flex-col pt-4">
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit mb-8 backdrop-blur-sm">
                    <span className="text-xs font-mono text-white/80 tracking-widest uppercase">Demo Drop</span>
                </div>
                
                <h2 className="text-4xl md:text-7xl font-display font-bold text-white tracking-tight leading-[1.1] mb-6">
                    Share Your <br/>
                    <span className="text-trillex-orange">Sound.</span>
                </h2>
                
                <p className="text-lg md:text-xl text-white/60 font-light mb-6">
                    Thank you for your interest in Trillex Music Group! After submission, we will contact you within 48 hours
                </p>

                <div className="flex flex-col gap-4 mt-8 lg:mt-10 w-full max-w-sm">
                     <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md transition-all duration-300 hover:bg-white/10 group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-trillex-orange/20 flex items-center justify-center text-trillex-orange group-hover:scale-110 transition-transform">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-lg">Contact here</h4>
                                <button 
                                    type="button"
                                    onClick={() => handleCopy("info@trillexmusicgroup.com")}
                                    className="text-white/40 text-sm hover:text-trillex-orange transition-colors text-left"
                                    data-hoverable="true"
                                >
                                    info@trillexmusicgroup.com
                                </button>
                            </div>
                        </div>
                     </div>

                     {/* INSTAGRAM CONNECT SECTION */}
                     <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md transition-all duration-300 hover:bg-white/10 group">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-12 h-12 rounded-full bg-trillex-orange/20 flex items-center justify-center text-trillex-orange group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,127,80,0.2)]">
                                <Instagram size={24} />
                            </div>
                            <h4 className="text-white font-bold text-lg">Connect on Instagram</h4>
                        </div>

                        <div className="flex flex-col gap-3">
                            {[
                                { handle: '@trillexmusicgroup', url: 'https://www.instagram.com/trillexmusicgroup' },
                                { handle: '@trillexbounce', url: 'https://www.instagram.com/trillexbounce' },
                                { handle: '@trillexavant', url: 'https://www.instagram.com/trillexavant' }
                            ].map((item, index) => (
                                <a
                                    key={index}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/item flex items-center justify-between w-full px-4 py-3 rounded-xl bg-black/20 border border-white/5 hover:border-trillex-orange/50 hover:bg-trillex-orange/10 transition-all duration-300"
                                >
                                    <span className="text-sm text-white/60 font-mono group-hover/item:text-white transition-colors">
                                        {item.handle}
                                    </span>
                                    
                                    <ExternalLink
                                        size={14} 
                                        className="text-white/20 group-hover/item:text-trillex-orange group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-all duration-300" 
                                    />
                                </a>
                            ))}
                        </div>
                     </div>
                </div>
            </div>

            <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-trillex-orange/5 rounded-full blur-[100px] pointer-events-none" />
                
                <form onSubmit={handleDemoSubmit} className="flex flex-col gap-5 md:gap-6 relative z-10">
                    
                    {/* TRILLEX SUB-LABEL SELECTION */}
                    <CustomSelect 
                        label="Trillex Sub-Label"
                        value={demoForm.subLabel}
                        onChange={(value) => setDemoForm({...demoForm, subLabel: value})}
                        options={[
                            { label: 'Trillex Avant', value: 'Trillex Avant', image: './Avant.png' },
                            { label: 'Trillex Bounce', value: 'Trillex Bounce', image: './Bounce.png' }
                        ]}
                        icon={Disc}
                        onMouseEnter={disableCursor}
                        onMouseLeave={enableCursor}
                    />

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono text-white/70 uppercase tracking-wider pl-1">Artist Name<span className="text-trillex-orange">*</span></label>
                        <div className="relative group/input">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-trillex-orange transition-colors w-5 h-5 pointer-events-none" />
                            <input 
                                required
                                type="text" 
                                placeholder="Enter artist name..." 
                                value={demoForm.artistName}
                                onChange={(e) => setDemoForm({...demoForm, artistName: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-base text-white placeholder-white/20 focus:border-trillex-orange/50 focus:bg-white/10 focus:ring-1 focus:ring-trillex-orange/50 outline-none transition-all duration-300"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono text-white/70 uppercase tracking-wider pl-1">Song Title<span className="text-trillex-orange">*</span></label>
                        <div className="relative group/input">
                            <Music className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-trillex-orange transition-colors w-5 h-5 pointer-events-none" />
                            <input 
                                required
                                type="text" 
                                placeholder="Enter song title..." 
                                value={demoForm.songTitle}
                                onChange={(e) => setDemoForm({...demoForm, songTitle: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-base text-white placeholder-white/20 focus:border-trillex-orange/50 focus:bg-white/10 focus:ring-1 focus:ring-trillex-orange/50 outline-none transition-all duration-300"
                            />
                        </div>
                    </div>

                    <CustomSelect 
                        label="Is the Song a Collaboration?"
                        value={demoForm.isCollab}
                        onChange={(value) => setDemoForm({...demoForm, isCollab: value})}
                        options={['Yes', 'No']}
                        icon={Users}
                        onMouseEnter={disableCursor}
                        onMouseLeave={enableCursor}
                    />

                    {demoForm.isCollab === 'Yes' && (
                        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                            <label className="text-xs font-mono text-white/70 uppercase tracking-wider pl-1">Please List All Collaborators<span className="text-trillex-orange">*</span></label>
                            <div className="relative group/input">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-trillex-orange transition-colors w-5 h-5 pointer-events-none" />
                                <input 
                                    required
                                    type="text" 
                                    placeholder="List collaborators..." 
                                    value={demoForm.collaborators}
                                    onChange={(e) => setDemoForm({...demoForm, collaborators: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-base text-white placeholder-white/20 focus:border-trillex-orange/50 focus:bg-white/10 focus:ring-1 focus:ring-trillex-orange/50 outline-none transition-all duration-300"
                                />
                            </div>
                        </div>
                    )}

                      <div className="flex flex-col gap-2">
                          <label className="text-xs font-mono text-white/70 uppercase tracking-wider pl-1">Demo Link (SoundCloud Private Link ONLY)<span className="text-trillex-orange">*</span></label>
                          <div className="relative group/input">
                              <img
                                  src="./soundcloud.png"
                                  alt="SoundCloud"
                                  className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-6 object-contain opacity-50 group-focus-within/input:opacity-100 transition-opacity pointer-events-none"
                              />

                              <input
                                  required
                                  type="url"
                                  pattern="^https:\/\/(on\.)?soundcloud\.com.*"
                                  title="URL must start with https://soundcloud.com or https://on.soundcloud.com"
                                  placeholder="https://soundcloud.com/..."
                                  value={demoForm.demoLink}
                                  onChange={(e) => setDemoForm({ ...demoForm, demoLink: e.target.value })}
                                  onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Please send a SoundCloud link.')}
                                  onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-16 pr-4 py-4 text-base text-white placeholder-white/20 focus:border-trillex-orange/50 focus:bg-white/10 focus:ring-1 focus:ring-trillex-orange/50 outline-none transition-all duration-300 [&:not(:placeholder-shown):invalid]:border-red-500/50 [&:not(:placeholder-shown):invalid]:focus:border-red-500"
                              />
                          </div>
                      </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono text-white/70 uppercase tracking-wider pl-1">Contact Email<span className="text-trillex-orange">*</span></label>
                        <div className="relative group/input">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-trillex-orange transition-colors w-5 h-5 pointer-events-none" />
                            <input 
                                required
                                type="email" 
                                placeholder="Enter email address..." 
                                value={demoForm.contactEmail}
                                onChange={(e) => setDemoForm({...demoForm, contactEmail: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-base text-white placeholder-white/20 focus:border-trillex-orange/50 focus:bg-white/10 focus:ring-1 focus:ring-trillex-orange/50 outline-none transition-all duration-300"
                            />
                        </div>
                    </div>

                     <CustomSelect 
                        label="Do You Have An Artist Profile?"
                        value={demoForm.hasProfile}
                        onChange={(value) => setDemoForm({...demoForm, hasProfile: value})}
                        options={['Yes', 'No']}
                        icon={User}
                        onMouseEnter={disableCursor}
                        onMouseLeave={enableCursor}
                    />

                    {demoForm.hasProfile === 'Yes' && (
                        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                            <label className="text-xs font-mono text-white/70 uppercase tracking-wider pl-1">Link to Artist Profile<span className="text-trillex-orange">*</span></label>
                            <div className="relative group/input">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-trillex-orange transition-colors w-5 h-5 pointer-events-none" />
                                <input 
                                    required
                                    type="url" 
                                    placeholder="Enter profile URL..." 
                                    value={demoForm.profileLink}
                                    onChange={(e) => setDemoForm({...demoForm, profileLink: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-base text-white placeholder-white/20 focus:border-trillex-orange/50 focus:bg-white/10 focus:ring-1 focus:ring-trillex-orange/50 outline-none transition-all duration-300"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono text-white/70 uppercase tracking-wider pl-1">Message</label>
                        <div className="relative">
                            <textarea 
                                placeholder="Any additional info..." 
                                value={demoForm.message}
                                onChange={(e) => setDemoForm({...demoForm, message: e.target.value})}
                                className="w-full h-48 md:h-64 bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-base text-white placeholder-white/20 focus:border-trillex-orange/50 focus:bg-white/10 focus:ring-1 focus:ring-trillex-orange/50 outline-none transition-all duration-300 resize-none"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="mt-4 w-full bg-trillex-orange text-black font-bold text-lg rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-white transition-all duration-300 shadow-[0_4px_20px_rgba(255,127,80,0.25)] hover:shadow-[0_4px_30px_rgba(255,255,255,0.3)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} /> Uploading...
                            </>
                        ) : (
                            <>
                                Submit Demo <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                </form>
            </div>
        </div>
    </div>
  );

  return (
    <section id="contact-form" ref={containerRef} className="relative bg-trillex-black py-5 md:py-10 overflow-hidden flex flex-col items-center">
        {/* Tab Buttons */}
        <div className="container mx-auto px-8 md:px-12 flex flex-col items-center text-center mb-16 relative z-10">
            <div className="flex gap-4 md:gap-8 bg-white/5 p-2 rounded-full backdrop-blur-sm border border-white/5">
                <button 
                    onClick={() => handleTabChange('general')}
                    className={`px-4 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-base font-bold tracking-wide transition-all duration-300 ${activeTab === 'general' ? 'bg-trillex-orange text-black shadow-[0_0_15px_rgba(255,127,80,0.4)]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                >
                    General Inquiry
                </button>
                <button 
                    onClick={() => handleTabChange('demo')}
                    className={`px-4 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-base font-bold tracking-wide transition-all duration-300 ${activeTab === 'demo' ? 'bg-trillex-orange text-black shadow-[0_0_15px_rgba(255,127,80,0.4)]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                >
                    Demo Submission
                </button>
            </div>
        </div>

      {/* Forms Container */}
      <div ref={formWrapperRef} className="container mx-auto px-4 md:px-12 relative z-10 opacity-0 pb-20">
         <div ref={contentRef}>
            {activeTab === 'general' ? renderGeneralForm() : renderDemoForm()}
         </div>
      </div>

       {/* WIDENED Toast Notification */}
       <div className={`fixed top-32 left-1/2 -translate-x-1/2 z-[10000] pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
          <div className={`bg-black border ${toast.type === 'error' ? 'border-red-500/50' : 'border-white/20'} text-white px-8 py-5 min-w-[350px] rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center gap-5`}>
             <div className={`w-10 h-10 shrink-0 rounded-full ${toast.type === 'error' ? 'bg-red-500' : 'bg-trillex-orange'} flex items-center justify-center text-black shadow-[0_0_15px_rgba(255,127,80,0.6)]`}>
                 {toast.type === 'error' ? <AlertCircle size={20} strokeWidth={2.5} /> : <Check size={20} strokeWidth={3} />}
             </div>
             <div className="flex flex-col">
                <span className="font-display font-bold text-lg tracking-wide uppercase leading-tight">{toast.title}</span>
                <span className="font-mono text-[11px] text-white/50 uppercase tracking-widest leading-tight mt-1">{toast.subtitle}</span>
             </div>
          </div>
       </div>
    </section>
  );
};

export default ContactForm;