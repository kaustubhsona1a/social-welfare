import React, { useState } from 'react';
import { GalleryItem, Language } from '../types';
import { 
  Image as ImageIcon, 
  MapPin, 
  X, 
  Maximize2 
} from 'lucide-react';

interface GallerySectionProps {
  items: GalleryItem[];
  currentLang: Language;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  items,
  currentLang,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', labelEn: 'All Media', labelOr: 'ସମସ୍ତ' },
    { id: 'food', labelEn: 'Food Drives', labelOr: 'ଅନ୍ନଦାନ' },
    { id: 'clothing', labelEn: 'Clothing', labelOr: 'ବସ୍ତ୍ରଦାନ' },
    { id: 'medical', labelEn: 'Medical Relief', labelOr: 'ଚିକିତ୍ସା' },
    { id: 'community', labelEn: 'Community Work', labelOr: 'ସାମାଜିକ ସେବା' },
  ];

  const filteredItems = activeTab === 'all'
    ? items
    : items.filter(item => item.category === activeTab);

  return (
    <section id="gallery" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-sky-100/80 text-sky-950 text-xs font-light tracking-wider uppercase border border-sky-200">
            <ImageIcon className="w-3.5 h-3.5 text-sky-700" />
            <span>{currentLang === 'or' ? 'କାର୍ଯ୍ୟକ୍ରମ ଫୋଟୋ ଗ୍ୟାଲେରୀ' : 'Field Activity Gallery'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 tracking-tight font-heading">
            {currentLang === 'or' ? (
              <span className="font-oriya font-normal text-sky-950">ବାବୁଜଙ୍ଗ ଓ କଟକରେ ଆମର କ୍ଷେତ୍ରୀୟ ସେବା କାର୍ଯ୍ୟ</span>
            ) : (
              <span>Field Operations in <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-800 to-blue-900 font-normal">Babujang, Cuttack</span></span>
            )}
          </h2>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-light transition-all ${
                  activeTab === cat.id
                    ? 'bg-sky-800 text-white font-normal shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {currentLang === 'or' ? cat.labelOr : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="group relative h-72 bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-sky-100/80 hover:-translate-y-0.5"
            >
              <img 
                src={item.imageUrl} 
                alt={item.titleEn}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

              {/* Top Zoom Button */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="p-2.5 bg-slate-900/80 backdrop-blur-md rounded-full text-white inline-block border border-white/20">
                  <Maximize2 className="w-4 h-4 text-sky-200" />
                </span>
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <span className="bg-sky-950/80 text-sky-200 text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-sky-500/30 inline-block">
                  {item.category}
                </span>
                <h3 className="text-base font-normal leading-snug drop-shadow-md font-heading">
                  {currentLang === 'or' ? item.titleOr : item.titleEn}
                </h3>
                <p className="text-[11px] text-sky-200 font-mono font-light flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-300" />
                  <span>{item.location}</span>
                  <span>•</span>
                  <span>{item.date}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activeImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <div className="relative max-w-4xl w-full bg-slate-950 rounded-[2.5rem] overflow-hidden shadow-2xl border border-sky-900/50">
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 z-10 p-2.5 bg-slate-900/80 hover:bg-slate-950 text-white rounded-full transition-colors border border-white/20"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="max-h-[75vh] flex items-center justify-center bg-slate-950 p-2">
                <img 
                  src={activeImage.imageUrl} 
                  alt={activeImage.titleEn}
                  className="max-h-[75vh] w-auto object-contain rounded-2xl"
                />
              </div>

              <div className="p-5 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-slate-800">
                <div>
                  <h4 className="text-lg font-normal text-sky-200 font-heading">
                    {currentLang === 'or' ? activeImage.titleOr : activeImage.titleEn}
                  </h4>
                  <p className="text-slate-400 font-mono font-light">
                    {activeImage.location} • {activeImage.date}
                  </p>
                </div>

                <span className="bg-sky-950 text-sky-200 text-xs font-mono font-light px-4 py-1.5 rounded-full border border-sky-800">
                  Social Welfare Foundation Babujang
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

