import React, { useState } from 'react';
import { DonationDrive, Language } from '../types';
import { 
  Utensils, 
  Shirt, 
  HeartPulse, 
  Coins, 
  GraduationCap, 
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  MapPin,
  MessageCircle,
  Layers,
  HeartHandshake
} from 'lucide-react';

interface InitiativesAndWorkProps {
  drives: DonationDrive[];
  currentLang: Language;
  onOpenContactModal: () => void;
}

export const InitiativesAndWork: React.FC<InitiativesAndWorkProps> = ({
  drives,
  currentLang,
  onOpenContactModal
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'drives' | 'pillars'>('all');

  const pillars = [
    {
      icon: Utensils,
      color: 'from-sky-700 to-blue-900',
      bgLight: 'bg-sky-50/60',
      borderColor: 'border-sky-100/90',
      titleEn: 'Annadaana — Monthly Ration Kits',
      titleOr: 'ଅନ୍ନଦାନ — ମାସିକ ରାସନ ବଣ୍ଟନ',
      descEn: 'Delivering 15kg dry grocery packs (Rice, Dal, Oil, Salt, Spices, Biscuits) to elderly widows and helpless destitute residents.',
      descOr: 'ବାବୁଜଙ୍ଗ ଓ ଆଖପାଖ ପଞ୍ଚାୟତର ନିଃସହାୟ ବୃଦ୍ଧବୃଦ୍ଧାଙ୍କୁ ପ୍ରତି ମାସରେ ଶୁଖିଲା ରାସନ ସାମଗ୍ରୀ ପ୍ରଦାନ।',
      statEn: '1,250+ Grocery Kits Delivered',
      statOr: '୧,୨୫୦+ ରାସନ କିଟ୍‌ ପ୍ରଦାନ'
    },
    {
      icon: Shirt,
      color: 'from-blue-700 to-indigo-900',
      bgLight: 'bg-blue-50/60',
      borderColor: 'border-blue-100/90',
      titleEn: 'Vastradaana — Clothes & Blankets',
      titleOr: 'ବସ୍ତ୍ରଦାନ — ନୂତନ ପୋଷାକ ଓ କମ୍ବଳ',
      descEn: 'Distributing new cotton sarees, dhotis, children wear, and heavy woollen blankets before severe winter cold waves.',
      descOr: 'ଶୀତ ଦିନରେ ଏବଂ ପର୍ବପର୍ବାଣୀରେ ଗରିବ ପରିବାର, ମହିଳା ଓ ଶିଶୁମାନଙ୍କୁ ନୂଆ ଶାଢ଼ୀ, ଧୋତି ଓ କମ୍ବଳ ବଣ୍ଟନ।',
      statEn: '800+ Families Clothed',
      statOr: '୮୦୦+ ପରିବାରକୁ ବସ୍ତ୍ର'
    },
    {
      icon: HeartPulse,
      color: 'from-sky-800 to-teal-900',
      bgLight: 'bg-teal-50/50',
      borderColor: 'border-teal-100/90',
      titleEn: 'Chikitsa Seva — Medical Relief',
      titleOr: 'ଚିକିତ୍ସା ସେବା — ମାଗଣା ଔଷଧ ଓ ଚିକିତ୍ସା',
      descEn: 'Direct monetary aid for poor patients requiring urgent surgery, chronic disease medicines, or testing at SCB Medical College Cuttack.',
      descOr: 'ଗୁରୁତର ରୋଗୀ, ଅସ୍ତ୍ରୋପଚାର ଓ ନିୟମିତ ଔଷଧ ପାଇଁ ଅର୍ଥାଭାବରେ ଥିବା ଗ୍ରାମବାସୀଙ୍କୁ ଚିକିତ୍ସା ଅନୁଦାନ।',
      statEn: '₹4.5L+ Medical Aid Disbursed',
      statOr: '₹୪.୫ ଲକ୍ଷ+ ଚିକିତ୍ସା ସହାୟତା'
    },
    {
      icon: Coins,
      color: 'from-indigo-700 to-slate-900',
      bgLight: 'bg-indigo-50/50',
      borderColor: 'border-indigo-100/90',
      titleEn: 'Emergency Financial Assistance',
      titleOr: 'ଆପାତକାଳୀନ ଜରୁରୀ ଆର୍ଥିକ ସହାୟତା',
      descEn: 'Immediate cash relief for impoverished households during sudden bereavement, accidental emergency, or catastrophic loss.',
      descOr: 'ପରିବାରର ରୋଜଗାରିଆ ବ୍ୟକ୍ତିଙ୍କ ମୃତ୍ୟୁ ବା ଦୁର୍ଘଟଣା ସମୟରେ ଆପାତକାଳୀନ ନଗଦ ସହାୟତା।',
      statEn: 'Direct Fast Verification',
      statOr: 'ଜରୁରୀକାଳୀନ ନିଷ୍ପତ୍ତି'
    },
    {
      icon: GraduationCap,
      color: 'from-sky-900 to-indigo-950',
      bgLight: 'bg-sky-50/70',
      borderColor: 'border-sky-200/70',
      titleEn: 'Shiksha Sahayata — Rural Student Aid',
      titleOr: 'ଶିକ୍ଷା ସହାୟତା — ଗରିବ ଛାତ୍ରଛାତ୍ରୀଙ୍କୁ ସମ୍ବଳ',
      descEn: 'Sponsoring school bags, notebooks, geometry boxes, raincoats, and examination fees for underprivileged children.',
      descOr: 'ମେଧାବୀ ଓ ଗରିବ ଛାତ୍ରଛାତ୍ରୀଙ୍କୁ ପାଠ୍ୟପୁସ୍ତକ, ବ୍ୟାଗ, ସ୍କୁଲ ଡ୍ରେସ ଓ ଷ୍ଟେସନାରୀ।',
      statEn: '150+ Students Supported',
      statOr: '୧୫୦+ ଛାତ୍ରଛାତ୍ରୀଙ୍କୁ ସହାୟତା'
    },
    {
      icon: AlertTriangle,
      color: 'from-slate-800 to-blue-950',
      bgLight: 'bg-slate-100/60',
      borderColor: 'border-slate-200/80',
      titleEn: 'Monsoon Flood & Disaster Relief',
      titleOr: 'ବନ୍ୟା ଓ ବାତ୍ୟା ସମୟରେ ଜରୁରୀ ରିଲିଫ୍‌',
      descEn: 'Rapid response volunteer force delivering drinking water, dry chuda, cooked meals, and tarpaulins in flooded lowlands.',
      descOr: 'ବନ୍ୟାଞ୍ଚଳରେ ବୋଟ୍‌ ଓ ସ୍ୱେଚ୍ଛାସେବୀଙ୍କ ଦ୍ୱାରା ରନ୍ଧା ଖାଦ୍ୟ ଓ ସୁଖିଲା ରିଲିଫ୍‌ ସାମଗ୍ରୀ ବଣ୍ଟନ।',
      statEn: 'Rapid Volunteer Action',
      statOr: 'କ୍ଷିପ୍ର ସ୍ୱେଚ୍ଛାସେବୀ ମୁତୟନ'
    }
  ];

  return (
    <section id="initiatives" className="py-20 bg-slate-50 relative overflow-hidden border-t border-slate-100">
      {/* Anchor for legacy pillars scroll target */}
      <div id="pillars" className="absolute -top-10 left-0 w-px h-px pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-sky-100/80 text-sky-950 text-xs font-light tracking-wider uppercase border border-sky-200">
            <Sparkles className="w-3.5 h-3.5 text-sky-700" />
            <span>{currentLang === 'or' ? 'ଆମର କାର୍ଯ୍ୟକ୍ରମ ଓ ସେବା କ୍ଷେତ୍ର' : 'Initiatives & Our Work'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 tracking-tight font-heading">
            {currentLang === 'or' ? (
              <span className="font-oriya font-normal text-sky-950">ବାବୁଜଙ୍ଗରେ କାର୍ଯ୍ୟକ୍ରମ ଓ ନିରନ୍ତର ସମାଜସେବା</span>
            ) : (
              <span>Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-800 to-blue-900 font-normal">Initiatives & Pillars of Work</span></span>
            )}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-light">
            {currentLang === 'or' ? (
              'ଗରିବ, ନିଃସହାୟ ଓ ବୃଦ୍ଧବୃଦ୍ଧାଙ୍କ ସହାୟତା ପାଇଁ ବାବୁଜଙ୍ଗ ଓ କଟକରେ ନିୟମିତ ପରିଚାଳିତ ସେବା କାର୍ଯ୍ୟକ୍ରମ।'
            ) : (
              'Combining active emergency drives and core annual service programs across Babujang and Cuttack district.'
            )}
          </p>

          {/* Tab Filter Switcher */}
          <div className="flex items-center justify-center pt-2">
            <div className="bg-slate-200/70 p-1 rounded-full flex items-center gap-1 border border-slate-300/80">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === 'all'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {currentLang === 'or' ? 'ସମସ୍ତ' : 'All Programs'}
              </button>
              <button
                onClick={() => setActiveTab('drives')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === 'drives'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {currentLang === 'or' ? 'ଚାଲୁଥିବା ଅଭିଯାନ' : 'Active Drives'} ({drives.length})
              </button>
              <button
                onClick={() => setActiveTab('pillars')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === 'pillars'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {currentLang === 'or' ? 'ମୁଖ୍ୟ ସେବା' : 'Pillars of Work'} (6)
              </button>
            </div>
          </div>
        </div>

        {/* SECTION BLOCK 1: Active Drives */}
        {(activeTab === 'all' || activeTab === 'drives') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h3 className="text-lg font-normal text-slate-900 font-heading flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-emerald-600" />
                <span>{currentLang === 'or' ? 'ସାମ୍ପ୍ରତିକ ସହାୟତା ଅଭିଯାନ' : 'Ongoing Active Relief Drives'}</span>
              </h3>
              <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {drives.length} Drives Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {drives.map((drive) => (
                <div 
                  key={drive.id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group hover:-translate-y-0.5"
                >
                  {/* Image Banner */}
                  <div className="relative h-40 sm:h-48 bg-slate-900 overflow-hidden">
                    <img 
                      src={drive.imageUrl} 
                      alt={drive.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="bg-emerald-950/80 backdrop-blur-md text-emerald-200 text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/30">
                        {drive.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="bg-white/90 text-slate-800 text-[10px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        Babujang
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h4 className="text-base font-normal leading-snug drop-shadow-md font-heading">
                        {currentLang === 'or' ? drive.titleOr : drive.titleEn}
                      </h4>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light line-clamp-3">
                      {currentLang === 'or' ? drive.descriptionOr : drive.descriptionEn}
                    </p>

                    {/* Key items needed */}
                    {drive.itemsNeeded && drive.itemsNeeded.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {drive.itemsNeeded.map((item, idx) => (
                          <span key={idx} className="bg-sky-50 text-sky-900 text-[10px] px-2.5 py-1 rounded-md border border-sky-100 font-light">
                            {item}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-light text-slate-700">
                      <span className="flex items-center gap-1 text-emerald-800 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Target: ₹{drive.targetAmount.toLocaleString()}
                      </span>
                      <button
                        onClick={onOpenContactModal}
                        className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-[11px] font-medium transition-colors"
                      >
                        {currentLang === 'or' ? 'ଅଂଶଗ୍ରହଣ କରନ୍ତୁ' : 'Contribute / Contact'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION BLOCK 2: Core Pillars of Service */}
        {(activeTab === 'all' || activeTab === 'pillars') && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h3 className="text-lg font-normal text-slate-900 font-heading flex items-center gap-2">
                <Layers className="w-5 h-5 text-sky-700" />
                <span>{currentLang === 'or' ? 'ଆମର ୬ଟି ମୁଖ୍ୟ ସେବା କାର୍ଯ୍ୟ' : 'Our 6 Pillars of Community Service'}</span>
              </h3>
              <span className="text-xs font-mono text-sky-900 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                Core Foundation Programs
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pillars.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={idx}
                    className={`glass-card p-7 rounded-[2rem] border ${item.borderColor} ${item.bgLight} hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-5 hover:-translate-y-0.5 group`}
                  >
                    <div className="space-y-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${item.color} text-white rounded-2xl flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <h4 className="text-lg font-normal text-slate-900 leading-snug font-heading">
                        {currentLang === 'or' ? item.titleOr : item.titleEn}
                      </h4>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                        {currentLang === 'or' ? item.descOr : item.descEn}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs font-light text-slate-800">
                      <span className="flex items-center gap-1.5 text-sky-900 font-mono">
                        <CheckCircle2 className="w-4 h-4 text-sky-600" />
                        {currentLang === 'or' ? item.statOr : item.statEn}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Contact Callout */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-sky-950 rounded-[2.5rem] p-8 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-sky-800/50">
          <div className="space-y-2 text-center lg:text-left relative z-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-sky-300 bg-sky-400/10 px-3 py-1 rounded-full border border-sky-400/20">
              Community Outreach & Support
            </span>
            <h3 className="text-2xl sm:text-3xl font-light font-heading text-white">
              {currentLang === 'or' ? 'ଆପଣଙ୍କ ନିକଟରେ କେହି ନିଃସହାୟ ବ୍ୟକ୍ତି ଅଛନ୍ତି କି?' : 'Know Someone in Need of Food, Clothes, or Medical Aid?'}
            </h3>
            <p className="text-xs sm:text-sm text-sky-100/80 font-light max-w-2xl">
              {currentLang === 'or' ? 'ସିଧାସଳଖ ସୋସିଆଲ ୱେଲଫେର ଫାଉଣ୍ଡେସନ ବାବୁଜଙ୍ଗ ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ।' : 'Connect directly with our Babujang foundation office to report or request verified community assistance.'}
            </p>
          </div>

          <div className="flex items-center justify-center relative z-10 shrink-0">
            <button
              onClick={onOpenContactModal}
              className="px-7 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold rounded-full text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-200" />
              <span>{currentLang === 'or' ? 'ଯୋଗାଯୋଗ କରନ୍ତୁ' : 'Contact Foundation Office'}</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
