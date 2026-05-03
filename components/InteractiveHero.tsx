
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Terminal } from 'lucide-react';
import NeuralBackground from './NeuralBackground';

const InteractiveHero: React.FC = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-24 px-6 bg-black">
      <NeuralBackground />
      
      <div className="container mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-12"
        >
          <div className="flex items-center justify-center gap-4 text-emerald-500 font-mono tracking-[0.4em] text-xs uppercase">
            <Shield size={20} className="animate-pulse" />
            <span>ENCRYPTED_HERO_MODULE_LOADED</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none hero-glitch">
            TACTICAL<br />INTELLIGENCE
          </h1>
          
          <p className="text-zinc-500 text-xl md:text-2xl font-mono max-w-2xl mx-auto leading-relaxed border-l-2 border-emerald-500/20 pl-8">
            Specializing in high-intensity defensive operations and offensive security architecture.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-16">
            <button className="px-12 py-5 bg-emerald-500 text-black font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform flex items-center gap-3">
              <Zap size={18} /> INITIALIZE_HANDSHAKE
            </button>
            <button className="px-12 py-5 border border-zinc-800 text-zinc-400 font-black uppercase tracking-widest text-sm hover:bg-white/5 transition-all flex items-center gap-3">
              <Terminal size={18} /> SYSTEM_SHELL
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative HUD Elements */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
    </div>
  );
};

export default InteractiveHero;
