import React from 'react';
import { Logo } from './Logo';
import { Language } from '../types';
import { FOUNDATION_INFO } from '../data/mockData';
import { 
  Phone, 
  MapPin, 
  Mail, 
  ExternalLink, 
  FileCheck, 
  MessageCircle, 
  ShieldCheck,
  Database,
  Camera
} from 'lucide-react';

interface FooterProps {
  currentLang: Language;
  onOpenContactModal: () => void;
  onOpenSupabaseModal?: () => void;
  onOpenOperatorPanel?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onOpenContactModal,
  onOpenSupabaseModal,
  onOpenOperatorPanel
}) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900">
      
      {/* Top CTA Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-blue-950 to-slate-950 text-white py-12 px-4 sm:px-6 relative overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-light font-heading">
              {currentLang === 'or' ? 'ସମାଜସେବାରେ ସାମିଲ ହୁଅନ୍ତୁ' : 'Join Hands to Serve Babujang'}
            </h3>
            <p className="text-xs sm:text-sm text-sky-200/90 font-light">
              {currentLang === 'or' 
                ? 'ବାବୁଜଙ୍ଗ ଓ କଟକ ଜିଲ୍ଲାର ନିଃସହାୟ ପରିବାରଙ୍କୁ ସହାୟତା ପାଇଁ ଆମ ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ।' 
                : 'Direct community welfare, food ration, and emergency aid for families in need.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenContactModal}
              className="px-7 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-light rounded-full text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-sky-200" />
              <span>{currentLang === 'or' ? 'ଯୋଗାଯୋଗ କରନ୍ତୁ' : 'Contact Office'}</span>
            </button>

            <a
              href={`tel:${FOUNDATION_INFO.phone.replace(/\s+/g, '')}`}
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-850 text-white font-light rounded-full text-xs border border-sky-500/30 transition-all flex items-center gap-2 font-mono"
            >
              <Phone className="w-4 h-4 text-sky-400" />
              <span>{FOUNDATION_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Foundation Info (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <Logo size="md" showText className="text-white" />

            <div className="text-xs space-y-2 text-slate-400 font-light leading-relaxed">
              <p className="text-white font-normal text-sm font-heading">
                {FOUNDATION_INFO.nameOr}
              </p>
              <p className="max-w-md">
                Government registered non-profit welfare trust in Babujang, Cuttack district (Odisha), dedicated to providing food security, clothing, medical aid, and emergency relief to underprivileged households.
              </p>

              <div className="pt-1 flex items-center gap-2 text-sky-400 font-mono text-xs">
                <FileCheck className="w-4 h-4 text-sky-400" />
                <span>Govt Reg. No: <strong className="text-white font-medium">{FOUNDATION_INFO.regNo}</strong></span>
              </div>
            </div>
          </div>

          {/* Contact Details (6 cols) */}
          <div className="lg:col-span-6 space-y-4 text-xs">
            <h4 className="text-white font-light text-xs uppercase tracking-wider border-b border-slate-800 pb-2 font-mono">
              Official Headquarters & Contact
            </h4>

            <div className="space-y-3 text-slate-300 font-light">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>{FOUNDATION_INFO.addressEn}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`tel:${FOUNDATION_INFO.phone}`} className="hover:text-sky-300 font-mono font-normal text-white transition-colors">
                  {FOUNDATION_INFO.phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{FOUNDATION_INFO.email}</span>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-2">
                <a
                  href={FOUNDATION_INFO.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800 text-xs font-light transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Official Facebook Page</span>
                </a>

                {onOpenOperatorPanel && (
                  <button
                    onClick={onOpenOperatorPanel}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-light transition-all"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Operator Hub (Upload Images)</span>
                  </button>
                )}

                {onOpenSupabaseModal && (
                  <button
                    onClick={onOpenSupabaseModal}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-light transition-all"
                  >
                    <Database className="w-3.5 h-3.5 text-sky-400" />
                    <span>Supabase Backend Script</span>
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-light">
          <p>
            © {new Date().getFullYear()} <strong className="text-emerald-400 font-black uppercase tracking-wider">SOCIAL WELFARE FOUNDATION</strong> Babujang, Cuttack. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-sky-400 font-mono text-xs">
            <ShieldCheck className="w-4 h-4 text-sky-500" />
            <span>100% Volunteer Driven</span>
          </div>
        </div>

      </div>
    </footer>
  );
};


