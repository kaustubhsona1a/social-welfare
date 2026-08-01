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

  const navItems = [
    { id: 'home', labelEn: 'Home', labelOr: 'ମୁଖ୍ୟ ପୃଷ୍ଠା' },
    { id: 'initiatives', labelEn: 'Initiatives', labelOr: 'କାର୍ଯ୍ୟକ୍ରମ' },
    { id: 'pillars', labelEn: 'Our Work', labelOr: 'ସେବା' },
    { id: 'leadership', labelEn: 'Leadership', labelOr: 'ନେତୃତ୍ୱ' },
    { id: 'stories', labelEn: 'Impact', labelOr: 'ସଫଳତା' },
    { id: 'gallery', labelEn: 'Gallery', labelOr: 'ଗ୍ୟାଲେରୀ' },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-sky-100 shadow-xs transition-all">
      {/* Top Single Slim Notification Bar */}
      <div className="bg-slate-900 text-slate-300 py-1 px-3 sm:py-1.5 sm:px-4 text-[10px] sm:text-[11px] font-light border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div 
            onClick={(e) => {
              if (e.detail === 3 && onOpenOperatorPanel) {
                onOpenOperatorPanel();
              }
            }}
            className="flex items-center gap-1.5 text-sky-300 min-w-0 cursor-pointer select-none"
            title="Triple click for Operator Panel (Or press Ctrl+Shift+O)"
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
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
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
            className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none group min-w-0 cursor-pointer select-none"
          >
            <Logo size="md" className="group-hover:scale-105 transition-transform shrink-0" />

            <div className="flex flex-col min-w-0">
              <span className="text-[12px] xs:text-sm sm:text-lg lg:text-xl font-black text-emerald-600 uppercase tracking-wide group-hover:text-emerald-700 transition-colors leading-snug font-heading">
                {currentLang === 'or' ? FOUNDATION_INFO.nameOr : 'SOCIAL WELFARE FOUNDATION'}
              </span>
              <span className="text-[10px] sm:text-[11px] font-light text-slate-500 flex items-center gap-1 pt-0.5 font-mono truncate">
                <span className="truncate">Babujang, Cuttack</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-medium shrink-0">Community Trust</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-full border border-slate-200/80">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-light transition-all ${
                    isActive 
                      ? 'bg-sky-800 text-white font-normal shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  {currentLang === 'or' ? item.labelOr : item.labelEn}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {onOpenOperatorPanel && (
              <button
                onClick={onOpenOperatorPanel}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 text-xs font-medium transition-all"
                title="Open Foundation Operator & Image Upload Panel"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-600" />
                <span>Operator Hub</span>
              </button>
            )}

            <button
              onClick={() => onLanguageChange(currentLang === 'en' ? 'or' : 'en')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-sky-200 bg-sky-50/70 hover:bg-sky-100 text-sky-900 text-xs font-light transition-all"
              title="Toggle English / Odia"
            >
              <Globe className="w-3.5 h-3.5 text-sky-700" />
              <span>{currentLang === 'en' ? 'ଓଡ଼ିଆ' : 'English'}</span>
            </button>

            <button
              onClick={onOpenContactModal}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-700 to-blue-900 hover:from-sky-800 hover:to-blue-950 text-white text-xs font-light px-5 py-2.5 rounded-full shadow-xs hover:shadow-md transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 text-sky-300" />
              <span>{currentLang === 'or' ? 'ଯୋଗାଯୋଗ କରନ୍ତୁ' : 'Contact Us'}</span>
            </button>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => onLanguageChange(currentLang === 'en' ? 'or' : 'en')}
              className="px-2.5 py-1.5 rounded-full bg-sky-100 text-sky-900 text-xs font-light border border-sky-200"
            >
              {currentLang === 'en' ? 'ଓଡ଼ିଆ' : 'EN'}
            </button>

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
                className={`text-left px-3.5 py-2.5 rounded-2xl text-xs font-light transition-colors ${
                  activeSection === item.id 
                    ? 'text-sky-900 bg-sky-50 font-normal border border-sky-200' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {currentLang === 'or' ? item.labelOr : item.labelEn}
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

