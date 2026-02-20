import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone } from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative pointer-events-auto"
            >
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-8 mt-2">
                <h3 className="text-2xl font-bold text-white mb-2">Get Stoutly</h3>
                <p className="text-gray-400">Choose your platform to start rating pints.</p>
              </div>

              <div className="space-y-4">
                {/* Android */}
                <a 
                  href="https://play.google.com/store/apps/details?id=uk.co.stoutly.twa" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-start px-6 py-4 bg-gray-800 border border-gray-600 rounded-xl hover:bg-gray-700 hover:border-amber-400 transition-all group w-full"
                >
                  <Smartphone className="w-8 h-8 text-green-500 mr-4 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Get it on</div>
                    <div className="text-lg font-bold text-white">Google Play</div>
                  </div>
                </a>

                {/* iOS */}
                <a
                  href="https://apps.apple.com/in/app/stoutly/id6758011319"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-start px-6 py-4 bg-gray-800 border border-gray-600 rounded-xl hover:bg-gray-700 hover:border-amber-400 transition-all group w-full"
                >
                  <Smartphone className="w-8 h-8 text-blue-400 mr-4 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Download on the</div>
                    <div className="text-lg font-bold text-white">App Store</div>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};