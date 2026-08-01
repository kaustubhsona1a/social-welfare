import React, { useState } from 'react';
import { SuccessStory, Language } from '../types';
import { 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle2, 
  X,
  BookOpen,
  Sparkles
} from 'lucide-react';

interface SuccessStoriesProps {
  stories: SuccessStory[];
  currentLang: Language;
}

export const SuccessStories: React.FC<SuccessStoriesProps> = ({
  stories,
  currentLang,
}) => {
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);

  return (
    <section id="stories" className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-sky-100/80 text-sky-950 text-xs font-light tracking-wider uppercase border border-sky-200">
            <Sparkles className="w-3.5 h-3.5 text-sky-700" />
            <span>{currentLang === 'or' ? 'ସେବା ସଫଳତା ଓ ପ୍ରଭାବ କାହାଣୀ' : 'Community Impact Stories'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 tracking-tight font-heading">
            {currentLang === 'or' ? (
              <span className="font-oriya font-normal text-sky-950">ସାମାଜିକ ସେବାର ବାସ୍ତବ ପ୍ରଭାବ</span>
            ) : (
              <span>Transforming Lives in <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-800 to-blue-900 font-normal">Babujang & Cuttack</span></span>
            )}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-light">
            {currentLang === 'or' ? (
              'ବାବୁଜଙ୍ଗ ସୋସିଆଲ ୱେଲଫେର ଫାଉଣ୍ଡେସନ ଦ୍ୱାରା ସଫଳତାର ସହ ସଂପାଦିତ ହୋଇଥିବା କେତେକ ବାସ୍ତବ ପ୍ରକଳ୍ପ ଓ ଜୀବନ ରକ୍ଷା କାହାଣୀ।'
            ) : (
              'Real documented case stories showing how timely food, medical, and emergency relief brought hope to local families.'
            )}
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div 
              key={story.id}
              className="glass-card rounded-[2rem] border border-sky-100/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-0.5"
              onClick={() => setSelectedStory(story)}
            >
              {/* Image Banner */}
              <div className="relative h-52 bg-slate-900 overflow-hidden">
                <img 
                  src={story.imageUrl} 
                  alt={story.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Category Tag */}
                <div className="absolute top-3 left-3">
                  <span className="bg-sky-950/80 backdrop-blur-md text-sky-200 text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-widest border border-sky-500/30">
                    {story.category}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-2 text-[11px] text-sky-200 font-mono font-light">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-sky-300" />
                    <span>{story.location}</span>
                    <span>•</span>
                    <span>{story.date}</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-normal text-slate-900 group-hover:text-sky-800 transition-colors leading-snug font-heading">
                    {currentLang === 'or' ? story.titleOr : story.titleEn}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed font-light">
                    {currentLang === 'or' ? story.summaryOr : story.summaryEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-light text-sky-900">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Users className="w-3.5 h-3.5 text-sky-600" />
                    {story.beneficiariesCount} Beneficiaries
                  </span>

                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform font-normal text-sky-900">
                    <span>{currentLang === 'or' ? 'ପଢ଼ନ୍ତୁ' : 'Read Story'}</span>
                    <BookOpen className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Story Modal Detail */}
        {selectedStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden my-8 border border-sky-100">
              
              <div className="relative h-72 bg-slate-950">
                <img 
                  src={selectedStory.imageUrl} 
                  alt={selectedStory.titleEn}
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <button
                  onClick={() => setSelectedStory(null)}
                  className="absolute top-4 right-4 p-2.5 bg-slate-900/80 hover:bg-slate-950 text-white rounded-full transition-colors border border-white/20"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-4 left-6 right-6 text-white space-y-1.5">
                  <span className="bg-sky-800 text-white text-[10px] font-mono px-3 py-1 rounded-full inline-block uppercase tracking-wider">
                    {selectedStory.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-normal leading-tight font-heading">
                    {currentLang === 'or' ? selectedStory.titleOr : selectedStory.titleEn}
                  </h3>
                  <p className="text-xs text-sky-200 font-mono font-light flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedStory.location}</span>
                    <span>•</span>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{selectedStory.date}</span>
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4 max-h-[50vh] overflow-y-auto">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-light">
                  {currentLang === 'or' ? selectedStory.fullStoryOr : selectedStory.fullStoryEn}
                </p>

                <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex items-center justify-between text-xs font-light text-sky-950">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-600" />
                    Impact Verified by Babujang Panchayat
                  </span>
                  <span className="font-mono text-sky-900">{selectedStory.beneficiariesCount} Beneficiaries Reached</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedStory(null)}
                  className="px-6 py-2.5 bg-sky-800 hover:bg-sky-900 text-white font-light text-xs rounded-full transition-colors"
                >
                  Close Story
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};

