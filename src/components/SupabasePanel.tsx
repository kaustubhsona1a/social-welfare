import React, { useState } from 'react';
import { isSupabaseConfigured, SUPABASE_SQL_SCHEMA, FoundationRepository } from '../lib/supabase';
import { 
  Database, 
  X, 
  Copy, 
  Check, 
  Terminal, 
  RefreshCw,
  Server,
  KeyRound
} from 'lucide-react';

interface SupabasePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onDataReset: () => void;
}

export const SupabasePanel: React.FC<SupabasePanelProps> = ({
  isOpen,
  onClose,
  onDataReset
}) => {
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen) return null;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const envSnippet = `# Supabase Backend Integration Credentials
VITE_SUPABASE_URL="https://your-supabase-project-ref.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(envSnippet);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-slate-200">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black font-heading flex items-center gap-2">
                <span>Supabase Backend Architecture</span>
                <span className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono font-black ${
                  isSupabaseConfigured 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {isSupabaseConfigured ? 'Live Supabase Connected' : 'Local Repository Sync'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Social Welfare Foundation Babujang • Database Engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
          
          {/* Status Alert */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
            isSupabaseConfigured
              ? 'bg-emerald-50/70 text-emerald-900 border-emerald-200'
              : 'bg-slate-50 text-slate-800 border-slate-200'
          }`}>
            <Server className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-black text-sm text-slate-900 font-heading">
                {isSupabaseConfigured 
                  ? 'Supabase Cloud Integration Active' 
                  : 'Operating on Local State Repository with Supabase Compatibility'}
              </h4>
              <p className="text-xs leading-relaxed text-slate-600 font-medium">
                All donations, assistance requests, drives, and office bearers are stored seamlessly. To connect your live Supabase cloud instance, add your project credentials to `.env`.
              </p>
            </div>
          </div>

          {/* Environment variables snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider font-mono text-[11px]">
                <KeyRound className="w-4 h-4 text-emerald-600" />
                1. Add Environment Variables (.env.example)
              </span>
              <button
                onClick={handleCopyEnv}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-colors"
              >
                {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEnv ? 'Copied!' : 'Copy Env'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-950 text-emerald-300 rounded-2xl font-mono text-[11px] overflow-x-auto border border-slate-800 shadow-inner">
              {envSnippet}
            </pre>
          </div>

          {/* SQL Schema Viewer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider font-mono text-[11px]">
                <Terminal className="w-4 h-4 text-emerald-600" />
                2. Supabase SQL Schema DDL Script (Copy & Run in Supabase SQL Editor)
              </span>
              <button
                onClick={handleCopySchema}
                className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition-colors"
              >
                {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSchema ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-950 text-teal-300 rounded-2xl font-mono text-[11px] overflow-x-auto max-h-60 border border-slate-800 shadow-inner">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>

          {/* Reset Local Cache Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-slate-500 font-mono text-[11px]">
              Testing reset options for preview storage
            </span>

            <button
              onClick={() => {
                FoundationRepository.resetToDefault();
                onDataReset();
              }}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl font-bold flex items-center gap-1.5 border border-rose-200 transition-colors text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Local Repository State</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

