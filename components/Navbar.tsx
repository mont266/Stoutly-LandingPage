import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo';
import { Menu, X, ChevronDown, Globe, Smartphone } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Download', href: '#download' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-800' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <Logo className="w-10 h-10" />
            <span className="text-2xl font-bold tracking-tight text-white">
              Stoutly
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-300 hover:text-amber-400 transition-colors px-3 py-2 rounded-md text-sm font-medium"
                >
                  {link.label}
                </a>
              ))}
              
              {/* Dropdown CTA */}
              <div className="relative inline-block text-left" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="group bg-amber-400 text-gray-900 hover:bg-amber-300 px-4 py-2 rounded-full font-bold transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  Get Stoutly
                  <ChevronDown size={18} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-gray-900 border border-gray-700 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <div className="py-1">
                      <a href="https://app.stoutly.co.uk" className="group flex items-center px-4 py-3 text-sm hover:bg-gray-800 transition-colors">
                        <div className="bg-amber-400/10 group-hover:bg-amber-400/20 p-2 rounded-lg mr-3 transition-colors">
                           <Globe size={20} className="text-amber-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-white">Web App</span>
                          <span className="text-xs text-gray-400">Launch in browser</span>
                        </div>
                      </a>
                      
                      <a href="https://play.google.com/store/apps/details?id=uk.co.stoutly.twa" className="group flex items-center px-4 py-3 text-sm hover:bg-gray-800 transition-colors">
                         <div className="bg-green-500/10 group-hover:bg-green-500/20 p-2 rounded-lg mr-3 transition-colors">
                           <Smartphone size={20} className="text-green-500" />
                         </div>
                         <div className="flex flex-col">
                           <span className="font-bold text-white">Android</span>
                           <span className="text-xs text-gray-400">Google Play Store</span>
                         </div>
                      </a>

                      <a href="https://apps.apple.com/in/app/stoutly/id6758011319" className="group flex items-center px-4 py-3 text-sm hover:bg-gray-800 transition-colors">
                         <div className="bg-blue-500/10 group-hover:bg-blue-500/20 p-2 rounded-lg mr-3 transition-colors">
                           <Smartphone size={20} className="text-blue-400" />
                         </div>
                         <div className="flex flex-col">
                           <span className="font-bold text-white">iOS</span>
                           <span className="text-xs text-gray-400">App Store</span>
                         </div>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-b border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-amber-400 block px-3 py-2 rounded-md text-base font-medium"
              >
                {link.label}
              </a>
            ))}
             
             {/* Mobile CTA Area */}
             <div className="mt-4 pt-4 border-t border-gray-800 space-y-2">
                <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Get Stoutly</div>
                <a
                  href="https://app.stoutly.co.uk"
                  className="flex items-center px-3 py-3 rounded-md text-base font-medium text-white bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                   <Globe size={18} className="text-amber-400 mr-3" />
                   Web App
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=uk.co.stoutly.twa"
                  className="flex items-center px-3 py-3 rounded-md text-base font-medium text-white bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                   <Smartphone size={18} className="text-green-500 mr-3" />
                   Android App
                </a>
                 <a
                  href="https://apps.apple.com/in/app/stoutly/id6758011319"
                  className="flex items-center px-3 py-3 rounded-md text-base font-medium text-white bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                   <Smartphone size={18} className="text-blue-400 mr-3" />
                   iOS App
                </a>
             </div>
          </div>
        </div>
      )}
    </nav>
  );
};