import React, { useState } from 'react';
import { Language, NewsEventItem } from '../types';
import { FoundationRepository } from '../lib/supabase';
import { getLangText } from '../lib/language';
import { Newspaper, Calendar, MapPin, Tag, ChevronRight, Megaphone, Bell } from 'lucide-react';

interface NewsAndEventsProps {
  currentLang: Language;
}

export const NewsAndEventsSection: React.FC<NewsAndEventsProps> = ({ currentLang }) => {
  const [filter, setFilter] = useState<'all' | 'news' | 'event' | 'press'>('all');
  const newsList = FoundationRepository.getNewsEvents();

  const filtered = newsList.filter(item => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  const getFilterLabel = (cat: string) => {
    if (cat === 'all') return currentLang === 'hi' ? 'सभी समाचार एवं कार्यक्रम' : currentLang === 'or' ? 'ସମସ୍ତ ଖବର ଓ କାର୍ଯ୍ୟକ୍ରମ' : 'All News & Events';
    if (cat === 'news') return currentLang === 'hi' ? 'समाचार' : currentLang === 'or' ? 'ଖବର' : 'Community News';
    if (cat === 'event') return currentLang === 'hi' ? 'कार्यक्रम' : currentLang === 'or' ? 'ଶିବିର ଓ କାର୍ଯ୍ୟକ୍ରମ' : 'Upcoming Events';
    return currentLang === 'hi' ? 'प्रेस विज्ञप्ति' : currentLang === 'or' ? 'ପ୍ରେସ୍‌ ରିଲିଜ୍‌' : 'Press Releases';
  };

  return (
    <section id="news-events" className="py-16 sm:py-20 bg-slate-100/70 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <Megaphone className="w-3.5 h-3.5 text-sky-600" />
              {currentLang === 'hi' ? 'ताज़ा समाचार एवं प्रेस विज्ञप्ति' : currentLang === 'or' ? 'ସଦ୍ୟତମ ଖବର ଓ ପ୍ରେସ ରିଲିଜ' : 'Latest Updates & Media'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading">
              {currentLang === 'hi' ? 'समाचार एवं आगामी कार्यक्रम' : currentLang === 'or' ? 'ଖବର, ଶିବିର ଓ କାର୍ଯ୍ୟସୂଚୀ' : 'News & Community Events'}
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
            {(['all', 'news', 'event', 'press'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filter === cat
                    ? 'bg-sky-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {getFilterLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map(item => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img 
                    src={item.imageUrl} 
                    alt={getLangText(item, 'title', currentLang)} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                      item.category === 'press' 
                        ? 'bg-purple-600 text-white' 
                        : item.category === 'event' 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-emerald-600 text-white'
                    }`}>
                      {item.category === 'press' ? 'Press Release' : item.category === 'event' ? 'Event' : 'News'}
                    </span>
                    {item.isUpcoming && (
                      <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-bold animate-pulse flex items-center gap-1">
                        <Bell className="w-3 h-3" />
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1 text-sky-800">
                      <Calendar className="w-3.5 h-3.5 text-sky-600" />
                      {item.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-heading leading-snug group-hover:text-sky-700 transition-colors">
                    {getLangText(item, 'title', currentLang)}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {getLangText(item, 'summary', currentLang)}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-700">
                <span>Social Welfare Foundation Media Desk</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
