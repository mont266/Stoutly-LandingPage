import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { DownloadSection } from './components/DownloadSection';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white selection:bg-amber-400 selection:text-black">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <DownloadSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;