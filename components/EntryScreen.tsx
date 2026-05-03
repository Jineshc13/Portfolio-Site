import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Shield, Zap, Terminal, Activity, Binary, Globe, Fingerprint, Network, ShieldCheck, ArrowRight } from 'lucide-react';

interface EntryScreenProps {
  onEnter: () => void;
}

const TerminalLogs: React.FC<{ active: boolean }> = ({ active }) => {
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    if (!active) return;
    const logPool = [
      "DECRYPTING_NODE_0x882...",
      "FETCHING_SECURE_KEYS/BIO",
      "BUFFER_OVERFLOW_SHIELD: ACTIVE",
      "NEURAL_MAP_VERSION_4.2.0",
      "PACKET_INSPECTION_88%...",
      "LATENCY_MS: 0.042",
      "UPLINK_STABILITY: ULTRA_HIGH",
      "ENCRYPT_MD5_HASH: REDACTED",
      "ROOT_ACCESS_LEVEL: GRANTED",
      "PROXY_ESTABLISHED: 127.0.0.1",
      "TRACE_BYPASS: SUCCESS",
      "MAC_ADDR_SPOOFED",
      "OSINT_SCAN_COMPLETE",
      "SEC_PROTOCOL: X-99",
      "MEMORY_ALLOCATION_OPTIMIZED",
      "HEARTBEAT_BPM: 72",
      "PULSE_SYNC: 100%",
      "GENETIC_HEX_READ: 0x4F22A"
    ];

    const interval = setInterval(() => {
      setLogs(prev => [logPool[Math.floor(Math.random() * logPool.length)], ...prev].slice(0, 15));
    }, 200);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="absolute top-20 right-10 w-64 h-96 overflow-hidden pointer-events-none opacity-20 hidden xl:block font-mono text-[7px] leading-relaxed text-red-500/80">
      <AnimatePresence>
        {logs.map((log, i) => (
          <motion.div
            key={`${log}-${i}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1 - (i * 0.06), x: 0 }}
            exit={{ opacity: 0 }}
            className="whitespace-nowrap flex items-center gap-2"
          >
            <span className="text-zinc-800">[{new Date().toLocaleTimeString()}]</span>
            {log}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const EntryScreen: React.FC<EntryScreenProps> = ({ onEnter }) => {
  const [loading, setLoading] = useState(0);
  const [status, setStatus] = useState("CORE_INIT...");
  const [isReady, setIsReady] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const mouseX = useMotionValue(0);

  const [isHovered, setIsHovered] = useState(false);

  const handleEnterClick = () => {
    setIsEntering(true);
    setStatus("NEURAL_LINK_ESTABLISHED");
    
    // Smooth transition handoff
    setTimeout(() => {
      onEnter();
    }, 1200); 
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    let clientX;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    const moveX = clientX - window.innerWidth / 2;
    mouseX.set(moveX);
  };

  const statuses = [
    "INITIALIZING_BIO_LINK...",
    "SECURE_CHANNEL_ISOLATED",
    "UPLINK_ESTABLISHED",
    "EXTRACTING_MARKERS...",
    "SCANNING_PATTERNS...",
    "BYPASSING_FIREWALLS...",
    "AUTHENTICATING_USER...",
    "UPLINK_READY"
  ];

  useEffect(() => {
    const startTime = Date.now();
    const duration = 4000; 

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      
      setLoading(progress);
      
      const statusIndex = Math.floor((progress / 100) * (statuses.length - 1));
      setStatus(statuses[statusIndex]);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsReady(true);
          setStatus("ACCESS_AUTHORIZED");
        }, 300);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Parallax transform for the scanner hub
  const hubX = useTransform(mouseX, [-1000, 1000], [-40, 40]);

  return (
    <motion.div 
      exit={{ 
        opacity: [1, 0],
        scale: [1, 1.5],
        filter: ["blur(0px)", "blur(40px)"],
        transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } 
      }}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      className={`fixed inset-0 z-[1000000] bg-[#050505] flex items-center justify-center overflow-hidden transition-colors duration-700 ${isEntering ? 'pointer-events-none' : ''}`}
    >
      {/* Background Ambience - Replicating App.tsx Split Style */}
      <div className={`absolute inset-0 flex flex-col md:flex-row pointer-events-none transition-opacity duration-1000 ${isEntering ? 'opacity-0' : 'opacity-40'}`}>
        <div className="relative flex-1 bg-black border-r border-emerald-500/10 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(transparent_2px,rgba(16,185,129,0.05)_2px),linear-gradient(90deg,transparent_2px,rgba(16,185,129,0.05)_2px)] bg-[size:40px_40px]" />
        </div>
        <div className="relative flex-1 bg-[#12080a] overflow-hidden">
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.15)_0%,transparent_70%)]" />
        </div>
      </div>

      {/* Clean Exit Flash */}
      <AnimatePresence>
        {isEntering && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.1, 0]
            }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 z-[100] bg-emerald-500 pointer-events-none mix-blend-screen"
          />
        )}
      </AnimatePresence>

      {/* Rotating Technical Circles Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
           className="absolute -top-1/4 -left-1/4 w-[100vw] h-[100vw] border-[2px] border-emerald-500 rounded-full flex items-center justify-center"
        >
          <div className="w-[80vw] h-[80vw] border-[1px] border-dashed border-red-500 rounded-full" />
        </motion.div>
      </div>
      {isEntering && (
        <div className="absolute inset-0 z-50 overflow-hidden pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: "100%" }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
              className="absolute w-[1px] bg-emerald-500/30"
              style={{ left: `${i * 2.5}%` }}
            />
          ))}
        </div>
      )}

      {/* Interactive Cinematic Divider */}
      <motion.div 
        style={{ x: useTransform(mouseX, [-500, 500], [-150, 150]) }}
        className="absolute inset-y-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-white/50 to-transparent z-20 pointer-events-none"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 rounded-full blur-xl animate-pulse" />
      </motion.div>

      {/* Cinematic Scanline */}
      <motion.div 
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute inset-x-0 h-[3px] bg-red-500/5 blur-[2px] z-10 pointer-events-none"
      />

      {/* Floating UI Elements (Shards) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden sm:block hidden">
        {Array.from({ length: 6 }).map((_, i) => (
           <motion.div
             key={i}
             initial={{ opacity: 0, scale: 0 }}
             animate={{ 
               opacity: [0, 0.2, 0], 
               y: [0, -100, -200], 
               rotate: [0, 90],
               scale: [0.5, 1, 0.5] 
             }}
             transition={{ duration: 10 + i * 2, repeat: Infinity, delay: i * 3 }}
             style={{ 
               left: `${15 + i * 15}%`, 
               bottom: "10%" 
             }}
             className="absolute w-24 h-48 border border-white/5 bg-gradient-to-b from-white/5 to-transparent skew-x-12"
           />
        ))}
      </div>

      <div className="absolute inset-0 z-30 overflow-y-auto overflow-x-hidden flex flex-col items-center custom-scrollbar">
        <div className="container mx-auto px-4 sm:px-6 relative flex flex-col items-center justify-start sm:justify-center min-h-max py-8 sm:py-16 md:py-24 my-auto">
        
        {/* System Uptime Badge */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="absolute top-6 left-6 md:top-10 md:left-10 hidden xl:flex items-center gap-3 py-2 px-4 bg-zinc-950 border border-white/5 rounded-full"
        >
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
          <span className="text-[9px] mono text-zinc-500 tracking-widest font-black uppercase">UPTIME: 99.9%_STABLE</span>
        </motion.div>
        
        {/* Massive Header Structure Like Main Page */}
        <motion.div
           initial={{ opacity: 0, y: 50, scale: 0.95 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.2 }}
           className="text-center mb-6 w-full mt-10 md:mt-0"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[6.5rem] font-display font-black leading-[0.9] tracking-[-0.05em] uppercase flex flex-col items-center justify-center pointer-events-none select-none">
            <span className="text-white hover:hero-glitch transition-all group/name">
              JINESH
              <motion.span 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 3 }}
                className="absolute inset-0 text-red-500 blur-[2px] pointer-events-none"
              >JINESH</motion.span>
            </span>
            <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' } as any}>PORTFOLIO</span>
          </h1>
          <div className="flex items-center justify-center gap-3 md:gap-4 mt-4 md:mt-6">
            <div className="h-px w-6 md:w-10 bg-red-500/20" />
            <p className="text-[7px] md:text-[9px] text-zinc-500 mono tracking-[0.3em] md:tracking-[0.5em] uppercase font-black">{status}</p>
            <div className="h-px w-6 md:w-10 bg-red-500/20" />
          </div>
        </motion.div>

        {/* Central Biometric Hub - The Fingerprint Scanner */}
        <motion.div 
           style={{ x: hubX }}
           className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 flex items-center justify-center mb-6 md:mb-10 shrink-0"
        >
           {/* Enhanced Animated HUD Rings */}
           <motion.div 
             animate={{ rotate: 360, scale: isHovered ? [1.1, 1.15, 1.1] : [1, 1.05, 1] }}
             transition={{ rotate: { duration: 30, repeat: Infinity, ease: "linear" }, scale: { duration: 5, repeat: Infinity } }}
             className="absolute -inset-16 border-[1.5px] border-red-500/20 rounded-full pointer-events-none"
           />
           <motion.div 
             animate={{ rotate: -360, opacity: isHovered ? [0.4, 0.8, 0.4] : [0.1, 0.4, 0.1] }}
             transition={{ rotate: { duration: 45, repeat: Infinity, ease: "linear" }, opacity: { duration: 4, repeat: Infinity } }}
             className="absolute -inset-10 border-[1px] border-red-500/10 rounded-full pointer-events-none"
           />
           
           {/* Pulsing Energy Ripple */}
           <motion.div 
             animate={{ scale: [1, 1.8], opacity: [0.2, 0] }}
             transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
             className="absolute inset-0 bg-red-500/10 rounded-full pointer-events-none"
           />

           {/* Tech Markers */}
           {[0, 90, 180, 270].map((angle) => (
             <motion.div
               key={angle}
               animate={{ opacity: isHovered ? [0.2, 1, 0.2] : 0.2 }}
               transition={{ duration: 2, repeat: Infinity, delay: angle / 360 }}
               className="absolute w-4 h-[1px] bg-red-500 z-50"
               style={{ 
                 transform: `rotate(${angle}deg) translateY(-140px)`,
                 left: 'calc(50% - 8px)',
                 top: '50%'
               }}
             />
           ))}
           
           {/* Red Danger Ring */}
           <motion.div 
             animate={{ scale: [1.1, 1.25, 1.1], opacity: [0, 0.15, 0] }}
             transition={{ duration: 4, repeat: Infinity, delay: 1 }}
             className="absolute -inset-24 border-[1px] border-red-500/30 rounded-full pointer-events-none"
           />
           
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ 
               scale: isEntering ? 2.5 : 1, 
               opacity: isEntering ? 0 : 1,
               filter: isEntering ? "blur(60px)" : "blur(0px)"
             }}
             onMouseEnter={() => setIsHovered(true)}
             onMouseLeave={() => setIsHovered(false)}
             whileHover={{ scale: 1.05, rotate: 2 }}
             transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
             className="w-full h-full bg-zinc-950/40 backdrop-blur-3xl border border-red-500/20 rounded-full flex items-center justify-center relative overflow-hidden group shadow-[0_0_150px_rgba(239,68,68,0.15)] cursor-pointer"
           >
              {/* Scan HUD Overlay */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-red-500/30" />
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[1px] bg-red-500/30" />
                {/* Circular Grid */}
                <div className="absolute inset-0 rounded-full border border-red-500/10 scale-90" />
                <div className="absolute inset-0 rounded-full border border-red-500/10 scale-75" />
                <div className="absolute inset-0 rounded-full border border-red-500/10 scale-50" />
              </div>

              <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 via-transparent to-red-500/10 opacity-50" />
              
              {/* Reactive Noise Texture */}
              <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

              {/* Rotating Tech String */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 pointer-events-none opacity-20"
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <div 
                    key={i}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[5px] mono font-bold text-red-500 uppercase tracking-[2em]"
                    style={{ transform: `translate(-50%, -50%) rotate(${i * 90}deg) translateY(-90px)` }}
                  >
                    ANALYZING_BIOMETRIC_DATA
                  </div>
                ))}
              </motion.div>

               {/* The Fingerprint Scanner */}
              <div className="relative group-hover:scale-110 transition-transform duration-[2000ms] ease-out">
                <motion.div
                  animate={{ 
                    opacity: isReady ? [0.8, 1, 0.8] : [0.4, 0.8, 0.4],
                    color: isReady ? "#ff003c" : "#ed1c24",
                    filter: isReady 
                      ? ["drop-shadow(0 0 10px #ff003c)", "drop-shadow(0 0 30px #ff003c)", "drop-shadow(0 0 10px #ff003c)"] 
                      : ["drop-shadow(0 0 5px #7d122b)", "drop-shadow(0 0 15px #7d122b)", "drop-shadow(0 0 5px #7d122b)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Fingerprint size={70} className="sm:hidden" />
                  <Fingerprint size={120} className="hidden sm:block md:hidden" />
                  <Fingerprint size={150} className="hidden md:block" />
                </motion.div>
                
                {/* Holographic Ribs Effect */}
                {!isReady && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          left: ["-100%", "200%"],
                          opacity: [0, 0.3, 0]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity, 
                          delay: i * 0.25,
                          ease: "linear"
                        }}
                        className="absolute top-0 w-[2px] h-full bg-red-400/20 rotate-12"
                      />
                    ))}
                  </div>
                )}
                
                {/* Secondary Holographic Echo */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.25, 1],
                    opacity: isHovered ? [0, 0.4, 0] : 0
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 text-red-500/20 blur-[4px] pointer-events-none flex justify-center items-center"
                >
                  <Fingerprint size={70} className="sm:hidden" />
                  <Fingerprint size={120} className="hidden sm:block md:hidden" />
                  <Fingerprint size={150} className="hidden md:block" />
                </motion.div>

                {/* Vertical Scanning Beam Improvement */}
                <motion.div 
                   animate={{ top: ["-10%", "110%"] }}
                   transition={{ duration: isHovered ? 1.2 : 2.5, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-x-0 h-[3px] bg-red-400 blur-[0.5px] shadow-[0_0_30px_#ff003c,0_0_10px_#ff003c] z-20 pointer-events-none"
                >
                  <div className="absolute top-0 left-0 w-full h-[15px] bg-gradient-to-b from-red-500/40 via-red-500/10 to-transparent" />
                  <div className="absolute -bottom-[20px] left-0 w-full h-[20px] bg-gradient-to-t from-red-500/20 to-transparent" />
                </motion.div>
                
                {/* Biometric Point Tracking Nodes */}
                <AnimatePresence>
                  {!isReady && (
                    <div className="absolute inset-0 overflow-hidden">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ 
                            opacity: [0, 1, 0],
                            scale: [0, 1.5, 0],
                            x: (Math.random() - 0.5) * 120,
                            y: (Math.random() - 0.5) * 120,
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            delay: i * 0.4,
                            ease: "circOut"
                          }}
                          className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-red-400 rounded-full blur-[1px]"
                        />
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Internal Floating Tech Data */}
              <AnimatePresence>
                {isHovered && !isReady && (
                   <div className="absolute inset-0 pointer-events-none">
                     {Array.from({ length: 8 }).map((_, i) => (
                       <motion.div
                         key={i}
                         initial={{ opacity: 0 }}
                         animate={{ 
                           opacity: [0, 0.4, 0],
                           x: [0, Math.cos(i * 45) * 120],
                           y: [0, Math.sin(i * 45) * 120],
                         }}
                         exit={{ opacity: 0 }}
                         transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                         className="absolute top-1/2 left-1/2 text-[6px] mono font-bold text-red-500 whitespace-nowrap"
                       >
                         {["SEQ_LNK", "STR_ANALYSIS", "PX_LOCK", "DRK_MODE", "SYS_READ", "VPT_INIT", "NOD_SNC", "SEC_PASS"][i]}
                       </motion.div>
                     ))}
                   </div>
                )}
              </AnimatePresence>

              {/* Biometric Readout */}
              <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-32 hidden lg:flex flex-col gap-2 pointer-events-none">
                <div className="h-[1px] w-full bg-red-500/20" />
                <div className="flex justify-between items-center text-[7px] mono font-bold text-red-500/60">
                  <span>BIO_STAB</span>
                  <span>99.2%</span>
                </div>
                <div className="flex justify-between items-center text-[7px] mono font-bold text-red-500/60">
                   <span>TEMPORAL_DRFT</span>
                   <span>0.002ms</span>
                </div>
                <div className="flex gap-1">
                   {Array.from({ length: 12 }).map((_, i) => (
                     <motion.div 
                       key={i}
                       animate={{ height: [2, 8, 2] }}
                       transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                       className="w-[1px] bg-red-500/40"
                     />
                   ))}
                </div>
              </div>

              {/* Ready Indicator Overlay */}
              <AnimatePresence>
                {isReady && !isEntering && (
                  <motion.div
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-40"
                  >
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="relative"
                    >
                      <ShieldCheck size={80} className="text-emerald-500 filter drop-shadow(0 0 20px #10b981)" />
                      <motion.div 
                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-full border-2 border-emerald-500"
                      />
                    </motion.div>
                    
                    <motion.div 
                      initial={{ y: 20, opacity: 0, scale: 0.9 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
                      className="mt-6 flex flex-col items-center gap-2"
                    >
                       <span className="text-[8px] md:text-[10px] mono font-black text-emerald-500 tracking-[0.4rem] md:tracking-[0.8rem] uppercase">
                         DNA_MATCHED
                       </span>
                       <div className="h-[1px] w-24 md:w-32 bg-emerald-500/20" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
           </motion.div>
        </motion.div>

        {/* Progress System - Unified Red Aesthetic */}
        <div className={`w-full max-w-[280px] sm:max-w-md space-y-4 transition-all duration-1000 ${isEntering ? 'opacity-0 scale-90 translate-y-10' : 'opacity-100'}`}>
           <div className="flex justify-between items-end mono text-[8px] sm:text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                Tactical Link
              </span>
              <span className="text-red-500 font-mono italic">{Math.floor(loading)}%</span>
           </div>
           <div className="h-[2px] w-full bg-zinc-900/80 overflow-hidden relative">
              <motion.div 
                className="h-full bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${loading}%` }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] w-20 animate-[scanline_2s_linear_infinite]" />
           </div>
        </div>

        {/* Enter Trigger - High Visibility Button */}
        <div className="mt-8 md:mt-12 flex flex-col items-center justify-center w-full z-50 gap-6">
          {isReady && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex flex-col items-center gap-6 w-full ${isEntering ? 'pointer-events-none' : ''}`}
            >
              <motion.button
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEnterClick}
                disabled={isEntering}
                className={`group relative px-8 sm:px-12 md:px-20 py-4 md:py-5 bg-zinc-950/80 backdrop-blur-md border border-emerald-500/20 text-emerald-400 font-black uppercase text-[11px] md:text-[13px] tracking-[0.4rem] md:tracking-[0.8rem] overflow-hidden transition-all duration-500 ${isEntering ? 'opacity-0 scale-150 blur-3xl' : 'shadow-[0_0_20px_rgba(16,185,129,0.05)] hover:shadow-[0_0_40px_rgba(16,185,129,0.2)] hover:border-emerald-500/50 hover:text-emerald-300'}`}
              >
                <div className="absolute inset-0 bg-emerald-500/10 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
                
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-500/50 pointer-events-none z-10" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-500/50 pointer-events-none z-10" />
                
                <span className="relative z-10 flex items-center justify-center gap-3 md:gap-4 transition-colors duration-300">
                  <Zap size={16} className="fill-current" />
                  INITIATE_UPLINK
                </span>

                <motion.div 
                  animate={{ x: [-300, 300] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-y-0 w-20 bg-emerald-500/10 skew-x-[-20deg] pointer-events-none z-10"
                />
              </motion.button>
            </motion.div>
          )}
        </div>
        </div>
      </div>

      <TerminalLogs active={!isReady && !isEntering} />

      {/* Decorative Identifiers */}
      <div className="absolute bottom-10 left-10 text-[9px] mono text-zinc-800 font-black tracking-widest hidden lg:block uppercase">
        X_AXIS: MODULAR_SYSTEM<br />
        Y_AXIS: NEURAL_INTERFACE<br />
        Z_AXIS: ENCRYPTED_CORE
      </div>
      <div className="absolute top-10 right-10 text-[9px] mono text-zinc-800 font-black tracking-widest hidden lg:block uppercase text-right">
        AUTH_VERSION: 1.0.0<br />
        SEC_LEVEL: MAXIMUM<br />
        IP: 192.168.1.1
      </div>
    </motion.div>
  );
};

export default EntryScreen;
