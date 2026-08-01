import React, { useState } from 'react';
import { Language, AssistanceRequest } from '../types';
import { FoundationRepository } from '../lib/supabase';
import { FOUNDATION_INFO } from '../data/mockData';
import { 
  X, 
  HandHeart, 
  Search, 
  Send, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface RequestHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export const RequestHelpModal: React.FC<RequestHelpModalProps> = ({
  isOpen,
  onClose,
  currentLang,
}) => {
  const [activeTab, setActiveTab] = useState<'apply' | 'track'>('apply');

  // Form State
  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('');
  const [villagePanchayat, setVillagePanchayat] = useState('Babujang');
  const [district, setDistrict] = useState('Cuttack');
  const [category, setCategory] = useState<'food' | 'clothing' | 'medical' | 'financial' | 'education'>('food');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'high' | 'medium' | 'normal'>('normal');

  // Result state
  const [submittedRequest, setSubmittedRequest] = useState<AssistanceRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tracking state
  const [trackingSearch, setTrackingSearch] = useState('');
  const [trackedRequest, setTrackedRequest] = useState<AssistanceRequest | null>(null);
  const [trackingError, setTrackingError] = useState('');

  if (!isOpen) return null;

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !phone || !description) return;

    setIsSubmitting(true);
    try {
      const newReq = await FoundationRepository.createAssistanceRequest({
        applicantName,
        phone,
        villagePanchayat,
        district,
        category,
        description,
        urgency,
      });

      setSubmittedRequest(newReq);
    } catch (err) {
      console.error('Error submitting help request:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingError('');
    setTrackedRequest(null);

    const all = FoundationRepository.getAssistanceRequests();
    const found = all.find(
      r => r.trackingCode.toLowerCase() === trackingSearch.trim().toLowerCase() ||
           r.phone.includes(trackingSearch.trim())
    );

    if (found) {
      setTrackedRequest(found);
    } else {
      setTrackingError('No matching application found. Please verify your tracking code or phone number.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-slate-200">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HandHeart className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-xl font-black font-heading">
                {currentLang === 'or' ? 'ସହାୟତା ନିମନ୍ତେ ଆବେଦନ' : 'Request Relief & Assistance'}
              </h3>
              <p className="text-xs text-emerald-200 font-mono">
                Social Welfare Foundation • Babujang, Cuttack
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-100 bg-slate-50 text-xs font-black font-mono">
          <button
            onClick={() => setActiveTab('apply')}
            className={`flex-1 py-3.5 text-center transition-colors uppercase tracking-wider ${
              activeTab === 'apply' 
                ? 'bg-white text-emerald-900 border-b-2 border-emerald-700' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {currentLang === 'or' ? 'ନୂତନ ଆବେଦନ' : 'Submit Assistance Form'}
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-3.5 text-center transition-colors uppercase tracking-wider ${
              activeTab === 'track' 
                ? 'bg-white text-emerald-900 border-b-2 border-emerald-700' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {currentLang === 'or' ? 'ଆବେଦନ ସ୍ଥିତି' : 'Track Application Status'}
          </button>
        </div>

        {/* TAB 1: APPLY */}
        {activeTab === 'apply' && (
          <div className="p-6">
            {submittedRequest ? (
              <div className="text-center space-y-5 py-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-black text-slate-900 font-heading">
                    {currentLang === 'or' ? 'ଆବେଦନ ସଫଳତାର ସହ ଗୃହୀତ ହେଲା!' : 'Request Submitted Successfully!'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto font-medium">
                    {currentLang === 'or' ? (
                      'ଆମର ସ୍ୱେଚ୍ଛାସେବୀ ଦଳ ଶୀଘ୍ର ଆପଣଙ୍କ ଗ୍ରାମକୁ ଯାଇ ପରିସ୍ଥିତି ଅନୁଧ୍ୟାନ କରିବେ।'
                    ) : (
                      'Our Babujang field volunteer team will verify your details and reach out shortly.'
                    )}
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block font-mono">Your Tracking Code</span>
                  <span className="text-2xl font-black font-mono text-emerald-900 select-all">
                    {submittedRequest.trackingCode}
                  </span>
                  <span className="text-[11px] text-emerald-800 block pt-1 font-medium">
                    Please save this code to check your status anytime.
                  </span>
                </div>

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSubmittedRequest(null);
                      setApplicantName('');
                      setDescription('');
                    }}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
                  >
                    Submit Another Request
                  </button>

                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-black"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1 uppercase text-[10px] tracking-wider font-mono">
                      Applicant Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1 uppercase text-[10px] tracking-wider font-mono">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 Mobile Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1 uppercase text-[10px] tracking-wider font-mono">
                      Village / Panchayat
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Babujang"
                      value={villagePanchayat}
                      onChange={(e) => setVillagePanchayat(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1 uppercase text-[10px] tracking-wider font-mono">
                      District
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1 uppercase text-[10px] tracking-wider font-mono">
                      Type of Relief Needed *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none"
                    >
                      <option value="food">Food Rations (Annadaana)</option>
                      <option value="clothing">Clothing & Winter Warmth</option>
                      <option value="medical">Medical Treatment Aid</option>
                      <option value="financial">Emergency Financial Aid</option>
                      <option value="education">Schooling & Student Kit</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1 uppercase text-[10px] tracking-wider font-mono">
                      Urgency Level
                    </label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none"
                    >
                      <option value="normal">Normal (Routine Relief)</option>
                      <option value="medium">Medium (Within 2-3 days)</option>
                      <option value="high">Urgent / Emergency (Immediate)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1 uppercase text-[10px] tracking-wider font-mono">
                    Describe Situation & Specific Help Needed *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Briefly explain the hardship, medical condition, or family situation..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-slate-950" />
                    <span>Submit Request to Babujang Foundation</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 text-center font-mono">
                  Direct Helpline: <a href={`tel:${FOUNDATION_INFO.phone}`} className="font-bold text-emerald-700">{FOUNDATION_INFO.phone}</a>
                </p>

              </form>
            )}
          </div>
        )}

        {/* TAB 2: TRACK */}
        {activeTab === 'track' && (
          <div className="p-6 space-y-4 text-xs">
            <form onSubmit={handleTrackSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Tracking Code or Phone"
                value={trackingSearch}
                onChange={(e) => setTrackingSearch(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black rounded-xl flex items-center gap-1.5 uppercase text-xs"
              >
                <Search className="w-4 h-4" />
                <span>Track</span>
              </button>
            </form>

            {trackingError && (
              <div className="p-3.5 bg-rose-50 text-rose-800 rounded-2xl border border-rose-200 flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{trackingError}</span>
              </div>
            )}

            {trackedRequest && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                  <span className="font-mono font-black text-emerald-950 text-sm">{trackedRequest.trackingCode}</span>
                  <span className="bg-emerald-700 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                    {trackedRequest.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700 font-medium">
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px] font-mono">Applicant</span>
                    <strong className="text-slate-900">{trackedRequest.applicantName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px] font-mono">Category</span>
                    <strong className="text-slate-900 capitalize">{trackedRequest.category} Relief</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px] font-mono">Village</span>
                    <strong className="text-slate-900">{trackedRequest.villagePanchayat}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px] font-mono">Submitted On</span>
                    <strong className="text-slate-900 font-mono">{trackedRequest.createdAt}</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-emerald-100 italic">
                  "{trackedRequest.description}"
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

