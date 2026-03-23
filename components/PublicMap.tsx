import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Map, { Marker, NavigationControl, MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '../lib/supabase';
import { X, Star, Map as MapIcon, List as ListIcon, ChevronLeft, Menu } from 'lucide-react';
import { Logo } from './Logo';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

const EUROZONE_COUNTRY_CODES = new Set([
    'at', 'be', 'hr', 'cy', 'ee', 'fi', 'fr', 'de', 'gr', 'ie', 
    'it', 'lv', 'lt', 'lu', 'mt', 'nl', 'pt', 'sk', 'si', 'es'
]);

const CURRENCY_MAP: Record<string, { symbol: string, code: string }> = {
    'us': { symbol: '$', code: 'USD' }, 'ca': { symbol: '$', code: 'CAD' },
    'gb': { symbol: '£', code: 'GBP' }, 'uk': { symbol: '£', code: 'GBP' }, 
    'au': { symbol: '$', code: 'AUD' }, 'nz': { symbol: 'NZ$', code: 'NZD' },
    'jp': { symbol: '¥', code: 'JPY' }, 'cn': { symbol: '¥', code: 'CNY' },
    'sg': { symbol: 'S$', code: 'SGD' }, 'hk': { symbol: 'HK$', code: 'HKD' },
    'ae': { symbol: 'د.إ', code: 'AED' },
    'pl': { symbol: 'zł', code: 'PLN' }, 'ch': { symbol: 'CHF', code: 'CHF' },
    'se': { symbol: 'kr', code: 'SEK' }, 'no': { symbol: 'kr', code: 'NOK' },
    'dk': { symbol: 'kr', code: 'DKK' }, 'is': { symbol: 'kr', code: 'ISK' },
    'cz': { symbol: 'Kč', code: 'CZK' }, 'hu': { symbol: 'Ft', code: 'HUF' },
    'tr': { symbol: '₺', code: 'TRY' }, 'il': { symbol: '₪', code: 'ILS' },
    'za': { symbol: 'R', code: 'ZAR' }, 'ma': { symbol: 'د.م.', code: 'MAD' }, 
    'br': { symbol: 'R$', code: 'BRL' }, 'in': { symbol: '₹', code: 'INR' },
    'mx': { symbol: 'Mex$', code: 'MXN' }, 'ru': { symbol: '₽', code: 'RUB' },
    'kr': { symbol: '₩', code: 'KRW' }, 'th': { symbol: '฿', code: 'THB' },
    'pe': { symbol: 'S/', code: 'PEN' },
};

const COUNTRY_NAME_TO_CODE: Record<string, string> = {
    'ireland': 'ie', 'portugal': 'pt', 'israel': 'il',
    'poland': 'pl', 'united states': 'us', 'italy': 'it',
    'united kingdom': 'gb', 'spain': 'es', 'germany': 'de',
    'france': 'fr', 'australia': 'au', 'canada': 'ca',
    'netherlands': 'nl', 'belgium': 'be', 'sweden': 'se',
    'norway': 'no', 'denmark': 'dk', 'switzerland': 'ch',
    'japan': 'jp', 'singapore': 'sg', 'united arab emirates': 'ae',
    'south africa': 'za', 'turkey': 'tr', 'austria': 'at',
    'czech republic': 'cz', 'peru': 'pe', 'south korea': 'kr',
    'morocco': 'ma',
};

const getCurrencySymbol = (countryStr?: string | null) => {
  if (!countryStr) return '';
  const lowerCountry = countryStr.toLowerCase().trim();
  const code = COUNTRY_NAME_TO_CODE[lowerCountry] || lowerCountry;
  
  if (EUROZONE_COUNTRY_CODES.has(code)) return '€';
  if (CURRENCY_MAP[code]) return CURRENCY_MAP[code].symbol;
  
  return '';
};

const getScoreColor = (score: number) => {
  if (score >= 80) return { hex: '#facc15', text: 'text-yellow-400', bg: 'rgba(250, 204, 21, 0.2)' };
  if (score >= 65) return { hex: '#22c55e', text: 'text-green-500', bg: 'rgba(34, 197, 94, 0.2)' };
  if (score >= 45) return { hex: '#eab308', text: 'text-yellow-500', bg: 'rgba(234, 179, 8, 0.2)' };
  return { hex: '#6b7280', text: 'text-gray-500', bg: 'rgba(107, 114, 128, 0.2)' };
};

const getAvatarUrl = (avatarId: string | null, username: string) => {
  if (!avatarId) return null;
  
  try {
    if (avatarId.startsWith('{')) {
      const parsed = JSON.parse(avatarId);
      if (parsed.type === 'dicebear') {
        const style = parsed.style || 'miniavs';
        const seed = (typeof parsed.seed === 'string' && parsed.seed.trim() !== '') ? parsed.seed.trim() : username;
        return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
      }
    }
  } catch {
    // Ignore JSON parse errors, fallback to returning the string directly
  }
  
  return avatarId;
};

const PubIcon = ({ color = "#F59E0B" }: { color?: string }) => (
  <div className="w-10 h-10 cursor-pointer drop-shadow-lg relative hover:scale-110 transition-transform">
    <svg viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#000" strokeWidth="1"/>
    </svg>
  </div>
);

type Profile = {
  id: string;
  username: string;
  is_map_public: boolean;
  reviews: number;
  level: number;
  avatar_id: string | null;
  bio: string | null;
  is_stoutly_legend: boolean;
  is_developer: boolean;
  is_beta_tester: boolean;
  is_early_bird: boolean;
};

type Rating = {
  id: string;
  pub_id: string;
  quality: number;
  price: number;
  exact_price: number | null;
  message: string | null;
  image_url: string | null;
  is_private: boolean;
  pub_score?: number;
  pubs: {
    name: string;
    lat: number;
    lng: number;
    country_code?: string | null;
    address?: string | null;
  };
};

export const PublicMap: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  
  const mapRef = useRef<MapRef>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: -0.1276,
    latitude: 51.5074,
    zoom: 11
  });

  useEffect(() => {
    if (ratings.length > 0 && mapRef.current) {
      const lats = ratings.map(r => r.pubs.lat);
      const lngs = ratings.map(r => r.pubs.lng);
      
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      
      if (ratings.length === 1) {
        setViewState({
          longitude: lngs[0],
          latitude: lats[0],
          zoom: 14
        });
      } else {
        mapRef.current.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat]
          ],
          { padding: 50, duration: 1000 }
        );
      }
    }
  }, [ratings]);

  // Force map resize when sidebar toggles
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.resize();
      const timeout = setTimeout(() => {
        mapRef.current?.resize();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isSidebarOpen, viewMode]);

  useEffect(() => {
    const fetchData = async () => {
      if (!username) return;
      
      setLoading(true);
      setError(null);
      
      // Clean up username (remove @ if present)
      const cleanUsername = username.replace(/^@/, '');
      
      try {
        // 1. Fetch Profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, is_map_public, reviews, level, avatar_id, bio, is_stoutly_legend, is_developer, is_beta_tester, is_early_bird')
          .eq('username', cleanUsername)
          .single();
          
        if (profileError || !profileData) {
          setError("This user's map is private or doesn't exist.");
          setLoading(false);
          return;
        }
        
        if (!profileData.is_map_public) {
          setError("This user's map is private or doesn't exist.");
          setLoading(false);
          return;
        }
        
        setProfile(profileData);
        
        // 2. Fetch Ratings with Pubs
        const { data: ratingsData, error: ratingsError } = await supabase
          .from('ratings')
          .select(`
            id,
            pub_id,
            quality,
            price,
            exact_price,
            message,
            image_url,
            is_private,
            pubs (
              name,
              lat,
              lng,
              country_code,
              address
            )
          `)
          .eq('user_id', profileData.id)
          .eq('is_private', false);
          
        if (ratingsError) {
          console.error("Error fetching ratings:", ratingsError);
        } else if (ratingsData) {
          // Filter out ratings where pub data might be missing or invalid
          const validRatings = (ratingsData as unknown as Rating[]).filter(
            r => r.pubs && r.pubs.lat && r.pubs.lng
          ) as Rating[];
          
          // 3. Fetch Pub Scores
          const pubIds = validRatings.map(r => r.pub_id);
          if (pubIds.length > 0) {
            const { data: scoresData, error: scoresError } = await supabase
              .from('pub_scores')
              .select('pub_id, pub_score')
              .in('pub_id', pubIds);
              
            if (!scoresError && scoresData) {
              const scoreMap: Record<string, number> = {};
              scoresData.forEach(s => { scoreMap[s.pub_id] = s.pub_score; });
              validRatings.forEach(r => {
                if (scoreMap[r.pub_id] !== undefined) {
                  r.pub_score = scoreMap[r.pub_id];
                }
              });
            }
          }
          
          setRatings(validRatings);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [username]);

  // Update document title for basic SEO
  useEffect(() => {
    if (profile) {
      document.title = `${profile.username}'s Stoutly Map`;
      
      // Update meta tags if possible (client-side only, won't help crawlers much without SSR)
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', `${profile.username}'s Stoutly Map`);
      
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', `Check out my Guinness ratings on Stoutly!`);
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[100dvh] bg-gray-900 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-gray-800 p-8 rounded-2xl max-w-md w-full border border-gray-700 shadow-xl">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {error === "An unexpected error occurred." ? "Oops!" : "Private Map"}
          </h2>
          <p className="text-gray-400 mb-6">{error || "This user's map is private or doesn't exist."}</p>
          <a href="/" className="inline-block bg-amber-400 text-gray-900 font-bold py-3 px-6 rounded-full hover:bg-amber-300 transition-colors">
            Return to Stoutly
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[100dvh] bg-gray-900 overflow-hidden flex flex-col">
      <style>{`
        @media (max-width: 640px) {
          .mapboxgl-ctrl-group {
            transform: scale(0.75);
            transform-origin: top right;
          }
          .mapboxgl-ctrl-top-right {
            top: 110px !important;
          }
        }
      `}</style>
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none flex flex-col">
        {/* See-through Header (Mobile Only) */}
        <div className="sm:hidden w-full bg-gray-900/40 backdrop-blur-md border-b border-gray-800/50 p-2.5 flex justify-center items-center pointer-events-auto">
          <a href="/" className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
            <Logo className="w-5 h-5" />
            <span className="text-base font-bold text-white tracking-tight">Stoutly</span>
          </a>
        </div>

        {/* Gradient Background for User Stats */}
        <div className="bg-gradient-to-b from-gray-900/80 via-gray-900/40 to-transparent p-3 sm:p-4 md:p-6 w-full">
          <div className="w-full px-2 sm:px-4 flex justify-center sm:justify-between items-start">
            {/* Desktop Logo & Toggle */}
            <div className="hidden sm:flex items-center gap-4 pointer-events-auto">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2.5 bg-gray-900/80 hover:bg-gray-800 backdrop-blur-md border border-gray-700 rounded-xl text-gray-400 hover:text-white transition-colors shadow-lg flex items-center justify-center"
                title={isSidebarOpen ? "Hide list" : "Show list"}
              >
                {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
              </button>
              <a href="/" className="flex items-center gap-2">
                <Logo className="w-10 h-10" />
                <span className="text-xl font-bold text-white drop-shadow-md">Stoutly</span>
              </a>
            </div>
            
            {/* User Stats Card and Toggle */}
            <div className="flex flex-col items-center sm:items-end gap-3 pointer-events-auto">
              <div className="bg-gray-900/80 backdrop-blur-md p-1.5 pr-3 sm:p-4 rounded-full sm:rounded-2xl border border-gray-700 flex items-center gap-2 sm:gap-3 shadow-lg max-w-[280px] sm:max-w-sm">
                {getAvatarUrl(profile.avatar_id, profile.username) ? (
                  <img 
                    src={getAvatarUrl(profile.avatar_id, profile.username)!} 
                    alt={profile.username} 
                    className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover border border-amber-400/50" 
                    referrerPolicy="no-referrer" 
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-800 rounded-full flex items-center justify-center text-amber-400 font-bold text-sm sm:text-xl border border-amber-400/50">
                    {profile.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <span className="text-white font-semibold text-xs sm:text-base truncate max-w-[120px] sm:max-w-[160px] leading-none">@{profile.username}</span>
                    {profile.is_stoutly_legend && <span title="Stoutly Legend" className="text-[10px] sm:text-sm leading-none">👑</span>}
                    {profile.is_developer && <span title="Developer" className="text-[10px] sm:text-sm leading-none">💻</span>}
                    {profile.is_beta_tester && <span title="Beta Tester" className="text-[10px] sm:text-sm leading-none">🧪</span>}
                    {profile.is_early_bird && <span title="Early Bird" className="text-[10px] sm:text-sm leading-none">🐦</span>}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-400 mt-0.5 leading-none">
                    <span className="flex items-center gap-0.5 font-medium text-amber-400">
                      <Star size={10} className="fill-amber-400 sm:w-3 sm:h-3" /> 
                      {profile.reviews || 0}
                    </span>
                    <span>•</span>
                    <span>Lvl {profile.level || 1}</span>
                  </div>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex md:hidden bg-gray-900/80 backdrop-blur-md p-1 rounded-full border border-gray-700 shadow-lg">
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-amber-400 text-gray-900' : 'text-gray-400 hover:text-white'}`}
                >
                  <MapIcon size={14} className="sm:w-4 sm:h-4" /> <span>Map</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-amber-400 text-gray-900' : 'text-gray-400 hover:text-white'}`}
                >
                  <ListIcon size={14} className="sm:w-4 sm:h-4" /> <span>List</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex w-full relative overflow-hidden">
        {/* List View Container (Sidebar on Desktop) */}
        <div className={`
          ${viewMode === 'map' ? 'hidden md:flex' : 'flex'} 
          absolute inset-0 md:relative flex-col bg-gray-900 md:border-r border-gray-800 z-10
          pt-[160px] sm:pt-[140px] md:pt-[120px] pb-32 md:pb-0 overflow-y-auto transition-all duration-300 ease-in-out
          w-full md:w-[350px] lg:w-[400px] flex-shrink-0
          ${!isSidebarOpen ? 'md:-ml-[350px] lg:-ml-[400px]' : 'md:ml-0'}
        `}>
          <div className="flex flex-col gap-4 px-4 sm:px-6 md:px-4 pb-6">
            {ratings.map(rating => (
              <div 
                key={rating.id} 
                onClick={() => setSelectedRating(rating)}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-amber-400/50 rounded-2xl p-4 cursor-pointer transition-all hover:bg-gray-800 flex gap-4 items-center shadow-sm hover:shadow-md"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-900 rounded-xl flex-shrink-0 overflow-hidden border border-gray-700">
                  {rating.image_url ? (
                    <img src={rating.image_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <PubIcon color="#4B5563" />
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className="text-white font-bold truncate text-sm sm:text-base">{rating.pubs.name}</h4>
                  <p className="text-gray-400 text-xs truncate mb-2">{rating.pubs.address || 'No address provided'}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium text-white">{rating.quality}/5</span>
                    </div>
                    {rating.pub_score !== undefined && (
                      <div className="flex items-center gap-1.5">
                        <div 
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold" 
                          style={{ backgroundColor: getScoreColor(rating.pub_score).bg, color: getScoreColor(rating.pub_score).hex, border: `1px solid ${getScoreColor(rating.pub_score).hex}` }}
                        >
                          {rating.pub_score}
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Score</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {ratings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No ratings found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Map Container */}
        <div className={`
          ${viewMode === 'list' ? 'hidden md:block' : 'block'} 
          flex-1 relative bg-gray-800 transition-all duration-300
        `}>
          {!MAPBOX_TOKEN ? (
            <div className="absolute inset-0 flex items-center justify-center text-center p-4">
              <div>
                <p className="text-amber-400 font-bold mb-2">Mapbox Token Missing</p>
                <p className="text-gray-400 text-sm">Please provide VITE_MAPBOX_ACCESS_TOKEN in your environment variables.</p>
              </div>
            </div>
          ) : (
            <Map
              ref={mapRef}
              {...viewState}
              onMove={evt => setViewState(evt.viewState)}
              mapStyle="mapbox://styles/mapbox/dark-v11"
              mapboxAccessToken={MAPBOX_TOKEN}
              style={{ width: '100%', height: '100%' }}
            >
              <NavigationControl position="top-right" />
              
              {ratings.map((rating) => (
                <Marker
                  key={rating.id}
                  longitude={rating.pubs.lng}
                  latitude={rating.pubs.lat}
                  anchor="bottom"
                  onClick={e => {
                    e.originalEvent.stopPropagation();
                    setSelectedRating(rating);
                  }}
                >
                  <PubIcon />
                </Marker>
              ))}
            </Map>
          )}
        </div>
      </div>

      {/* Interactive Card (Bottom Sheet / Sidebar) */}
      {selectedRating && (
        <div className={`absolute bottom-0 left-0 right-0 md:bottom-auto md:top-24 md:right-auto md:w-96 z-30 animate-in slide-in-from-bottom md:slide-in-from-left transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:left-[374px] lg:left-[424px]' : 'md:left-6'}`}>
          <div className="bg-gray-900 border-t md:border border-gray-700 rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] md:max-h-[calc(100vh-8rem)]">
            
            {/* Header with Close Button */}
            <div className="flex justify-between items-start p-4 border-b border-gray-800 sticky top-0 bg-gray-900/95 backdrop-blur z-10">
              <div className="flex-1 pr-4 flex flex-col gap-1.5">
                <h3 className="text-lg font-bold text-white leading-tight">{selectedRating.pubs.name}</h3>
                {selectedRating.pubs.address && (
                  <p className="text-xs text-gray-400 leading-tight">{selectedRating.pubs.address}</p>
                )}
                {selectedRating.pub_score !== undefined && (() => {
                  const scoreColor = getScoreColor(selectedRating.pub_score);
                  return (
                    <div className="flex items-center gap-2">
                      <div className="relative flex items-center justify-center w-8 h-8 flex-shrink-0 bg-gray-800 rounded-full shadow-inner" title="Stoutly Pub Score">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
                          <circle cx="20" cy="20" r="16" fill="transparent" stroke={scoreColor.bg} strokeWidth="3" />
                          <circle 
                            cx="20" 
                            cy="20" 
                            r="16" 
                            fill="transparent" 
                            stroke={scoreColor.hex} 
                            strokeWidth="3" 
                            strokeDasharray="100.53" 
                            strokeDashoffset={100.53 - ((selectedRating.pub_score / 100) * 100.53)} 
                            strokeLinecap="round" 
                          />
                        </svg>
                        <span className={`absolute text-[10px] font-bold ${scoreColor.text}`}>{selectedRating.pub_score}</span>
                      </div>
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Stoutly Pub Score</span>
                    </div>
                  );
                })()}
              </div>
              <button 
                onClick={() => setSelectedRating(null)}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors flex-shrink-0 mt-1"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Content Scrollable Area */}
            <div className="overflow-y-auto p-4 flex-1">
              {/* Rating Stars */}
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm w-16">Quality:</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={`quality-${i}`} 
                        size={16} 
                        className={i < Math.floor(selectedRating.quality || 0) ? "fill-amber-400 text-amber-400" : "text-gray-600"} 
                      />
                    ))}
                    <span className="ml-1 font-bold text-white text-sm">{Number(selectedRating.quality || 0).toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm w-16">Value:</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={`price-${i}`} 
                        size={16} 
                        className={i < Math.floor(selectedRating.price || 0) ? "fill-amber-400 text-amber-400" : "text-gray-600"} 
                      />
                    ))}
                    <span className="ml-1 font-bold text-white text-sm">{Number(selectedRating.price || 0).toFixed(1)}</span>
                  </div>
                </div>
                {selectedRating.exact_price && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-400 text-sm w-16">Price:</span>
                    <span className="font-medium text-amber-400 text-sm">
                      {getCurrencySymbol(selectedRating.pubs.country_code)}{selectedRating.exact_price.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Photo */}
              {selectedRating.image_url && (
                <div className="w-full h-32 sm:h-48 rounded-xl overflow-hidden mb-4 bg-gray-800 flex items-center justify-center">
                  <img 
                    src={selectedRating.image_url} 
                    alt={`Pint at ${selectedRating.pubs.name}`} 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              
              {/* Review Text */}
              {selectedRating.message ? (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Review</h4>
                  <p className="text-gray-300 text-sm leading-relaxed italic">&quot;{selectedRating.message}&quot;</p>
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic mb-4">No written review provided.</p>
              )}
            </div>
            
            {/* Sticky CTA */}
            <div className="p-3 sm:p-4 border-t border-gray-800 bg-gray-900 sticky bottom-0">
              <a 
                href="/" 
                className="block w-full bg-amber-400 text-gray-900 text-center font-bold py-2.5 sm:py-3 px-4 rounded-xl hover:bg-amber-300 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)] text-sm sm:text-base"
              >
                Rate your own pints on Stoutly
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* Global Mobile CTA (when no card is selected) */}
      {!selectedRating && (
        <div className="absolute bottom-4 sm:bottom-6 left-4 right-4 sm:left-6 sm:right-6 md:left-auto md:w-80 z-10">
          <a 
            href="/" 
            className="block w-full bg-amber-400 text-gray-900 text-center font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl hover:bg-amber-300 transition-transform hover:scale-105 shadow-[0_10px_25px_rgba(245,158,11,0.4)] text-sm sm:text-base"
          >
            Download Stoutly
          </a>
        </div>
      )}
    </div>
  );
};
