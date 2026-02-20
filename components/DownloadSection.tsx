import React from 'react';
import { Smartphone, Globe } from 'lucide-react';

export const DownloadSection: React.FC = () => {
  return (
    <div id="download" className="bg-gray-800 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-3xl p-8 md:p-16 text-center border border-gray-700 relative overflow-hidden">
          
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-6 relative z-10">
            Start Your Stout Journey
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 relative z-10">
            Join thousands of others in the quest for the perfect pint. Available now on iOS, Android and Web.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            
            {/* Android */}
            <a 
              href="https://play.google.com/store/apps/details?id=uk.co.stoutly.twa" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-6 py-4 bg-gray-800 border border-gray-600 rounded-xl hover:bg-gray-700 hover:border-amber-400 transition-all group"
            >
              <Smartphone className="w-8 h-8 text-green-500 mr-3 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-xs text-gray-400">Get it on</div>
                <div className="text-lg font-bold text-white">Google Play</div>
              </div>
            </a>

            {/* Web */}
            <a 
              href="https://app.stoutly.co.uk" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-6 py-4 bg-gray-800 border border-gray-600 rounded-xl hover:bg-gray-700 hover:border-amber-400 transition-all group"
            >
              <Globe className="w-8 h-8 text-amber-400 mr-3 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-xs text-gray-400">Use in browser</div>
                <div className="text-lg font-bold text-white">Web App</div>
              </div>
            </a>

            {/* iOS */}
            <a 
              href="https://apps.apple.com/in/app/stoutly/id6758011319" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-6 py-4 bg-gray-800 border border-gray-600 rounded-xl hover:bg-gray-700 hover:border-amber-400 transition-all group"
            >
              <Smartphone className="w-8 h-8 text-blue-400 mr-3 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-xs text-gray-400">Download on the</div>
                <div className="text-lg font-bold text-white">App Store</div>
              </div>
            </a>
          </div>
          
          {/* Decorative Circle */}
           <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-amber-400 rounded-full opacity-5 blur-3xl pointer-events-none"></div>

        </div>
      </div>
    </div>
  );
};