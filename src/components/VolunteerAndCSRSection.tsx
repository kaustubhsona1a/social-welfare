import React, { useState } from 'react';
import { Language } from '../types';
import { FOUNDATION_INFO } from '../data/mockData';
import { UserCheck, Building2, Send, CheckCircle, Heart, Handshake, Shield, Sparkles } from 'lucide-react';

interface VolunteerAndCSRProps {
  currentLang: Language;
}

export const VolunteerAndCSRSection: React.FC<VolunteerAndCSRProps> = ({ currentLang }) => {
  const [volName, setVolName] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volPanchayat, setVolPanchayat] = useState('');
  const [volInterest, setVolInterest] = useState('food_distribution');
  const [volSubmitted, setVolSubmitted] = useState(false);

  const [csrCompany, setCsrCompany] = useState('');
  const [csrContactPerson, setCsrContactPerson] = useState('');
  const [csrEmail, setCsrEmail] = useState('');
  const [csrPhone, setCsrPhone] = useState('');
  const [csrInterestArea, setCsrInterestArea] = useState('food_security');
  const [csrSubmitted, setCsrSubmitted] = useState(false);

  const handleVolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volName || !volPhone) return;
    setVolSubmitted(true);
    setTimeout(() => {
      setVolName('');
      setVolPhone('');
      setVolPanchayat('');
    }, 500);
  };

  const handleCsrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csrCompany || !csrPhone) return;
    setCsrSubmitted(true);
    setTimeout(() => {
      setCsrCompany('');
      setCsrContactPerson('');
      setCsrEmail('');
      setCsrPhone('');
    }, 500);
  };

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* ========================================= */}
        {/* SECTION 1: VOLUNTEER REGISTRATION (#volunteer) */}
        {/* ========================================= */}
        <div id="volunteer" className="mb-20 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                {currentLang === 'hi' ? 'युवा स्वयंसेवक नेटवर्क' : currentLang === 'or' ? 'ଯୁବ ସ୍ୱେଚ୍ଛାସେବୀ ବାହିନୀ' : 'Youth Volunteer Network'}
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading">
                {currentLang === 'hi' ? 'हमारे साथ स्वयंसेवक (Volunteer) के रूप में जुड़ें' : currentLang === 'or' ? 'ସୋସିଆଲ ୱେଲଫେର ସ୍ୱେଚ୍ଛାସେବୀ ଭାବେ ଯୋଗ ଦିଅନ୍ତୁ' : 'Join as a Youth Volunteer in Babujang'}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                {currentLang === 'hi'
                  ? 'बाबुजांग और कटक जिले के 50 से अधिक युवा हमारे साथ भोजन वितरण, स्वास्थ्य शिविर और आपदा राहत में सक्रिय योगदान दे रहे हैं।'
                  : currentLang === 'or'
                  ? 'ବାବୁଜଙ୍ଗ ଓ ଆଖପାଖ ଅଞ୍ଚଳର ୫୦+ ଯୁବକ ଗ୍ରାମୀଣ ଅନ୍ନଦାନ, ବସ୍ତ୍ରଦାନ ଓ ବନ୍ୟା ରିଲିଫ୍‌ରେ ନିଜର ସମୟ ଏବଂ ସେବା ପ୍ରଦାନ କରୁଛନ୍ତି।'
                  : 'Be the boots on the ground! Help us pack ration kits, coordinate health check-up camps, and deliver emergency disaster relief.'
                }
              </p>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
                <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Volunteer Recognition & Certificates</span>
                </div>
                <p className="text-xs text-emerald-800">
                  Every active volunteer receives an official Foundation Identity Card and Community Service Appreciation Certificate.
                </p>
              </div>
            </div>

            {/* Volunteer Form */}
            <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              {volSubmitted ? (
                <div className="text-center py-8 space-y-3 bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-lg font-bold text-emerald-900 font-heading">
                    {currentLang === 'hi' ? 'धन्यवाद! आपका पंजीकरण प्राप्त हुआ' : currentLang === 'or' ? 'ଧନ୍ୟବାଦ! ଆପଣଙ୍କ ପଞ୍ଜୀକରଣ ସଫଳ ହେଲା' : 'Registration Submitted Successfully!'}
                  </h3>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto">
                    Our Volunteer Coordinator will contact you on your mobile number shortly. Welcome to Social Welfare Foundation!
                  </p>
                  <button
                    onClick={() => setVolSubmitted(false)}
                    className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
                  >
                    Register Another Volunteer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVolSubmit} className="space-y-4">
                  <h3 className="text-base font-bold text-slate-800 font-heading border-b pb-2">
                    {currentLang === 'hi' ? 'स्वयंसेवक आवेदन पत्र' : currentLang === 'or' ? 'ସ୍ୱେଚ୍ଛାସେବୀ ଆବେଦନ ଫର୍ମ' : 'Volunteer Registration Form'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Chandra Swain"
                        value={volName}
                        onChange={e => setVolName(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Mobile / WhatsApp No *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 97770 00000"
                        value={volPhone}
                        onChange={e => setVolPhone(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Village / Panchayat</label>
                      <input
                        type="text"
                        placeholder="Babujang / Kishore Nagar / Cuttack"
                        value={volPanchayat}
                        onChange={e => setVolPanchayat(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Interest Area</label>
                      <select
                        value={volInterest}
                        onChange={e => setVolInterest(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                      >
                        <option value="food_distribution">Annadaana Food Drives</option>
                        <option value="medical_camps">Health Camps & Blood Drive</option>
                        <option value="education">Student Coaching & Stationeries</option>
                        <option value="disaster_relief">Flood & Monsoon Emergency Relief</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <Send className="w-4 h-4 text-emerald-200" />
                    <span>Submit Volunteer Registration</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

        {/* ========================================= */}
        {/* SECTION 2: CSR PARTNERSHIP (#csr)         */}
        {/* ========================================= */}
        <div id="csr" className="pt-10 border-t border-slate-200 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-semibold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5 text-purple-700" />
                {currentLang === 'hi' ? 'कॉर्पोरेट सीएसआर (CSR) साझेदारी' : currentLang === 'or' ? 'ସିଏସଆର (CSR) ସହଭାଗିତା' : 'Corporate CSR Partnership'}
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading">
                {currentLang === 'hi' ? 'सीएसआर (CSR) अनुदान एवं संस्थागत साझेदारी' : currentLang === 'or' ? 'ସିଏସଆର (CSR) ଓ ଅନୁଦାନ ସହାୟତା' : 'CSR Partnership & Corporate Grants'}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                Social Welfare Foundation is registered with Ministry of Corporate Affairs under <strong>Form CSR-1 (Registration No. CSR00081920)</strong> and holds valid 80G tax exemption status.
              </p>

              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 space-y-2">
                <div className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-purple-700" />
                  <span>Comprehensive Impact Auditing</span>
                </div>
                <p className="text-xs text-purple-800">
                  We provide corporate partners with quarterly photo documentation, beneficiary ID verification logs, and C.A. certified utilization certificates.
                </p>
              </div>
            </div>

            {/* CSR Form */}
            <div className="lg:col-span-7 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
              {csrSubmitted ? (
                <div className="text-center py-8 space-y-3 bg-purple-950/60 rounded-2xl p-6 border border-purple-800/80">
                  <Handshake className="w-12 h-12 text-purple-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white font-heading">
                    CSR Inquiry Received!
                  </h3>
                  <p className="text-xs text-purple-200 max-w-md mx-auto">
                    Our General Secretary and Finance Head will reach out to your organization with our official CSR Brochure & Audited Financial Statements.
                  </p>
                  <button
                    onClick={() => setCsrSubmitted(false)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold"
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCsrSubmit} className="space-y-4">
                  <h3 className="text-base font-bold text-purple-300 font-heading border-b border-slate-800 pb-2">
                    Corporate CSR Partnership Proposal Form
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Company / Organization *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tata Steel / SBI / National Thermal"
                        value={csrCompany}
                        onChange={e => setCsrCompany(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Contact Person *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mr. S. K. Das (CSR Head)"
                        value={csrContactPerson}
                        onChange={e => setCsrContactPerson(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Official Email</label>
                      <input
                        type="email"
                        placeholder="csr@company.com"
                        value={csrEmail}
                        onChange={e => setCsrEmail(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98000 00000"
                        value={csrPhone}
                        onChange={e => setCsrPhone(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Key Interest Pillar</label>
                    <select
                      value={csrInterestArea}
                      onChange={e => setCsrInterestArea(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="food_security">Rural Food Security & Annadaana</option>
                      <option value="rural_health">Mobile Medical Clinic & Health Camps</option>
                      <option value="child_education">Primary Education Infrastructure</option>
                      <option value="women_empowerment">Women Self-Help & Tailoring Kits</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <Handshake className="w-4 h-4 text-purple-200" />
                    <span>Submit CSR Partnership Request</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
