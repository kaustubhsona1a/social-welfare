import React from 'react';
import { DonationDrive, Language } from '../types';
import { MapPin, Tag } from 'lucide-react';

interface CurrentDrivesProps {
  drives: DonationDrive[];
  currentLang: Language;
  onOpenContactModal: () => void;
}

export const CurrentDrives: React.FC<CurrentDrivesProps> = ({
  drives,
  currentLang,
}) => {
  return (
    <section id="initiatives" className="py-16 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono text-sky-800 uppercase tracking-widest bg-sky-100/70 px-3 py-1 rounded-full border border-sky-200">
            {currentLang === 'or' ? 'ଅଭିଯାନ' : 'Active Community Programs'}
          </span>

          <h2 className="text-2xl sm:text-4xl font-light text-slate-900 tracking-tight font-heading">
            {currentLang === 'or' ? (
              <span className="font-oriya font-normal text-sky-950">ବାବୁଜଙ୍ଗରେ ଚାଲୁଥିବା ସେବା କାର୍ଯ୍ୟ</span>
            ) : (
              <span>Ongoing Community <span className="text-sky-800 font-normal">Initiatives</span></span>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 font-light">
            {currentLang === 'or' ? (
              'ଗରିବ, ନିଃସହାୟ ଓ ବୃଦ୍ଧବୃଦ୍ଧାଙ୍କ ସହାୟତା ପାଇଁ ବାବୁଜଙ୍ଗରେ ନିୟମିତ ପରିଚାଳିତ କାର୍ଯ୍ୟକ୍ରମ।'
            ) : (
              'Regular food distribution, blanket drives, and emergency medical assistance in Babujang, Cuttack.'
            )}
          </p>
        </div>

        {/* Drives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drives.map((drive) => (
            <div 
              key={drive.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              {/* Image Banner */}
              <div className="relative h-48 bg-slate-900 overflow-hidden">
                <img 
                  src={drive.imageUrl} 
                  alt={drive.titleEn}
                  className="w-full h-full object-cover opacity-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                <div className="absolute top-3 left-3">
                  <span className="bg-sky-950/80 text-sky-200 text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-sky-500/30">
                    {drive.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 text-slate-800 text-[10px] font-light px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-sky-600" />
                    Babujang
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-base font-normal leading-snug drop-shadow-md font-heading">
                    {currentLang === 'or' ? drive.titleOr : drive.titleEn}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  {currentLang === 'or' ? drive.descriptionOr : drive.descriptionEn}
                </p>

                {/* Key items needed */}
                {drive.itemsNeeded && drive.itemsNeeded.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {drive.itemsNeeded.map((item, idx) => (
                      <span key={idx} className="bg-sky-50 text-sky-900 text-[10px] px-2 py-0.5 rounded-md border border-sky-100 font-light">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};


