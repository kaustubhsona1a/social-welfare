import React, { useState, useEffect } from 'react';
import { SuccessStory, Language, PaymentInfo, DonorRecord } from '../types';
import { FoundationRepository } from '../lib/supabase';
import { 
  HeartHandshake, 
  MapPin, 
  Users, 
  X, 
  BookOpen, 
  Sparkles, 
  QrCode, 
  Copy, 
  Check, 
  Building2, 
  CreditCard, 
  ShieldCheck, 
  Maximize2,
  Lock,
  Award
} from 'lucide-react';

interface DonateAndImpactProps {
  stories: SuccessStory[];
  currentLang: Language;
  onOpenContactModal: () => void;
}

export const DonateAndImpact: React.FC<DonateAndImpactProps> = ({
  stories,
  currentLang,
  onOpenContactModal
}) => {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>(() => FoundationRepository.getPaymentInfo());
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [recentDonors, setRecentDonors] = useState<DonorRecord[]>(() => FoundationRepository.getDonors());

  useEffect(() => {
    const handleUpdate = () => {
      setPaymentInfo(FoundationRepository.getPaymentInfo());
      setRecentDonors(FoundationRepository.getDonors());
    };

    window.addEventListener('payment_info_updated', handleUpdate);
    window.addEventListener('repository_updated', handleUpdate);
    return () => {
      window.removeEventListener('payment_info_updated', handleUpdate);
      window.removeEventListener('repository_updated', handleUpdate);
    };
  }, []);

  const handleCopy = (text: string, type: 'upi' | 'acc' | 'ifsc') => {
    navigator.clipboard.writeText(text);
    if (type === 'upi') {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    } else if (type === 'acc') {
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2500);
    } else if (type === 'ifsc') {
      setCopiedIfsc(true);
      setTimeout(() => setCopiedIfsc(false), 2500);
    }
  };

  return (
    <section id="stories" className="py-20 bg-gradient-to-b from-slate-50 via-sky-50/30 to-slate-50 relative overflow-hidden">
      {/* Anchor for legacy donate navigation links */}
      <div id="donate-impact" className="absolute -top-10 left-0 w-px h-px pointer-events-none" />
      <div id="drives" className="absolute -top-10 left-0 w-px h-px pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-100/90 text-emerald-950 text-xs font-light tracking-wider uppercase border border-emerald-200">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />
            <span>{currentLang === 'or' ? 'ଦାନ ଓ ପ୍ରଭାବ' : 'Donate & Community Impact'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 tracking-tight font-heading">
            {currentLang === 'or' ? (
              <span className="font-oriya font-normal text-sky-950">ସାହାଯ୍ୟ କରନ୍ତୁ ଏବଂ ସେବାର ପ୍ରଭାବ ଦେଖନ୍ତୁ</span>
            ) : (
              <span>Empower Lives Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 to-teal-900 font-normal">Direct Giving & Impact</span></span>
            )}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-light">
            {currentLang === 'or' ? (
              'ବାବୁଜଙ୍ଗ ସୋସିଆଲ ୱେଲଫେର ଫାଉଣ୍ଡେସନକୁ ସିଧାସଳଖ ୟୁପିଆଇ / ବ୍ୟାଙ୍କ ବାରକୋଡ ଦ୍ୱାରା ଅନୁଦାନ ଦିଅନ୍ତୁ ଏବଂ ଆମ ସଫଳତାର କାହାଣୀ ଦେଖନ୍ତୁ।'
            ) : (
              '100% transparent local community relief. Scan the official barcode below or copy UPI & bank account details to support families in Babujang, Cuttack.'
            )}
          </p>
        </div>

        {/* DONATE & UPI PAYMENT PORTAL CARD */}
        <div className="bg-white rounded-[2.5rem] border border-emerald-200/80 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-4 border-b border-emerald-800/40">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                Official Registered NGO Account
              </span>
              <h3 className="text-xl sm:text-2xl font-light font-heading text-white flex items-center justify-center md:justify-start gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span>{currentLang === 'or' ? 'ଅଫିସିଆଲ୍‌ ୟୁପିଆଇ ବାରକୋଡ୍‌ ଓ ବ୍ୟାଙ୍କ ତଥ୍ୟ' : 'Official UPI Barcode & Bank Portal'}</span>
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-200/90 font-mono bg-white/10 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-md">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct Bank Verification Active</span>
            </div>
          </div>

          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Barcode Display & Scan Card */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4 bg-emerald-50/50 p-6 sm:p-8 rounded-[2rem] border border-emerald-100 text-center">
              <div className="relative group cursor-pointer" onClick={() => setShowQrModal(true)}>
                <div className="w-56 h-56 sm:w-64 sm:h-64 bg-white p-4 rounded-3xl border-2 border-emerald-300 shadow-md flex items-center justify-center overflow-hidden group-hover:border-emerald-500 transition-all">
                  <img 
                    src={paymentInfo.upiQrUrl} 
                    alt="Official Payment UPI Barcode" 
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
                <div className="absolute inset-0 bg-slate-900/60 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-2">
                  <Maximize2 className="w-5 h-5 text-emerald-300" />
                  <span>Click to Enlarge Barcode</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-800 flex items-center justify-center gap-1">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>{currentLang === 'or' ? 'ସ୍କାନ୍‌ କରି ଦାନ କରନ୍ତୁ (Google Pay / PhonePe / Paytm)' : 'Scan Barcode with Any UPI App'}</span>
                </span>
                <p className="text-[11px] text-slate-500 font-light">
                  Supports GPay, PhonePe, Paytm, BHIM, Amazon Pay & All Indian Bank UPI Apps
                </p>
              </div>

              <button
                onClick={() => setShowQrModal(true)}
                className="px-4 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold rounded-full text-xs transition-colors inline-flex items-center gap-1.5"
              >
                <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>{currentLang === 'or' ? 'ବଡ଼ ଆକାରରେ ଦେଖନ୍ତୁ' : 'View Full Barcode'}</span>
              </button>
            </div>

            {/* Right: Payment Details & Direct Copy */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* UPI ID Copy Block */}
              <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl space-y-3 border border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="uppercase tracking-wider flex items-center gap-1 text-emerald-400">
                    <CreditCard className="w-4 h-4" />
                    <span>Official UPI VPA ID</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Verified NGO
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-base sm:text-lg font-mono font-bold text-emerald-300 tracking-wide break-all">
                    {paymentInfo.upiId}
                  </span>

                  <button
                    onClick={() => handleCopy(paymentInfo.upiId, 'upi')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 ${
                      copiedUpi 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    }`}
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied UPI ID!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy UPI ID</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Bank Transfer Details Grid */}
              <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200/80 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>Direct Bank NEFT / RTGS Transfer Details</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Account Holder Name</span>
                    <p className="font-semibold text-slate-900">{paymentInfo.accountHolder}</p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Bank Name</span>
                    <p className="font-semibold text-slate-900">{paymentInfo.bankName}</p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">Account Number</span>
                      <p className="font-mono font-bold text-slate-900">{paymentInfo.accountNo}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(paymentInfo.accountNo, 'acc')}
                      className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-emerald-700"
                      title="Copy Account Number"
                    >
                      {copiedAcc ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">IFSC Code</span>
                      <p className="font-mono font-bold text-slate-900">{paymentInfo.ifscCode}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(paymentInfo.ifscCode, 'ifsc')}
                      className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-emerald-700"
                      title="Copy IFSC Code"
                    >
                      {copiedIfsc ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button
                  onClick={onOpenContactModal}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-2xl text-xs shadow-md transition-all inline-flex items-center justify-center gap-2"
                >
                  <HeartHandshake className="w-4 h-4 text-emerald-200" />
                  <span>{currentLang === 'or' ? 'ଦାନ ରସିଦ୍‌ / ଯୋଗାଯୋଗ କରନ୍ତୁ' : 'Inform Office After Payment / Request Receipt'}</span>
                </button>

                <div className="text-xs text-slate-500 font-light flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Registered Non-Profit • 100% Community Fund Transparency</span>
                </div>
              </div>

            </div>

          </div>

          {/* Recent Donors Ticker */}
          {recentDonors.length > 0 && (
            <div className="bg-slate-100/80 border-t border-slate-200 p-4 px-6 sm:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-slate-800 shrink-0 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{currentLang === 'or' ? 'ସାମ୍ପ୍ରତିକ ଦାତାମାନେ:' : 'Recent Community Supporters:'}</span>
              </span>

              <div className="flex flex-wrap gap-2">
                {recentDonors.slice(0, 4).map((donor) => (
                  <span key={donor.id} className="bg-white px-3 py-1 rounded-full border border-slate-200 text-slate-700 font-medium text-[11px] flex items-center gap-1.5 shadow-2xs">
                    <span className="text-emerald-700 font-bold">₹{donor.amount}</span>
                    <span>by {donor.isAnonymous ? 'Anonymous Well-wisher' : donor.donorName}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION BLOCK: IMPACT & SUCCESS STORIES */}
        <div className="space-y-8 pt-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono text-sky-800 uppercase tracking-widest bg-sky-100/70 px-3 py-1 rounded-full border border-sky-200">
              {currentLang === 'or' ? 'ସେବା ସଫଳତା' : 'Documented Service Stories'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-light text-slate-900 font-heading">
              {currentLang === 'or' ? 'ଆମର ବାସ୍ତବ ପ୍ରଭାବ କାହାଣୀ' : 'Community Impact & Field Stories'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-light">
              See how donations and volunteer efforts directly benefited families across Babujang and Cuttack.
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
                    <h4 className="text-base sm:text-lg font-normal text-slate-900 group-hover:text-sky-800 transition-colors leading-snug font-heading">
                      {currentLang === 'or' ? story.titleOr : story.titleEn}
                    </h4>

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
        </div>

        {/* Full QR Barcode Modal */}
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-emerald-200">
              <button
                onClick={() => setShowQrModal(false)}
                className="absolute top-3 right-3 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-slate-900 flex items-center justify-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-600" />
                <span>UPI Payment QR Code</span>
              </h3>

              <div className="w-64 h-64 mx-auto bg-white p-3 rounded-2xl border-2 border-emerald-400 shadow-inner overflow-hidden">
                <img src={paymentInfo.upiQrUrl} alt="UPI Barcode Large" className="w-full h-full object-contain" />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-mono font-bold text-emerald-800">{paymentInfo.upiId}</p>
                <p className="text-[11px] text-slate-500">{paymentInfo.accountHolder}</p>
              </div>

              <button
                onClick={() => handleCopy(paymentInfo.upiId, 'upi')}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2"
              >
                {copiedUpi ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedUpi ? 'Copied UPI VPA!' : 'Copy UPI ID'}</span>
              </button>
            </div>
          </div>
        )}

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
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-mono pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 text-sky-900">
                    <MapPin className="w-4 h-4 text-sky-600" />
                    <span>{selectedStory.location}</span>
                  </div>
                  <div>
                    <span>Impact Date: {selectedStory.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>{selectedStory.beneficiariesCount} Lives Transformed</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400">Full Project Summary</h4>
                  <p className="text-sm text-slate-700 leading-relaxed font-light whitespace-pre-line">
                    {currentLang === 'or' ? selectedStory.fullStoryOr : selectedStory.fullStoryEn}
                  </p>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setSelectedStory(null)}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full"
                  >
                    Close Story
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
