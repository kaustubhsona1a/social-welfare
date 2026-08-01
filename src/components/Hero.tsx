import React from 'react';
import { Language } from '../types';
import { FOUNDATION_INFO } from '../data/mockData';
import { 
  Phone,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface HeroProps {
  currentLang: Language;
  onOpenContactModal: () => void;
  onExploreWork: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentLang,
  onOpenContactModal,
  onExploreWork
}) => {
  return (
    <section id="home" className="relative py-10 sm:py-20 bg-gradient-to-b from-sky-50/70 via-slate-50 to-slate-50 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8 relative z-10">
        
        {/* Government Reg Badge */}
        <div className="inline-flex flex-wrap sm:flex-nowrap items-center justify-center gap-1.5 sm:gap-2 bg-white px-3.5 py-1.5 rounded-full border border-sky-200/90 shadow-2xs text-[11px] sm:text-xs font-light text-slate-700 max-w-full">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-600 shrink-0" />
            <span>Govt Reg: <strong className="font-mono text-slate-900 font-medium">{FOUNDATION_INFO.regNo}</strong></span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="text-sky-800 font-medium text-[10px] sm:text-xs bg-sky-50 px-2 py-0.5 rounded-full sm:bg-transparent sm:p-0">Babujang, Cuttack</span>
        </div>

        {/* Hero Headline */}
        <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto px-1 sm:px-0">
          <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-light text-slate-900 leading-tight sm:leading-[1.2] tracking-tight font-heading">
            {currentLang === 'or' ? (
              <>
                <span className="font-oriya font-bold text-emerald-600 uppercase block text-xl xs:text-2xl sm:text-4xl lg:text-5xl leading-snug">
                  ସୋସିଆଲ ୱେଲଫେର ଫାଉଣ୍ଡେସନ
                </span>
                <span className="text-lg xs:text-xl sm:text-3xl lg:text-4xl text-sky-800 font-light font-oriya pt-1 block">
                  "ମାନବ ସେବା ହିଁ ମାଧବ ସେବା"
                </span>
              </>
            ) : (
              <>
                <span className="font-black text-emerald-600 uppercase tracking-wide sm:tracking-wider block text-xl xs:text-2xl sm:text-4xl lg:text-5xl leading-tight">
                  SOCIAL WELFARE FOUNDATION
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-700 to-blue-900 font-normal block text-lg xs:text-2xl sm:text-4xl lg:text-5xl pt-1">
                  Babujang, Cuttack
                </span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-base lg:text-lg text-slate-600 font-light max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
            {currentLang === 'or' ? (
              'ବାବୁଜଙ୍ଗ ଓ କଟକ ଅଞ୍ଚଳରେ ନିଃସହାୟ ପରିବାର, ବୃଦ୍ଧବୃଦ୍ଧା ଓ ଗରିବ ଛାତ୍ରଛାତ୍ରୀଙ୍କ ପାଇଁ ନିୟମିତ ମାଗଣା ରାସନ, ନୂତନ ପୋଷାକ, କମ୍ବଳ ଏବଂ ଜରୁରୀ ଚିକିତ୍ସା ସହାୟତା।'
            ) : (
              'Direct food security, winter clothing, medical aid, and emergency relief delivered directly to helpless destitute families across Babujang and Cuttack district.'
            )}
          </p>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 w-full max-w-xs sm:max-w-none mx-auto pt-1 sm:pt-2">
          <button
            onClick={onOpenContactModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-700 to-blue-900 hover:from-sky-800 hover:to-blue-950 text-white font-light text-xs sm:text-sm px-6 py-3 sm:px-7 sm:py-3.5 rounded-full shadow-xs hover:shadow-md transition-all active:scale-98"
          >
            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-300" />
            <span>{currentLang === 'or' ? 'ଯୋଗାଯୋଗ କରନ୍ତୁ' : 'Contact Office'}</span>
          </button>

          <button
            onClick={onExploreWork}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-light text-xs sm:text-sm px-6 py-3 sm:py-3.5 rounded-full border border-slate-200 shadow-2xs transition-all active:scale-98"
          >
            <span>{currentLang === 'or' ? 'ସେବା କାର୍ଯ୍ୟ ଦେଖନ୍ତୁ' : 'Explore Services'}</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
          </button>
        </div>

        {/* Clean 3-Column Stats Row */}
        <div className="pt-4 sm:pt-8 max-w-3xl mx-auto grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-sky-100 shadow-2xs space-y-0.5 sm:space-y-1 flex flex-col justify-center">
            <div className="text-lg xs:text-xl sm:text-2xl font-normal text-sky-950 font-mono">1,250+</div>
            <div className="text-[10px] sm:text-xs font-light text-slate-600 leading-tight">
              {currentLang === 'or' ? 'ସହାୟତା ପ୍ରାପ୍ତ ପରିବାର' : 'Families Supported'}
            </div>
          </div>

          <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-sky-100 shadow-2xs space-y-0.5 sm:space-y-1 flex flex-col justify-center">
            <div className="text-lg xs:text-xl sm:text-2xl font-normal text-sky-950 font-mono">800+</div>
            <div className="text-[10px] sm:text-xs font-light text-slate-600 leading-tight">
              {currentLang === 'or' ? 'ବସ୍ତ୍ର ବଣ୍ଟନ' : 'Clothes & Blankets'}
            </div>
          </div>

          <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-sky-100 shadow-2xs space-y-0.5 sm:space-y-1 flex flex-col justify-center">
            <div className="text-lg xs:text-xl sm:text-2xl font-normal text-sky-950 font-mono">100%</div>
            <div className="text-[10px] sm:text-xs font-light text-slate-600 leading-tight">
              {currentLang === 'or' ? 'ନିଃସ୍ୱାର୍ଥପର ସେବା' : 'Non-Profit Trust'}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};


