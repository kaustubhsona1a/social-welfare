import React, { useState } from 'react';
import { Logo } from './Logo';
import { Language } from '../types';
import { FOUNDATION_INFO } from '../data/mockData';
import { 
  Menu, 
  X, 
  Globe, 
  MessageCircle,
  Phone,
  FileCheck,
  MapPin,
  Camera,
  Settings
} from 'lucide-react';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenContactModal: () => void;
  onOpenOperatorPanel?: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  onOpenContactModal,
  onOpenOperatorPanel,
  activeSection,
  setActiveSection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const lastTapTimeRef = React.useRef<number>(0);
  const tapCountRef = React.useRef<number>(0);

  const handleTripleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTapTimeRef.current < 30) return; // ignore duplicate click right after touchend

    if (now - lastTapTimeRef.current < 550) {
      tapCountRef.current += 1;
    } else {
      tapCountRef.current = 1;
    }
    lastTapTimeRef.current = now;

    const detail = 'detail' in e ? (e as React.MouseEvent).detail : 0;
    if (tapCountRef.current >= 3 || detail >= 3) {
      tapCountRef.current = 0;
      if (onOpenOperatorPanel) {
        onOpenOperatorPanel();
      }
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', labelEn: 'Home', labelHi: 'मुख्य पृष्ठ', labelOr: 'ମୁଖ୍ୟ' },
    { id: 'about', labelEn: 'About Us', labelHi: 'हमारे बारे में', labelOr: 'ଆମ ବିଷୟରେ' },
    { id: 'vision-mission', labelEn: 'Vision & Mission', labelHi: 'लक्ष्य एवं मिशन', labelOr: 'ଲକ୍ଷ୍ୟ ଓ ମିଶନ୍' },
    { id: 'leadership', labelEn: 'Our Team', labelHi: 'हमारी टीम', labelOr: 'ଆମ ନେତୃତ୍ୱ' },
    { id: 'initiatives', labelEn: 'Our Projects', labelHi: 'परियोजनाएं', labelOr: 'ଆମ ପ୍ରକଳ୍ପ' },
    { id: 'gallery', labelEn: 'Gallery', labelHi: 'गैलरी', labelOr: 'ଗ୍ୟାଲେରୀ' },
    { id: 'news-events', labelEn: 'News & Events', labelHi: 'समाचार एवं कार्यक्रम', labelOr: 'ଖବର ଓ କାର୍ଯ୍ୟକ୍ରମ' },
    { id: 'volunteer', labelEn: 'Volunteer', labelHi: 'स्वयंसेवक', labelOr: 'ସ୍ୱେଚ୍ଛାସେବୀ' },
    { id: 'stories', labelEn: 'Donate', labelHi: 'दान करें', labelOr: 'ଦାନ କରନ୍ତୁ' },
    { id: 'csr', labelEn: 'CSR Partnership', labelHi: 'सीएसआर साझेदारी', labelOr: 'ସିଏସଆର' },
    { id: 'transparency', labelEn: 'Transparency & Docs', labelHi: 'पारदर्शिता एवं दस्तावेज', labelOr: 'ସ୍ୱଚ୍ଛତା ଓ ଦସ୍ତାବିଜ' },
    { id: 'contact', labelEn: 'Contact Us', labelHi: 'संपर्क करें', labelOr: 'ଯୋଗାଯୋଗ' },
  ];

  const getNavLabel = (item: typeof navItems[0]) => {
    if (currentLang === 'hi') return item.labelHi;
    if (currentLang === 'or') return item.labelOr;
    return item.labelEn;
  };

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/75 backdrop-blur-2xl border-b border-white/50 shadow-sm py-0.5' 
          : 'bg-white/95 backdrop-blur-md border-b border-sky-100/80 py-0'
      }`}
    >
      {/* Top Single Slim Notification Bar */}
      <div className="bg-slate-900 text-slate-300 py-1 px-3 sm:px-4 text-[10px] sm:text-[11px] font-light border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div 
            onClick={handleTripleTap}
            onTouchEnd={handleTripleTap}
            className="flex items-center gap-1.5 text-sky-300 min-w-0 cursor-pointer select-none active:opacity-80"
            title="Triple tap for Operator Panel (Or press Ctrl+Shift+O)"
          >
            <FileCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-400 shrink-0" />
            <span className="truncate">Govt Reg: <strong className="font-mono text-white font-normal">{FOUNDATION_INFO.regNo}</strong></span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400 truncate">Babujang, Cuttack</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300 shrink-0">
            <a 
              href={`tel:${FOUNDATION_INFO.phone.replace(/\s+/g, '')}`} 
              className="hover:text-white transition-colors font-mono flex items-center gap-1 text-sky-300 text-[10px] sm:text-xs"
            >
              <Phone className="w-3 h-3 text-sky-400 shrink-0" />
              <span>{FOUNDATION_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className={`flex items-center justify-between gap-2 transition-all duration-300 ${isScrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'}`}>
          
          {/* Brand Logo & Name */}
          <div 
            onClick={() => handleNavClick('home')} 
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNavClick('home');
              }
            }}
            role="button"
            tabIndex={0}
            className="flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none group min-w-0 cursor-pointer select-none"
          >
            <Logo size={isScrolled ? "sm" : "md"} className="group-hover:scale-105 transition-transform shrink-0" />

            <div className="flex flex-col min-w-0 max-w-[170px] min-[380px]:max-w-[210px] sm:max-w-none">
              <span className="text-[11px] min-[380px]:text-xs sm:text-base lg:text-lg font-extrabold text-emerald-700 uppercase tracking-tight sm:tracking-wide group-hover:text-emerald-800 transition-colors leading-tight font-heading truncate">
                {currentLang === 'hi' ? FOUNDATION_INFO.nameHi : currentLang === 'or' ? FOUNDATION_INFO.nameOr : FOUNDATION_INFO.nameEn}
              </span>
              <span className="text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-light text-slate-500 flex items-center gap-1 pt-0.5 truncate">
                <span className="truncate">Babujang, Cuttack</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-medium shrink-0">Trust</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/80 overflow-x-auto max-w-2xl">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                    isActive 
                      ? 'bg-emerald-700 text-white shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/90'
                  }`}
                >
                  {getNavLabel(item)}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-2">
            {onOpenOperatorPanel && (
              <button
                onClick={onOpenOperatorPanel}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50/90 hover:bg-emerald-100 text-emerald-900 text-xs font-medium transition-all shrink-0"
                title="Open Foundation Operator & Image Upload Panel"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-600" />
                <span>Operator Hub</span>
              </button>
            )}

            {/* 3-Language Toggle */}
            <div className="flex items-center bg-sky-50 border border-sky-200 rounded-full p-0.5 text-xs font-semibold shrink-0">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 rounded-full transition-all ${currentLang === 'en' ? 'bg-sky-700 text-white shadow-2xs' : 'text-sky-900 hover:bg-sky-100'}`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2.5 py-1 rounded-full transition-all ${currentLang === 'hi' ? 'bg-sky-700 text-white shadow-2xs' : 'text-sky-900 hover:bg-sky-100'}`}
              >
                हिंदी
              </button>
              <button
                onClick={() => onLanguageChange('or')}
                className={`px-2.5 py-1 rounded-full transition-all ${currentLang === 'or' ? 'bg-sky-700 text-white shadow-2xs' : 'text-sky-900 hover:bg-sky-100'}`}
              >
                ଓଡ଼ିଆ
              </button>
            </div>

            <button
              onClick={onOpenContactModal}
              className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xs hover:shadow-xs transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-200" />
              <span>{currentLang === 'or' ? 'ଯୋଗାଯୋଗ' : 'Contact Us'}</span>
            </button>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center gap-1.5 md:hidden">
            <div className="flex items-center bg-sky-50 border border-sky-200 rounded-full p-0.5 text-[10px] font-bold">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 rounded-full ${currentLang === 'en' ? 'bg-sky-700 text-white' : 'text-sky-900'}`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-0.5 rounded-full ${currentLang === 'hi' ? 'bg-sky-700 text-white' : 'text-sky-900'}`}
              >
                हि
              </button>
              <button
                onClick={() => onLanguageChange('or')}
                className={`px-2 py-0.5 rounded-full ${currentLang === 'or' ? 'bg-sky-700 text-white' : 'text-sky-900'}`}
              >
                ଓଡ଼ି
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-2xl text-slate-700 hover:bg-slate-100 focus:outline-none border border-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-colors ${
                  activeSection === item.id 
                    ? 'text-sky-900 bg-sky-50 font-bold border border-sky-200' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {getNavLabel(item)}
              </button>
            ))}
          </div>

          {onOpenOperatorPanel && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOperatorPanel();
              }}
              className="w-full py-2.5 bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium rounded-2xl text-center flex items-center justify-center gap-2 text-xs"
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>Operator Hub (Upload & Sync Images)</span>
            </button>
          )}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenContactModal();
            }}
            className="w-full py-3 bg-gradient-to-r from-sky-700 to-blue-900 text-white font-light rounded-2xl text-center shadow-md flex items-center justify-center gap-2 text-xs"
          >
            <MessageCircle className="w-4 h-4 text-sky-300" />
            <span>{currentLang === 'or' ? 'ଯୋଗାଯୋଗ କରନ୍ତୁ' : 'Contact Foundation Office'}</span>
          </button>
        </div>
      )}
    </header>
  );
};

