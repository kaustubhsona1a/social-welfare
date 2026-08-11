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
      hi: "हमारा दृष्टिकोण",
      or: "ଆମର ଲକ୍ଷ୍ୟ"
    },
    visionQuote: {
      en: "“To build an inclusive, self-reliant, healthy and empowered society where every individual has access to food, healthcare, education and a dignified life, and where no one in need is left behind.”",
      hi: "“एक समावेशी, आत्मनिर्भर, स्वस्थ और सशक्त समाज का निर्माण करना जहाँ हर व्यक्ति को भोजन, स्वास्थ्य सेवा, शिक्षा और गरिमापूर्ण जीवन मिले, और जहाँ कोई भी असहाय पीछे न छूटे।”",
      or: "“ଏକ ଅନ୍ତର୍ଭୁକ୍ତ, ଆତ୍ମନିର୍ଭରଶୀଳ, ସୁସ୍ଥ ଏବଂ ସଶକ୍ତ ସମାଜ ଗଠନ କରିବା ଯେଉଁଠାରେ ପ୍ରତ୍ୟେକ ବ୍ୟକ୍ତିଙ୍କର ଖାଦ୍ୟ, ସ୍ୱାସ୍ଥ୍ୟସେବା, ଶିକ୍ଷା ଏବଂ ମର୍ଯ୍ୟାଦାପୂର୍ଣ୍ଣ ଜୀବନ ବଞ୍ଚିବାର ସୁଯୋଗ ରହିବ, ଏବଂ କେହି ବି ଅସହାୟ ପଛରେ ରହିବେ ନାହିଁ।”"
    },
    visionDesc: {
      en: "We envision creating sustainable positive change in rural and underserved communities by providing support, opportunities and resources that help people live with dignity and become self-reliant.",
      hi: "हम सहायता, अवसर और संसाधन प्रदान करके ग्रामीण और वंचित समुदायों में स्थायी सकारात्मक बदलाव लाने की दिशा में समर्पित हैं ताकि लोग सम्मान के साथ जी सकें और आत्मनिर्भर बन सकें।",
      or: "ଆମେ ଗ୍ରାମାଞ୍ଚଳ ଏବଂ ଅବହେଳିତ ସମ୍ପ୍ରଦାୟରେ ସହାୟତା, ସୁଯୋଗ ଏବଂ ସମ୍ବଳ ଯୋଗାଇ ସ୍ଥାୟୀ ସକାରାତ୍ମକ ପରିବର୍ତ୍ତନ ସୃଷ୍ଟି କରିବାକୁ ଲକ୍ଷ୍ୟ ରଖିଛୁ ଯାହା ଲୋକଙ୍କୁ ଆତ୍ମସମ୍ମାନର ସହ ବଞ୍ଚିବାକୁ ଏବଂ ଆତ୍ମନିର୍ଭରଶୀଳ ହେବାକୁ ସାହାଯ୍ୟ କରିବ।"
    },
    missionTitle: {
      en: "Our Mission",
      hi: "हमारा मिशन",
      or: "ଆମର ମିଶନ୍"
    },
    missionPoints: [
      {
        title: { en: "Food & Nutrition:", hi: "खाद्य एवं पोषण:", or: "ଖାଦ୍ୟ ଓ ପୋଷଣ:" },
        desc: {
          en: "To provide nutritious food, ration kits and essential support to underprivileged families, senior citizens, patients and their attendants.",
          hi: "वंचित परिवारों, वरिष्ठ नागरिकों, रोगियों और उनके परिचारकों को पौष्टिक भोजन, राशन किट और आवश्यक सहायता प्रदान करना।",
          or: "ଅସହାୟ ପରିବାର, ବୃଦ୍ଧବୃଦ୍ଧା, ରୋଗୀ ଏବଂ ସେମାନଙ୍କ ସମ୍ପର୍କୀୟଙ୍କୁ ପୌଷ୍ଟିକ ଖାଦ୍ୟ, ରାସନ କିଟ୍ ଏବଂ ଆବଶ୍ୟକୀୟ ସହାୟତା ଯୋଗାଇଦେବା।"
        }
      },
      {
        title: { en: "Healthcare:", hi: "स्वास्थ्य सेवा:", or: "ସ୍ୱାସ୍ଥ୍ୟସେବା:" },
        desc: {
          en: "To organize free health check-up camps, provide medical assistance and help vulnerable communities access essential healthcare services.",
          hi: "निःशुल्क स्वास्थ्य जांच शिविर आयोजित करना, चिकित्सा सहायता देना और जरूरतमंदों को स्वास्थ्य सेवाओं तक पहुँच प्रदान करना।",
          or: "ମାଗଣା ସ୍ୱାସ୍ଥ୍ୟ ପରୀକ୍ଷା ଶିବିର ଆୟୋଜନ କରିବା, ଡାକ୍ତରୀ ସହାୟତା ଯୋଗାଇଦେବା ଏବଂ ଗ୍ରାମାଞ୍ଚଳର ଅସହାୟ ଲୋକଙ୍କୁ ଆବଶ୍ୟକୀୟ ସ୍ୱାସ୍ଥ୍ୟସେବା ଯୋଗାଇଦେବା।"
        }
      },
      {
        title: { en: "Education Support:", hi: "शिक्षा सहायता:", or: "ଶିକ୍ଷା ସହାୟତା:" },
        desc: {
          en: "To support children from economically weaker families with books, school bags, uniforms and other educational materials.",
          hi: "आर्थिक रूप से कमजोर परिवारों के बच्चों को किताबें, स्कूल बैग, यूनिफॉर्म और अन्य शैक्षणिक सामग्री प्रदान करना।",
          or: "ଆର୍ଥିକ ଅନାଟନରେ ଥିବା ପରିବାରର ପିଲାମାନଙ୍କୁ ବହି, ସ୍କୁଲ ବ୍ୟାଗ୍, ୟୁନିଫର୍ମ ଏବଂ ଅନ୍ୟାନ୍ୟ ଶିକ୍ଷା ସାମଗ୍ରୀ ପ୍ରଦାନ କରିବା।"
        }
      },
      {
        title: { en: "Disaster Relief:", hi: "आपदा राहत:", or: "ଆପାତକାଳୀନ ରିଲିଫ୍:" },
        desc: {
          en: "To provide timely food, ration kits and essential supplies during floods, cyclones, pandemics and other emergencies.",
          hi: "बाढ़, चक्रवात, महामारी और अन्य आपात स्थितियों के दौरान समय पर भोजन, राशन किट और आवश्यक सामग्री वितरित करना।",
          or: "ବନ୍ୟା, ବାତ୍ୟା, ମହାମାରୀ ଏବଂ ଅନ୍ୟାନ୍ୟ ଜରୁରୀ ସମୟରେ ତୁରନ୍ତ ଖାଦ୍ୟ, ରାସନ କିଟ୍ ଏବଂ ଆବଶ୍ୟକୀୟ ସାମଗ୍ରୀ ଯୋଗାଇଦେବା।"
        }
      },
      {
        title: { en: "Women & Youth Empowerment:", hi: "महिला एवं युवा सशक्तिकरण:", or: "ମହିଳା ଓ ଯୁବ ସଶକ୍ତୀକରଣ:" },
        desc: {
          en: "To promote skill development, awareness and opportunities that help women and young people become more independent and confident.",
          hi: "कौशल विकास, जागरूकता और अवसरों को बढ़ावा देना ताकि महिलाएं और युवा अधिक स्वतंत्र और आत्मविश्वासी बन सकें।",
          or: "ମହିଳା ଏବଂ ଯୁବପିଢ଼ିଙ୍କୁ ଅଧିକ ସ୍ୱାବଲମ୍ବୀ ଏବଂ ଆତ୍ମବିଶ୍ୱାସୀ କରିବା ପାଇଁ ଦକ୍ଷତା ବିକାଶ, ସଚେତନତା ଓ ସୁଯୋଗ ସୃଷ୍ଟି କରିବା।"
        }
      },
      {
        title: { en: "Community Development:", hi: "सामुदायिक विकास:", or: "ସାମାଜିକ ବିକାଶ:" },
        desc: {
          en: "To work for better sanitation, environmental protection, social awareness and sustainable development in rural communities.",
          hi: "ग्रामीण समुदायों में बेहतर स्वच्छता, पर्यावरण संरक्षण, सामाजिक जागरूकता और सतत विकास के लिए काम करना।",
          or: "ଗ୍ରାମାଞ୍ଚଳରେ ଉନ୍ନତ ସ୍ୱଚ୍ଛତା, ପରିବେଶ ସୁରକ୍ଷା, ସାମାଜିକ ସଚେତନତା ଏବଂ ସ୍ଥାୟୀ ବିକାଶ ପାଇଁ କାର୍ଯ୍ୟ କରିବା।"
        }
      },
      {
        title: { en: "Humanitarian Service:", hi: "मानवीय सेवा:", or: "ମାନବିକ ସେବା:" },
        desc: {
          en: "To serve people in need without discrimination, promoting compassion, dignity, equality and unity in society.",
          hi: "बिना किसी भेदभाव के जरूरतमंद लोगों की सेवा करना, समाज में करुणा, गरिमा, समानता और एकता को बढ़ावा देना।",
          or: "ବିନା କୌଣସି ଭେଦଭାବରେ ଜରୁରୀ ଲୋକଙ୍କ ସେବା କରିବା, ସମାଜରେ ଦୟା, ମର୍ଯ୍ୟାଦା, ସମାନତା ଏବଂ ଏକତା ପ୍ରତିଷ୍ଠା କରିବା।"
        }
      }
    ],
    commitmentTitle: {
      en: "Our Commitment",
      hi: "हमारी प्रतिबद्धता",
      or: "ଆମର ପ୍ରତିବଦ୍ଧତା"
    },
    commitmentQuote: {
      en: "“Service to Humanity is Service to God.”",
      hi: "“मानव सेवा ही ईश्वर सेवा है।”",
      or: "“ମାନବ ସେବା ହିଁ ମାଧବ ସେବା।”"
    },
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

        {/* Vision, Mission & Commitment Cards */}
        <div id="vision-mission" className="space-y-6 sm:space-y-8">
          
          {/* Top Row: Vision & Commitment */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            
            {/* Our Vision Card */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <Eye className="w-40 h-40 text-slate-900" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-bold mb-4">
                  <Eye className="w-4 h-4 text-sky-700" />
                  <span>{getTxt(content.visionTitle)}</span>
                </div>
                
                <blockquote className="text-base sm:text-lg text-slate-900 font-serif italic leading-relaxed border-l-4 border-sky-600 pl-4 my-3 bg-sky-50/50 py-2 pr-3 rounded-r-xl">
                  {getTxt(content.visionQuote)}
                </blockquote>

                <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {getTxt(content.visionDesc)}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400 italic">
                Sustainable positive change in rural and underserved communities.
              </div>
            </div>

            {/* Our Commitment Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 text-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-emerald-800/50 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <Heart className="w-40 h-40 text-emerald-300" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-bold mb-4 border border-emerald-500/30">
                  <Heart className="w-4 h-4 text-emerald-300" />
                  <span>{getTxt(content.commitmentTitle)}</span>
                </div>
                
                <blockquote className="text-xl sm:text-2xl font-normal font-heading text-emerald-100 italic leading-snug my-4 border-l-4 border-emerald-400 pl-4">
                  {getTxt(content.commitmentQuote)}
                </blockquote>
              </div>
              
              <div className="pt-4 border-t border-emerald-800/60 text-xs text-emerald-200/80 leading-relaxed">
                Dedicated to serving every individual in need with unconditional compassion, dignity, equality and unity.
              </div>
            </div>

          </div>

          {/* Bottom Row: Our Mission Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <Target className="w-40 h-40 text-slate-900" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-6">
                <Target className="w-4 h-4 text-emerald-700" />
                <span>{getTxt(content.missionTitle)}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                {content.missionPoints.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-emerald-200 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <strong className="font-bold text-slate-900 block sm:inline mr-1">
                        {getTxt(pt.title)}
                      </strong>
                      <span>{getTxt(pt.desc)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400 italic">
              "Working together so no one in need is left behind."
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
