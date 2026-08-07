import React, { useState, useEffect } from 'react';
import { Language, DonationDrive, OfficeBearer, SuccessStory, GalleryItem } from './types';
import { FoundationRepository } from './lib/supabase';

// Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutAndVision } from './components/AboutAndVision';
import { InitiativesAndWork } from './components/InitiativesAndWork';
import { LeadershipSection } from './components/LeadershipSection';
import { DonateAndImpact } from './components/DonateAndImpact';
import { GallerySection } from './components/GallerySection';
import { NewsAndEventsSection } from './components/NewsAndEventsSection';
import { VolunteerAndCSRSection } from './components/VolunteerAndCSRSection';
import { TransparencySection } from './components/TransparencySection';
import { ContactSection } from './components/ContactSection';
import { ContactModal } from './components/ContactModal';
import { SupabaseModal } from './components/SupabaseModal';
import { OperatorPanel } from './components/OperatorPanel';
import { Footer } from './components/Footer';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [activeSection, setActiveSection] = useState<string>('home');

  // Modal state
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState<boolean>(false);
  const [isOperatorOpen, setIsOperatorOpen] = useState<boolean>(false);

  // Repository state
  const [drives, setDrives] = useState<DonationDrive[]>([]);
  const [leadership, setLeadership] = useState<OfficeBearer[]>([]);
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  const loadRepositoryData = () => {
    setDrives(FoundationRepository.getDrives());
    setLeadership(FoundationRepository.getLeadership());
    setStories(FoundationRepository.getStories());
    setGallery(FoundationRepository.getGallery());
  };

  useEffect(() => {
    loadRepositoryData();
    FoundationRepository.syncFromSupabase();

    const handleRepoUpdate = () => loadRepositoryData();
    window.addEventListener('repository_updated', handleRepoUpdate);

    // Hidden Keyboard Shortcut (Ctrl+Shift+O or Cmd+Shift+O) to open Operator Panel
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        setIsOperatorOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('repository_updated', handleRepoUpdate);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-sky-200 selection:text-sky-900 flex flex-col">
      {/* Single Main Navigation Bar with Integrated Announcement Bar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenContactModal={() => setIsContactOpen(true)}
        onOpenOperatorPanel={() => setIsOperatorOpen(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Body Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          currentLang={currentLang}
          onOpenContactModal={() => setIsContactOpen(true)}
          onExploreWork={() => {
            const el = document.getElementById('about');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* About Us & Vision & Mission */}
        <AboutAndVision currentLang={currentLang} />

        {/* Initiatives & Our Work (Projects) */}
        <InitiativesAndWork
          drives={drives}
          currentLang={currentLang}
          onOpenContactModal={() => setIsContactOpen(true)}
        />

        {/* Leadership & Office Bearers (Our Team) */}
        <LeadershipSection
          leadership={leadership}
          currentLang={currentLang}
        />

        {/* Activity & Media Gallery */}
        <GallerySection
          items={gallery}
          currentLang={currentLang}
        />

        {/* News & Events & Media */}
        <NewsAndEventsSection currentLang={currentLang} />

        {/* Donate & Impact Section (UPI Barcode, Bank Details, Success Stories) */}
        <DonateAndImpact
          stories={stories}
          currentLang={currentLang}
          onOpenContactModal={() => setIsContactOpen(true)}
        />

        {/* Volunteer Joining & Corporate CSR Partnership */}
        <VolunteerAndCSRSection currentLang={currentLang} />

        {/* Documents Folder & Legal Transparency (12A, 80G, PAN, Trust Reg, Audit) */}
        <TransparencySection currentLang={currentLang} />

        {/* Contact Page Section (Address, Map, Email, Phone, WhatsApp, Form) */}
        <ContactSection currentLang={currentLang} />
      </main>

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        onOpenContactModal={() => setIsContactOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseOpen(true)}
        onOpenOperatorPanel={() => setIsOperatorOpen(true)}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        currentLang={currentLang}
      />

      {/* Supabase Script & Integration Modal */}
      <SupabaseModal
        isOpen={isSupabaseOpen}
        onClose={() => setIsSupabaseOpen(false)}
      />

      {/* Operator Hub & Image Sync Modal */}
      <OperatorPanel
        isOpen={isOperatorOpen}
        onClose={() => setIsOperatorOpen(false)}
        onDataChange={loadRepositoryData}
      />
    </div>
  );
}
