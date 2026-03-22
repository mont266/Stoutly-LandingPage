import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedIn } from './components/FeaturedIn';
import { Features } from './components/Features';
import { DownloadSection } from './components/DownloadSection';
import { Footer } from './components/Footer';
import { PressKit } from './components/PressKit';
import { PublicMap } from './components/PublicMap';

const Home = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <FeaturedIn />
      <Features />
      <DownloadSection />
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white selection:bg-amber-400 selection:text-black">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/press" element={<><Navbar /><main><PressKit /></main><Footer /></>} />
          <Route path="/map/:username" element={<PublicMap />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
