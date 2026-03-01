import React from 'react';
import { DownloadCloud, ImageIcon, FileText, Palette, AtSign } from 'lucide-react';
import { Logo } from './Logo';

export const PressKit: React.FC = () => {
  const pressKitZipUrl = 'Stoutly-PressKit.zip'; // Placeholder for the actual zip file URL

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        
        <div className="text-center mb-16">
          <Logo className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-5xl font-extrabold text-white tracking-tight">Press Kit</h1>
          <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to feature Stoutly. For all media inquiries, please contact us at <a href="mailto:admin@stoutly.co.uk" className="text-amber-400 hover:underline">admin@stoutly.co.uk</a>.
          </p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Download Full Press Kit</h2>
          <p className="text-gray-400 mb-6">Contains all assets including logos, screenshots, and app icons in high resolution.</p>
          <a
            href={pressKitZipUrl}
            className="inline-flex items-center justify-center px-8 py-4 bg-amber-400 text-gray-900 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            <DownloadCloud className="w-6 h-6 mr-3" />
            Download .zip (8.34MB)
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <FileText className="w-10 h-10 text-amber-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">About Stoutly</h3>
            <p className="text-gray-400">
              Stoutly is the ultimate <span className='text-amber-400 font-bold'>social hub</span> for the global Guinness community. Designed for those who take their stout seriously, the app allows users to <span className='text-white'>rate, share, and review pints</span> while connecting with a feed of fellow enthusiasts.
              <br />
<br />
At the heart of the app is the <span className='text-amber-400 font-bold'>Stoutly Pub Score</span> - a unique algorithm that balances quality and price with a <span className='text-white'>&quot;confidence score&quot;</span> based on review volume. This ensures users find pubs that offer <span className='text-white'>genuine value</span>, not just hype. Whether you’re searching for the nearest <span className='text-white'>Guinness 0.0</span>, hunting for the <span className='text-white'>cheapest pint</span> in the city, or climbing the ranks whilst earning in-app <span className='text-amber-400'>&quot;trophies,&quot;</span> Stoutly is the definitive map for the modern Guinness lover.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <AtSign className="w-10 h-10 text-amber-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Contact</h3>
            <p className="text-gray-400">
              For press inquiries, interviews, or other media requests, please contact:
              <br />
              <a href="mailto:admin@stoutly.co.uk" className="text-amber-400 font-semibold hover:underline">admin@stoutly.co.uk</a>
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <Palette className="w-10 h-10 text-amber-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Logos & Branding</h3>
            <p className="text-gray-400 mb-4">Please use our official logo. Do not alter, rotate, or change the color of the logo. The full branding guide is available in the downloadable press kit.</p>
            <div className="bg-black p-6 rounded-lg text-center">
              <Logo className="w-24 h-24 mx-auto" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <a href="/favicon.svg" download="Stoutly-Logo.svg" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg text-sm text-center transition-colors">
                Download SVG
              </a>
              <a href="/favicon.svg" download="Stoutly-Logo.png" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg text-sm text-center transition-colors">
                Download PNG
              </a>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <ImageIcon className="w-10 h-10 text-amber-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">App Screenshot</h3>
            <p className="text-gray-400 mb-4">A high-resolution screenshot of the Stoutly app. More screenshots available in the downloadable presskit.</p>
            <img src="/images/app-screenshot.png" alt="Stoutly App Screenshot" className="rounded-lg border-2 border-gray-700" />
          </div>

        </div>

      </div>
    </div>
  );
};
