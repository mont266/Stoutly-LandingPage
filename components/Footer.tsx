import React from 'react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Logo className="w-8 h-8" />
            <span className="text-xl font-bold text-white">Stoutly</span>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Terms</a>
            <a href="mailto:hello@stoutly.co.uk" className="text-gray-400 hover:text-amber-400 transition-colors">Contact</a>
          </div>
        </div>
        <div className="mt-8 text-center md:text-left text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Stoutly. All rights reserved.</p>
          <p className="mt-2 text-xs">Drink responsibly. Sláinte.</p>
        </div>
      </div>
    </footer>
  );
};