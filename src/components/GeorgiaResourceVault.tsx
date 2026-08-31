import React, { useState } from 'react';
import { 
  Landmark, 
  MapPin, 
  Phone, 
  Search, 
  Filter, 
  ExternalLink, 
  ShieldCheck, 
  Award,
  Compass
} from 'lucide-react';
import { GEORGIA_CORRIDOR_RESOURCES } from '../data/georgiaResources';
import { GeorgiaResourceItem } from '../types';

export const GeorgiaResourceVault: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCorridor, setSelectedCorridor] = useState<string>('All');

  const categories = [
    'All',
    'Vital Records & DDS',
    'Transit & Mobility',
    'Housing & Support',
    'Second Chance Banking',
    'Apprenticeships & Trades'
  ];

  const corridors = ['All', 'Atlanta Metro', 'Macon / Central GA', 'Statewide GA'];

  const filteredResources = GEORGIA_CORRIDOR_RESOURCES.filter((item: GeorgiaResourceItem) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesCorridor = selectedCorridor === 'All' || item.corridor === selectedCorridor;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.address && item.address.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesCorridor && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Vault Header */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                CORRIDOR DIRECTORY
              </span>
              <h2 className="text-lg font-bold text-stone-100">
                Georgia / Atlanta / Macon Resource Vault
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 max-w-3xl">
              Verified physical addresses, fee-waiver contact points, and direct intake channels across the I-75 / I-85 / I-20 Georgia logistics and trade corridors.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-stone-400 bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800">
              {filteredResources.length} Verified Agencies
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-stone-900/60 p-4 rounded-xl border border-stone-800">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            id="resource-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by agency, street, certification, or service..."
            className="w-full bg-stone-950 border border-stone-700/80 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="md:col-span-3">
          <select
            id="resource-category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-stone-950 border border-stone-700/80 rounded-lg px-3 py-2.5 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            id="resource-corridor-select"
            value={selectedCorridor}
            onChange={(e) => setSelectedCorridor(e.target.value)}
            className="w-full bg-stone-950 border border-stone-700/80 rounded-lg px-3 py-2.5 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {corridors.map((c) => (
              <option key={c} value={c}>
                Corridor: {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {item.category}
                </span>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-800 text-stone-300 border border-stone-700">
                    {item.badge}
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-stone-100 group-hover:text-amber-200 transition-colors font-sans">
                {item.name}
              </h3>

              <p className="text-xs text-stone-300 leading-relaxed">
                {item.notes}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-800 space-y-1.5 text-xs font-mono text-stone-400">
              {item.address && (
                <div className="flex items-start gap-1.5 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-stone-300">{item.address}</span>
                </div>
              )}
              {item.contact && (
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-stone-300">{item.contact}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-1 text-[10px] text-stone-500">
                <span>Corridor: {item.corridor}</span>
                <span className="text-emerald-400 font-semibold">Verified Agency</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
