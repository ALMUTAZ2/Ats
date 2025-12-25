
import React from 'react';
import { ResumeAuditor } from './components/ResumeAuditor.tsx';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8">
      <header className="max-w-5xl mx-auto mb-12 flex items-center justify-between border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase">ATS-Beater</h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em]">PROPHET AI V2.0</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
            ELITE AUDIT ACTIVE
          </span>
          <div className="h-4 w-px bg-slate-800"></div>
          <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition">Documentation</a>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto">
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
              <span>Prophet: AI Resume Auditor</span>
              <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20 font-mono">FORENSIC ENGINE</span>
            </h2>
            <p className="text-slate-400 max-w-3xl text-sm leading-relaxed">
              Analyze professional profiles using strict, cynical Silicon Valley recruitment standards. 
              Our engine identifies structural traps, keyword gaps, and outcome-based metrics with zero leniency.
            </p>
          </div>
          <ResumeAuditor />
        </section>
      </main>

      <footer className="max-w-5xl mx-auto mt-24 pb-12 text-center border-t border-slate-800 pt-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-6 text-slate-500">
            <a href="#" className="hover:text-indigo-400 transition-colors cursor-pointer text-xs uppercase tracking-widest font-bold">Github</a>
            <a href="#" className="hover:text-indigo-400 transition-colors cursor-pointer text-xs uppercase tracking-widest font-bold">Privacy</a>
            <a href="#" className="hover:text-indigo-400 transition-colors cursor-pointer text-xs uppercase tracking-widest font-bold">Support</a>
          </div>
          <p className="text-slate-600 text-[10px] uppercase tracking-widest font-bold">
            &copy; {new Date().getFullYear()} ATS-Beater Systems. Forensic Scanning Protocol.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
