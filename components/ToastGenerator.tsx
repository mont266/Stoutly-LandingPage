import React, { useState } from 'react';
import { generateToast } from '../services/geminiService';
import { Sparkles, RefreshCw, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ToastGenerator: React.FC = () => {
  const [occasion, setOccasion] = useState('');
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!occasion.trim()) return;

    setLoading(true);
    const result = await generateToast(occasion);
    setToast(result);
    setLoading(false);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(toast);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="toast-master" className="py-24 bg-gray-900 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Background flourish */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl"></div>

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-2 bg-amber-400/10 rounded-full mb-4">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-white">Stoutly Toast Master</h2>
            <p className="mt-2 text-gray-400">Powered by AI. Enter an occasion, get a witty Irish toast.</p>
          </div>

          <form onSubmit={handleGenerate} className="max-w-lg mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="E.g., My friend's wedding, Friday night..."
                className="flex-1 bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                disabled={loading || !occasion.trim()}
                className="bg-amber-400 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 min-w-[140px]"
              >
                {loading ? <RefreshCw className="animate-spin w-5 h-5" /> : 'Toast Me'}
              </button>
            </div>
          </form>

          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="max-w-lg mx-auto"
              >
                <div className="bg-black/30 rounded-xl p-6 border border-gray-700 relative group">
                  <p className="text-xl font-serif text-amber-100 italic text-center leading-relaxed">
                    "{toast}"
                  </p>
                  <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-2 text-gray-500 hover:text-amber-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};