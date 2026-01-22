import React from 'react';
import { Logo } from './Logo';
import { Instagram, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <span className="text-xl font-bold text-white">Stoutly</span>
          </div>
          
          {/* Links & Socials */}
          <div className="flex items-center flex-wrap justify-center gap-x-6 gap-y-4">
            <a href="#" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">Privacy</a>
            <a href="#" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">Terms</a>
            <a href="mailto:hello@stoutly.co.uk" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">Contact</a>
            
            <div className="w-px h-5 bg-gray-700 hidden sm:block"></div> {/* Separator */}

            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/stoutlyapp/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-amber-400 transition-colors"
                aria-label="Stoutly on Instagram"
              >
                <Instagram size={22} />
              </a>
              <a 
                href="https://www.facebook.com/people/Stoutly-App/61578687216972/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-amber-400 transition-colors"
                aria-label="Stoutly on Facebook"
              >
                <Facebook size={22} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Stoutly. All rights reserved.</p>
          <p className="mt-2 text-xs">Drink responsibly. Sláinte.</p>
        </div>
      </div>
    </footer>
  );
};