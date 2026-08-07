import React, { useState, useEffect } from 'react';
import { X, Check, Copy, Database, ShieldCheck, Terminal, ExternalLink, Zap, AlertCircle, RefreshCw } from 'lucide-react';
import { isSupabaseConfigured, SUPABASE_SQL_SCHEMA, FoundationRepository } from '../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'sql' | 'guide'>('sql');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    connected: boolean;
    tablesExist: boolean;
    bucketExists: boolean;
    errorDetails?: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen && isSupabaseConfigured) {
      runTest();
    }
  }, [isOpen]);

  const runTest = async () => {
    setTesting(true);
    const res = await FoundationRepository.testSupabaseConnection();
    setTestResult(res);
    setTesting(false);
  };

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                Supabase Backend Integration
                {isSupabaseConfigured ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                    CONNECTED
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-mono">
                    LOCAL FALLBACK MODE
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400 font-light">
                Complete SQL schema & setup guide for Social Welfare Foundation Babujang
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Indicator & Health Check */}
        <div className={`px-6 py-3 border-b text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
          isSupabaseConfigured && testResult?.tablesExist
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
            : isSupabaseConfigured && testResult && !testResult.tablesExist
            ? 'bg-amber-50 text-amber-900 border-amber-200'
            : 'bg-slate-100 text-slate-800 border-slate-200'
        }`}>
          <div className="flex items-start gap-2">
            {isSupabaseConfigured && testResult?.tablesExist ? (
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5">
              <div className="font-semibold">
                {isSupabaseConfigured
                  ? testResult?.tablesExist 
                    ? 'Supabase is fully connected, tables verified, and storage ready!'
                    : 'Supabase credentials set, but SQL tables are missing or not executed yet.'
                  : 'Running in Local Persistence Mode (No Supabase URL set).'
                }
              </div>
              {testResult?.errorDetails && (
                <p className="text-[11px] text-amber-800 font-mono">
                  {testResult.errorDetails}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isSupabaseConfigured && (
              <button
                onClick={runTest}
                disabled={testing}
                className="inline-flex items-center gap-1 text-[11px] font-mono bg-white hover:bg-slate-50 border border-slate-300 px-2.5 py-1 rounded-lg text-slate-700 transition-colors shadow-2xs"
              >
                <RefreshCw className={`w-3 h-3 ${testing ? 'animate-spin text-emerald-600' : ''}`} />
                <span>{testing ? 'Testing...' : 'Test Sync'}</span>
              </button>
            )}

            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-700 hover:underline"
            >
              <span>Dashboard</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-4 py-2 text-xs font-medium rounded-t-xl transition-all border-t border-x ${
              activeTab === 'sql'
                ? 'bg-white text-emerald-700 border-slate-200 shadow-2xs font-semibold'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-600" />
              <span>SQL Schema Script</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 text-xs font-medium rounded-t-xl transition-all border-t border-x ${
              activeTab === 'guide'
                ? 'bg-white text-emerald-700 border-slate-200 shadow-2xs font-semibold'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Step-by-Step Setup Guide</span>
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'sql' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-slate-700">
                  Run this DDL script in your Supabase SQL Editor:
                </span>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-2xs active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy SQL Script</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <pre className="bg-slate-950 text-slate-200 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-[350px] leading-relaxed border border-slate-800">
                  <code>{SUPABASE_SQL_SCHEMA}</code>
                </pre>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed font-light">
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2">
                <h4 className="font-semibold text-emerald-900 text-sm">1. Create a Supabase Project</h4>
                <p>Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-700 font-medium underline">supabase.com</a>, log in, and click <strong>New Project</strong>.</p>
              </div>

              <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100 space-y-2">
                <h4 className="font-semibold text-sky-900 text-sm">2. Execute the Database Schema</h4>
                <p>In your Supabase project dashboard, navigate to <strong>SQL Editor</strong> on the left sidebar, paste the SQL Script from the first tab, and click <strong>Run</strong>.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-semibold text-slate-900 text-sm">3. Add Environment Variables</h4>
                <p>Under <strong>Project Settings &gt; API</strong>, copy your Project URL and Anon Public API key. Add them to your environment variables:</p>
                <div className="bg-slate-900 text-emerald-400 font-mono p-3 rounded-xl text-[11px] space-y-1">
                  <div>VITE_SUPABASE_URL=https://your-project.supabase.co</div>
                  <div>VITE_SUPABASE_ANON_KEY=your-anon-public-key</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] font-mono text-slate-500">
            Client SDK: @supabase/supabase-js v2
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
