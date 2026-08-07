import React, { useState } from 'react';
import { Language } from '../types';
import { FOUNDATION_INFO } from '../data/mockData';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Send, 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  Building 
} from 'lucide-react';

interface ContactSectionProps {
  currentLang: Language;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ currentLang }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('general');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    }, 500);
  };

  const whatsappUrl = `https://wa.me/${FOUNDATION_INFO.whatsappNumber}?text=Namaskar%20Social%20Welfare%20Foundation%20Babujang,%20I%20would%20like%20to%20connect.`;

  return (
    <section id="contact" className="py-16 sm:py-20 bg-slate-100/80 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Building className="w-3.5 h-3.5 text-emerald-700" />
            {currentLang === 'hi' ? 'संपर्क करें एवं स्थान' : currentLang === 'or' ? 'ଯୋଗାଯୋଗ ଓ ସ୍ଥାନ' : 'Get in Touch'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            {currentLang === 'hi' ? 'सोशल वेलफेयर फाउंडेशन कार्यालय' : currentLang === 'or' ? 'ବାବୁଜଙ୍ଗ କାର୍ଯ୍ୟାଳୟ ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ' : 'Contact Us & Head Office'}
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            {currentLang === 'hi'
              ? 'ग्राम बाबुजांग, कटक जिला, ओडिशा स्थित हमारे मुख्य कार्यालय में आपका स्वागत है।'
              : currentLang === 'or'
              ? 'ବାବୁଜଙ୍ଗ ଗ୍ରାମ ଓ କଟକ ଜିଲ୍ଲା ସୋସିଆଲ ୱେଲଫେର ଫାଉଣ୍ଡେସନ ସହ ଯୋଗାଯୋଗ।'
              : 'Feel free to call, email, or send us a WhatsApp message directly.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Cards + Google Map */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Quick Contact Info */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              
              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-100 shrink-0">
                  <MapPin className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Registered Office Address</h4>
                  <p className="text-xs text-slate-700 leading-relaxed mt-0.5">
                    {currentLang === 'hi' ? FOUNDATION_INFO.addressHi : currentLang === 'or' ? FOUNDATION_INFO.addressOr : FOUNDATION_INFO.addressEn}
                  </p>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-sky-50 rounded-2xl border border-sky-100 shrink-0">
                  <Phone className="w-5 h-5 text-sky-700" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Helpline & Phone Numbers</h4>
                  <div className="flex flex-col gap-1 mt-0.5 text-xs font-mono font-medium text-slate-800">
                    <a href={`tel:${FOUNDATION_INFO.phone.replace(/\s+/g, '')}`} className="hover:text-emerald-700">
                      {FOUNDATION_INFO.phone} (Primary)
                    </a>
                    <a href={`tel:${FOUNDATION_INFO.phoneSecondary.replace(/\s+/g, '')}`} className="hover:text-emerald-700">
                      {FOUNDATION_INFO.phoneSecondary} (Secondary)
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-indigo-50 rounded-2xl border border-indigo-100 shrink-0">
                  <Mail className="w-5 h-5 text-indigo-700" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Official Email</h4>
                  <a href={`mailto:${FOUNDATION_INFO.email}`} className="text-xs font-mono text-indigo-700 hover:underline">
                    {FOUNDATION_INFO.email}
                  </a>
                </div>
              </div>

              {/* DIRECT WHATSAPP BUTTON */}
              <div className="pt-2 border-t">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat directly on WhatsApp (+91 95948 81882)</span>
                </a>
              </div>

            </div>

            {/* Google Map Embed Card */}
            <div className="bg-white p-3 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5 text-emerald-800">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Location: Babujang, Cuttack
                </span>
                <a
                  href="https://maps.google.com/?q=Babujang,Cuttack,Odisha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-sky-700 hover:underline flex items-center gap-1"
                >
                  Open Maps <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-200">
                <iframe
                  title="Social Welfare Foundation Babujang Google Map"
                  src={FOUNDATION_INFO.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Contact & Inquiry Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            {submitted ? (
              <div className="text-center py-10 space-y-3 bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-bold text-emerald-900 font-heading">
                  {currentLang === 'hi' ? 'आपका संदेश प्राप्त हुआ!' : currentLang === 'or' ? 'ଆପଣଙ୍କ ସନ୍ଦେଶ ସଫଳ ଭାବେ ଗ୍ରହଣ କରାଗଲା!' : 'Message Sent Successfully!'}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
                  Thank you for reaching out to Social Welfare Foundation Babujang. Our team will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 font-heading border-b pb-3">
                  {currentLang === 'hi' ? 'संपर्क एवं पूछताछ फ़ॉर्म' : currentLang === 'or' ? 'ଯୋଗାଯୋଗ ଓ ପଚରାଉଚରା ଫର୍ମ' : 'Send us a Direct Inquiry'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Santosh Swain"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Mobile / Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 97770 00000"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="your.name@gmail.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Inquiry Subject</label>
                    <select
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                    >
                      <option value="general">General Query / Foundation Work</option>
                      <option value="donation">Donation & 80G Tax Receipt Inquiry</option>
                      <option value="assistance">Assistance / Relief Request</option>
                      <option value="csr">Corporate CSR Collaboration</option>
                      <option value="volunteer">Volunteer Joining Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Your Message or Query *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write your message, feedback, or inquiry here..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4 text-emerald-200" />
                  <span>Send Message to Foundation Office</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
