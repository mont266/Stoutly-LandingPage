import React from 'react';
import { Globe, Activity, Trophy, Users, History, Share2 } from 'lucide-react';
import { Feature } from '../types';

const features: Feature[] = [
  {
    title: 'Smart Pub Scores',
    description: "Our weighted algorithm (60% Quality, 40% Price) combined with a Confidence Multiplier gives you a score you can trust.",
    icon: <Activity className="w-6 h-6 text-amber-400" />,
  },
  {
    title: 'Your Pint Passport',
    description: "Your personal stout journal. Log every rating, track your history, and build a profile that showcases your expertise.",
    icon: <History className="w-6 h-6 text-amber-400" />,
  },
  {
    title: 'Levels & Trophies',
    description: "Gamify your drinking. Progress from 'Stout Sprout' to 'Pint Paragon' and unlock achievements for your dedication.",
    icon: <Trophy className="w-6 h-6 text-amber-400" />,
  },
  {
    title: 'Global Discovery',
    description: "Find the best pints anywhere. Search by city, use international price conversion, and find pubs serving Guinness 0.0.",
    icon: <Globe className="w-6 h-6 text-amber-400" />,
  },
  {
    title: 'Community Feeds',
    description: "See what your friends are drinking in real-time or explore the global feed to discover hidden gems nearby.",
    icon: <Users className="w-6 h-6 text-amber-400" />,
  },
  {
    title: 'Shareable Stat Cards',
    description: "Turn your data into art. Generate beautiful infographic cards for your profile or favorite pubs to share on social media.",
    icon: <Share2 className="w-6 h-6 text-amber-400" />,
  },
];

export const Features: React.FC = () => {
  return (
    <div id="features" className="bg-gray-800 py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gray-700/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/30 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h2 className="text-base text-amber-400 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            More Than Just A Rating App
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
            Stoutly merges social connection, deep data, and fun gamification to help you find the perfect pint.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="pt-6">
                <div className="flow-root bg-gray-900 rounded-2xl px-6 pb-8 h-full border border-gray-700 hover:border-amber-400/50 transition-all hover:shadow-[0_0_30px_rgba(251,191,36,0.1)] hover:-translate-y-1 group">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gray-800 rounded-xl shadow-lg border border-gray-700 group-hover:border-amber-400/50 transition-colors">
                        {feature.icon}
                      </span>
                    </div>
                    <h3 className="mt-8 text-xl font-bold text-white tracking-tight">{feature.title}</h3>
                    <p className="mt-4 text-base text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};