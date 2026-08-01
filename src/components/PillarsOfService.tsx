import React from 'react';
import { Language } from '../types';
import { 
  Utensils, 
  Shirt, 
  HeartPulse, 
  Coins, 
  GraduationCap, 
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Phone,
  MessageCircle
} from 'lucide-react';

interface PillarsOfServiceProps {
  currentLang: Language;
  onOpenContactModal: () => void;
}

export const PillarsOfService: React.FC<PillarsOfServiceProps> = ({
  currentLang,
  onOpenContactModal
}) => {
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
    <section id="pillars" className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-sky-100/80 text-sky-950 text-xs font-light tracking-wider uppercase border border-sky-200">
            <Sparkles className="w-3.5 h-3.5 text-sky-700" />
            <span>{currentLang === 'or' ? 'ଆମର ମୁଖ୍ୟ ସେବା କାର୍ଯ୍ୟ' : 'Pillars of Community Relief'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 tracking-tight font-heading">
            {currentLang === 'or' ? (
              <span className="font-oriya font-normal text-sky-950">କେଉଁ କ୍ଷେତ୍ରରେ ଆମେ ସହାୟତା ଯୋଗାଇ ଦେଉଛୁ?</span>
            ) : (
              <span>How We Serve <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-800 to-blue-900 font-normal">Babujang & Cuttack</span></span>
            )}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-light">
            {currentLang === 'or' ? (
              'ସୋସିଆଲ ୱେଲଫେର ଫାଉଣ୍ଡେସନ ବାବୁଜଙ୍ଗ ଦ୍ୱାରା ନିୟମିତ ପରିଚାଳିତ ହେଉଥିବା ୬ଟି ମୁଖ୍ୟ ସମାଜସେବା କାର୍ଯ୍ୟ।'
            ) : (
              'Every program is designed to deliver immediate dignity, food security, and direct aid with complete transparency.'
            )}
          </p>
        </div>

        {/* Pillars Grid */}
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

                  <h3 className="text-lg font-normal text-slate-900 leading-snug font-heading">
                    {currentLang === 'or' ? item.titleOr : item.titleEn}
                  </h3>

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

        {/* Bottom Flowy Showcase Banner */}
        <div className="mt-14 bg-gradient-to-r from-slate-900 via-blue-950 to-sky-950 rounded-[2.5rem] p-8 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-sky-800/50">
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

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
              className="px-7 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-light rounded-full text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-sky-200" />
              <span>{currentLang === 'or' ? 'ଯୋଗାଯୋଗ କରନ୍ତୁ' : 'Contact Foundation Office'}</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

