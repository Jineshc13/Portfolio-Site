import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: string;
  metadata?: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}

const Tooltip: React.FC<TooltipProps> = ({ content, metadata, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        x: rect.left + rect.width / 2,
        y: rect.top,
        height: rect.height,
      });
    }
  };

  const handleEnter = () => {
    updatePosition();
    setIsVisible(true);
  };

  const handleLeave = () => {
    setIsVisible(false);
  };

  // Keep position synced on scroll/resize
  useEffect(() => {
    if (isVisible) {
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isVisible]);

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center justify-center pointer-events-auto"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === 'bottom' ? -10 : 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: position === 'bottom' ? -10 : 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className={`fixed z-[1000000] pointer-events-none -translate-x-1/2 ${position === 'bottom' ? 'mt-6' : '-translate-y-full mb-6'}`}
            style={{ 
              left: coords.x, 
              top: position === 'bottom' ? coords.y + coords.height : coords.y - 15
            }}
          >
            <div className="bg-zinc-950/95 border-2 border-emerald-500/60 backdrop-blur-3xl p-6 shadow-[0_0_80px_rgba(0,255,65,0.3)] min-w-[280px] md:min-w-[340px] max-w-[450px] rounded-sm relative overflow-hidden">
              <div className="flex justify-between items-center mb-5 pb-3 border-b-2 border-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-emerald-500 shadow-[0_0_12px_#10b981] rounded-full animate-pulse" />
                  <span className="text-[11px] mono text-emerald-500 font-black tracking-[0.5em] uppercase whitespace-nowrap">SEC_PACKET_v3</span>
                </div>
                {metadata && <span className="text-[10px] mono text-zinc-700 font-black tracking-widest uppercase">[{metadata}]</span>}
              </div>
              
              <p className="text-[15px] md:text-[17px] mono text-white leading-relaxed font-medium tracking-tight">
                {content}
              </p>
              
              {/* HUD Decorative Corners */}
              <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-emerald-500/30" />
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-500/30" />
              
              {/* Pointing Arrow */}
              <div className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-950 border-emerald-500/60 rotate-45 shadow-2xl ${
                position === 'bottom' 
                  ? 'top-0 -mt-2.5 border-l-2 border-t-2' 
                  : 'top-full -mt-2 border-r-2 border-b-2'
              }`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;