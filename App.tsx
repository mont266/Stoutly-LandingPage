import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { DownloadSection } from './components/DownloadSection';
import { Footer } from './components/Footer';
import { PressKit } from './components/PressKit';

const Home = () => (
  <>
    <Hero />
    <Features />
    <DownloadSection />
  </>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white selection:bg-amber-400 selection:text-black">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/press" element={<PressKit />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
