import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, X, Send, Cpu, Activity, Zap, Shield, Globe } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface SecurityTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  audioCtx: AudioContext | null;
}

const SecurityTerminal: React.FC<SecurityTerminalProps> = ({ isOpen, onClose, audioCtx }) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ type: 'user' | 'ai', text: string }[]>([
    { type: 'ai', text: "NEURAL_LINK_ESTABLISHED. SEC_SHELL_v9.1 ACTIVE." },
    { type: 'ai', text: "Query system for general cyber-security intelligence, or request portfolio data regarding Jinesh." }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Advanced Sound Utility
  const playBlip = (freqs: number[], type: OscillatorType, duration: number, gainValue: number = 0.1) => {
    if (!audioCtx || audioCtx.state === 'suspended') return;
    
    const now = audioCtx.currentTime;
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(gainValue, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    g.connect(audioCtx.destination);

    freqs.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + (idx * 0.05));
      osc.connect(g);
      osc.start(now + (idx * 0.05));
      osc.stop(now + duration + (idx * 0.05));
    });
  };

  const playOpenSound = () => playBlip([440, 880, 1760], 'sine', 0.4, 0.15);
  const playCloseSound = () => playBlip([1760, 880, 440], 'sine', 0.5, 0.1);
  const playSendSound = () => playBlip([2200, 4400], 'square', 0.08, 0.05);
  const playReceiveSound = () => playBlip([880, 1100], 'sine', 0.2, 0.08);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      playOpenSound();
      scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
      setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
      }, 100);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    // Keep focus on new messages unless we are currently interacting somewhere else
    if (isOpen && !isProcessing) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [history, isOpen, isProcessing]);

  const handleClose = () => {
    playCloseSound();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMsg = input.trim();
    setInput("");
    playSendSound();
    setHistory(prev => [...prev, { type: 'user', text: userMsg }]);
    setIsProcessing(true);

    try {
      const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      
      const chatHistory = history.map(msg => `${msg.type === 'user' ? 'User' : 'System'}: ${msg.text}`).join('\n');

      const promptContext = `
You are a Cyber Security AI Assistant.

CRITICAL INSTRUCTIONS:
1. You can answer ANY general cyber security or technical questions expertly and directly. Do NOT mention Jinesh or Bandhan AMC when answering these general questions.
2. If and ONLY if the user explicitly mentions or asks about "Jinesh" or his portfolio, provide his portfolio information (Jinesh Chudasama: Cyber Security Analyst, VAPT at Bandhan AMC, and Actor).

Tone: Analytical, precise, helpful, and professional.

Recent Chat Log:
${chatHistory}

User Query: ${userMsg}`;

      const response = await genAI.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: promptContext }] }],
        config: { systemInstruction: "Act as an advanced cyber security AI shell. Provide expert security answers. Give Jinesh's information only when specifically requested." }
      });

      playReceiveSound();
      setHistory(prev => [...prev, { type: 'ai', text: response.text || "COMM_ERROR: EMPTY_PACKET" }]);
    } catch (err) {
      setHistory(prev => [...prev, { type: 'ai', text: "UPLINK_FAILURE: SIGNAL_INTERCEPTED_OR_TIMEOUT." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
          className="fixed inset-0 z-[1000000] flex items-center justify-center p-4 md:p-12 pointer-events-none"
        >
          <div className="w-full max-w-5xl h-[90vh] md:h-[85vh] bg-black/95 backdrop-blur-3xl border-2 border-emerald-500/30 shadow-[0_0_150px_rgba(16,185,129,0.25)] rounded-sm flex flex-col overflow-hidden pointer-events-auto relative">
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 border-b border-emerald-500/20 bg-zinc-950/80">
              <div className="flex items-center gap-3 md:gap-6">
                <div className="p-2 md:p-3 bg-emerald-500/10 rounded-sm">
                   <Terminal size={20} md:size={24} className="text-emerald-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] md:text-[12px] mono text-white font-black tracking-widest uppercase">SEC_OPS_TERMINAL // GRID_UPLINK</span>
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                    <span className="text-[8px] md:text-[10px] text-zinc-500 font-black uppercase tracking-tighter">Status: Active_Trace_Clean</span>
                  </div>
                </div>
              </div>
              <button onClick={handleClose} className="p-2 md:p-3 hover:bg-red-500/20 text-zinc-600 hover:text-red-500 transition-all rounded-full">
                <X size={20} md:size={24} />
              </button>
            </div>

            {/* Logs Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-10 space-y-4 md:space-y-6 mono text-[13px] md:text-[15px] scroll-smooth terminal-scrollbar bg-[radial-gradient(circle_at_center,rgba(0,255,65,0.03)_0%,transparent_100%)]">
              {history.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -15 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  key={i} 
                  className={`flex gap-3 md:gap-6 ${msg.type === 'user' ? 'bg-zinc-900/40 p-3 md:p-4 rounded-sm' : ''}`}
                >
                  <span className={`shrink-0 font-black text-[10px] md:text-[12px] pt-1 ${msg.type === 'user' ? 'text-red-500' : 'text-emerald-500'}`}>
                    {msg.type === 'user' ? '[GUEST@OPS]:' : '[SYS_CORE]:'}
                  </span>
                  <div className={`flex flex-col ${msg.type === 'user' ? 'text-red-400/90 font-light' : 'text-emerald-400 font-medium'} leading-relaxed max-w-4xl break-words`}>
                    {/* Render with basic newlines if AI responds with them */}
                    {msg.text.split('\n').map((line, idx) => (
                      <span key={idx} className="block min-h-[1.2em]">{line}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
              {isProcessing && (
                <div className="flex items-center gap-3 text-emerald-500/50 animate-pulse italic text-[11px] md:text-[13px]">
                  <Cpu size={14} md:size={18} className="animate-spin" /> <span>ANALYZING_TACTICAL_PACKET...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSubmit} className="p-3 md:p-8 border-t border-emerald-500/20 bg-zinc-950/80 flex gap-2 md:gap-5 items-center">
               <span className="text-emerald-500 font-black mono text-sm md:text-xl flex items-center gap-2 md:gap-3 shrink-0">
                 <Zap size={14} md:size={20} className="text-emerald-500 animate-pulse hidden sm:block" /> $
               </span>
               <div className="flex-1 relative flex items-center min-w-0">
                 <input 
                   ref={inputRef}
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   className="w-full bg-transparent border-none outline-none mono text-emerald-100 text-[12px] sm:text-[13px] md:text-base lg:text-lg placeholder:text-zinc-600/70 caret-emerald-500"
                   placeholder="Query system (Sec or Jinesh info)..."
                   autoComplete="off"
                   spellCheck="false"
                   autoFocus
                 />
               </div>
               <button type="submit" disabled={isProcessing} className="p-2 md:p-4 bg-emerald-500/10 hover:bg-emerald-500/30 text-emerald-600 hover:text-emerald-400 transition-all rounded-sm border border-emerald-500/20 hover:border-emerald-500/50 shrink-0">
                 <Send size={18} md:size={24} />
               </button>
            </form>

            {/* HUD Scan Effect Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(transparent_0%,rgba(0,255,65,0.5)_50%,transparent_100%)] bg-[size:100%_4px] animate-scan" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SecurityTerminal;