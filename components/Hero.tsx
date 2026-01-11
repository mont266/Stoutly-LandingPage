import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { DownloadModal } from './DownloadModal';

export const Hero: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 3D Tilt Logic
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

  // Tilt range (degrees)
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  // Lighting/Sheen effect movement
  const sheenX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate mouse position relative to center (from -0.5 to 0.5)
    const mouseXFromCenter = (e.clientX - rect.left) / width - 0.5;
    const mouseYFromCenter = (e.clientY - rect.top) / height - 0.5;
    
    x.set(mouseXFromCenter);
    y.set(mouseYFromCenter);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pb-32 bg-gray-900 perspective-1000">
      
      {/* Background radial gradient effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-amber-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* Text Content */}
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left mb-12 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-gray-800 border border-gray-700 text-amber-400 text-xs font-semibold tracking-wide uppercase mb-4">
                The #1 App for Guinness Lovers
              </span>
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                The Pursuit of the <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                  Perfect Pint
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Join the community dedicated to the black stuff. Rate the pour, find the best pints near you, and share your stout journey with friends.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-gray-900 bg-amber-400 hover:bg-amber-300 md:py-4 md:text-lg transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)]"
                >
                  Get the App
                  <ChevronRight className="ml-2 w-5 h-5" />
                </button>
                <a
                  href="https://app.stoutly.co.uk"
                  className="inline-flex items-center justify-center px-8 py-3 border border-gray-700 text-base font-medium rounded-full text-white bg-gray-800 hover:bg-gray-700 md:py-4 md:text-lg transition-all"
                >
                  Use Web Version
                </a>
              </div>
            </motion.div>
          </div>

          {/* 3D Interactive Phone Hero */}
          <div className="relative lg:col-span-6 w-full max-w-[340px] mx-auto lg:max-w-[380px] perspective-container" style={{ perspective: "1200px" }}>
             
             {/* The Interactive Card */}
            <motion.div 
              ref={ref}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              initial={{ opacity: 0, y: 40, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="relative cursor-pointer group"
            >
              {/* Pulsing Glow Behind */}
              <motion.div 
                animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute inset-0 bg-amber-500/30 blur-[60px] rounded-full -z-10 translate-y-10"
              />

              {/* Phone Frame */}
              <div className="relative rounded-[2.5rem] border-[8px] border-gray-900 bg-gray-900 shadow-2xl overflow-hidden aspect-[9/19.5] ring-1 ring-gray-700/50">
                
                {/* Status Bar Shim */}
                <div className="absolute top-0 w-full h-6 bg-black/40 z-30 flex items-center justify-between px-6 backdrop-blur-sm">
                  <div className="text-[10px] text-white font-medium">9:41</div>
                  <div className="flex gap-1">
                     <div className="w-3 h-3 bg-white rounded-full opacity-20"></div>
                     <div className="w-3 h-3 bg-white rounded-full opacity-20"></div>
                  </div>
                </div>

                {/* Actual Screenshot Image */}
                <img 
                  src="public/images/app-screenshot.png" 
                  alt="Stoutly App Screenshot" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    // If public/ fails, try without public/ (some servers map public to root)
                    if (target.src.includes('public/')) {
                      target.src = "images/app-screenshot.png";
                    } else {
                      // Fallback placeholder
                      target.src = "https://placehold.co/380x820/1f2937/fbbf24?text=Stoutly+App";
                    }
                  }}
                />

                {/* Interactive Sheen/Glass Reflection */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 z-40 pointer-events-none"
                  style={{ 
                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.05) 50%, transparent 54%)",
                    x: sheenX,
                    opacity: 1
                  }}
                />
                
                {/* Static Edge Highlight */}
                <div className="absolute inset-0 rounded-[2rem] ring-1 ring-white/10 pointer-events-none z-50"></div>

              </div>
            </motion.div>

            {/* Floating Elements (Optional decorative blurs) */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -top-10 -right-10 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl -z-10"
            />
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -z-10"
            />

          </div>
        </div>
      </div>

      <DownloadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};