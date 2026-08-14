import React, { useState } from 'react';
import { GalleryItem, Language } from '../types';
import { 
  Image as ImageIcon, 
  MapPin, 
  X, 
  Maximize2,
  Play,
  Video,
  Film,
  Calendar,
  Sparkles
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
  const [activeMedia, setActiveMedia] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', labelEn: 'All Media', labelHi: 'सभी मीडिया', labelOr: 'ସମସ୍ତ' },
    { id: 'video', labelEn: 'Videos & Reels', labelHi: 'वीडियो एवं वृत्तचित्र', labelOr: 'ଭିଡିଓ ସମୂହ', isSpecial: true },
    { id: 'food', labelEn: 'Food Drives', labelHi: 'अन्नदान', labelOr: 'ଅନ୍ନଦାନ' },
    { id: 'clothing', labelEn: 'Clothing', labelHi: 'वस्त्रदान', labelOr: 'ବସ୍ତ୍ରଦାନ' },
    { id: 'medical', labelEn: 'Medical Relief', labelHi: 'चिकित्सा सहायता', labelOr: 'ଚିକିତ୍ସା' },
    { id: 'community', labelEn: 'Community Work', labelHi: 'सामाजिक सेवा', labelOr: 'ସାମାଜିକ ସେବା' },
  ];

  const getYouTubeEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
    }
    return null;
  };

  const isVideoItem = (item: GalleryItem): boolean => {
    return item.mediaType === 'video' || Boolean(item.videoUrl) || item.category === 'video';
  };

  const filteredItems = items.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'video') return isVideoItem(item);
    return item.category === activeTab;
  });

  const videoCount = items.filter(isVideoItem).length;

  return (
    <section id="gallery" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-sky-100/80 text-sky-950 text-xs font-light tracking-wider uppercase border border-sky-200">
            <Film className="w-3.5 h-3.5 text-sky-700" />
            <span>
              {currentLang === 'or' ? 'କାର୍ଯ୍ୟକ୍ରମ ଫୋଟୋ ଓ ଭିଡିଓ ଗ୍ୟାଲେରୀ' : currentLang === 'hi' ? 'कार्यक्रम फोटो एवं वीडियो गैलरी' : 'Field Activity Photo & Video Gallery'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 tracking-tight font-heading">
            {currentLang === 'or' ? (
              <span className="font-oriya font-normal text-sky-950">ବାବୁଜଙ୍ଗ ଓ କଟକରେ ଆମର କ୍ଷେତ୍ରୀୟ ସେବା କାର୍ଯ୍ୟ</span>
            ) : currentLang === 'hi' ? (
              <span>बाबुजंग और कटक में <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-800 to-blue-900 font-normal">जमीनी सेवा कार्य</span></span>
            ) : (
              <span>Field Operations in <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-800 to-blue-900 font-normal">Babujang, Cuttack</span></span>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 font-light max-w-2xl mx-auto">
            {currentLang === 'or' 
              ? 'କ୍ଷେତ୍ରୀୟ ରିଲିଫ୍, ଅନ୍ନଦାନ, ମାଗଣା ଚିକିତ୍ସା ଓ ବସ୍ତ୍ରଦାନ କାର୍ଯ୍ୟକ୍ରମର ବାସ୍ତବ ଚିତ୍ର ଓ ଭିଡିଓ ଦସ୍ତାବିଜ୍।'
              : currentLang === 'hi'
              ? 'जमीनी राहत, अन्नदान, निशुल्क स्वास्थ्य शिविर एवं वस्त्रदान कार्यक्रमों के जीवंत वीडियो और चित्र।'
              : 'Authentic photos and video footage from our grassroots food distribution drives, free medical relief camps, and volunteer initiatives.'}
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => {
              const isSelected = activeTab === cat.id;
              const count = cat.id === 'all' 
                ? items.length 
                : cat.id === 'video' 
                ? videoCount 
                : items.filter(i => i.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  id={`gallery-tab-${cat.id}`}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? cat.id === 'video'
                        ? 'bg-rose-700 text-white font-medium shadow-sm ring-2 ring-rose-200'
                        : 'bg-sky-800 text-white font-medium shadow-xs'
                      : cat.id === 'video'
                        ? 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200 font-medium'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cat.id === 'video' && <Video className="w-3.5 h-3.5" />}
                  <span>{currentLang === 'or' ? cat.labelOr : currentLang === 'hi' ? cat.labelHi : cat.labelEn}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected 
                      ? 'bg-white/20 text-white' 
                      : cat.id === 'video'
                      ? 'bg-rose-200/70 text-rose-900'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.map((item) => {
            const isVideo = isVideoItem(item);

            return (
              <div 
                key={item.id}
                id={`gallery-card-${item.id}`}
                onClick={() => setActiveMedia(item)}
                className="group relative h-56 sm:h-64 lg:h-72 bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer border border-sky-100/80 hover:-translate-y-1"
              >
                {/* Poster / Thumbnail Image */}
                <img 
                  src={item.imageUrl || "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800"} 
                  alt={item.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  {isVideo ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-md backdrop-blur-md border border-rose-400/40 animate-pulse">
                      <Video className="w-3 h-3" />
                      <span>{item.duration ? `Video • ${item.duration}` : 'Video'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/70 text-sky-200 text-[10px] font-mono uppercase tracking-wider backdrop-blur-md border border-white/20">
                      <ImageIcon className="w-3 h-3" />
                      <span>Photo</span>
                    </span>
                  )}

                  {/* Top Zoom / Expand Icon */}
                  <span className="p-1.5 sm:p-2 bg-slate-900/80 hover:bg-slate-950 backdrop-blur-md rounded-full text-white border border-white/20 transition-transform group-hover:scale-110">
                    <Maximize2 className="w-3.5 h-3.5 text-sky-200" />
                  </span>
                </div>

                {/* Center Play Button for Videos */}
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-rose-600 transition-all duration-300 border-2 border-white/80 ring-4 ring-rose-500/30">
                      <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Bottom Caption */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 text-white space-y-1 z-10">
                  <div className="flex items-center gap-2">
                    <span className="bg-sky-950/90 text-sky-200 text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider border border-sky-500/30">
                      {item.category}
                    </span>
                    {item.date && (
                      <span className="text-[10px] text-slate-300 font-light flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5 text-sky-300" />
                        {item.date}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xs sm:text-sm md:text-base font-normal leading-snug drop-shadow-md font-heading line-clamp-2">
                    {currentLang === 'or' ? item.titleOr : (currentLang === 'hi' && item.titleHi) ? item.titleHi : item.titleEn}
                  </h3>
                  
                  {item.location && (
                    <p className="text-[10px] sm:text-[11px] text-sky-200 font-mono font-light flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-sky-300 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200 p-8">
            <Film className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-medium text-slate-700 mb-1">No media in this category yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Photos and videos are regularly uploaded by ground coordinators in Babujang.
            </p>
          </div>
        )}

        {/* Lightbox / Video Player Modal */}
        {activeMedia && (
          <div 
            id="gallery-lightbox-modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setActiveMedia(null)}
          >
            <div 
              className="relative max-w-4xl w-full bg-slate-950 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-sky-900/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                id="gallery-modal-close"
                onClick={() => setActiveMedia(null)}
                className="absolute top-4 right-4 z-30 p-2.5 bg-slate-900/80 hover:bg-slate-950 text-white rounded-full transition-colors border border-white/20 shadow-lg"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Media Content Area */}
              <div className="flex items-center justify-center bg-black min-h-[260px] sm:min-h-[400px] max-h-[75vh]">
                {(() => {
                  const isVideo = isVideoItem(activeMedia);
                  const ytEmbed = activeMedia.videoUrl ? getYouTubeEmbedUrl(activeMedia.videoUrl) : null;

                  if (isVideo && ytEmbed) {
                    return (
                      <div className="w-full aspect-video max-h-[75vh]">
                        <iframe
                          src={ytEmbed}
                          title={activeMedia.titleEn}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    );
                  }

                  if (isVideo && activeMedia.videoUrl) {
                    return (
                      <video 
                        src={activeMedia.videoUrl} 
                        poster={activeMedia.imageUrl}
                        controls 
                        autoPlay 
                        playsInline
                        className="w-full max-h-[75vh] object-contain"
                      >
                        Your browser does not support HTML5 video playback.
                      </video>
                    );
                  }

                  return (
                    <img 
                      src={activeMedia.imageUrl} 
                      alt={activeMedia.titleEn}
                      className="max-h-[75vh] w-auto object-contain"
                    />
                  );
                })()}
              </div>

              {/* Bottom Caption Information */}
              <div className="p-4 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs border-t border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {isVideoItem(activeMedia) ? (
                      <span className="bg-rose-900/80 text-rose-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-rose-600/40 uppercase tracking-wider flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        Video Footage
                      </span>
                    ) : (
                      <span className="bg-sky-950 text-sky-200 text-[10px] font-mono px-2 py-0.5 rounded-full border border-sky-800 uppercase tracking-wider">
                        Photo Archive
                      </span>
                    )}
                    <span className="text-slate-400 font-mono text-[11px] capitalize">
                      {activeMedia.category}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-normal text-sky-100 font-heading">
                    {currentLang === 'or' ? activeMedia.titleOr : (currentLang === 'hi' && activeMedia.titleHi) ? activeMedia.titleHi : activeMedia.titleEn}
                  </h4>

                  <p className="text-slate-400 font-mono font-light text-[11px] flex items-center gap-2">
                    {activeMedia.location && <span>📍 {activeMedia.location}</span>}
                    {activeMedia.location && activeMedia.date && <span>•</span>}
                    {activeMedia.date && <span>📅 {activeMedia.date}</span>}
                  </p>
                </div>

                <div className="shrink-0">
                  <span className="bg-sky-950 text-sky-200 text-xs font-mono font-light px-3.5 py-1.5 rounded-full border border-sky-800/80 block sm:inline-block">
                    Social Welfare Foundation Babujang
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
