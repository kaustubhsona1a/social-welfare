import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { FoundationRepository } from '../lib/supabase';
import { 
  Phone,
  ArrowRight
} from 'lucide-react';

interface HeroProps {
  currentLang: Language;
  onOpenContactModal: () => void;
  onExploreWork: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentLang,
  onOpenContactModal,
  onExploreWork
}) => {
  const [heroBgUrl, setHeroBgUrl] = useState<string | null>(FoundationRepository.getHeroBg());
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const loadHeroBg = () => {
      setHeroBgUrl(FoundationRepository.getHeroBg());
    };
    loadHeroBg();

    window.addEventListener('hero_bg_updated', loadHeroBg);
    window.addEventListener('repository_updated', loadHeroBg);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('hero_bg_updated', loadHeroBg);
      window.removeEventListener('repository_updated', loadHeroBg);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calculate liquid glass diffusion parameters based on scroll depth
  const scrollRatio = Math.min(1, Math.max(0, scrollY / 300));
  const isScrolled = scrollY > 20;

  // Default fallback hero image if no custom operator background uploaded
  const activeBgImage = heroBgUrl || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1600&auto=format&fit=crop";

  return (
    <section id="home" className="relative overflow-hidden min-h-[calc(100dvh-80px)] sm:min-h-[85vh] flex items-center justify-center py-8 sm:py-16">
      
      {/* Liquid Glass Background Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
        <img 
          src={activeBgImage} 
          alt="Social Welfare Foundation" 
          className="w-full h-full object-cover transition-all duration-700 ease-out scale-100"
          style={{
            filter: `blur(${scrollRatio * 16}px) brightness(${1 - scrollRatio * 0.25})`,
            transform: `scale(${1 + scrollRatio * 0.04})`
          }}
        />

        {/* Ambient Gradient Overlays for readable buttons */}
        <div 
          className="absolute inset-0 transition-opacity duration-500 ease-out pointer-events-none"
          style={{
            background: scrollRatio > 0.1 
              ? `radial-gradient(circle at 50% 50%, rgba(15, 23, 42, ${0.2 + scrollRatio * 0.4}), rgba(2, 6, 23, ${0.5 + scrollRatio * 0.3}))`
              : 'linear-gradient(to top, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.2) 50%, rgba(15, 23, 42, 0.4) 100%)'
          }}
        />

        {/* Liquid Glass Frosting Overlay on Scroll */}
        <div 
          className="absolute inset-0 backdrop-blur-xs transition-all duration-500 pointer-events-none"
          style={{
            backdropFilter: `blur(${scrollRatio * 10}px)`,
            backgroundColor: `rgba(255, 255, 255, ${scrollRatio * 0.12})`
          }}
        />
      </div>

      {/* Floating Glass Action Buttons Container */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-4 text-center">
        <div className="bg-slate-900/60 backdrop-blur-xl p-3.5 sm:p-4 rounded-3xl border border-white/20 shadow-2xl flex flex-col sm:flex-row items-center justify-center gap-3 transition-all duration-300 hover:bg-slate-900/70">
          <button
            onClick={onOpenContactModal}
            className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-all active:scale-98"
          >
            <Phone className="w-4 h-4 text-emerald-200" />
            <span>{currentLang === 'or' ? 'ଯୋଗାଯୋଗ କରନ୍ତୁ' : 'Contact Office'}</span>
          </button>

          <button
            onClick={onExploreWork}
            className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 bg-white/90 hover:bg-white text-slate-900 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-md transition-all active:scale-98"
          >
            <span>{currentLang === 'or' ? 'ସେବା କାର୍ଯ୍ୟ ଦେଖନ୍ତୁ' : 'Explore Services'}</span>
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </button>
        </div>
      </div>

    </section>
  );
};


