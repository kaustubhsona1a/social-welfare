import React, { useState } from 'react';
import { GalleryItem, Language } from '../types';
import { 
  Image as ImageIcon, 
  MapPin, 
  X, 
  Maximize2,
  Play,
  Film,
  Video
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
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', labelEn: 'All Media', labelOr: 'ସମସ୍ତ' },
    { id: 'videos', labelEn: '🎬 Videos', labelOr: '🎬 ଭିଡିଓ' },
    { id: 'food', labelEn: 'Food Drives', labelOr: 'ଅନ୍ନଦାନ' },
    { id: 'clothing', labelEn: 'Clothing', labelOr: 'ବସ୍ତ୍ରଦାନ' },
    { id: 'medical', labelEn: 'Medical Relief', labelOr: 'ଚିକିତ୍ସା' },
    { id: 'community', labelEn: 'Community Work', labelOr: 'ସାମାଜିକ ସେବା' },
  ];

  const filteredItems = items.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'videos') return item.mediaType === 'video' || Boolean(item.videoUrl);
    return item.category === activeTab;
  });

  const isVideoItem = (item: GalleryItem) => {
    return item.mediaType === 'video' || Boolean(item.videoUrl);
  };

  const getVideoSrc = (item: GalleryItem) => {
    return item.videoUrl || (item.mediaType === 'video' ? item.imageUrl : '');
  };

  const isEmbeddableVideo = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    return url;
  };

  return (
    <section id="gallery" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-sky-100/80 text-sky-950 text-xs font-light tracking-wider uppercase border border-sky-200">
            <Film className="w-3.5 h-3.5 text-sky-700" />
            <span>{currentLang === 'or' ? 'କାର୍ଯ୍ୟକ୍ରମ ଫୋଟୋ ଓ ଭିଡିଓ ଗ୍ୟାଲେରୀ' : 'Field Photo & Video Gallery'}</span>
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {filteredItems.map((item) => {
            const isVid = isVideoItem(item);
            return (
              <div 
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="group relative h-48 sm:h-64 lg:h-72 bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer border border-sky-100/80 hover:-translate-y-0.5"
              >
                {/* Visual Thumbnail */}
                {isVid && !item.imageUrl && item.videoUrl && !isEmbeddableVideo(item.videoUrl) ? (
                  <video 
                    src={item.videoUrl} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    muted
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <img 
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800'} 
                    alt={item.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Video Play Badge if Video */}
                {isVid && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg border-2 border-white/80 group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Top Media Indicator & Zoom Button */}
                <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 flex items-center gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  {isVid ? (
                    <span className="px-2.5 py-1 bg-red-600/90 backdrop-blur-md rounded-full text-white text-[10px] font-semibold flex items-center gap-1 border border-white/20">
                      <Video className="w-3 h-3" />
                      Video
                    </span>
                  ) : (
                    <span className="p-1.5 sm:p-2.5 bg-slate-900/80 backdrop-blur-md rounded-full text-white inline-block border border-white/20">
                      <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-200" />
                    </span>
                  )}
                </div>

                {/* Bottom Caption */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-4 sm:left-4 sm:right-4 text-white space-y-0.5 sm:space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-sky-950/80 text-sky-200 text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider border border-sky-500/30 inline-block">
                      {item.category}
                    </span>
                    {isVid && (
                      <span className="bg-red-950/80 text-red-200 text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded-full uppercase tracking-wider border border-red-500/30 inline-block">
                        MP4/Video
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs sm:text-base font-normal leading-snug drop-shadow-md font-heading line-clamp-1 sm:line-clamp-none">
                    {currentLang === 'or' ? item.titleOr : item.titleEn}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-sky-200 font-mono font-light flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-sky-300 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lightbox / Video Player Modal */}
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <div className="relative max-w-4xl w-full bg-slate-950 rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl border border-sky-900/50">
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 z-20 p-2.5 bg-slate-900/80 hover:bg-slate-950 text-white rounded-full transition-colors border border-white/20"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="max-h-[75vh] flex items-center justify-center bg-slate-950 p-2">
                {isVideoItem(activeItem) ? (
                  isEmbeddableVideo(getVideoSrc(activeItem)) ? (
                    <div className="w-full aspect-video">
                      <iframe
                        src={getEmbedUrl(getVideoSrc(activeItem))}
                        title={activeItem.titleEn}
                        className="w-full h-full rounded-2xl border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <video
                      src={getVideoSrc(activeItem)}
                      controls
                      autoPlay
                      className="max-h-[70vh] w-full rounded-2xl bg-black"
                    />
                  )
                ) : (
                  <img 
                    src={activeItem.imageUrl} 
                    alt={activeItem.titleEn}
                    className="max-h-[75vh] w-auto object-contain rounded-2xl"
                  />
                )}
              </div>

              <div className="p-5 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-slate-800">
                <div>
                  <h4 className="text-lg font-normal text-sky-200 font-heading flex items-center gap-2">
                    {isVideoItem(activeItem) && <Film className="w-4 h-4 text-red-400" />}
                    {currentLang === 'or' ? activeItem.titleOr : activeItem.titleEn}
                  </h4>
                  <p className="text-slate-400 font-mono font-light">
                    {activeItem.location} • {activeItem.date} {isVideoItem(activeItem) ? '• Video Record' : ''}
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


