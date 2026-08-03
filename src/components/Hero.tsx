import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { FoundationRepository } from '../lib/supabase';

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

        {/* Ambient Gradient Overlays (subtle fade on scroll) */}
        <div 
          className="absolute inset-0 transition-opacity duration-500 ease-out pointer-events-none"
          style={{
            background: scrollRatio > 0.1 
              ? `radial-gradient(circle at 50% 50%, rgba(15, 23, 42, ${0.2 + scrollRatio * 0.4}), rgba(2, 6, 23, ${0.5 + scrollRatio * 0.3}))`
              : 'transparent'
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

    </section>
  );
};


