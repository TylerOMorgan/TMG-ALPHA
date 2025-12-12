import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, User, ChevronDown, Check, ArrowRight, Globe, MessageSquare, Music, Users, Scale, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../utils/supabase';

gsap.registerPlugin(ScrollTrigger);


const ContactForm: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const formWrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const isFirstRender = useRef(true);
  const isAnimating = useRef(false);
  const directionRef = useRef<'ltr' | 'rtl'>('ltr');

  const [activeTab, setActiveTab] = useState<'general' | 'demo'>('general');
  
  // Unified Toast State
  const [toast, setToast] = useState<{ show: boolean; title: string; subtitle: string; type: 'success' | 'error' }>({
    show: false,
    title: '',
    subtitle: '',
    type: 'success'
  });

  // Loading State
  const [isSubmitting, setIsSubmitting] = useState(false);

  // General Form State
  const [generalForm, setGeneralForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  // Demo Form State
  const [demoForm, setDemoForm] = useState({
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance Sequence
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
    };
  }, []);

  // Handle Tab Switch Animation 'IN'
  useEffect(() => {
    if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
    }

    if (contentRef.current) {
        // Determine start position based on direction
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

  const handleTabChange = (tab: 'general' | 'demo') => {
    if (activeTab === tab || isAnimating.current) return;
    isAnimating.current = true;

    // Determine direction and exit animation
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
    // Clear existing timer if any
    if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
    }
    
    setToast({ show: true, title, subtitle, type });
    
    // Set new timer safely
    toastTimerRef.current = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Email Copied', 'Ready to paste', 'success');
  };

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    try {
        const { error } = await supabase
            .from('general_inquiries')
            .insert([
                {
                    full_name: generalForm.name,
                    email: generalForm.email,
                    subject: generalForm.subject,
                    message: generalForm.message,
                },
            ]);

        if (error) throw error;

        showToast('Message Sent', 'We will get back to you shortly', 'success');
        setGeneralForm({ name: '', email: '', subject: '', message: '' });

    } catch (err: any) {
        console.error('Supabase Error:', err);
        showToast('Submission Failed', 'Please check your connection and try again.', 'error');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
        const { error } = await supabase
            .from('demo_submissions')
            .insert([
                {
                    artist_name: demoForm.artistName,
                    song_title: demoForm.songTitle,
                    is_collab: demoForm.isCollab,
                    collaborators: demoForm.collaborators,
                    demo_link: demoForm.demoLink,
                    contact_email: demoForm.contactEmail,
                    has_profile: demoForm.hasProfile,
                    profile_link: demoForm.profileLink,
                    message: demoForm.message,
                },
            ]);

        if (error) throw error;
        
        showToast('Demo Submitted', 'Our A&R team is listening', 'success');
        setDemoForm({
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
        console.error('Supabase Error:', err);
        showToast('Submission Failed', 'Please check your connection and try again.', 'error');
    } finally {
        setIsSubmitting(false);
    }
  };

  // Form rendering helpers
  const renderGeneralForm = () => (
    <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            
            {/* Left Column: Text Content */}
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

                {/* Decorative element for large screens */}
                <div className="hidden lg:block mt-20 p-6 bg-white/5 rounded-2xl border border-white/10 max-w-sm backdrop-blur-md">
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

            {/* Right Column: The Form */}
            <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden group">
                {/* Glow Effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-trillex-orange/5 rounded-full blur-[100px] pointer-events-none" />
                
                <form onSubmit={handleGeneralSubmit} className="flex flex-col gap-5 md:gap-6 relative z-10">
                    
                    {/* Full Name */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono text-white/70 uppercase tracking-wider pl-1">Full Name</label>
                        <div className="relative group/input">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-trillex-orange transition-colors w-5 h-5" />
                            <input 
                                required
                                type="text" 
                                placeholder="Enter your full name..." 
                                value={generalForm.name}
                                onChange={(e) => setGeneralForm({...generalForm, name: e.target.value})}
                                // Added 'text-base' for iOS to prevent zoom
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-base text-white placeholder-white/20 focus:border-trillex-orange/50 focus:bg-white/10 focus:ring-1 focus:ring-trillex-orange/50 outline-none transition-all duration-300"
                            />
                        </div>
                    </div>

                    {/* Email Address */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono text-white/70 uppercase tracking-wider pl-1">Email Address</label>
                        <div className="relative group/input">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-trillex-orange transition-colors w-5 h-5" />
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

                    {/* Subject Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono text-white/70 uppercase tracking-wider pl-1">Subject</label>
                        <div className="relative group/input">
                            <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-trillex-orange transition-colors w-5 h-5" />
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

                    {/* Message */}
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

                    {/* Submit Button */}
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
            
            {/* Left Column: Text Content */}
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

                {/* Decorative element - Updated with 2 boxes */}
                <div className="hidden lg:flex flex-col gap-4 mt-10 max-w-sm">
                     {/* Box 1: Contact */}
                     <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md transition-all duration-300 hover:bg-white/10 group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-trillex-orange/20 flex items-center justify-center text-trillex-orange group-hover:scale-110 transition-transform">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">Contact here</h4>
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

                     {/* Box 2: Legal */}
                     <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md transition-all duration-300 hover:bg-white/10 group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-trillex-orange/20 flex items-center justify-center text-trillex-orange group-hover:scale-110 transition-transform">
                                <Scale size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">Legal Query</h4>
                                <button 
                                    type="button"
                                    onClick={() => handleCopy("legal@trillexmusicgroup.com")}
                                    className="text-white/40 text-sm hover:text-trillex-orange transition-colors text-left"
                                    data-hoverable="true"
                                >
                                    legal@trillexmusicgroup.com
                                </button>
                            </div>
                        </div>
                     </div>
                </div>
            </div>

            {/* Right Column: The Form */}
            <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden group">
                {/* Glow Effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-trillex-orange/5 rounded-full blur-[100px] pointer-events-none" />
                
                <form onSubmit={handleDemoSubmit} className="flex flex-col gap-5 md:gap-6 relative z-10">
                    
                    {/* 1. Artist Name */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono text-white/70 uppercase tracking-wider pl-1">Artist Name<span className="text-trillex-orange">*</span></label>
                        <div className="relative group/input">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-trillex-orange transition-colors w-5 h-5" />
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

                    {/* 2. Song Title */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono text-white/70 uppercase tracking-wider pl-1">Song Title<span className="text-trillex-orange">*</span></label>
                        <div className="relative group/input">
                            <Music className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-trillex-orange transition-colors w-5 h-5" />
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

                    {/* 3. Is the Song a Collaboration? */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono text-white/70 uppercase tracking-wider pl-1">Is the Song a Collaboration?<span className="text-trillex-orange">*</span></label>
                        <div className="relative group/input">
                             <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-trillex-orange transition-colors w-5 h-5" />
                             <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none w-5 h-5" />
                            <select 
                                required
                                value={demoForm.isCollab}
                                onChange={(e) => setDemoForm({...demoForm, isCollab: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-10 py-4 text-base text-white focus:border-trillex-orange/50 focus:bg-white/10 focus:ring-1 focus:ring-trillex-orange/50 outline-none transition-all duration-300 appearance-none cursor-pointer"
                            >
                                <option value="Select" disabled className="bg-[#111] text-white/50">Select</option>
                                <option value="Yes" className="bg-[#111]">Yes</option>
                                <option value="No" className="bg-[#111]">No</option>
                            </select>
                        </div>
                    </div>

                    {/* 4. Please List All Collaborators (Conditional) */}
                    {demoForm.isCollab === 'Yes' && (
                        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                            <label className="text-xs font-mono text-white/70 uppercase tracking-wider pl-1">Please List All Collaborators<span className="text-trillex-orange">*</span></label>
                            <div className="relative group/input">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-trillex-orange transition-colors w-5 h-5" />
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


                    {/* 5. Demo Link */}
                      <div className="flex flex-col gap-2">
                          <label className="text-xs font-mono text-white/70 uppercase tracking-wider pl-1">Demo Link (SoundCloud Private Link ONLY)<span className="text-trillex-orange">*</span></label>
                          <div className="relative group/input">

                              <img
                                  src="./soundcloud.png"  // Make sure file is in public folder
                                  alt="SoundCloud"
                                  className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-6 object-contain opacity-50 group-focus-within/input:opacity-100 transition-opacity"
                              />

                              <input
                                  required
                                  type="url"
                                  placeholder="https://..."
                                  value={demoForm.demoLink}
                                  onChange={(e) => setDemoForm({ ...demoForm, demoLink: e.target.value })}
                                  // Ensure padding-left (pl-16) is big enough so text doesn't hit image
                                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-16 pr-4 py-4 text-base text-white placeholder-white/20 focus:border-trillex-orange/50 focus:bg-white/10 focus:ring-1 focus:ring-trillex-orange/50 outline-none transition-all duration-300"
                              />
                          </div>
                      </div>

                    {/* 6. Contact Email */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono text-white/70 uppercase tracking-wider pl-1">Contact Email<span className="text-trillex-orange">*</span></label>
                        <div className="relative group/input">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-trillex-orange transition-colors w-5 h-5" />
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

                     {/* 7. Do You Have An Artist Profile? */}
                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono text-white/70 uppercase tracking-wider pl-1">Do You Have An Artist Profile?<span className="text-trillex-orange">*</span></label>
                        <div className="relative group/input">
                             <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-trillex-orange transition-colors w-5 h-5" />
                             <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none w-5 h-5" />
                            <select 
                                required
                                value={demoForm.hasProfile}
                                onChange={(e) => setDemoForm({...demoForm, hasProfile: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-10 py-4 text-base text-white focus:border-trillex-orange/50 focus:bg-white/10 focus:ring-1 focus:ring-trillex-orange/50 outline-none transition-all duration-300 appearance-none cursor-pointer"
                            >
                                <option value="Select" disabled className="bg-[#111] text-white/50">Select</option>
                                <option value="Yes" className="bg-[#111]">Yes</option>
                                <option value="No" className="bg-[#111]">No</option>
                            </select>
                        </div>
                    </div>

                    {/* 8. Link to Artist Profile (Conditional) */}
                    {demoForm.hasProfile === 'Yes' && (
                        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                            <label className="text-xs font-mono text-white/70 uppercase tracking-wider pl-1">Link to Artist Profile<span className="text-trillex-orange">*</span></label>
                            <div className="relative group/input">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-trillex-orange transition-colors w-5 h-5" />
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

                    {/* 9. Message */}
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

                    {/* 10. Submit Button */}
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
        {/* Tab Buttons - Centered above forms */}
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
      {/* Reduced padding on mobile (px-4) to allow forms more breathing room */}
      <div ref={formWrapperRef} className="container mx-auto px-4 md:px-12 relative z-10 opacity-0 pb-20">
         <div ref={contentRef}>
            {activeTab === 'general' ? renderGeneralForm() : renderDemoForm()}
         </div>
      </div>

       {/* Toast Notification */}
       <div className={`fixed top-32 left-1/2 -translate-x-1/2 z-[10000] pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
          <div className={`bg-black border ${toast.type === 'error' ? 'border-red-500/50' : 'border-white/20'} text-white px-6 py-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center gap-4`}>
             <div className={`w-6 h-6 rounded-full ${toast.type === 'error' ? 'bg-red-500' : 'bg-trillex-orange'} flex items-center justify-center text-black shadow-[0_0_10px_rgba(255,127,80,0.5)]`}>
                 {toast.type === 'error' ? <AlertCircle size={14} strokeWidth={3} /> : <Check size={14} strokeWidth={3} />}
             </div>
             <div className="flex flex-col">
                <span className="font-display font-bold text-sm tracking-wide uppercase leading-none">{toast.title}</span>
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest leading-none mt-1">{toast.subtitle}</span>
             </div>
          </div>
       </div>
    </section>
  );
};

export default ContactForm;