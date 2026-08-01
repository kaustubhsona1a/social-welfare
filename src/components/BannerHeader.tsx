import React from 'react';
import { Logo } from './Logo';
import { FOUNDATION_INFO } from '../data/mockData';
import { Phone, MapPin, FileCheck, ExternalLink, Megaphone, Sparkles } from 'lucide-react';

export const BannerHeader: React.FC = () => {
  return (
    <div className="relative border-b border-sky-100/60 bg-white/90 backdrop-blur-md">
      
      {/* Top Announcement Marquee Ticker */}
      <div className="bg-gradient-to-r from-sky-950 via-blue-950 to-slate-950 text-sky-100 py-1.5 px-4 text-xs overflow-hidden border-b border-sky-900/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 bg-blue-900/80 text-sky-200 px-2.5 py-0.5 rounded-full text-[10px] font-medium shrink-0 uppercase tracking-widest border border-sky-700/50">
            <Megaphone className="w-3 h-3 text-sky-300 animate-pulse" />
            <span>Community Showcase</span>
          </div>

          <div className="overflow-hidden flex-1 relative hidden sm:block">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-[11px] text-sky-100/90 font-light">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-sky-300" />
                <span>ସୋସିଆଲ ୱେଲଫେୟାର ଫାଉଣ୍ଡେସନ୍ • ବାବୁଜଙ୍ଗ, କଟକ</span>
              </span>
              <span>•</span>
              <span>Active Programs: Food Rations, Winter Clothing & Medical Relief in Babujang</span>
              <span>•</span>
              <span className="text-sky-200 font-normal">Reg No: {FOUNDATION_INFO.regNo}</span>
              <span>•</span>
              <span>Direct Phone: {FOUNDATION_INFO.phone}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] shrink-0 font-light text-sky-200">
            <span className="hidden md:inline text-sky-300/80 font-mono">Estd. {FOUNDATION_INFO.estdYear}</span>
            <a 
              href={`tel:${FOUNDATION_INFO.phone.replace(/\s+/g, '')}`} 
              className="hover:text-white transition-colors font-mono font-medium flex items-center gap-1 text-sky-300"
            >
              <Phone className="w-3 h-3 text-sky-400" />
              <span>{FOUNDATION_INFO.phone}</span>
            </a>
          </div>

        </div>
      </div>

      {/* Main Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-sky-50/70 via-blue-50/40 to-slate-50/60 py-4 sm:py-5 px-4 sm:px-6">
        
        {/* Soft Flowy Ambient Glows */}
        <div className="absolute -top-10 left-1/3 w-80 h-80 bg-sky-200/40 rounded-full blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute -bottom-10 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none animate-float-reverse" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
          
          {/* Left: Logo & NGO Accreditation */}
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-600 to-blue-600 rounded-2xl blur-md opacity-30 group-hover:opacity-60 transition duration-500" />
              <Logo size="lg" className="relative shadow-xs" />
            </div>

            <div className="hidden sm:block h-10 w-px bg-sky-200/80" />

            <div className="text-xs space-y-0.5">
              <div className="inline-flex items-center gap-1.5 bg-sky-100/80 text-sky-950 px-3 py-0.5 rounded-full text-[11px] font-normal border border-sky-200/80">
                <FileCheck className="w-3.5 h-3.5 text-sky-700" />
                <span>Reg. No: <strong className="font-mono font-medium text-sky-900">{FOUNDATION_INFO.regNo}</strong></span>
              </div>
              <p className="text-slate-500 font-light text-[11px] pt-0.5">
                Government Registered Community Trust
              </p>
            </div>
          </div>

          {/* Center Title: Thin, Elegant Typography */}
          <div className="text-center space-y-0.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-sky-950 tracking-tight font-oriya leading-tight">
              {FOUNDATION_INFO.nameOr}
            </h1>
            <h2 className="text-sm sm:text-base font-normal text-sky-800 font-oriya">
              {FOUNDATION_INFO.subLocationOr}
            </h2>

            <p className="text-xs font-light text-slate-600 tracking-widest uppercase font-heading pt-0.5">
              {FOUNDATION_INFO.nameEn} • {FOUNDATION_INFO.subLocationEn}
            </p>

            <div className="inline-flex items-center gap-1.5 text-slate-500 text-[11px] font-light pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>{FOUNDATION_INFO.addressEn}</span>
            </div>
          </div>

          {/* Right Links */}
          <div className="flex flex-row md:flex-col items-center md:items-end gap-2">
            <a 
              href={`tel:${FOUNDATION_INFO.phone.replace(/\s+/g, '')}`} 
              className="px-4 py-2 bg-gradient-to-r from-sky-700 to-blue-800 hover:from-sky-800 hover:to-blue-900 text-white font-light text-xs rounded-full shadow-xs hover:shadow-md transition-all flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-sky-300" />
              <span className="font-mono">{FOUNDATION_INFO.phone}</span>
            </a>

            <a
              href={FOUNDATION_INFO.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white/80 hover:bg-white text-slate-600 hover:text-sky-800 font-light text-[11px] rounded-full border border-slate-200 transition-all flex items-center gap-1.5"
            >
              <ExternalLink className="w-3 h-3 text-sky-600" />
              <span>Facebook Page</span>
            </a>
          </div>

        </div>
      </div>

    </div>
  );
};

