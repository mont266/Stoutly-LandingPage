import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { BarChart3, Map, Calendar, Beer, TrendingUp, TrendingDown, PoundSterling, Euro, Trophy, ArrowDownToLine, ArrowUpFromLine, CreditCard, Activity, Camera, X, ChevronLeft, ChevronRight, Info, Tag, Shield } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { belfastData, niData, londonData, dublinData, ukData, roiData, derryData } from '../data/reportData';
import { Logo } from './Logo';

type LocationType = 'United Kingdom' | 'Northern Ireland' | 'Republic of Ireland';

const regionCities: Record<LocationType, string[]> = {
  'United Kingdom': ['All of UK', 'London'],
  'Northern Ireland': ['All of NI', 'Belfast', 'Derry/Londonderry'],
  'Republic of Ireland': ['All of ROI', 'Dublin'],
};

const getDisplayName = (city: string) => {
  if (city === 'All of NI') return 'Northern Ireland';
  if (city === 'All of ROI') return 'Republic of Ireland';
  if (city === 'All of UK') return 'United Kingdom';
  return city;
};

const ScoreMeter = ({ score, size = 100, strokeWidth = 8 }: { score: number, size?: number, strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getColor = (s: number) => {
    if (s >= 80) return '#f59e0b'; // amber-500
    if (s >= 65) return '#22c55e'; // green-500
    if (s >= 45) return '#eab308'; // yellow-500
    return '#6b7280'; // gray-500
  };

  const color = getColor(score);

  return (
    <div className="relative flex items-center justify-center mb-3" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 absolute" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(107, 114, 128, 0.3)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute text-4xl font-bold text-white">
        {Math.round(score)}
      </div>
    </div>
  );
};

const PubScoreModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
    <div className="bg-[#1e2330] rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-gray-700">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
        <X size={24} />
      </button>
      <h3 className="text-2xl font-bold text-white mb-4 text-center">What is Pub Score?</h3>
      <p className="text-gray-400 text-sm mb-6 text-center">
        The Pub Score is a single, reliable metric out of 100 that helps you judge a pub&apos;s overall quality at a glance. It&apos;s calculated by combining three key factors:
      </p>

      <div className="space-y-4">
        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 flex gap-4">
          <div className="text-amber-500 mt-1"><Beer size={24} /></div>
          <div>
            <h4 className="text-white font-bold text-sm mb-1">Pint Quality (70% weight)</h4>
            <p className="text-gray-400 text-xs leading-relaxed">The average of all user quality ratings. A great-tasting pint is the most important factor.</p>
          </div>
        </div>
        
        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 flex gap-4">
          <div className="text-emerald-500 mt-1"><Tag size={24} /></div>
          <div>
            <h4 className="text-white font-bold text-sm mb-1">Pint Price (30% weight)</h4>
            <p className="text-gray-400 text-xs leading-relaxed">The average of all user price ratings. A cheaper pint means a better value score.</p>
          </div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 flex gap-4">
          <div className="text-blue-500 mt-1"><Shield size={24} /></div>
          <div>
            <h4 className="text-white font-bold text-sm mb-1">Confidence (Multiplier)</h4>
            <p className="text-gray-400 text-xs leading-relaxed">This rewards pubs with more ratings. A pub with 50 great ratings is a more reliable choice than one with a single perfect rating.</p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-900 rounded-lg p-3 text-center border border-gray-800">
        <code className="text-gray-300 text-xs sm:text-sm font-mono">(Quality + Price) × Confidence = Pub Score</code>
      </div>

      <button onClick={onClose} className="w-full mt-6 bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-3 rounded-lg transition-colors">
        Got it!
      </button>
    </div>
  </div>
);

export const StoutlyReport: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialYear = searchParams.get('year') || null;
  const initialLocation = searchParams.get('region') as LocationType | null;
  const initialCity = searchParams.get('city') || null;

  const [selectedYear, setSelectedYear] = useState<string | null>(initialYear);
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(initialLocation);
  const [selectedCity, setSelectedCity] = useState<string | null>(initialCity);
  const [showInfographic, setShowInfographic] = useState(false);
  const [infographicPage, setInfographicPage] = useState<1 | 2>(1);
  const [showScoreModal, setShowScoreModal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedYear) params.set('year', selectedYear);
    if (selectedLocation) params.set('region', selectedLocation);
    if (selectedCity) params.set('city', selectedCity);
    setSearchParams(params, { replace: true });
  }, [selectedYear, selectedLocation, selectedCity, setSearchParams]);

  const years = ['2025/2026'];
  const locations: LocationType[] = ['United Kingdom', 'Northern Ireland', 'Republic of Ireland'];

  // Map selected city to data
  const getCurrentData = () => {
    if (selectedCity === 'Belfast') return belfastData;
    if (selectedCity === 'Derry/Londonderry') return derryData;
    if (selectedCity === 'All of NI') return niData;
    if (selectedCity === 'London') return londonData;
    if (selectedCity === 'Dublin') return dublinData;
    if (selectedCity === 'All of UK') return ukData;
    if (selectedCity === 'All of ROI') return roiData;
    return null;
  };

  const currentData = getCurrentData();

  const comparisons: {label: string, data: typeof belfastData}[] = [];
  if (selectedCity === 'Belfast' || selectedCity === 'Derry/Londonderry') {
    comparisons.push({ label: 'Northern Ireland', data: niData });
    comparisons.push({ label: 'ROI', data: roiData });
    comparisons.push({ label: 'UK', data: ukData });
  } else if (selectedCity === 'All of NI') {
    comparisons.push({ label: 'ROI', data: roiData });
    comparisons.push({ label: 'UK', data: ukData });
  } else if (selectedCity === 'London') {
    comparisons.push({ label: 'Rest of UK', data: ukData });
  } else if (selectedCity === 'Dublin') {
    comparisons.push({ label: 'ROI', data: roiData });
    comparisons.push({ label: 'UK', data: ukData });
  } else if (selectedCity === 'All of ROI') {
    comparisons.push({ label: 'Northern Ireland', data: niData });
    comparisons.push({ label: 'UK', data: ukData });
  } else if (selectedCity === 'All of UK') {
    comparisons.push({ label: 'ROI', data: roiData });
  }

  const renderDiff = (current: number, comp: number, isPrice: boolean, currCurrency: string, compCurrency: string, isInfographic: boolean = false) => {
    let diff = current - comp;
    if (isPrice && currCurrency !== compCurrency) {
      // Currency conversion locked as of 23rd July 2026 to prevent fluctuation
      const GBP_TO_EUR_RATE = 1.189;
      const compInCurr = compCurrency === '€' && currCurrency === '£' 
        ? comp / GBP_TO_EUR_RATE 
        : compCurrency === '£' && currCurrency === '€' 
          ? comp * GBP_TO_EUR_RATE 
          : comp;
      diff = current - compInCurr;
    }
    const textSize = isInfographic ? "text-[8px] px-1 py-0.5" : "text-xs px-2 py-1";
    if (Math.abs(diff) < 0.01) return <span className={`font-bold text-gray-500 bg-gray-900 rounded ${textSize} min-w-[32px] inline-block text-center`}>Even</span>;
    const isPositive = diff > 0;
    const isBetter = isPrice ? !isPositive : isPositive;
    const color = isBetter ? 'text-emerald-500' : 'text-rose-500';
    const sign = isPositive ? '+' : '-';
    const formattedDiff = isPrice ? `${sign}${currCurrency}${Math.abs(diff).toFixed(2)}` : `${sign}${Math.abs(diff).toFixed(2)}`;
    return <span className={`font-bold ${color} bg-gray-900 rounded ${textSize} min-w-[32px] inline-block text-center`}>{formattedDiff}</span>;
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Stoutly <span className="text-amber-400">Annual Report</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Dive into our yearly insights, exploring the trends, top-rated spots, and community growth across the globe.
            </p>
            <div className="mt-6 bg-amber-500/10 rounded-xl p-4 border border-amber-500/20 text-sm text-left max-w-3xl mx-auto">
              <h4 className="font-bold mb-1 text-amber-400">About This Data</h4>
              <p className="leading-relaxed text-amber-500/90">
                The insights presented in this report are crowdsourced and collected directly from users of Stoutly. Stoutly launched on 25th July 2025. As the app grows, the data will become more accurate, but it is not entirely representative of each region&apos;s complete pint-economy. Instead, it serves as an accurate representation of the data that users on Stoutly are submitting to us.
              </p>
            </div>
          </div>

          {/* Year Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b border-gray-800 pb-2">
              <Calendar className="text-amber-400" />
              Select Year
            </h2>
            <div className="flex flex-wrap gap-4">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setSelectedLocation(null);
                    setSelectedCity(null);
                  }}
                  className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${
                    selectedYear === year
                      ? 'bg-amber-400 text-gray-900 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Location Selection (Visible only if year is selected) */}
          {selectedYear && (
            <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b border-gray-800 pb-2">
                <Map className="text-amber-400" />
                Select Region
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      if (loc === 'United Kingdom') setSelectedCity('All of UK');
                      else if (loc === 'Northern Ireland') setSelectedCity('All of NI');
                      else if (loc === 'Republic of Ireland') setSelectedCity('All of ROI');
                    }}
                    className={`p-4 rounded-xl font-medium text-left transition-all border ${
                      selectedLocation === loc
                        ? 'bg-gray-800 border-amber-400 text-amber-400'
                        : 'bg-gray-900 border-gray-800 hover:border-gray-600 hover:bg-gray-800/50 text-gray-300'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* City Selection (Visible only if location is selected) */}
          {selectedLocation && (
            <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b border-gray-800 pb-2">
                <Map className="text-amber-400" />
                Select City
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {regionCities[selectedLocation].map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`p-4 rounded-xl font-medium text-left transition-all border ${
                      selectedCity === city
                        ? 'bg-gray-800 border-amber-400 text-amber-400'
                        : 'bg-gray-900 border-gray-800 hover:border-gray-600 hover:bg-gray-800/50 text-gray-300'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Data Display Placeholder */}
          {selectedCity && !currentData && (
            <div className="mt-12 bg-gray-800/50 rounded-2xl p-8 border border-gray-700 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="bg-gray-900 p-4 rounded-full mb-6">
                  <BarChart3 size={48} className="text-amber-400 opacity-50" />
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {selectedYear} Report: {selectedCity}, {selectedLocation}
                </h3>
                <p className="text-gray-400 max-w-md">
                  We are preparing the data for this region. Once ready, insights, top-rated pints, and pricing trends will be displayed here.
                </p>
              </div>
            </div>
          )}
          
          {selectedCity && currentData && (
            <div className="mt-12 animate-in fade-in zoom-in-95 duration-500 space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <h2 className="text-3xl font-extrabold flex items-center gap-3">
                    <BarChart3 className="text-amber-400" size={32} />
                    {selectedYear} Insights: {selectedCity}
                 </h2>
                 <div className="flex items-center gap-4">
                   <button 
                     onClick={() => setShowInfographic(true)}
                     className="hidden md:flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded-lg transition-colors border border-amber-500/20 font-medium text-sm"
                   >
                     <Camera size={16} />
                     Share Infographic
                   </button>
                   <div className="text-gray-400 text-sm hidden md:block">Data accurate up to 25th July 2026</div>
                 </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col items-center text-center hover:border-amber-400/50 transition-colors">
                  <Beer className="text-amber-400 mb-4" size={36} />
                  <div className="text-4xl font-bold text-white mb-2">{currentData.stats.pubCount}</div>
                  <div className="text-gray-400 text-sm">Pubs Tracked</div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col items-center text-center hover:border-amber-400/50 transition-colors">
                  <Activity className="text-amber-400 mb-4" size={36} />
                  <div className="text-4xl font-bold text-white mb-2">{currentData.stats.avgPintsPerVisit.toFixed(1)}</div>
                  <div className="text-gray-400 text-sm">Avg Pints / Visit</div>
                  <div className="text-xs text-amber-500/80 mt-2">*Accurate since 19th May 2026</div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col items-center text-center hover:border-amber-400/50 transition-colors">
                  {currentData.stats.currency === '€' ? (
                    <Euro className="text-amber-400 mb-4" size={36} />
                  ) : (
                    <PoundSterling className="text-amber-400 mb-4" size={36} />
                  )}
                  <div className="text-4xl font-bold text-white mb-2">{currentData.stats.currency}{currentData.stats.avgPrice.toFixed(2)}</div>
                  <div className="text-gray-400 text-sm">Avg Pint Price</div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col items-center text-center hover:border-amber-400/50 transition-colors">
                  <CreditCard className="text-amber-400 mb-4" size={36} />
                  <div className="text-4xl font-bold text-white mb-2">{currentData.stats.currency}{currentData.stats.avgSpendPerVisit.toFixed(2)}</div>
                  <div className="text-gray-400 text-sm">Avg Spend / Visit</div>
                  <div className="text-xs text-amber-500/80 mt-2">*Accurate since 19th May 2026</div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col items-center text-center hover:border-amber-400/50 transition-colors">
                  <ScoreMeter score={currentData.stats.avgScore} size={100} strokeWidth={10} />
                  <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-2">
                    Average Score
                    <button onClick={() => setShowScoreModal(true)} className="hover:text-amber-400 transition-colors" title="What is Pub Score?">
                      <Info size={14} />
                    </button>
                  </div>
                  <div className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${currentData.stats.avgScore >= 39.7 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {currentData.stats.avgScore >= 39.7 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(currentData.stats.avgScore - 40).toFixed(1)} {currentData.stats.avgScore >= 40 ? 'above' : 'below'} global average
                  </div>
                </div>
              </div>

              {/* Advanced Metrics & Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart */}
                <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
                   <div className="flex flex-col gap-1 mb-6">
                     <h3 className="text-xl font-bold flex items-center gap-2">
                       <TrendingUp className="text-amber-400" size={24} /> 
                       Price Trends (12 Months)
                     </h3>
                     <p className="text-gray-400 text-sm">Showing the average pint prices currently being paid by users in this region.<span className="block mt-1 text-xs text-gray-500 italic">Note: This isn&apos;t the same as &quot;12-month price change&quot; which shows the average percentage pubs have increased/decreased their prices in the last 12 months.</span></p>
                   </div>
                   <div className="h-72 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={currentData.stats.trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="month" 
                            stroke="#9ca3af" 
                            minTickGap={30}
                            tickMargin={10}
                            tickFormatter={(val) => {
                              const date = new Date(val);
                              return date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
                            }} 
                          />
                          <YAxis stroke="#9ca3af" tickFormatter={(val) => `${currentData.stats.currency}${val}`} domain={['auto', 'auto']} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '0.5rem', color: '#f3f4f6' }}
                            formatter={(value: number) => [`${currentData.stats.currency}${value.toFixed(2)}`, 'Avg Price']}
                            labelFormatter={(label) => {
                              const date = new Date(label);
                              return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
                            }}
                          />
                          <Area type="monotone" dataKey="avgPrice" stroke="#f59e0b" fillOpacity={1} fill="url(#colorPrice)" />
                        </AreaChart>
                     </ResponsiveContainer>
                   </div>
                </div>

                {/* Additional Stats */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col justify-center gap-6">
                   <div className="border-b border-gray-700 pb-6">
                      <div className="flex items-center gap-2 mb-2 text-amber-400">
                        <TrendingUp size={24} />
                      </div>
                      <div className="text-gray-400 text-sm mb-1 uppercase tracking-wide">12-Month Price Change</div>
                      <div className={`text-3xl font-bold ${currentData.stats.avgPriceChange12m > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {currentData.stats.avgPriceChange12m > 0 ? '+' : '-'}{Math.abs(currentData.stats.avgPriceChange12m).toFixed(2)}%
                      </div>
                      <div className="text-xs text-gray-500 mt-2">Average percentage increase across venues that have raised prices in the last year</div>
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-2 text-amber-400">
                        <Beer size={24} />
                      </div>
                      <div className="text-gray-400 text-sm mb-1 uppercase tracking-wide">Guinness Zero Availability</div>
                      <div className="text-3xl font-bold text-amber-400">{currentData.stats.guinnessZeroPerc.toFixed(1)}%</div>
                      <div className="text-xs text-gray-500 mt-2">Of tracked venues offer 0.0%</div>
                   </div>
                </div>
              </div>

              {/* National Comparisons */}
              {comparisons.length > 0 && (
                <div className={`grid grid-cols-1 ${comparisons.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-6`}>
                  {comparisons.map(comp => (
                    <div key={comp.label} className="bg-gray-800 rounded-xl p-6 border border-gray-700 relative overflow-hidden">
                       <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                         <Activity className="text-amber-400" size={24} />
                         vs {comp.label}
                       </h3>
                       <div className="space-y-4">
                          <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                             <span className="text-gray-400">Average Price</span>
                             <div className="flex items-center gap-3">
                               <span className="text-white font-medium">{currentData.stats.currency}{currentData.stats.avgPrice.toFixed(2)}</span>
                               <span className="text-gray-500 text-sm italic w-16 text-right">vs {comp.data.stats.currency}{comp.data.stats.avgPrice.toFixed(2)}</span>
                               <div className="w-14 flex justify-end">
                                 {renderDiff(currentData.stats.avgPrice, comp.data.stats.avgPrice, true, currentData.stats.currency, comp.data.stats.currency)}
                               </div>
                             </div>
                          </div>
                          <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                             <span className="text-gray-400">Quality Rating</span>
                             <div className="flex items-center gap-3">
                               <span className="text-white font-medium">{currentData.stats.avgQuality.toFixed(2)}</span>
                               <span className="text-gray-500 text-sm italic w-16 text-right">vs {comp.data.stats.avgQuality.toFixed(2)}</span>
                               <div className="w-14 flex justify-end">
                                 {renderDiff(currentData.stats.avgQuality, comp.data.stats.avgQuality, false, currentData.stats.currency, comp.data.stats.currency)}
                               </div>
                             </div>
                          </div>
                          <div className="flex justify-between items-center">
                             <span className="text-gray-400">Avg Pub Score</span>
                             <div className="flex items-center gap-3">
                               <span className="text-white font-medium">{currentData.stats.avgScore.toFixed(1)}</span>
                               <span className="text-gray-500 text-sm italic w-16 text-right">vs {comp.data.stats.avgScore.toFixed(1)}</span>
                               <div className="w-14 flex justify-end">
                                 {renderDiff(currentData.stats.avgScore, comp.data.stats.avgScore, false, currentData.stats.currency, comp.data.stats.currency)}
                               </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pub Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-gray-800 rounded-xl p-6 border border-amber-400/30 relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Trophy size={64} />
                  </div>
                  <h4 className="text-amber-400 font-bold mb-4 flex items-center gap-2"><Trophy size={20} /> Top Rated Pub{'top3RatedPubs' in currentData.stats ? 's' : ''}</h4>
                  
                  {'top3RatedPubs' in currentData.stats && Array.isArray(currentData.stats.top3RatedPubs) ? (
                    <div className="flex flex-col gap-3 mt-auto">
                      {currentData.stats.top3RatedPubs.slice(0, 3).map((pub: typeof belfastData.stats.topRatedPub, i: number) => (
                        <div key={pub.id} className="flex justify-between items-center border-b border-gray-700/50 pb-2 last:border-0 last:pb-0">
                          <div className="flex items-center gap-3 overflow-hidden pr-2">
                            <span className="text-amber-400 font-bold text-lg opacity-80 shrink-0">{i + 1}.</span>
                            <div className="truncate">
                              <div className="text-white font-bold truncate">{pub.name}</div>
                              <div className="text-gray-400 text-xs truncate">{pub.address}</div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end shrink-0">
                            <span className="text-amber-400 font-bold">{pub.score}/100</span>
                            <span className="text-gray-300 font-medium text-xs">
                              {pub.minPrice !== null && pub.minPrice !== undefined ? `${currentData.stats.currency}${pub.minPrice.toFixed(2)}` : 'N/A'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-white mb-2">{currentData.stats.topRatedPub.name}</div>
                      <div className="text-gray-400 text-sm mb-4 line-clamp-2">{currentData.stats.topRatedPub.address}</div>
                      <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-700">
                         <span className="text-gray-300 font-medium">Score: {currentData.stats.topRatedPub.score}/100</span>
                         <span className="text-amber-400 font-bold">
                           {currentData.stats.topRatedPub.minPrice !== null && currentData.stats.topRatedPub.minPrice !== undefined ? `${currentData.stats.currency}${currentData.stats.topRatedPub.minPrice.toFixed(2)}` : 'N/A'}
                         </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-emerald-500/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ArrowDownToLine size={64} className="text-emerald-500" />
                  </div>
                  <h4 className="text-emerald-500 font-bold mb-4 flex items-center gap-2"><ArrowDownToLine size={20} /> Cheapest Pint</h4>
                  <div className="text-2xl font-bold text-white mb-2">{currentData.stats.cheapestPub.name}</div>
                  <div className="text-gray-400 text-sm mb-4 line-clamp-2">{currentData.stats.cheapestPub.address}</div>
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-700">
                     <span className="text-gray-300 font-medium text-sm">Best Value</span>
                     <span className="text-emerald-500 font-bold">
                       {currentData.stats.cheapestPub.minPrice !== null && currentData.stats.cheapestPub.minPrice !== undefined ? `${currentData.stats.currency}${currentData.stats.cheapestPub.minPrice.toFixed(2)}` : 'N/A'}
                     </span>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-rose-500/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ArrowUpFromLine size={64} className="text-rose-500" />
                  </div>
                  <h4 className="text-rose-500 font-bold mb-4 flex items-center gap-2"><ArrowUpFromLine size={20} /> Most Expensive</h4>
                  <div className="text-2xl font-bold text-white mb-2">{currentData.stats.expensivePub.name}</div>
                  <div className="text-gray-400 text-sm mb-4 line-clamp-2">{currentData.stats.expensivePub.address}</div>
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-700">
                     <span className="text-gray-300 font-medium text-sm">Premium Price</span>
                     <span className="text-rose-500 font-bold">
                       {currentData.stats.expensivePub.minPrice !== null && currentData.stats.expensivePub.minPrice !== undefined ? `${currentData.stats.currency}${currentData.stats.expensivePub.minPrice.toFixed(2)}` : 'N/A'}
                     </span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Help text before year selection */}
          {!selectedYear && (
            <div className="text-center py-12 text-gray-500 border border-dashed border-gray-800 rounded-2xl">
              Please select a year above to view the report.
            </div>
          )}

        </div>
      </main>
      <Footer />
      
      {/* Infographic Overlay */}
      {showInfographic && currentData && (
        <div className="fixed inset-0 z-[100] bg-gray-950/95 backdrop-blur-md overflow-hidden flex flex-col items-center justify-center">
            {/* Action Bar */}
            <div className="absolute top-4 right-4 flex gap-4 z-[110]">
               <button onClick={() => setShowInfographic(false)} className="bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 transition-colors shadow-lg">
                 <X size={24} />
               </button>
            </div>
            
            <div 
              className="flex items-center gap-2 sm:gap-4 w-[640px] shrink-0 justify-center"
              style={{ transform: 'scale(min(1, calc(100vw / 640), calc(100vh / 850)))', transformOrigin: 'center' }}
            >
            <button 
              onClick={() => setInfographicPage((prev) => Math.max(1, prev - 1) as 1 | 2)}
              className={`p-2 sm:p-3 rounded-full transition-all flex-shrink-0 ${infographicPage === 1 ? 'bg-amber-500/10 text-amber-500/30 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-gray-700 shadow-lg'}`}
              disabled={infographicPage === 1}
            >
               <ChevronLeft size={24} />
            </button>

            {/* Infographic Target Area */}
            <div className="bg-gray-900 border border-gray-700 p-6 sm:p-8 rounded-[2rem] shadow-2xl w-[480px] shrink-0 min-h-[680px] flex flex-col relative overflow-hidden ring-1 ring-white/10">
                {/* background accents */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
                
                {/* Header */}
                <div className="text-center mb-6 relative z-10 flex flex-col items-center">
                  <Logo className="w-12 h-12 mb-3" />
                  <h2 className="text-4xl font-extrabold tracking-tight mb-3 text-white">Stoutly <span className="text-amber-400">Insights</span></h2>
                  <div className="inline-block bg-gray-800/80 backdrop-blur-md text-amber-400 px-5 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase border border-amber-500/30">
                    {selectedYear} • {getDisplayName(selectedCity || '')}
                  </div>
                </div>
                
                {infographicPage === 1 ? (
                  /* Core Stats Grid */
                  <div className="grid grid-cols-4 gap-3 flex-1 relative z-10">
                     {/* Avg Score Hero */}
                     <div className="bg-gray-800/80 rounded-3xl p-4 border border-gray-700 flex flex-col justify-center items-center text-center col-span-2 shadow-lg relative">
                       <ScoreMeter score={currentData.stats.avgScore} size={90} strokeWidth={8} />
                       <div className="flex items-center gap-1 mt-2">
                         <div className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Average Pub Score</div>
                       </div>
                       <div className="text-[8px] text-gray-500 mt-1 max-w-[160px] leading-tight text-center px-2">
                         Quality + Price × Confidence
                       </div>
                       
                       {/* Worldwide Comparison */}
                       <div className={`mt-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${currentData.stats.avgScore >= 39.7 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                         {currentData.stats.avgScore >= 39.7 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                         {Math.abs(currentData.stats.avgScore - 40).toFixed(1)} {currentData.stats.avgScore >= 40 ? 'above' : 'below'} global avg
                       </div>
                     </div>
    
                     {/* Top Rated */}
                     <div className="bg-gradient-to-br from-amber-500/20 to-gray-800/80 rounded-2xl p-4 border border-amber-500/30 flex flex-col justify-center items-center text-center col-span-2 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-3 opacity-10">
                         <Trophy size={48} />
                       </div>
                       
                       {'top3RatedPubs' in currentData.stats && Array.isArray(currentData.stats.top3RatedPubs) ? (
                         <>
                           <div className="flex items-center gap-1 mb-2 z-10 w-full justify-center">
                             <Trophy className="text-amber-400" size={12} />
                             <div className="text-gray-300 text-[9px] font-semibold uppercase tracking-wider">Top Rated Pubs</div>
                           </div>
                           <div className="w-full flex flex-col gap-1.5 z-10">
                             {currentData.stats.top3RatedPubs.slice(0,3).map((pub: typeof belfastData.stats.topRatedPub, i: number) => (
                               <div key={pub.id} className="flex justify-between items-center bg-gray-900/40 rounded px-2 py-1">
                                 <div className="flex items-center gap-1.5 overflow-hidden">
                                   <span className="text-amber-400 font-black text-[10px] opacity-80">{i + 1}</span>
                                   <span className="text-white font-bold text-[10px] truncate max-w-[100px] text-left">{pub.name}</span>
                                 </div>
                                 <div className="flex items-center gap-1.5 shrink-0">
                                   <span className="text-gray-300 text-[9px]">
                                     {pub.minPrice !== null && pub.minPrice !== undefined ? `${currentData.stats.currency}${pub.minPrice.toFixed(2)}` : 'N/A'}
                                   </span>
                                   <span className="text-amber-400 font-bold text-[10px]">{pub.score}</span>
                                 </div>
                               </div>
                             ))}
                           </div>
                         </>
                       ) : (
                         <>
                           <Trophy className="text-amber-400 mb-1" size={16} />
                           <div className="text-gray-300 text-[9px] font-semibold mb-1 uppercase tracking-wider">Top Rated Pub</div>
                           <div className="text-lg font-bold text-white leading-tight px-2">{currentData.stats.topRatedPub.name}</div>
                           <div className="flex items-center gap-3 mt-1">
                             <span className="text-amber-400 font-bold text-xs bg-gray-900/50 px-2 py-1 rounded">{currentData.stats.topRatedPub.score}/100</span>
                             <span className="text-gray-300 font-medium text-xs">
                               {currentData.stats.topRatedPub.minPrice !== null && currentData.stats.topRatedPub.minPrice !== undefined ? `${currentData.stats.currency}${currentData.stats.topRatedPub.minPrice.toFixed(2)}` : 'N/A'}
                             </span>
                           </div>
                         </>
                       )}
                     </div>
    
                     {/* Cheapest and Expensive */}
                     <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/30 flex flex-col justify-center items-center text-center col-span-1">
                       <ArrowDownToLine className="text-emerald-500 mb-1" size={14} />
                       <div className="text-emerald-500 font-bold text-[10px] leading-tight mb-1 truncate w-full px-1">{currentData.stats.cheapestPub.name}</div>
                       <div className="text-emerald-400 font-medium text-xs">
                         {currentData.stats.cheapestPub.minPrice !== null && currentData.stats.cheapestPub.minPrice !== undefined ? `${currentData.stats.currency}${currentData.stats.cheapestPub.minPrice.toFixed(2)}` : 'N/A'}
                       </div>
                       <div className="text-emerald-500/70 text-[7px] uppercase tracking-wider font-semibold mt-1">Cheapest</div>
                     </div>
                     
                     <div className="bg-rose-500/10 rounded-xl p-3 border border-rose-500/30 flex flex-col justify-center items-center text-center col-span-1">
                       <ArrowUpFromLine className="text-rose-500 mb-1" size={14} />
                       <div className="text-rose-500 font-bold text-[10px] leading-tight mb-1 truncate w-full px-1">{currentData.stats.expensivePub.name}</div>
                       <div className="text-rose-400 font-medium text-xs">
                         {currentData.stats.expensivePub.minPrice !== null && currentData.stats.expensivePub.minPrice !== undefined ? `${currentData.stats.currency}${currentData.stats.expensivePub.minPrice.toFixed(2)}` : 'N/A'}
                       </div>
                       <div className="text-rose-500/70 text-[7px] uppercase tracking-wider font-semibold mt-1">Most Expensive</div>
                     </div>
    
                     {/* Price & Trend */}
                     <div className="bg-gray-800/80 rounded-xl p-3 border border-gray-700 flex flex-col justify-center items-center text-center col-span-1">
                       <div className="text-lg font-black text-white mb-1">{currentData.stats.currency}{currentData.stats.avgPrice.toFixed(2)}</div>
                       <div className="text-gray-400 text-[7px] uppercase tracking-wider font-semibold">Avg Price</div>
                     </div>
                     
                     <div className="bg-gray-800/80 rounded-xl p-3 border border-gray-700 flex flex-col justify-center items-center text-center col-span-1">
                       <div className={`text-lg font-black mb-1 ${currentData.stats.avgPriceChange12m > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                         {currentData.stats.avgPriceChange12m > 0 ? '+' : '-'}{Math.abs(currentData.stats.avgPriceChange12m).toFixed(2)}%
                       </div>
                       <div className="text-gray-400 text-[7px] uppercase tracking-wider font-semibold">
                         {currentData.stats.avgPriceChange12m > 0 ? 'Avg 12m Price Increase' : 'Avg 12m Price Decrease'}
                       </div>
                     </div>
    
                     {/* G0 */}
                     <div className="bg-blue-900/20 rounded-xl p-3 border border-blue-500/30 flex flex-col justify-center items-center text-center col-span-2 h-full relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-3 opacity-10">
                         <Beer size={48} className="text-blue-400" />
                       </div>
                       <div className="text-xl font-bold text-blue-400 mb-1 z-10">{currentData.stats.guinnessZeroPerc.toFixed(1)}%</div>
                       <div className="text-blue-300/70 text-[9px] uppercase tracking-wider font-semibold z-10">Of pubs offer Guinness 0.0</div>
                     </div>
    
                     {/* Total Pubs & Ratings */}
                     <div className="bg-gray-800/80 rounded-xl p-3 border border-gray-700 flex flex-col justify-center items-center text-center col-span-2 h-full">
                       <div className="text-xl font-bold text-white mb-1">{currentData.stats.pubCount}</div>
                       <div className="text-gray-400 text-[9px] uppercase tracking-wider font-semibold"># Pubs Tracked</div>
                     </div>
                  </div>
                ) : (
                  /* Page 2: Price Trends */
                  <div className="flex-1 flex flex-col relative z-10">
                     <div className="bg-gray-800/80 rounded-2xl p-6 border border-gray-700 shadow-lg mb-4 flex-1 flex flex-col">
                       <h3 className="text-white font-bold mb-1 flex items-center gap-2">
                         <TrendingUp className="text-amber-400" size={18} />
                         12-Month Rating Price Trend
                       </h3>
                       <p className="text-gray-400 text-xs mb-6 leading-relaxed">
                         This chart tracks the average price of pints per user ratings for each month in {getDisplayName(selectedCity || '')}. It reflects the prices users are paying that month, and is not directly reflective of price increases as users could just be visiting more expensive places in a given month.
                       </p>
                       
                       <div className="w-full h-48 sm:h-64 -ml-4 relative mt-auto">
                         <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={currentData.stats.trendData}>
                             <defs>
                               <linearGradient id="colorPriceInfo" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                                 <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                               </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                             <XAxis 
                               dataKey="month" 
                               stroke="#9ca3af" 
                               fontSize={10}
                               minTickGap={30}
                               tickMargin={5}
                               tickFormatter={(val) => {
                                 const date = new Date(val);
                                 return date.toLocaleDateString('en-US', { month: 'short' });
                               }}
                             />
                             <YAxis 
                               stroke="#9ca3af" 
                               fontSize={10}
                               domain={['dataMin - 0.2', 'dataMax + 0.2']}
                               tickFormatter={(val) => `${currentData.stats.currency}${val.toFixed(2)}`}
                             />
                             <Area 
                               type="monotone" 
                               dataKey="avgPrice" 
                               stroke="#f59e0b" 
                               strokeWidth={3}
                               fillOpacity={1} 
                               fill="url(#colorPriceInfo)" 
                             />
                           </AreaChart>
                         </ResponsiveContainer>
                       </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-3 mt-auto">
                       <div className="bg-gray-800/80 rounded-xl p-4 border border-gray-700 text-center flex flex-col justify-center">
                         <div className="text-gray-400 text-[9px] uppercase tracking-wider font-semibold mb-2">
                           Overall Avg Price Change (12m)
                         </div>
                         <div className={`text-2xl font-black ${(currentData.stats.trendData[currentData.stats.trendData.length - 1]?.avgPrice || 0) > (currentData.stats.trendData[0]?.avgPrice || 0) ? 'text-rose-400' : 'text-emerald-400'}`}>
                           {((currentData.stats.trendData[currentData.stats.trendData.length - 1]?.avgPrice || 0) > (currentData.stats.trendData[0]?.avgPrice || 0)) ? '+' : ''}{((currentData.stats.trendData[0]?.avgPrice || 0) > 0 ? (((currentData.stats.trendData[currentData.stats.trendData.length - 1]?.avgPrice || 0) - (currentData.stats.trendData[0]?.avgPrice || 0)) / (currentData.stats.trendData[0]?.avgPrice || 0)) * 100 : 0).toFixed(2)}%
                         </div>
                       </div>
                       <div className="bg-gray-800/80 rounded-xl p-4 border border-gray-700 text-center flex flex-col justify-center">
                         <div className="text-gray-400 text-[8px] uppercase tracking-wider font-semibold mb-2">
                           Average percentage increase across venues that have raised prices in the last year
                         </div>
                         <div className={`text-2xl font-black ${currentData.stats.avgPriceChange12m > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                           {currentData.stats.avgPriceChange12m > 0 ? '+' : '-'}{Math.abs(currentData.stats.avgPriceChange12m).toFixed(2)}%
                         </div>
                       </div>
                     </div>
                  </div>
                )}
                
                {/* Infographic Comparisons */}
                {infographicPage === 1 && comparisons.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-800 w-full z-10 relative">
                    <div className="text-gray-400 text-[8px] uppercase tracking-wider font-semibold mb-2 text-center">Compared to</div>
                    <div className="flex justify-center gap-3 flex-wrap">
                      {comparisons.map((comp) => (
                        <div key={comp.label} className={`bg-gray-800/80 rounded-lg p-2 border border-gray-700 text-center min-w-[120px] ${comparisons.length === 1 ? 'w-full max-w-[200px]' : 'flex-1'}`}>
                           <div className="text-white font-bold text-[9px] mb-1.5">{comp.label}</div>
                           <div className="flex flex-col gap-1">
                             <div className="flex justify-between items-center text-[8px]">
                               <span className="text-gray-500 w-8 text-left">Price</span>
                               <span className="text-white font-medium w-10 text-right">{comp.data.stats.currency}{comp.data.stats.avgPrice.toFixed(2)}</span>
                               <div className="w-10 flex justify-end">
                                 {renderDiff(currentData.stats.avgPrice, comp.data.stats.avgPrice, true, currentData.stats.currency, comp.data.stats.currency, true)}
                               </div>
                             </div>
                             <div className="flex justify-between items-center text-[8px]">
                               <span className="text-gray-500 w-8 text-left">Score</span>
                               <span className="text-white font-medium w-10 text-right">{comp.data.stats.avgScore.toFixed(1)}</span>
                               <div className="w-10 flex justify-end">
                                 {renderDiff(currentData.stats.avgScore, comp.data.stats.avgScore, false, '', '', true)}
                               </div>
                             </div>
                             <div className="flex justify-between items-center text-[8px]">
                               <span className="text-gray-500 w-8 text-left">Quality</span>
                               <span className="text-white font-medium w-10 text-right">{comp.data.stats.avgQuality.toFixed(2)}</span>
                               <div className="w-10 flex justify-end">
                                 {renderDiff(currentData.stats.avgQuality, comp.data.stats.avgQuality, false, '', '', true)}
                               </div>
                             </div>
                           </div>
                        </div>
                      ))}
                    </div>
                    {comparisons.some(comp => comp.data.stats.currency !== currentData.stats.currency) && (
                      <div className="text-[7px] text-gray-500 text-center mt-2 italic">
                        *Currency converted to {currentData.stats.currency} for an accurate price comparison.
                      </div>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="mt-8 text-center relative z-10">
                  <div className="flex items-center justify-center gap-2 mb-2 text-amber-500/80 font-bold tracking-wider text-sm">
                    STOUTLY.CO.UK
                  </div>
                  <div className="text-gray-500 text-[9px] uppercase tracking-widest opacity-60">
                     Data powered by the community
                  </div>
                </div>
            </div>

            <button 
              onClick={() => setInfographicPage((prev) => Math.min(2, prev + 1) as 1 | 2)}
              className={`p-2 sm:p-3 rounded-full transition-all flex-shrink-0 ${infographicPage === 2 ? 'bg-amber-500/10 text-amber-500/30 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-gray-700 shadow-lg'}`}
              disabled={infographicPage === 2}
            >
               <ChevronRight size={24} />
            </button>
          </div>
          
        </div>
      )}
      
      {showScoreModal && <PubScoreModal onClose={() => setShowScoreModal(false)} />}
    </>
  );
};

