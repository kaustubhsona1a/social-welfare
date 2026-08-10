import React, { useState } from 'react';
import { Language, TransparencyDocument } from '../types';
import { FoundationRepository } from '../lib/supabase';
import { getLangText } from '../lib/language';
import { 
  FileCheck, 
  ShieldCheck, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  FileText, 
  Copy, 
  Check, 
  Clock, 
  Award, 
  FolderLock 
} from 'lucide-react';

interface TransparencySectionProps {
  currentLang: Language;
}

export const TransparencySection: React.FC<TransparencySectionProps> = ({ currentLang }) => {
  const documents = FoundationRepository.getDocuments();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<TransparencyDocument | null>(null);

  const handleCopyNo = (doc: TransparencyDocument) => {
    if (doc.docNumber) {
      navigator.clipboard.writeText(doc.docNumber);
      setCopiedId(doc.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'registration':
        return { label: 'Trust Reg', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'tax':
        return { label: 'Income Tax', bg: 'bg-sky-100 text-sky-800 border-sky-200' };
      case 'csr':
        return { label: 'CSR Status', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'report':
        return { label: 'Audit / Report', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'fcra':
        return { label: 'FCRA Govt', bg: 'bg-rose-100 text-rose-800 border-rose-200' };
      default:
        return { label: 'Official Doc', bg: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  return (
    <section id="transparency" className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
            <FolderLock className="w-3.5 h-3.5 text-emerald-400" />
            {currentLang === 'hi' ? 'दस्तावेज़ एवं सरकारी पारदर्शिता' : currentLang === 'or' ? 'ସରକାରୀ ଦସ୍ତାବିଜ ଓ ସ୍ୱଚ୍ଛତା' : 'Official Governance & Transparency'}
          </span>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight mb-4">
            {currentLang === 'hi' ? 'पारदर्शिता एवं कानूनी दस्तावेज (Documents Folder)' : currentLang === 'or' ? 'ଆଇନଗତ ପ୍ରମାଣପତ୍ର ଓ ଦସ୍ତାବିଜ' : 'Documents Folder & Verification'}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {currentLang === 'hi' 
              ? 'सोशल वेलफेयर फाउंडेशन भारत सरकार और ओडिशा सरकार के नियमानुसार 100% पंजीकृत और कर-मुक्त संस्था है।'
              : currentLang === 'or'
              ? 'ସୋସିଆଲ ୱେଲଫେର ଫାଉଣ୍ଡେସନ ଭାରତ ସରକାର ଓ ଆୟକର ବିଭାଗ ଅଧୀନରେ ସମ୍ପୂର୍ଣ୍ଣ ସ୍ୱୀକୃତିପ୍ରାପ୍ତ ଅନୁଷ୍ଠାନ।'
              : 'Our registration certificates, tax exemption approvals (12A & 80G), CSR filings, and audited annual reports are open for donor inspection.'
            }
          </p>
        </div>

        {/* Quick Reference Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-10 p-3 sm:p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 backdrop-blur-md text-xs">
          <div className="p-2.5 sm:p-3 bg-slate-900/60 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[10px]">Trust Reg No:</span>
            <strong className="text-emerald-300 font-mono text-xs sm:text-sm break-all">40762401394</strong>
          </div>
          <div className="p-2.5 sm:p-3 bg-slate-900/60 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[10px]">PAN Card:</span>
            <strong className="text-sky-300 font-mono text-xs sm:text-sm">AAATS0192K</strong>
          </div>
          <div className="p-2.5 sm:p-3 bg-slate-900/60 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[10px]">12A & 80G:</span>
            <strong className="text-amber-300 font-mono text-xs sm:text-sm">Approved (50% Tax Relief)</strong>
          </div>
          <div className="p-2.5 sm:p-3 bg-slate-900/60 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[10px]">CSR Registration:</span>
            <strong className="text-purple-300 font-mono text-xs sm:text-sm">CSR00081920</strong>
          </div>
        </div>

        {/* Documents Folder Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {documents.map(doc => {
            const badge = getCategoryBadge(doc.category);
            return (
              <div 
                key={doc.id}
                className="bg-slate-800/90 hover:bg-slate-800 rounded-2xl border border-slate-700 p-4 sm:p-5 flex flex-col justify-between transition-all hover:border-emerald-500/50 hover:shadow-xl group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                      {badge.label}
                    </span>

                    {doc.status === 'under_process' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400">
                        <Clock className="w-3 h-3" />
                        Processing
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-2.5 mb-2">
                    <FileText className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <h3 className="text-sm font-bold text-white font-heading leading-snug">
                      {getLangText(doc, 'title', currentLang)}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-3">
                    {getLangText(doc, 'description', currentLang)}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-700/80 space-y-2">
                  {doc.docNumber && (
                    <div className="flex items-center justify-between gap-1 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-700 text-[11px] font-mono">
                      <span className="text-slate-400 truncate">No: {doc.docNumber}</span>
                      <button
                        onClick={() => handleCopyNo(doc)}
                        className="text-slate-300 hover:text-white p-1 rounded hover:bg-slate-800"
                        title="Copy Document Number"
                      >
                        {copiedId === doc.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedDoc(doc)}
                    className="w-full py-2 bg-slate-700/80 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Certificate Info</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base font-heading">
                <FileCheck className="w-5 h-5" />
                <span>{getLangText(selectedDoc, 'title', currentLang)}</span>
              </div>
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedDoc(null);
                }}
                className="text-slate-400 hover:text-white text-xs font-bold px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 font-mono space-y-1">
                <div>Registration / Ref No: <strong className="text-emerald-300">{selectedDoc.docNumber || 'Govt File Ref'}</strong></div>
                <div>Issue / Audit Date: <span className="text-slate-400">{selectedDoc.issueDate || '2024'}</span></div>
                <div>Approval Status: <span className="text-emerald-400 font-semibold">{selectedDoc.status.toUpperCase()}</span></div>
              </div>

              <p className="leading-relaxed">
                {getLangText(selectedDoc, 'description', currentLang)}
              </p>

              <div className="bg-emerald-950/40 border border-emerald-800/50 p-3 rounded-xl text-emerald-200 text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Verified under the Registrar of Public Trusts, Cuttack & Income Tax Department of India.</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
