import React, { useState } from 'react';
import { OfficeBearer, Language } from '../types';
import { 
  Users, 
  Phone, 
  UserCheck, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface LeadershipSectionProps {
  leadership: OfficeBearer[];
  currentLang: Language;
}

export const LeadershipSection: React.FC<LeadershipSectionProps> = ({
  leadership,
  currentLang,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'executive' | 'advisory' | 'trustee'>('all');

  const sortedTeam = [...leadership].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  const filteredTeam = activeTab === 'all'
    ? sortedTeam
    : sortedTeam.filter(m => m.category === activeTab);

  return (
    <section id="leadership" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-sky-100/80 text-sky-950 text-xs font-light tracking-wider uppercase border border-sky-200">
            <Users className="w-3.5 h-3.5 text-sky-700" />
            <span>{currentLang === 'or' ? 'ସଙ୍ଗଠନ ନେତୃତ୍ୱ ଓ କର୍ମକର୍ତ୍ତା' : 'Foundation Leadership'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 tracking-tight font-heading">
            {currentLang === 'or' ? (
              <span className="font-oriya font-normal text-sky-950">ବାବୁଜଙ୍ଗ ସୋସିଆଲ ୱେଲଫେର ଫାଉଣ୍ଡେସନର ସେବାବ୍ରତୀ ନେତୃମଣ୍ଡଳୀ</span>
            ) : (
              <span>Dedicated Leaders of <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-800 to-blue-950 font-normal">Babujang</span></span>
            )}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-light">
            {currentLang === 'or' ? (
              'ଆମର ସଭାପତି, ଚେୟାରପରସନ, ସାଧାରଣ ସମ୍ପାଦକ ଏବଂ ଉପଦେଷ୍ଟାମଣ୍ଡଳୀ ଯେଉଁମାନେ ବାବୁଜଙ୍ଗ ଓ କଟକ ଅଞ୍ଚଳରେ ନିଃସ୍ୱାର୍ଥପର ଭାବେ ସାମାଜିକ ସେବା ଯୋଗାଇ ଆସୁଛନ୍ତି।'
            ) : (
              'Meet the executive board, chairpersons, and community advisors guiding transparent social welfare and relief drives across Cuttack district.'
            )}
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-xs font-light transition-all ${
                activeTab === 'all'
                  ? 'bg-sky-800 text-white font-normal shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {currentLang === 'or' ? 'ସମସ୍ତ କର୍ମକର୍ତ୍ତା' : 'All Office Bearers'}
            </button>

            <button
              onClick={() => setActiveTab('executive')}
              className={`px-4 py-2 rounded-full text-xs font-light transition-all ${
                activeTab === 'executive'
                  ? 'bg-sky-800 text-white font-normal shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {currentLang === 'or' ? 'କାର୍ଯ୍ୟକାରୀ କମିଟି' : 'Executive Council'}
            </button>

            <button
              onClick={() => setActiveTab('advisory')}
              className={`px-4 py-2 rounded-full text-xs font-light transition-all ${
                activeTab === 'advisory'
                  ? 'bg-sky-800 text-white font-normal shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {currentLang === 'or' ? 'ଉପଦେଷ୍ଟା ମଣ୍ଡଳୀ' : 'Advisory Board'}
            </button>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredTeam.map((member) => (
            <div 
              key={member.id}
              className="glass-card rounded-2xl sm:rounded-3xl border border-sky-100/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-0.5"
            >
              {/* Photo Frame */}
              <div className="relative h-56 sm:h-64 lg:h-72 bg-slate-900 overflow-hidden flex items-center justify-center">
                <img 
                  src={member.imageUrl} 
                  alt={member.nameEn}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Role Ribbon Tag */}
                <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4">
                  <span className="bg-sky-950/80 backdrop-blur-md text-sky-200 text-[10px] font-mono px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider border border-sky-500/30">
                    <UserCheck className="w-3.5 h-3.5 text-sky-300" />
                    {currentLang === 'or' ? (member.roleOr || member.roleEn) : member.roleEn}
                  </span>
                </div>

                {/* Name Overlay on Photo */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 sm:bottom-4 sm:left-4 sm:right-4 text-white space-y-0.5">
                  <h3 className="text-lg sm:text-xl font-normal leading-snug drop-shadow-md font-heading">
                    {currentLang === 'or' ? (member.nameOr || member.nameEn) : member.nameEn}
                  </h3>
                  <p className="text-xs text-sky-300 font-light font-mono">
                    {currentLang === 'or' ? member.nameEn : (member.nameOr || '')}
                  </p>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col justify-between space-y-3.5">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light italic border-l-2 border-sky-600 pl-3 bg-sky-50/50 py-2 rounded-r-xl">
                  "{currentLang === 'or' ? member.bioOr : member.bioEn}"
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-light">
                  <span className="text-sky-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    Verified Leadership
                  </span>

                  {member.phone ? (
                    <a 
                      href={`tel:${member.phone}`}
                      className="text-slate-700 font-mono font-medium flex items-center gap-1 hover:text-sky-800 transition-colors bg-sky-50 px-3 py-1 rounded-full border border-sky-100"
                    >
                      <Phone className="w-3.5 h-3.5 text-sky-600" />
                      {member.phone}
                    </a>
                  ) : (
                    <span className="text-slate-400 font-mono text-[11px]">Babujang Chapter</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

