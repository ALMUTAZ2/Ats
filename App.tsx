
import React from 'react';
import { ResumeAuditor } from './components/ResumeAuditor.tsx';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-200 font-sans selection:bg-emerald-500/30">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#0b0f1a]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white uppercase leading-none">Prophet</h1>
              <p className="text-[9px] text-emerald-500 font-bold tracking-[0.3em] uppercase">ATS Auditor V2.0</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
             <div className="hidden md:flex items-center space-x-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Deterministic Engine</span>
                <span className="w-px h-3 bg-slate-800"></span>
                <span>v2.1.0-STRICT</span>
             </div>
             <a href="https://ai.google.dev" target="_blank" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">DOCS</a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-16">
        <section className="text-center space-y-4">
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
            Be <span className="text-emerald-500">Unstoppable</span>.
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-medium leading-relaxed">
            Silicon Valley hiring algorithms are designed to reject you. 
            Prophet V2.0 exposes structural traps and semantic gaps using 
            Gemini-powered forensic analysis and deterministic strict scoring.
          </p>
        </section>

        <ResumeAuditor />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-4">
            <div className="text-emerald-500">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Anti-Trap Engine</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">Automatically detects multi-columns, tables, and images that break legacy ATS parsers.</p>
          </div>
          <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-4">
            <div className="text-blue-500">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            </div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Semantic Fact Check</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">Extracts years of experience, skill density, and metric-based impact with surgical precision.</p>
          </div>
          <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-4">
            <div className="text-amber-500">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Zero Leniency</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">Scored by a deterministic JS algorithm to ensure consistent, brutal feedback every time.</p>
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-800 text-center">
        <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em]">
          Powered by Gemini 3 Flash // Deterministic Execution Protocol
        </p>
        <p className="text-[9px] text-slate-700 font-bold uppercase mt-2">
          &copy; {new Date().getFullYear()} Prophet ATS Systems. No Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;
