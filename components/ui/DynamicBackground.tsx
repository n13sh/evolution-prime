'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export function DynamicBackground() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      {/* Primary Cinematic Anchor */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-[120%]"
      >
        <img
          src="/hero-background.png"
          alt="Evolution Path"
          className={`w-full h-full object-cover transition-all duration-1000 ${
            isMobile ? 'object-[75%_center] scale-110' : 'object-center scale-100'
          } opacity-40 brightness-[0.7] saturate-[0.8] contrast-[1.1]`}
        />
      </motion.div>

      {/* Overlay Gradients for Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#05050a]/0 via-[#05050a]/40 to-[#05050a]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(5,5,10,0.8)_100%)]" />
      
      {/* Breathing UI Glows */}
      <motion.div 
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-crimson/5 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div 
        animate={{ 
          opacity: [0.05, 0.15, 0.05],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-gold/5 rounded-full blur-[150px] pointer-events-none"
      />
    </div>
  );
}
