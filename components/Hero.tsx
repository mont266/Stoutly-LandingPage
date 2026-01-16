import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronRight, BatteryOff } from 'lucide-react';
import { DownloadModal } from './DownloadModal';

// Add your screenshot paths here. The component will cycle through them.
const screenshots = [
  "public/images/app-screenshot.png",
  "public/images/app-screenshot-2.png", // Example: A map view
  "public/images/app-screenshot-3.png", // Example: A user profile
];

export const Hero: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isPhoneOff, setIsPhoneOff] = useState(false);

  // Clock logic
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours());
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateClock();
    const timerId = setInterval(updateClock, 1000); 

    return () => clearInterval(timerId);
  }, []);

  // Slideshow logic
  const intervalRef = useRef<number | null>(null);

  const startSlideshow = () => {
    stopSlideshow(); // Ensure no multiple intervals are running
    if (isPhoneOff) return;
    intervalRef.current = window.setInterval(() => {
      setCurrentScreenshotIndex(prev => (prev + 1) % screenshots.length);
    }, 5000); // Change image every 5 seconds
  };

  const stopSlideshow = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
  
  useEffect(() => {
    startSlideshow();
    return () => stopSlideshow();
  }, [isPhoneOff]);

  // 3D Tilt Logic
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);
  const sheenX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);

  // Battery Drain Logic
  useEffect(() => {
    const drainDuration = 3600 * 1000; // 1 hour
    const tickInterval = drainDuration / 100; // Interval per percentage point

    const batteryDrainInterval = setInterval(() => {
      setBatteryLevel(prevLevel => {
        if (prevLevel <= 1) {
          setIsPhoneOff(true);
          x.set(0); // Reset tilt
          y.set(0);
          clearInterval(batteryDrainInterval);
          return 0;
        }
        return prevLevel - 1;
      });
    }, tickInterval);

    return () => clearInterval(batteryDrainInterval);
  }, []);


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || isPhoneOff) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXFromCenter = (e.clientX - rect.left) / width - 0.5;
    const mouseYFromCenter = (e.clientY - rect.top) / height - 0.5;
    x.set(mouseXFromCenter);
    y.set(mouseYFromCenter);
  };

  const handleMouseLeave = () => {
    if (isPhoneOff) return;
    x.set(0);
    y.set(0);
  };
  
  const handleIndicatorClick = (index: number) => {
    setCurrentScreenshotIndex(index);
    startSlideshow(); // Restart timer from this point
  }

  const getBatteryColor = (level: number) => {
    if (level <= 20) return '#ef4444'; // red-500
    return '#4ade80'; // green-400
  };

  return (
    <div className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pb-32 bg-gray-900 perspective-1000">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-amber-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* Text Content */}
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left mb-24 lg:mb-0">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
            <motion.div 
              ref={ref}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={handleMouseMove}
              onMouseEnter={stopSlideshow}
              onMouseLeave={() => {
                handleMouseLeave();
                startSlideshow();
              }}
              initial={{ opacity: 0, y: 40, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="relative cursor-pointer group"
            >
              <motion.div 
                animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute inset-0 bg-amber-500/30 blur-[60px] rounded-full -z-10 translate-y-10"
              />
              <div className="relative rounded-[2.5rem] border-[8px] border-gray-900 bg-gray-900 shadow-2xl overflow-hidden aspect-[9/19.5] ring-1 ring-gray-700/50">
                {!isPhoneOff && (
                  <div className="absolute top-0 w-full h-6 bg-black/40 z-30 flex items-center justify-between px-4 backdrop-blur-sm pointer-events-none">
                    <div className="text-[10px] text-white font-medium w-9 text-left">{currentTime}</div>
                    <div className="flex items-center gap-1.5 text-white/70">
                      <span className="text-[9px] font-medium tabular-nums">{batteryLevel}%</span>
                      <div className="w-[18px] h-[9px] border border-white/50 rounded-[2px] p-[1px] flex items-center relative">
                          <motion.div 
                              className="h-full rounded-[0.5px]"
                              style={{ backgroundColor: getBatteryColor(batteryLevel) }}
                              animate={{ width: `${batteryLevel}%` }}
                              transition={{ duration: 1, ease: "linear" }}
                          />
                          <div className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[1px] h-2 bg-white/50 rounded-r-sm"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Screenshot Carousel */}
                <AnimatePresence initial={false}>
                   <motion.img
                      key={currentScreenshotIndex}
                      src={screenshots[currentScreenshotIndex]}
                      alt="Stoutly App Screenshot"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: 'easeInOut' }}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const currentSrc = target.src;
                          if (currentSrc.includes('public/')) {
                              target.src = currentSrc.replace('public/', '');
                          } else {
                              target.src = `images/app-screenshot-${currentScreenshotIndex + 1}.png`;
                          }
                      }}
                   />
                </AnimatePresence>

                {/* Out of Battery Screen */}
                <AnimatePresence>
                  {isPhoneOff && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="absolute inset-0 bg-black z-40 flex items-center justify-center"
                    >
                      <div className="flex flex-col items-center gap-2 text-red-500 opacity-60">
                          <BatteryOff size={64} strokeWidth={1.5} />
                          <p className="text-sm font-medium">Out of Battery</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isPhoneOff && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 z-40 pointer-events-none"
                    style={{ 
                      background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.05) 50%, transparent 54%)",
                      x: sheenX,
                      opacity: 1
                    }}
                  />
                )}
                <div className="absolute inset-0 rounded-[2rem] ring-1 ring-white/10 pointer-events-none z-50"></div>
              </div>
            </motion.div>
            
            {/* Carousel Indicator Dots */}
            {!isPhoneOff && (
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2.5">
                {screenshots.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleIndicatorClick(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentScreenshotIndex === index ? 'bg-amber-400 scale-125' : 'bg-gray-600 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to screenshot ${index + 1}`}
                  />
                ))}
              </div>
            )}

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