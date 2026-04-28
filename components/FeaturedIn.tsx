import React from 'react';

const logos = [
  { src: '/feature-logos/logo1.png', alt: 'LadBible Ireland' },
  { src: '/feature-logos/logo2.png', alt: 'The Times Ireland' },
  { src: '/feature-logos/logo3.png', alt: 'JoeIE' },
  { src: '/feature-logos/logo4.png', alt: 'Derry Journal' },
  { src: '/feature-logos/logo5.png', alt: 'Coleraine Times' },
  { src: '/feature-logos/logo6.png', alt: 'LovinIreland' },
  { src: '/feature-logos/logo7.png', alt: 'Northern Ireland World' },
  { src: '/feature-logos/logo8.png', alt: 'Belfast Telegraph'},
];

export const FeaturedIn: React.FC = () => {
  return (
    <div className="bg-gray-900 py-10 border-b border-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
            Featured In
          </p>
        </div>
        <div className="relative w-full overflow-hidden group mx-auto">
          {/* Gradient masks for smooth fade on edges */}
          <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none"></div>

          <div className="flex w-max animate-scroll group-hover:[animation-play-state:paused] flex-shrink-0">
            {/* First set of logos */}
            <div className="flex items-center gap-12 md:gap-20 pr-12 md:pr-20">
              {logos.map((logo, index) => (
                <img
                  key={`set1-${index}`}
                  src={logo.src}
                  alt={logo.alt}
                  className="h-8 md:h-10 w-auto object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
              ))}
            </div>
            {/* Second identical set of logos for seamless looping */}
            <div className="flex items-center gap-12 md:gap-20 pr-12 md:pr-20" aria-hidden="true">
              {logos.map((logo, index) => (
                <img
                  key={`set2-${index}`}
                  src={logo.src}
                  alt={logo.alt}
                  className="h-8 md:h-10 w-auto object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
