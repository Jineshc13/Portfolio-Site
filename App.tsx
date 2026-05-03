
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence, useTransform, useMotionValue } from 'motion/react';
// Added Globe to the lucide-react import list
import { Shield, Mail, GraduationCap, Award, Film, Lock, Activity, Terminal, Zap, Fingerprint, Server, Github, Linkedin, Binary, MapPin, Volume2, VolumeX, BookOpen, Clock, Sun, Moon, ArrowDown, Target, Network, Cpu, Globe, ArrowRight } from 'lucide-react';
import { FadeIn, SlideIn, ScaleIn } from './components/FramerComponents';
import EntryScreen from './components/EntryScreen';
import Tooltip from './components/Tooltip';
import SecurityTerminal from './components/SecurityTerminal';
import NeuralBackground from './components/NeuralBackground';
import TiltCard from './components/TiltCard';
import { PERSONAL_INFO, MISSIONS, ACHIEVEMENTS, NAV_LINKS, SOCIAL_LINKS, ARSENAL } from './constants';

const Cursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' || 
        target.closest('a') !== null || 
        target.closest('button') !== null
      );
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border border-[#00ff41] z-[9999999] pointer-events-none mix-blend-screen hidden lg:block rounded-sm"
        animate={{ 
          x: position.x - 24, 
          y: position.y - 24, 
          scale: isPointer ? 1.5 : 1,
          rotate: isPointer ? 90 : 0,
          borderColor: isPointer ? "#ff003c" : "#00ff41"
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white z-[9999999] pointer-events-none rounded-full hidden lg:block shadow-[0_0_10px_#fff]"
        animate={{ x: position.x - 3, y: position.y - 3 }}
        transition={{ type: 'spring', damping: 30, stiffness: 800 }}
      />
    </>
  );
};

const HUDCircle: React.FC<{ size: string; color: string; speed: number; opacity: number; reverse?: boolean }> = ({ size, color, speed, opacity, reverse = false }) => (
  <motion.div
    animate={{ 
      rotate: reverse ? -360 : 360,
      scale: [1, 1.05, 1],
      opacity: [opacity, opacity * 1.5, opacity]
    }}
    transition={{ 
      rotate: { duration: speed, repeat: Infinity, ease: "linear" },
      scale: { duration: speed / 2, repeat: Infinity, ease: "easeInOut" },
      opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    }}
    className={`absolute rounded-full border border-dashed ${size} pointer-events-none`}
    style={{ borderColor: color }}
  />
);

const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-500, 500], [10, -10]);
  const rotateY = useTransform(mouseX, [-500, 500], [-10, 10]);

  // Parallax transforms for depth levels
  const pX_S = useTransform(mouseX, [-500, 500], [-20, 20]);
  const pY_S = useTransform(mouseY, [-500, 500], [-20, 20]);
  const pX_M = useTransform(mouseX, [-500, 500], [-50, 50]);
  const pY_M = useTransform(mouseY, [-500, 500], [-50, 50]);
  const pX_L = useTransform(mouseX, [-500, 500], [-100, 100]);
  const pY_L = useTransform(mouseY, [-500, 500], [-100, 100]);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = clientX - rect.left - rect.width / 2;
    const y = clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const toggleTheme = () => {
    setToastMessage("Oops! Work in progress.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const initializeAudio = () => {
    try {
      if (audioCtxRef.current) return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // 1. Sub Drone
      const sub = ctx.createOscillator();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(32.7, ctx.currentTime);
      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.4, ctx.currentTime);
      sub.connect(subGain);
      subGain.connect(masterGain);
      sub.start();

      // 2. Constant Buzz (Dark Webseries Aesthetic)
      const buzz = ctx.createOscillator();
      buzz.type = 'sawtooth';
      buzz.frequency.setValueAtTime(55, ctx.currentTime);
      const lpFilter = ctx.createBiquadFilter();
      lpFilter.type = 'lowpass';
      lpFilter.frequency.setValueAtTime(100, ctx.currentTime);
      const buzzGain = ctx.createGain();
      buzzGain.gain.setValueAtTime(0.15, ctx.currentTime);
      buzz.connect(lpFilter);
      lpFilter.connect(buzzGain);
      buzzGain.connect(masterGain);
      buzz.start();

      // 3. Precise Ticking
      const tick = ctx.createOscillator();
      const tickGain = ctx.createGain();
      tick.type = 'square';
      tick.frequency.setValueAtTime(1800, ctx.currentTime);
      tick.connect(tickGain);
      tickGain.connect(masterGain);
      tick.start();

      const runTick = () => {
        if (!audioCtxRef.current) return;
        const now = audioCtxRef.current.currentTime;
        tickGain.gain.setValueAtTime(0.04, now);
        tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
        setTimeout(runTick, 1000); 
      };
      runTick();

      masterGain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 3);
      setHasEntered(true);
    } catch (e) {
      setHasEntered(true);
    }
  };

  useEffect(() => {
    if (hasEntered) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }, [hasEntered]);

  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      const target = isMuted ? 0.0001 : 0.8;
      masterGainRef.current.gain.exponentialRampToValueAtTime(target, audioCtxRef.current.currentTime + 1.2);
    }
  }, [isMuted]);

  return (
    <div className={`min-h-screen relative transition-colors duration-1000 font-mono ${isDark ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      <AnimatePresence mode="wait">
        {!hasEntered && <EntryScreen onEnter={initializeAudio} />}
      </AnimatePresence>

      <Cursor />
      <NeuralBackground />
      <SecurityTerminal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} audioCtx={audioCtxRef.current} />

      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[8000] pointer-events-none"
          >
            <div className="bg-black/90 border-2 border-red-500 pt-3 pb-2 px-6 shadow-[0_0_30px_rgba(255,0,0,0.4)] text-red-500 mono font-black tracking-widest text-xs md:text-sm uppercase rounded-sm flex items-center gap-3">
               <Zap size={14} className="animate-pulse" />
               {toastMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed top-0 left-0 right-0 h-[3px] bg-emerald-500/10 z-[6000]">
        <motion.div className="h-full bg-emerald-500 origin-left shadow-[0_0_15px_#10b981]" style={{ scaleX }} />
      </div>

      <header className="fixed top-0 left-0 w-full z-[5000] px-4 md:px-12 py-4 md:py-6 flex justify-between items-center pointer-events-none transition-all duration-500">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="pointer-events-auto bg-black/80 backdrop-blur-3xl border border-white/5 p-3 md:p-4 flex flex-col gap-0.5 md:gap-1 shadow-2xl"
        >
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
            <span className="text-white text-[8px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.4em] uppercase">SYSTEM.OPERATIVE // v4.2.0</span>
          </div>
          <span className="text-zinc-500 text-[6px] md:text-[8px] uppercase tracking-widest font-bold font-mono">ENCRYPT_KEY: SHAKE_512_AES</span>
        </motion.div>

        <div className="flex gap-2 md:gap-4 pointer-events-auto">
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 mr-4 xl:mr-6 bg-black/20 backdrop-blur-md px-6 xl:px-8 py-2 rounded-full border border-white/5">
            {NAV_LINKS.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-zinc-400 hover:text-emerald-500 transition-colors text-[9px] xl:text-[10px] font-black tracking-widest uppercase"
              >
                {link.name}
              </a>
            ))}
          </div>
          
          <div className="flex gap-1.5 md:gap-2 p-1.5 md:p-2 bg-black/90 rounded-sm border border-white/10 shadow-2xl">
            <Tooltip content="Tactical Terminal" metadata="AI_SHELL" position="bottom">
               <button onClick={() => setIsTerminalOpen(true)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-zinc-400 hover:text-emerald-500 transition-all bg-white/5 relative z-50">
                 <Terminal size={16} md:size={18} />
               </button>
            </Tooltip>
            <button onClick={toggleTheme} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-all bg-white/5">
              {isDark ? <Sun size={16} md:size={18} /> : <Moon size={16} md:size={18} />}
            </button>
            <button onClick={() => setIsMuted(!isMuted)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-all bg-white/5">
              {isMuted ? <VolumeX size={16} md:size={18} /> : <Volume2 size={16} md:size={18} className="text-emerald-500" />}
            </button>
          </div>
        </div>
      </header>

      <motion.main 
        initial={{ opacity: 0, y: 60, filter: "blur(20px)", scale: 0.95 }}
        animate={hasEntered ? {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scale: 1,
        } : { opacity: 0, y: 60, filter: "blur(20px)", scale: 0.95 }}
        transition={{ 
          duration: 1.5, 
          ease: [0.16, 1, 0.3, 1],
          delay: 0.2 // Wait for entry screen fade outline
        }}
        className="relative z-10" 
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
      >
        
        {/* Scroll To Top Button */}
        <AnimatePresence>
          {hasEntered && scrollYProgress.get() > 0.1 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-10 right-10 z-[5000] w-12 h-12 md:w-16 md:h-16 bg-emerald-500 text-black flex items-center justify-center rounded-full shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95 group transition-transform"
            >
              <ArrowDown size={28} className="rotate-180 group-hover:-translate-y-1 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* REDEFINED HOME SECTION: THE BINARY STAGE */}
        <section id="identity" className="min-h-screen relative flex items-center justify-center overflow-hidden pt-24 md:pt-20">
          
          {/* Main Background Layers */}
          <div className="absolute inset-0 flex flex-col md:flex-row pointer-events-none z-0">
            {/* Left Panel: The Operative (Security) */}
            <div className="relative flex-1 bg-black border-b md:border-b-0 md:border-r border-emerald-500/10 overflow-hidden min-h-[300px]">
               <div className="absolute inset-0 opacity-10 bg-[linear-gradient(transparent_2px,rgba(16,185,129,0.05)_2px),linear-gradient(90deg,transparent_2px,rgba(16,185,129,0.05)_2px)] bg-[size:20px_20px] md:bg-[size:40px_40px]" />
               
               {/* HUD Circles Enhancement - Parallax M */}
               <motion.div 
                 style={{ x: pX_M, y: pY_M }}
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
               >
                  <HUDCircle size="w-[30vw] h-[30vw] md:w-[15vw] md:h-[15vw]" color="#10b981" speed={20} opacity={0.1} />
                  <HUDCircle size="w-[40vw] h-[40vw] md:w-[20vw] md:h-[20vw]" color="#10b981" speed={30} opacity={0.05} reverse />
               </motion.div>

               {/* Live System Logs - Parallax S */}
               <motion.div 
                 style={{ x: pX_S, y: pY_S }}
                 className="absolute top-20 md:top-40 left-4 md:left-10 w-48 md:w-64 h-64 md:h-96 overflow-hidden opacity-10 md:opacity-20 pointer-events-none"
               >
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 2 + i * 0.1, duration: 0.5 }}
                      className="text-[6px] md:text-[8px] mono text-emerald-500 mb-1"
                    >
                      [{new Date().toLocaleTimeString()}] TRACE_NODE_{Math.random().toString(16).slice(2, 6).toUpperCase()}.. ACTIVE
                    </motion.div>
                  ))}
               </motion.div>
               
               <motion.div 
                 style={{ x: pX_L, y: pY_L }}
                 animate={{ 
                   opacity: [0.1, 0.2, 0.1],
                   scale: [1, 1.2, 1],
                   rotate: [0, 5, 0]
                 }}
                 transition={{ duration: 15, repeat: Infinity }}
                 className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] bg-emerald-500/5 rounded-full blur-[140px]" 
               />
               
               {/* Cyber Streamers - More dense now */}
               <div className="absolute inset-x-0 top-0 h-full overflow-hidden opacity-30">
                 {Array.from({ length: 8 }).map((_, i) => (
                   <motion.div
                     key={i}
                     initial={{ y: -500 }}
                     animate={{ y: 1500 }}
                     transition={{ duration: 10 + i * 3, repeat: Infinity, ease: "linear", delay: i * 2 }}
                     className="absolute w-[1px] bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent"
                     style={{ left: `${12.5 * i}%`, height: '600px' }}
                   />
                 ))}
               </div>
            </div>

            {/* Right Panel: The Performer (Dramatic) */}
            <div className="relative flex-1 bg-[#12080a] overflow-hidden min-h-[300px]">
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.15)_0%,transparent_70%)]" />
               
               {/* HUD Circles Enhancement (Red) - Parallax L */}
               <motion.div 
                 style={{ x: pX_L, y: pY_L }}
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
               >
                  <HUDCircle size="w-[35vw] h-[35vw] md:w-[18vw] md:h-[18vw]" color="#ff003c" speed={25} opacity={0.08} />
                  <HUDCircle size="w-[45vw] h-[45vw] md:w-[25vw] md:h-[25vw]" color="#ff003c" speed={35} opacity={0.03} reverse />
               </motion.div>

               <motion.div 
                 style={{ x: pX_M, y: pY_M }}
                 animate={{ 
                   opacity: [0.15, 0.35, 0.15],
                   x: [-30, 30, -30],
                   y: [-20, 20, -20]
                 }}
                 transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-red-900/10 rounded-full blur-[120px]" 
               />

               {/* Dynamic Stage Light Beams - Parallax S */}
               <motion.div 
                 style={{ x: pX_S, y: pY_S }}
                 className="absolute inset-0 flex justify-end"
               >
                 {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ 
                        rotate: [-15 - i * 5, 5 + i * 5, -15 - i * 5],
                        opacity: [0.05, 0.15, 0.05]
                      }}
                      transition={{ duration: 7 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i }}
                      className="absolute top-[-20%] right-[10%] w-[15vw] h-[150vh] bg-gradient-to-b from-white/20 to-transparent blur-3xl origin-top"
                    />
                 ))}
               </motion.div>
            </div>
          </div>

          {/* Interactive Cinematic Divider */}
          <motion.div 
            style={{ x: useTransform(mouseX, [-500, 500], [-150, 150]) }}
            className="absolute inset-y-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-white/50 to-transparent z-20 pointer-events-none"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_15px_#fff]" />
          </motion.div>

          <div className="container mx-auto px-6 relative z-30 pointer-events-none">
            <div className="flex flex-col items-center justify-center text-center">
              
              {/* Massive Editorial Header */}
              <div className="relative mb-8 md:mb-0 scale-90 md:scale-100">
                <motion.div
                   initial={{ opacity: 0, y: 100, filter: "blur(20px)" }}
                   animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                   transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                   className="pointer-events-auto"
                >
                  <h1 className="text-5xl sm:text-7xl md:text-[12vw] lg:text-[16vw] font-black leading-[0.75] tracking-[-0.06em] uppercase flex flex-col items-center justify-center">
                    <motion.span 
                      animate={{ 
                        x: [0, -1, 1, 0],
                        skewX: [0, -2, 2, 0],
                      }}
                      transition={{ 
                        duration: 0.2, 
                        repeat: Infinity, 
                        repeatDelay: 4 
                      }}
                      className="text-white hover:hero-glitch transition-all duration-700 select-none cursor-default inline-block"
                    >
                      JINESH
                    </motion.span>
                    <span className="text-transparent md:-mt-[4vw] relative group/name" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.4)' } as any}>
                       <motion.span 
                         animate={{ 
                           x: [0, 1, -1, 0],
                           skewX: [0, 2, -2, 0],
                         }}
                         transition={{ 
                           duration: 0.2, 
                           repeat: Infinity, 
                           repeatDelay: 4.5,
                           delay: 0.1
                         }}
                         className="relative z-10 hover:text-white hover:hero-glitch transition-all duration-1000 select-none cursor-default inline-block"
                       >
                         CHUDASAMA
                       </motion.span>
                       <div className="absolute inset-0 bg-white/5 blur-3xl opacity-0 group-hover/name:opacity-100 transition-opacity duration-1000" />
                    </span>
                  </h1>
                </motion.div>

                {/* Perspective Role Indicators */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 2 }}
                  className="mt-12 md:mt-16 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24 pointer-events-auto"
                >
                  <div className="text-center group cursor-crosshair relative">
                    <div className="absolute -inset-8 bg-emerald-500/5 blur-2xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-700" />
                    <span className="block text-[8px] md:text-[9px] text-emerald-500 mono font-black tracking-[0.4em] md:tracking-[0.6em] mb-3 md:mb-4 uppercase opacity-40 group-hover:opacity-100 transition-all">// Security Analyst</span>
                    <span className="text-lg md:text-3xl text-zinc-500 font-light tracking-[0.2em] uppercase group-hover:text-white transition-colors">Security Architecture</span>
                  </div>
                  
                  <div className="w-12 h-px bg-zinc-800 rotate-90 hidden md:block" />
                  
                  <div className="text-center group cursor-crosshair relative">
                     <div className="absolute -inset-8 bg-red-500/5 blur-2xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-700" />
                     <span className="block text-[8px] md:text-[9px] text-red-500 mono font-black tracking-[0.4em] md:tracking-[0.6em] mb-3 md:mb-4 uppercase opacity-40 group-hover:opacity-100 transition-all">// STAGE_OPERATIVE</span>
                     <span className="text-lg md:text-3xl text-zinc-500 font-light tracking-[0.2em] uppercase group-hover:text-white transition-colors">Theatrical Presence</span>
                  </div>
                </motion.div>
              </div>

              {/* Unique Interactive CTA */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 1 }}
                className="mt-20 md:mt-32 pointer-events-auto relative px-4 md:px-0"
              >
                <div className="absolute -inset-20 bg-white/5 blur-[80px] rounded-full animate-pulse" />
                <a 
                  href="#missions" 
                  className="relative group px-10 md:px-16 py-6 md:py-8 flex items-center justify-center gap-6 md:gap-8 overflow-hidden bg-black/40 backdrop-blur-3xl border border-white/10 w-full md:w-auto"
                >
                  <motion.div 
                    animate={{ x: [-100, 100] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                  />
                  
                  <span className="relative z-10 text-white font-black uppercase text-[8px] md:text-[10px] tracking-[0.6em] md:tracking-[1em] group-hover:text-emerald-400 transition-colors">Deploy Archives</span>
                  <div className="relative z-10 w-8 h-8 md:w-10 md:h-10 border border-white/20 flex items-center justify-center group-hover:border-emerald-500 group-hover:bg-emerald-500 transition-all duration-500">
                    <ArrowDown size={16} md:size={18} className="text-white group-hover:animate-bounce" />
                  </div>
                  
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-emerald-500 group-hover:w-full transition-all duration-700 ease-in-out" />
                </a>
              </motion.div>

            </div>
          </div>

          {/* Side Micro-labels */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 vertical-text hidden lg:flex flex-col gap-12 text-[10px] mono text-zinc-800 font-black tracking-widest">
            <span className="hover:text-emerald-500 transition-colors cursor-help">0x4F 50 45 52 41 54 49 56 45</span>
            <div className="w-[1px] h-24 bg-white/5" />
            <span>01001010 01001001 01001110</span>
          </div>

          <div className="absolute right-8 top-1/2 -translate-y-1/2 vertical-text hidden lg:flex flex-col gap-12 text-[10px] mono text-zinc-800 font-black tracking-widest">
             <span className="hover:text-red-500 transition-colors cursor-help">D R A M A T I C _ I N T E L</span>
             <div className="w-[1px] h-24 bg-white/5" />
             <span>S I G N A L _ S T R E N G T H</span>
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/20"
          >
             <span className="text-[9px] mono font-black tracking-[0.5em] uppercase">Scroll to Decrypt</span>
             <div className="w-px h-16 bg-gradient-to-b from-white/40 to-transparent" />
          </motion.div>

        </section>

        {/* MISSION LOGS SECTION */}
        <section id="missions" className="py-20 md:py-32 border-t-8 border-zinc-900 bg-black relative">
           <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-16 md:mb-24 gap-10 md:gap-12 text-center md:text-left">
                <FadeIn>
                  <div className="flex items-center justify-center md:justify-start gap-6 md:gap-8 mb-6 md:mb-10">
                    <div className="w-12 md:w-20 h-[3px] bg-red-600 shadow-[0_0_20px_#ef4444]" />
                    <span className="text-red-600 mono text-[11px] md:text-[13px] font-black tracking-[0.5em] md:tracking-[1em] uppercase">SECTION_01 // OPERATIONS</span>
                  </div>
                  <h2 className="section-title text-4xl sm:text-6xl md:text-8xl lg:text-[7.5rem] font-grotesk font-black uppercase tracking-tighter text-white leading-none">Mission Archive</h2>
                </FadeIn>
              </div>

              <div className="space-y-16 md:space-y-24">
                {MISSIONS.map((exp, idx) => (
                  <SlideIn key={idx} direction={idx % 2 === 0 ? 'left' : 'right'}>
                    <TiltCard>
                      <div className="bg-zinc-950/50 border-2 border-zinc-900 p-8 md:p-20 rounded-sm relative group overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all hover:border-emerald-500/20">
                         <Shield size={450} className="absolute -top-32 -right-32 text-emerald-500 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-all duration-1000 hidden md:block" />
                         
                         <div className="relative z-10 flex flex-col xl:flex-row justify-between mb-10 md:mb-16 gap-8 md:gap-12 items-start">
                            <div className="max-w-4xl space-y-6 md:space-y-8">
                               <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                                  <span className="inline-block self-start bg-red-600 text-white mono text-[8px] md:text-[10px] font-black px-3 md:px-4 py-1 md:py-2 uppercase tracking-widest shadow-xl">LIVE_INTEL</span>
                                  <h3 className="text-3xl sm:text-4xl md:text-7xl font-grotesk font-black text-white group-hover:text-emerald-500 transition-colors uppercase leading-tight">{exp.role}</h3>
                               </div>
                               <div className="flex flex-wrap gap-6 md:gap-10 mono text-[10px] md:text-sm font-bold">
                                  <span className="text-blue-500 border border-blue-500/20 px-4 md:px-6 py-1 md:py-2 bg-blue-500/5">{exp.company}</span>
                                  <span className="text-zinc-500 flex items-center gap-2 md:gap-3"><MapPin size={16} /> {exp.location}</span>
                               </div>
                            </div>
                            <div className="mono text-zinc-500 border-l-4 border-zinc-800 pl-6 md:pl-8 py-1 md:py-2 text-[10px] md:text-[12px] uppercase font-black tracking-[0.2em] md:tracking-[0.3em]">
                                TIMESTAMP: <span className="text-white">{exp.period}</span>
                            </div>
                         </div>
  
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 md:gap-x-20 gap-y-8 md:gap-y-12 relative z-10">
                            {exp.highlights.map((h, i) => (
                              <div key={i} className="flex gap-4 md:gap-8 group/item">
                                 <span className="text-emerald-500/40 font-black mono text-base md:text-xl group-hover/item:text-emerald-500 transition-colors">0x{i+1}</span>
                                 <p className="text-zinc-400 text-base md:text-xl font-light leading-relaxed group-hover/item:text-zinc-100 transition-colors">{h}</p>
                              </div>
                            ))}
                         </div>
                      </div>
                    </TiltCard>
                  </SlideIn>
                ))}
              </div>
           </div>
        </section>

        {/* ARSENAL SECTION */}
        <section id="arsenal" className="py-20 md:py-32 bg-zinc-950 border-y-8 border-zinc-900 relative">
          <div className="container mx-auto px-6">
             <FadeIn className="text-center mb-16 md:mb-32">
                <div className="flex items-center justify-center gap-6 md:gap-10 mb-8 md:mb-12">
                   <div className="w-8 md:w-16 h-[1px] bg-blue-500/30" />
                   <span className="text-blue-500 mono text-[11px] md:text-[13px] font-black tracking-[0.5em] md:tracking-[1em] uppercase">SECTION_02 // SYSTEM_ARSENAL</span>
                   <div className="w-8 md:w-16 h-[1px] bg-blue-500/30" />
                </div>
                <h2 className="text-5xl md:text-[8vw] lg:text-[10rem] font-grotesk font-black uppercase tracking-tighter text-white leading-none">Tactical Toolkit</h2>
             </FadeIn>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {ARSENAL.map((cat, idx) => (
                  <ScaleIn key={idx}>
                    <div className="bg-black/50 border-2 border-zinc-900 p-8 md:p-16 rounded-sm relative group h-full shadow-2xl hover:border-emerald-500/30 transition-all duration-700">
                       <div className="w-16 h-16 md:w-24 md:h-24 bg-zinc-900/40 border border-zinc-800 flex items-center justify-center mb-10 md:mb-16 group-hover:scale-110 transition-all duration-700 shadow-2xl rounded-sm">
                          {React.cloneElement(cat.icon, { size: 32, md: 48 })}
                       </div>
                       <h3 className="text-2xl md:text-3xl font-grotesk font-black text-white mb-10 md:mb-16 uppercase tracking-[0.2em] border-l-8 pl-6 md:pl-8 border-current" style={{ color: cat.icon.props.className.includes('red') ? '#ff003c' : cat.icon.props.className.includes('green') ? '#00ff41' : '#00a2ff' }}>
                          {cat.category}
                       </h3>
                       <div className="space-y-8 md:space-y-12">
                          {cat.skills.map(skill => (
                            <div key={skill.name} className="space-y-4 md:space-y-5">
                               <div className="flex justify-between items-end mono">
                                  <div className="space-y-1 md:space-y-2">
                                     <p className="text-[13px] md:text-[15px] font-black text-white uppercase tracking-wider">{skill.name}</p>
                                     <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-tighter">{skill.detail}</p>
                                  </div>
                                  <span className="text-emerald-500 text-[10px] md:text-[12px] font-black">{skill.level}%</span>
                               </div>
                               <div className="h-[2px] md:h-[3px] bg-zinc-900 w-full relative overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }} 
                                    whileInView={{ width: `${skill.level}%` }} 
                                    transition={{ duration: 2, ease: "circOut" }}
                                    className="h-full bg-current shadow-[0_0_15px_currentColor]"
                                    style={{ color: cat.icon.props.className.includes('red') ? '#ff003c' : cat.icon.props.className.includes('green') ? '#00ff41' : '#00a2ff' } as any}
                                  />
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  </ScaleIn>
                ))}
             </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer id="comms" className="py-24 md:py-48 bg-black relative border-t-8 border-zinc-900 overflow-hidden group/footer">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_75%)] pointer-events-none" />
           <div className="container mx-auto px-6 relative z-10 text-center">
              <FadeIn>
                 <div className="flex flex-col items-center justify-center gap-2 mb-10 md:mb-16">
                     <Clock size={48} className="text-emerald-500 animate-pulse md:w-16 md:h-16 inline-block" />
                     <div className="text-[10px] md:text-[12px] mono text-emerald-500/80 uppercase tracking-[0.2em] font-bold mt-6 text-center">
                        CONSTRUCTING_FUTURE // SITE_IN_PROGRESS
                     </div>
                     <div className="text-[8px] md:text-[10px] mono text-zinc-500 uppercase tracking-[0.1em] text-center">
                        CHECK_BACK_FREQUENTLY_FOR_MORE_MODULES
                     </div>
                  </div>
                 <a href={`mailto:${PERSONAL_INFO.email}`} className="group cursor-pointer inline-block">
                   <h2 className="text-4xl sm:text-6xl md:text-[10vw] lg:text-[14rem] font-grotesk font-black uppercase tracking-tighter mb-12 md:mb-20 text-white leading-none">
                     Establish <span className="text-emerald-500 group-hover:hero-glitch group-hover:underline transition-all duration-700">Link</span>
                   </h2>
                 </a>
                 <p className="text-zinc-600 text-lg sm:text-2xl md:text-4xl lg:text-5xl font-grotesk font-light max-w-6xl mx-auto leading-relaxed italic border-l-4 md:border-l-8 border-emerald-500/10 pl-6 md:pl-16 text-left mb-16 md:mb-32">
                    "The infinite buzz of data is only meaningful when filtered through intelligence. Initiate a secure handshake."
                 </p>
              </FadeIn>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-20 md:mb-32">
                 {[
                   { label: 'SECURE_CHANNEL', value: PERSONAL_INFO.email, icon: <Mail size={32} md:size={40} />, color: 'text-blue-500', href: `mailto:${PERSONAL_INFO.email}` },
                   { label: 'SOCIAL_RELAY', value: 'Neural.auth', icon: <Linkedin size={32} md:size={40} />, color: 'text-red-600', href: PERSONAL_INFO.linkedin },
                   { label: 'GLOBAL_NODE', value: PERSONAL_INFO.location, icon: <Globe size={32} md:size={40} />, color: 'text-emerald-500', href: null }
                 ].map((item, idx) => (
                   <ScaleIn key={idx} className="bg-zinc-950 border-2 border-zinc-900 p-8 md:p-16 rounded-sm text-center flex flex-col items-center group/card hover:bg-black hover:border-emerald-500 transition-all duration-700 shadow-2xl">
                      <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className={`w-16 h-16 md:w-24 md:h-24 bg-black border-2 border-zinc-900 rounded-full flex items-center justify-center mb-8 md:mb-12 group-hover/card:${item.color} group-hover/card:border-current shadow-xl transition-all duration-700`}>
                        {item.icon}
                      </motion.div>
                      <p className="text-[9px] md:text-[11px] text-zinc-700 font-black mono mb-4 md:mb-6 tracking-[0.3em] md:tracking-[0.5em] uppercase">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-lg sm:text-xl md:text-2xl font-black text-white hover:text-emerald-500 group-hover/card:hero-glitch transition-colors mono break-words whitespace-normal w-full tracking-tighter min-h-[4rem] flex justify-center items-center px-2">{item.value}</a>
                      ) : (
                        <p className="text-lg sm:text-xl md:text-2xl font-black text-white mono break-words tracking-tighter w-full min-h-[4rem] flex justify-center items-center px-2">{item.value}</p>
                      )}
                   </ScaleIn>
                 ))}
              </div>

              {/* Medium Portal Module in Establish Link */}
              <div className="flex justify-center mb-20 md:mb-32 w-full">
                 <motion.a 
                   href="https://jineshc13.medium.com/"
                   target="_blank"
                   rel="noopener noreferrer"
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ type: "spring", stiffness: 200, damping: 20 }}
                   className="group relative flex justify-between items-center gap-6 px-6 py-4 md:px-10 md:py-6 w-full max-w-xl bg-zinc-950/80 border-2 border-zinc-900 hover:border-emerald-500/50 transition-all duration-700 backdrop-blur-sm shadow-xl hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]"
                 >
                   <div className="flex items-center gap-6">
                     <div className="w-10 h-10 md:w-14 md:h-14 bg-white shrink-0 flex items-center justify-center rounded-sm transition-transform duration-500 group-hover:scale-110">
                       {/* Medium Logo Style */}
                       <svg viewBox="0 0 1043.63 592.71" className="w-6 h-6 md:w-8 md:h-8 fill-black">
                         <g>
                           <path d="M588.67 296.36c0 163.67-131.78 296.35-294.33 296.35S0 460 0 296.36 131.78 0 294.34 0s294.33 132.69 294.33 296.36M911.56 296.36c0 154.06-65.89 279-147.17 279s-147.17-124.94-147.17-279 65.88-279 147.16-279 147.17 124.9 147.17 279M1043.63 296.36c0 138-23.17 249.94-51.76 249.94s-51.75-111.91-51.75-249.94 23.17-249.94 51.75-249.94 51.76 111.9 51.76 249.94" />
                         </g>
                       </svg>
                     </div>
                     <div className="flex flex-col items-start overflow-hidden text-left">
                       <span className="text-[12px] md:text-[14px] mono text-white uppercase tracking-widest group-hover:text-emerald-400 transition-colors w-full truncate font-black">THOUGHT_PORTAL</span>
                       <span className="text-[9px] md:text-[11px] mono text-zinc-500 uppercase tracking-[0.2em] w-full truncate mt-1">ACCESS_MEDIUM_ARTICLES</span>
                     </div>
                   </div>
                   <div className="text-zinc-600 group-hover:text-emerald-400 transition-colors bg-zinc-900 group-hover:bg-emerald-500/10 p-3 rounded-full">
                     <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                   </div>
                   {/* Decorative Brackets */}
                   <div className="absolute top-0 left-0 w-2 h-4 border-t-2 border-l-2 border-zinc-800 group-hover:border-emerald-500/50 transition-colors" />
                   <div className="absolute bottom-0 right-0 w-2 h-4 border-b-2 border-r-2 border-zinc-800 group-hover:border-emerald-500/50 transition-colors" />
                 </motion.a>
              </div>

              <div className="pt-16 md:pt-24 border-t-2 border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-10 md:gap-16 mono text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] md:tracking-[1em] text-zinc-800">
                 <div className="flex gap-8 md:gap-12">
                   <span className="hover:text-red-500 transition-colors cursor-crosshair">SHA_512_SECURE</span>
                   <span className="hover:text-blue-500 transition-colors cursor-crosshair">NODE_ACTIVE</span>
                 </div>
                 <p>© 2025 JINESH CHUDASAMA // REV_4.2.0</p>
                 <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_#10b981] animate-pulse" />
                    <span className="text-emerald-950 tracking-[0.1em] md:tracking-[0.2em]">GRID_CONNECTED</span>
                 </div>
              </div>
           </div>
        </footer>
      </motion.main>
    </div>
  );
};

const SectionHeading: React.FC<{ title: string; subtitle: string; accent: string }> = ({ title, subtitle, accent }) => (
  <div className="mb-24">
    <div className="flex items-center gap-10 mb-10">
      <div className="w-24 h-[6px]" style={{ backgroundColor: accent, boxShadow: `0 0 30px ${accent}` }} />
      <span className="mono text-[14px] font-black uppercase tracking-[1em]" style={{ color: accent }}>{subtitle}</span>
    </div>
    <h3 className="text-6xl md:text-9xl font-grotesk font-black uppercase tracking-tight leading-none text-white">{title}</h3>
  </div>
);

export default App;
