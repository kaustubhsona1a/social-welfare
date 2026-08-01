import React, { useState } from 'react';
import { Language } from '../types';
import { FOUNDATION_INFO } from '../data/mockData';
import { Phone, MapPin, Mail, X, Send, CheckCircle2, Heart } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  currentLang,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    topic: 'general',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({ name: '', phone: '', topic: 'general', message: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8">
        
        {/* Header with Blue Gradient */}
        <div className="bg-gradient-to-r from-sky-800 via-blue-900 to-indigo-950 text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-1 relative z-10">
            <span className="text-[11px] uppercase tracking-widest font-mono text-sky-300 font-semibold">
              {currentLang === 'or' ? 'ଯୋଗାଯୋଗ କରନ୍ତୁ' : 'Direct Communication'}
            </span>
            <h3 className="text-2xl font-light font-heading text-white">
              {currentLang === 'or' ? 'ସୋସିଆଲ ୱେଲଫେର ଫାଉଣ୍ଡେସନ ସହ ଯୋଗାଯୋଗ' : 'Connect with Babujang Foundation'}
            </h3>
            <p className="text-xs text-sky-100/90 font-light">
              {currentLang === 'or' 
                ? 'ବାବୁଜଙ୍ଗ, କଟକ କାର୍ଯ୍ୟାଳୟ ସହ ସିଧାସଳଖ ଆଲୋଚନା କରନ୍ତୁ' 
                : 'Reach out to our leadership & team at Babujang, Cuttack'}
            </p>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-light text-slate-900 font-heading">
                  {currentLang === 'or' ? 'ଧନ୍ୟବାଦ! ଆପଣଙ୍କ ବାର୍ତ୍ତା ମିଳିଲା' : 'Message Received!'}
                </h4>
                <p className="text-xs text-slate-600 font-light max-w-xs mx-auto">
                  {currentLang === 'or'
                    ? 'ଆମର କର୍ମକର୍ତ୍ତା ଶୀଘ୍ର ଆପଣଙ୍କ ସହ ଯୋଗାଯୋଗ କରିବେ।'
                    : 'Our team in Babujang, Cuttack will get in touch with you shortly.'}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-sky-700 hover:bg-sky-800 text-white text-xs font-medium rounded-full shadow-md transition-all"
              >
                {currentLang === 'or' ? 'ବନ୍ଦ କରନ୍ତୁ' : 'Close Window'}
              </button>
            </div>
          ) : (
            <>
              {/* Quick Contact Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <a
                  href={`tel:${FOUNDATION_INFO.phone.replace(/\s+/g, '')}`}
                  className="p-3.5 bg-sky-50/80 hover:bg-sky-100/80 rounded-2xl border border-sky-200/80 transition-all flex items-center gap-3 text-sky-950 group"
                >
                  <div className="p-2 bg-sky-600 text-white rounded-xl shadow-xs group-hover:scale-105 transition-transform">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-sky-700 font-medium uppercase tracking-wider">Helpline Number</span>
                    <strong className="font-mono text-sm font-semibold">{FOUNDATION_INFO.phone}</strong>
                  </div>
                </a>

                <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex items-center gap-3 text-slate-800">
                  <div className="p-2 bg-blue-700 text-white rounded-xl shadow-xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-medium uppercase tracking-wider">Headquarters</span>
                    <strong className="text-xs font-normal">Babujang, Cuttack</strong>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-light text-slate-700 mb-1">
                    {currentLang === 'or' ? 'ଆପଣଙ୍କ ନାମ' : 'Your Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Chandra Das"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-light focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-light text-slate-700 mb-1">
                    {currentLang === 'or' ? 'ଫୋନ୍ ନମ୍ବର' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-light focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-light text-slate-700 mb-1">
                    {currentLang === 'or' ? 'ବିଷୟ' : 'Subject'}
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-light focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all bg-white"
                  >
                    <option value="general">General Inquiry / Information</option>
                    <option value="volunteer">Volunteer Opportunity</option>
                    <option value="relief">Nominate Needy Family for Relief</option>
                    <option value="media">Media & Press Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-light text-slate-700 mb-1">
                    {currentLang === 'or' ? 'ବାର୍ତ୍ତା' : 'Your Message'}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your query or message here..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-light focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-sky-700 to-blue-800 hover:from-sky-800 hover:to-blue-900 text-white font-medium text-xs rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{currentLang === 'or' ? 'ବାର୍ତ୍ତା ପଠାନ୍ତୁ' : 'Send Message'}</span>
                </button>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
