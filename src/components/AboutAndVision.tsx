import React from 'react';
import { Language } from '../types';
import { FOUNDATION_INFO } from '../data/mockData';
import { getLangText } from '../lib/language';
import { Target, Heart, Award, ShieldCheck, Users, Compass, Eye, CheckCircle2 } from 'lucide-react';

interface AboutAndVisionProps {
  currentLang: Language;
}

export const AboutAndVision: React.FC<AboutAndVisionProps> = ({ currentLang }) => {
  const content = {
    aboutTag: {
      en: "Government Registered Public Charitable Trust",
      hi: "सरकार पंजीकृत सार्वजनिक धर्मार्थ ट्रस्ट",
      or: "ସରକାରୀ ପଞ୍ଜୀକୃତ ଚାରିଟେବୁଲ ଟ୍ରଷ୍ଟ"
    },
    aboutHeading: {
      en: "Empowering Rural Lives with Dignity & Compassion",
      hi: "ग्रामीण जीवन को गरिमा और करुणा के साथ सशक्त बनाना",
      or: "ଗ୍ରାମୀଣ ପରିବାରମାନଙ୍କୁ ଆତ୍ମନିର୍ଭର ଓ ସହାୟତା"
    },
    aboutDesc1: {
      en: "Social Welfare Foundation, Babujang, Cuttack (Govt. Reg. No. 40762401394/2024) is a non-profit organization dedicated to grassroots rural development, elder care, food security, and education across Odisha.",
      hi: "सोशल वेलफेयर फाउंडेशन, बाबुजांग, कटक (पंजीकरण सं. 40762401394/2024) ओडिशा में ग्रामीण विकास, बुजुर्ग सेवा, भोजन सुरक्षा और शिक्षा के लिए समर्पित एक गैर-लाभकारी संगठन है।",
      or: "ସୋସିଆଲ ୱେଲଫେର ଫାଉଣ୍ଡେସନ, ବାବୁଜଙ୍ଗ, କଟକ (ସରକାରୀ ପଞ୍ଜୀକରଣ ନଂ ୪୦୭୬୨୪୦୧୩୯୪/୨୦୨୪) ହେଉଛି ଗ୍ରାମୀଣ ବିକାଶ, ନିଃସହାୟ ବୃଦ୍ଧ ସେବା, ଅନ୍ନଦାନ ଓ ଶିକ୍ଷା ସହାୟତା ପାଇଁ ସମର୍ପିତ ଏକ ଅନୁଷ୍ଠାନ।"
    },
    aboutDesc2: {
      en: "Founded in Babujang panchayat, Tyendakura block, Cuttack district, we bridge the gap between fortunate donors and impoverished rural families through transparent, audited community programs.",
      hi: "कटक जिले के बाबुजांग पंचायत में स्थापित, हम पारदर्शी और लेखापरीक्षित सामुदायिक कार्यक्रमों के माध्यम से ग्रामीण गरीब परिवारों तक सीधी सहायता पहुँचाते हैं।",
      or: "କଟକ ଜିଲ୍ଲାର ବାବୁଜଙ୍ଗ ପଞ୍ଚାୟତରେ ପ୍ରତିଷ୍ଠିତ ଏହି ଅନୁଷ୍ଠାନ ଦାନୀ ଓ ଗ୍ରାମାଞ୍ଚଳର ଅସହାୟ ପରିବାର ମଧ୍ୟରେ ସିଧାସଳଖ ସେବା ଯୋଗାଇ ଆସୁଛି।"
    },
    visionTitle: {
      en: "Our Vision",
      hi: "हमारा दृष्टिकोण (Vision)",
      or: "ଆମର ଲକ୍ଷ୍ୟ (Vision)"
    },
    visionDesc: {
      en: "A self-reliant, healthy, and educated rural Odisha where no senior citizen suffers from hunger, no child drops out of school due to poverty, and emergency disaster relief reaches every vulnerable doorstep.",
      hi: "एक आत्मनिर्भर, स्वस्थ और शिक्षित ग्रामीण ओडिशा जहाँ कोई बुजुर्ग भूखा न रहे, कोई बच्चा गरीबी के कारण शिक्षा से वंचित न हो और हर पीड़ित को तुरंत राहत मिले।",
      or: "ଏକ ଆତ୍ମନିର୍ଭର, ସୁସ୍ଥ ଓ ଶିକ୍ଷିତ ଗ୍ରାମୀଣ ଓଡ଼ିଶା, ଯେଉଁଠାରେ କୌଣସି ବୃଦ୍ଧ ନିରାଶ୍ରୟ ହେବେ ନାହିଁ ଏବଂ କୌଣସି ଶିଶୁ ଶିକ୍ଷାରୁ ବଞ୍ଚିତ ହେବେ ନାହିଁ।"
    },
    missionTitle: {
      en: "Our Mission",
      hi: "हमारा मिशन (Mission)",
      or: "ଆମର ମିଶନ୍ (Mission)"
    },
    missionPoints: [
      {
        en: "Annadaana: Monthly dry ration kits and cooked meal drives for destitute elders in Babujang & Kishore Nagar.",
        hi: "अन्नदान: असहाय बुजुर्गों के लिए मासिक राशन किट और भोजन वितरण।",
        or: "ଅନ୍ନଦାନ: ନିଃସହାୟ ବୃଦ୍ଧବୃଦ୍ଧାଙ୍କ ପାଇଁ ମାସିକ ସୁଖା ରାସନ ଓ ଖାଦ୍ୟ ବଣ୍ଟନ।"
      },
      {
        en: "Arogya Seva: Free health check-up camps, free diagnostic tests, and prescription medicine support.",
        hi: "आरोग्य सेवा: मुफ्त स्वास्थ्य जांच शिविर और आवश्यक दवा सहायता।",
        or: "ଆରୋଗ୍ୟ ସେବା: ମାଗଣା ସ୍ୱାସ୍ଥ୍ୟ ପରୀକ୍ଷା ଶିବିର ଓ ଔଷଧ ସହାୟତା।"
      },
      {
        en: "Shiksha Sahayata: Books, bags, and uniform stipends for underprivileged primary school students.",
        hi: "शिक्षा सहायता: गरीब बच्चों के लिए किताबें, बैग और स्कूल फीस सहायता।",
        or: "ଶିକ୍ଷା ସହାୟତା: ଗରିବ ଛାତ୍ରଛାତ୍ରୀଙ୍କୁ ବହି, ବ୍ୟାଗ୍‌ ଓ ଷ୍ଟେସନାରୀ।"
      },
      {
        en: "Emergency Disaster Relief: Swift flood and monsoon relief with ready-to-eat packets in Tyendakura & Cuttack.",
        hi: "आपदा राहत: बाढ़ और मानसूनी आपदा में तुरंत तैयार भोजन और राहत सामग्री पहुँचाना।",
        or: "ଆପାତକାଳୀନ ରିଲିଫ୍: ବନ୍ୟା ଓ ବର୍ଷା ସମୟରେ ତୁରନ୍ତ ସୁଜି, ଛୁଡ଼ା, ଗୁଡ଼ ଓ ଖାଦ୍ୟ ପ୍ୟାକେଟ୍‌ ବଣ୍ଟନ।"
      }
    ],
    coreValuesTitle: {
      en: "Core Institutional Values",
      hi: "हमारे मुख्य सिद्धांत",
      or: "ଆମର ମୌଳିକ ମୂଲ୍ୟବୋଧ"
    }
  };

  const getTxt = (obj: Record<string, string>) => obj[currentLang] || obj.en;

  return (
    <section id="about" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            {getTxt(content.aboutTag)}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight mb-4">
            {getTxt(content.aboutHeading)}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {getTxt(content.aboutDesc1)}
          </p>
        </div>

        {/* Grid: Story & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center mb-16">
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-base sm:text-lg font-heading">
              <Compass className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                {currentLang === 'hi' ? 'स्थापना एवं पृष्ठभूमि' : currentLang === 'or' ? 'ପ୍ରତିଷ୍ଠା ଓ ପୃଷ୍ଠଭୂମି' : 'Establishment & Legacy'}
              </span>
            </div>
            <p className="text-xs sm:text-base text-slate-700 leading-relaxed">
              {getTxt(content.aboutDesc2)}
            </p>
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <div className="p-3 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                <span className="block text-xs sm:text-sm md:text-base font-bold text-emerald-900 font-mono tracking-tight break-all">40762401394</span>
                <span className="text-[10px] sm:text-[11px] font-medium text-emerald-700">Govt. Reg. No.</span>
              </div>
              <div className="p-3 rounded-xl sm:rounded-2xl bg-sky-50 border border-sky-100 text-center">
                <span className="block text-xs sm:text-sm md:text-base font-bold text-sky-900 font-mono tracking-tight">12A & 80G</span>
                <span className="text-[10px] sm:text-[11px] font-medium text-sky-700">Tax Exemption</span>
              </div>
              <div className="p-3 rounded-xl sm:rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
                <span className="block text-xs sm:text-sm md:text-base font-bold text-indigo-900 font-mono tracking-tight">Babujang</span>
                <span className="text-[10px] sm:text-[11px] font-medium text-indigo-700">Cuttack District</span>
              </div>
            </div>
          </div>

          {/* Key Impact Counter Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xs">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-300 mb-1.5" />
              <div className="text-xl sm:text-3xl font-extrabold font-mono">1,200+</div>
              <p className="text-[11px] sm:text-xs text-emerald-100 mt-1 leading-tight">
                {currentLang === 'hi' ? 'लाभार्थी परिवार' : currentLang === 'or' ? 'ଉପକୃତ ପରିବାର' : 'Beneficiary Families Served'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-800 to-slate-900 text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xs">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-sky-300 mb-1.5" />
              <div className="text-xl sm:text-3xl font-extrabold font-mono">50+</div>
              <p className="text-[11px] sm:text-xs text-sky-100 mt-1 leading-tight">
                {currentLang === 'hi' ? 'युवा स्वयंसेवक' : currentLang === 'or' ? 'ଯୁବ ସ୍ୱେଚ୍ଛାସେବୀ' : 'Active Youth Volunteers'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-700 to-orange-900 text-white p-6 rounded-3xl shadow-md col-span-2">
              <Award className="w-8 h-8 text-amber-200 mb-2" />
              <div className="text-3xl font-black font-mono">100% Audited</div>
              <p className="text-xs text-amber-100 mt-1">
                {currentLang === 'hi' ? 'पारदर्शी खाता और सी.ए. ऑडिट रिपोर्ट' : currentLang === 'or' ? 'ସମ୍ପୂର୍ଣ୍ଣ ସ୍ୱଚ୍ଛ C.A. ଅଡିଟ୍‌ ହିସାବ' : 'Complete Financial Transparency with CA Audits'}
              </p>
            </div>
          </div>
        </div>

        {/* Vision & Mission Cards */}
        <div id="vision-mission" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Vision */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <Eye className="w-40 h-40 text-slate-900" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-bold mb-4">
                <Eye className="w-4 h-4 text-sky-700" />
                <span>{getTxt(content.visionTitle)}</span>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                {getTxt(content.visionDesc)}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 italic">
              "Building sustainable dignity in rural Cuttack."
            </div>
          </div>

          {/* Mission */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <Target className="w-40 h-40 text-slate-900" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-4">
                <Target className="w-4 h-4 text-emerald-700" />
                <span>{getTxt(content.missionTitle)}</span>
              </div>
              <ul className="space-y-3">
                {content.missionPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pt[currentLang] || pt.en}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 italic">
              "Service to humanity is service to God."
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
