import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import { FoundationRepository } from '../lib/supabase';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  allowUpload?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showText = false,
  allowUpload = false 
}) => {
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  };

  useEffect(() => {
    const loadLogo = () => {
      const saved = localStorage.getItem('custom_app_logo');
      if (saved) {
        setCustomLogo(saved);
      } else {
        setCustomLogo(null);
      }
    };

    loadLogo();

    const handleUpdate = () => loadLogo();
    window.addEventListener('logo_updated', handleUpdate);

    return () => {
      window.removeEventListener('logo_updated', handleUpdate);
    };
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size is too large. Please select an image under 5MB.');
        return;
      }

      try {
        const imageUrl = await FoundationRepository.uploadImage(file, 'logos');
        await FoundationRepository.saveCustomLogo(imageUrl);
      } catch (err: any) {
        console.error('Logo upload error:', err);
      }
    }
  };

  const handleResetLogo = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Reset logo back to default official emblem?')) {
      await FoundationRepository.saveCustomLogo('');
    }
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    if (allowUpload) {
      e.stopPropagation();
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {allowUpload && (
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
          accept="image/*" 
          className="hidden" 
        />
      )}

      <div 
        className={`relative flex-shrink-0 group/logo ${allowUpload ? 'cursor-pointer' : ''} ${sizeMap[size]}`}
        onMouseEnter={() => allowUpload && setIsHovered(true)}
        onMouseLeave={() => allowUpload && setIsHovered(false)}
        onClick={allowUpload ? handleUploadClick : undefined}
        title={allowUpload ? "Click to upload custom logo image" : undefined}
      >
        {customLogo ? (
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-emerald-600 bg-white shadow-md flex items-center justify-center p-0.5">
            <img 
              src={customLogo} 
              alt="Social Welfare Foundation Logo" 
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        ) : (
          /* SVG emblem replicating the official green/yellow seal from Babujang Cuttack */
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            {/* Outer Green Ring */}
            <circle cx="100" cy="100" r="96" fill="#15803d" stroke="#047857" strokeWidth="4" />
            <circle cx="100" cy="100" r="90" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="4 2" />
            
            {/* Circular Text Track - Outer */}
            <path id="textPathOuter" d="M 18,100 A 82,82 0 1,1 182,100" fill="none" />
            <text fill="#ffffff" fontSize="13.5" fontWeight="bold" letterSpacing="1.2">
              <textPath href="#textPathOuter" startOffset="50%" textAnchor="middle">
                SOCIAL WELFARE FOUNDATION
              </textPath>
            </text>

            <path id="textPathBottom" d="M 182,100 A 82,82 0 0,1 18,100" fill="none" />
            <text fill="#ffffff" fontSize="13" fontWeight="bold" letterSpacing="1">
              <textPath href="#textPathBottom" startOffset="50%" textAnchor="middle">
                ★ BABUJANG ★
              </textPath>
            </text>

            {/* Inner Circle Background - Yellow */}
            <circle cx="100" cy="100" r="68" fill="#fde047" stroke="#ffffff" strokeWidth="3" />
            
            {/* Inner Circular Text - SERVICES TO HUMANITY */}
            <path id="textPathInner" d="M 38,100 A 62,62 0 1,1 162,100" fill="none" />
            <text fill="#15803d" fontSize="10.5" fontWeight="800" letterSpacing="0.8">
              <textPath href="#textPathInner" startOffset="50%" textAnchor="middle">
                SERVICES TO HUMANITY
              </textPath>
            </text>

            {/* Center Graphic Elements */}
            <g transform="translate(100, 105) scale(0.85)">
              <path d="M 0,-15 C -8,-25 -20,-20 -20,-10 C -20,-2 -10,0 0,12 C 10,0 20,-2 20,-10 C 20,-20 8,-25 0,-15 Z" fill="#16a34a" />
              <rect x="-2" y="10" width="4" height="15" fill="#854d0e" rx="1" />
              
              <circle cx="-25" cy="-5" r="4" fill="#0284c7" />
              <path d="M -29,2 L -21,2 L -23,15 L -27,15 Z" fill="#0369a1" />

              <circle cx="-35" cy="-2" r="3.5" fill="#0284c7" />
              <path d="M -38,5 L -32,5 L -34,15 L -36,15 Z" fill="#0284c7" />

              <rect x="-12" y="-35" width="24" height="10" rx="2" fill="#0284c7" />
              <circle cx="-6" cy="-30" r="2.5" fill="#ffffff" />
              <path d="M -12,-25 L 12,-25" stroke="#ffffff" strokeWidth="1.5" />

              <path d="M -15,22 C -8,18 -2,22 0,25 C 2,22 8,18 15,22 C 10,30 -10,30 -15,22 Z" fill="#dc2626" />
            </g>

            {/* Established Badge */}
            <rect x="62" y="148" width="76" height="18" rx="9" fill="#15803d" stroke="#ffffff" strokeWidth="1" />
            <text x="100" y="161" fill="#ffffff" fontSize="9.5" fontWeight="bold" textAnchor="middle">
              ★ ESTD-2024 ★
            </text>
          </svg>
        )}

        {/* Upload Overlay Badge on Hover */}
        {allowUpload && (
          <div className="absolute inset-0 bg-slate-950/60 rounded-full flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity backdrop-blur-3xs">
            <Camera className="w-5 h-5 text-white drop-shadow-xs" />
          </div>
        )}

        {/* Reset Button Badge if custom logo is active */}
        {allowUpload && customLogo && isHovered && (
          <button
            onClick={handleResetLogo}
            className="absolute -top-1 -right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md z-10 transition-transform hover:scale-110"
            title="Reset to default logo"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        )}
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-black text-emerald-600 uppercase tracking-wider leading-tight text-base md:text-xl">
            SOCIAL WELFARE FOUNDATION
          </span>
          <span className="text-xs font-semibold text-emerald-700 tracking-wide flex items-center gap-1.5">
            <span>Babujang, Cuttack</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-mono border border-emerald-200">
              ESTD 2024
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

