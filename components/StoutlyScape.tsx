import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { X, Star, Image as ImageIcon } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

// OSRS Pub Locations mapped to the full HD Map percentages
const OSRS_PUBS = [
  { id: 'blue-moon', name: 'Blue Moon Inn', location: 'Varrock', x: 71, y: 43, desc: 'Famous for its Uncle Harry\'s Beer.' },
  { id: 'jolly-boar', name: 'Jolly Boar Inn', location: 'North of Varrock', x: 72.8, y: 36.5, desc: 'Popular with PKers before heading into the wildy.' },
  { id: 'rising-sun', name: 'Rising Sun Inn', location: 'Falador', x: 60.5, y: 45, desc: 'Home of the Asgarnian Ale.' },
  { id: 'rusty-anchor', name: 'Rusty Anchor Inn', location: 'Port Sarim', x: 61, y: 51, desc: 'Filled with sailors and sea shanties.' },
  { id: 'karamja-spirits', name: 'Karamja Spirits Bar', location: 'Musa Point', x: 58, y: 57, desc: 'Best Karamjan Rum on the island.' },
  { id: 'dragon-inn', name: 'Dragon Inn', location: 'Yanille', x: 49.5, y: 54, desc: 'A quiet place for wizards.' },
  { id: 'flying-horse', name: 'Flying Horse Inn', location: 'Ardougne', x: 50, y: 47, desc: 'The most popular pub in East Ardougne.' }
];

type OSRSRating = {
  id: string;
  pub_id: string;
  rater_name: string;
  drink_name?: string;
  quality: number;
  price_gp: number;
  image_url: string | null;
  created_at: string;
};

export const StoutlyScape: React.FC = () => {
  const [selectedPub, setSelectedPub] = useState<typeof OSRS_PUBS[0] | null>(null);
  const [pubRatings, setPubRatings] = useState<OSRSRating[]>([]);
  const [ratedPubIds, setRatedPubIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [showRateForm, setShowRateForm] = useState(false);

  // Form State
  const [raterName, setRaterName] = useState('');
  const [drinkName, setDrinkName] = useState('');
  const [quality, setQuality] = useState(3);
  const [priceGp, setPriceGp] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRatings = async (pubId: string) => {
    setLoading(true);
    try {
      // NOTE: This requires the osrs_ratings table to exist in Supabase!
      const { data, error } = await supabase
        .from('osrs_ratings')
        .select('*')
        .eq('pub_id', pubId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPubRatings(data);
      } else {
        setPubRatings([]);
      }
    } catch {
      setPubRatings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRatedPubs = async () => {
      try {
        const { data } = await supabase.from('osrs_ratings').select('pub_id');
        if (data) {
          setRatedPubIds(new Set(data.map(r => r.pub_id)));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRatedPubs();
  }, []);

  useEffect(() => {
    if (selectedPub) {
      fetchRatings(selectedPub.id);
      setShowRateForm(false);
    }
  }, [selectedPub]);

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPub || !raterName || !priceGp) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('osrs_ratings')
        .insert({
          pub_id: selectedPub.id,
          rater_name: raterName,
          drink_name: drinkName,
          quality,
          price_gp: typeof priceGp === 'number' ? priceGp : parseInt(priceGp),
          // image_url would go here fully implemented
        });

      if (!error) {
        setShowRateForm(false);
        fetchRatings(selectedPub.id);
        setRatedPubIds(prev => new Set(prev).add(selectedPub.id));
        setRaterName('');
        setDrinkName('');
        setQuality(3);
        setPriceGp('');
      } else {
        alert("Make sure you run the SQL commands in Supabase first!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pubScore = React.useMemo(() => {
    if (pubRatings.length === 0) return null;
    
    const avgQuality = pubRatings.reduce((sum, r) => sum + r.quality, 0) / pubRatings.length;
    const avgPrice = pubRatings.reduce((sum, r) => sum + r.price_gp, 0) / pubRatings.length;
    
    const qualityScore = (avgQuality / 5) * 100;
    // Assume 10+ gp is 0 score, 0 gp is 100 score for price mapping
    const priceScore = Math.max(0, 100 - (avgPrice / 10) * 100);
    
    const rawScore = (0.7 * qualityScore) + (0.3 * priceScore);
    
    // Bayesian average: pull towards 50 if low number of ratings.
    const finalScore = Math.round(((rawScore * pubRatings.length) + (50 * 3)) / (pubRatings.length + 3));
    return finalScore;
  }, [pubRatings]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col font-mono text-gray-200">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center">
        {/* Header */}
        <div className="w-full bg-[#3e3529] border-b-4 border-[#2b241c] py-8 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-500 mb-2 drop-shadow-md" style={{ fontFamily: '"Press Start 2P", cursive, monospace'}}>
            StoutlyScape
          </h1>
          <p className="text-[#c6b696] max-w-2xl mx-auto">
            Rate pints across Gielinor. No sign-up required. Just drop your OSRS character name and let us know where the best pixelated pints are.
          </p>
        </div>

        {/* Map Container */}
        <div className="w-full max-w-6xl mx-auto p-4 flex-1 flex flex-col md:flex-row gap-6">
          
          {/* Map Area */}
          <div className="flex-1 bg-[#1a1c23] cursor-grab active:cursor-grabbing rounded-xl border-4 border-[#3e3529] relative overflow-hidden h-[500px] md:h-[700px] shadow-2xl">
            <TransformWrapper
              initialScale={2}
              minScale={0.2}
              maxScale={10}
              centerOnInit
            >
              <TransformComponent wrapperClass="w-full h-full" contentClass="w-full h-full flex items-center justify-center bg-[#2d3748]">
                <div className="relative max-w-none" style={{ width: '2000px' }}>
                  <img 
                    src="https://oldschool.runescape.wiki/images/World_map.png"
                    alt="OSRS Map"
                    className="w-full block"
                    style={{ minHeight: '100px' }}
                  />

                  {/* Pins */}
                  {OSRS_PUBS.map(pub => (
                    <div 
                      key={pub.id}
                      onClick={(e) => { e.stopPropagation(); setSelectedPub(pub); }}
                      className="absolute w-10 h-10 -ml-5 -mt-10 cursor-pointer drop-shadow-lg transform hover:scale-110 transition-transform z-10 group"
                      style={{ left: `${pub.x}%`, top: `${pub.y}%` }}
                    >
                      <svg className="w-full h-full" viewBox="0 0 24 24">
                        <path 
                          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                          fill={selectedPub?.id === pub.id ? '#D97706' : ratedPubIds.has(pub.id) ? '#F59E0B' : '#9CA3AF'}
                          stroke="#000"
                          strokeWidth="1"
                        />
                      </svg>
                      
                      {/* Tooltip */}
                      <span className="absolute top-10 left-1/2 -translate-x-1/2 bg-black/90 text-amber-400 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none border border-amber-900 z-20">
                        {pub.name}
                      </span>
                    </div>
                  ))}
                </div>
              </TransformComponent>
            </TransformWrapper>
          </div>

          {/* Sidebar / Modal details */}
          {selectedPub && (
            <div className="w-full md:w-96 bg-[#2a241b] rounded-xl border-4 border-[#3e3529] p-4 flex flex-col shadow-2xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-amber-500">{selectedPub.name}</h2>
                  <p className="text-[#a89f91] text-sm">{selectedPub.location}</p>
                </div>
                <button onClick={() => setSelectedPub(null)} className="text-gray-400 hover:text-white bg-[#1a1610] p-1 rounded">
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm text-gray-300 mb-4 pb-4 border-b border-[#3e3529] italic">
                &quot;{selectedPub.desc}&quot;
              </p>

              {pubScore !== null && !showRateForm && (
                <div className="flex items-center justify-between bg-[#1a1610] p-3 rounded-lg border border-[#3e3529] mb-4">
                  <span className="text-gray-400 font-bold uppercase text-xs tracking-wider">Overall Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-amber-500 text-gray-900">
                      {pubScore}
                    </div>
                  </div>
                </div>
              )}

              {showRateForm ? (
                <form onSubmit={handleSubmitRating} className="flex flex-col gap-4">
                  <h3 className="text-amber-400 font-bold mb-2">Submit a Review</h3>
                  
                  <div>
                    <label className="block text-xs text-[#a89f91] mb-1">Character Name</label>
                    <input 
                      required
                      type="text" 
                      value={raterName}
                      onChange={e => setRaterName(e.target.value)}
                      placeholder="e.g. Zezima" 
                      className="w-full bg-[#1a1610] border border-[#3e3529] rounded p-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#a89f91] mb-1">Drink Name</label>
                    <input 
                      required
                      type="text" 
                      value={drinkName}
                      onChange={e => setDrinkName(e.target.value)}
                      placeholder="e.g. Asgarnian Ale" 
                      className="w-full bg-[#1a1610] border border-[#3e3529] rounded p-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#a89f91] mb-1">Price (gp)</label>
                    <input 
                      required
                      type="number" 
                      value={priceGp}
                      onChange={e => setPriceGp(e.target.value ? Number(e.target.value) : '')}
                      placeholder="2" 
                      className="w-full bg-[#1a1610] border border-[#3e3529] rounded p-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#a89f91] mb-1">Quality ({quality}/5)</label>
                    <input 
                      type="range" 
                      min="0" max="5" step="1"
                      value={quality}
                      onChange={e => setQuality(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  <div className="bg-[#1a1610] border border-dashed border-[#3e3529] rounded p-4 text-center cursor-not-allowed opacity-50 relative group">
                    <ImageIcon className="mx-auto mb-2 text-gray-500" />
                    <span className="text-xs text-gray-500">Screenshot Upload (Requires Supabase Storage Setup)</span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button type="button" onClick={() => setShowRateForm(false)} className="flex-1 bg-transparent border border-[#3e3529] text-gray-300 py-2 rounded hover:bg-[#3e3529]">
                      Cancel
                    </button>
                    <button disabled={isSubmitting} type="submit" className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 rounded">
                      {isSubmitting ? 'Posting...' : 'Post Rating'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex-1 flex flex-col min-h-0">
                  <button 
                    onClick={() => setShowRateForm(true)}
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-lg mb-4 shadow-lg transition-colors"
                  >
                    Rate this Pub
                  </button>

                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                    {loading ? (
                      <p className="text-center text-gray-500 py-4">Checking for ratings...</p>
                    ) : pubRatings.length > 0 ? (
                      pubRatings.map(rating => (
                        <div key={rating.id} className="bg-[#1a1610] p-3 rounded border border-[#3e3529]">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <span className="font-bold text-amber-500">{rating.rater_name}</span>
                              {rating.drink_name && <span className="ml-2 text-xs text-[#a89f91] font-normal italic">{rating.drink_name}</span>}
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(rating.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-300">
                            <span className="flex items-center gap-1">
                              <Star size={14} className="text-amber-400 fill-amber-400" /> {rating.quality}/5
                            </span>
                            <span className="text-yellow-600 font-bold">{rating.price_gp} gp</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-[#a89f91] mb-2">No ratings yet.</p>
                        <p className="text-xs text-gray-500">Be the first to rate your pint here!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Real App Promo */}
        <div className="w-full bg-amber-400 text-gray-900 text-center py-6 px-4 mt-8">
          <p className="font-bold text-xl mb-2">Enjoying the pixel pints?</p>
          <p className="mb-4">Download Stoutly to rate real-world pints of Guinness!</p>
          <a href="/" className="inline-block bg-gray-900 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition-colors">
            Get the Real App
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
};
