
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { ProphetResponse, RawForensicMetrics } from '../types.ts';

export const ResumeAuditor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProphetResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- DETERMINISTIC SCORING ALGORITHM ---
  const calculateStrictScore = (metrics: RawForensicMetrics, missingSkills: string[]) => {
    let ats_score = 100;
    let impact_score = 100;

    // ATS Compatibility Deductions
    if (metrics.has_columns_tables) ats_score -= 20;
    if (metrics.has_photo) ats_score -= 15;
    if (metrics.has_graphic_icons) ats_score -= 10;
    if (metrics.has_creative_headers) ats_score -= 10;
    if (metrics.date_format_issues) ats_score -= 10;

    // Content Impact Deductions
    const bulletRatio = metrics.total_bullet_points > 0 ? metrics.bullets_with_numbers / metrics.total_bullet_points : 0;
    if (bulletRatio < 0.3) impact_score -= 10;
    if (bulletRatio === 0 && metrics.total_bullet_points > 0) impact_score -= 15;
    
    impact_score -= Math.min(20, metrics.weak_verbs_count * 4);
    impact_score -= (missingSkills.length * 5);

    // Final Normalization
    ats_score = Math.max(0, ats_score);
    impact_score = Math.max(0, impact_score);
    const overall = Math.floor((ats_score * 0.6) + (impact_score * 0.4));

    return { overall, ats_score, impact_score };
  };

  const handleAudit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });
      const base64Data = await base64Promise;

      const systemInstruction = `You are "Prophet V2.0", a forensic resume auditor. 
Your task is to extract RAW FACTS only. Do NOT calculate any scores yourself.
Return a strict JSON object based on the resume content.

Output Schema:
{
  "meta_data": { "candidate_name": string, "detected_language": string, "inferred_target_role": string, "years_experience": number },
  "raw_metrics": {
    "has_columns_tables": boolean,
    "has_photo": boolean,
    "has_graphic_icons": boolean,
    "has_creative_headers": boolean,
    "date_format_issues": boolean,
    "total_bullet_points": number,
    "bullets_with_numbers": number,
    "weak_verbs_count": number,
    "word_count": number
  },
  "summary_verdict": { "headline": string, "executive_summary": string },
  "structural_audit": { "issues_found": string[], "is_parsable": boolean },
  "keyword_analysis": { "hard_skills_found": string[], "missing_critical_skills": string[], "buzzwords_to_remove": string[] },
  "action_plan": string[]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{
          parts: [
            { inlineData: { data: base64Data, mimeType: file.type || "application/pdf" } },
            { text: "Analyze this resume and extract forensic metrics. Be cynical and precise." }
          ]
        }],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0
        }
      });

      const rawJson = JSON.parse(response.text || "{}");
      const { overall, ats_score, impact_score } = calculateStrictScore(rawJson.raw_metrics, rawJson.keyword_analysis.missing_critical_skills);

      setResult({
        ...rawJson,
        scores: {
          overall_score: overall,
          ats_compatibility: ats_score,
          content_impact: impact_score
        }
      });
    } catch (err: any) {
      console.error(err);
      setError("Forensic engine failed to initialize. Ensure the file is a readable PDF or Image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      {/* Upload Section */}
      {!result && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-8 shadow-2xl">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Prophet Forensic Audit</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Upload your resume for a deterministic algorithmic scan. 
              We identify formatting traps and keyword gaps with zero leniency.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <label className="relative group cursor-pointer">
              <input 
                type="file" 
                className="hidden" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept=".pdf,.jpg,.png"
              />
              <div className="px-8 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-slate-300 font-bold uppercase tracking-widest text-xs group-hover:border-emerald-500/50 transition-all flex items-center gap-3">
                {file ? file.name : "Select File (PDF/IMG)"}
              </div>
            </label>

            <button
              onClick={handleAudit}
              disabled={loading || !file}
              className="w-full max-w-sm py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-900/20 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                "Execute Forensic Scan"
              )}
            </button>
            {error && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest">{error}</p>}
          </div>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-1000">
          {/* Main Score & Headline */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h4 className="text-4xl font-black text-white tracking-tighter">{result.meta_data.candidate_name}</h4>
                    <p className="text-emerald-500 font-black uppercase tracking-widest text-sm">{result.meta_data.inferred_target_role}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-6xl font-black text-white">{result.scores.overall_score}<span className="text-xl text-slate-600">/100</span></div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Calculated Score</p>
                  </div>
                </div>
                <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                  <h6 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2">Verdict: {result.summary_verdict.headline}</h6>
                  <p className="text-slate-300 text-sm leading-relaxed italic">"{result.summary_verdict.executive_summary}"</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 space-y-6 flex flex-col justify-center">
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>ATS Parser Health</span>
                  <span>{result.scores.ats_compatibility}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${result.scores.ats_compatibility}%` }}></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>Content Impact</span>
                  <span>{result.scores.content_impact}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${result.scores.content_impact}%` }}></div>
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                 <div className="flex-1 p-3 bg-slate-800 rounded-xl text-center">
                    <div className="text-xl font-black text-white">{result.meta_data.years_experience}</div>
                    <div className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Years Exp</div>
                 </div>
                 <div className="flex-1 p-3 bg-slate-800 rounded-xl text-center">
                    <div className="text-xl font-black text-white">{result.raw_metrics.word_count}</div>
                    <div className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Words</div>
                 </div>
              </div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Structural Issues (Red) */}
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-8 space-y-6">
              <h5 className="text-sm font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Fatal Structural Errors
              </h5>
              <div className="space-y-3">
                {result.structural_audit.issues_found.length > 0 ? (
                  result.structural_audit.issues_found.map((issue, i) => (
                    <div key={i} className="flex gap-3 text-xs text-rose-200/80">
                      <span className="text-rose-500 font-black">•</span>
                      <span>{issue}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No structural issues found.</p>
                )}
              </div>
            </div>

            {/* Keyword Analysis (Yellow) */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-8 space-y-6">
              <h5 className="text-sm font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                Missing Critical Keywords
              </h5>
              <div className="flex flex-wrap gap-2">
                {result.keyword_analysis.missing_critical_skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[10px] font-black rounded-lg uppercase">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="pt-4 border-t border-amber-500/10">
                 <h6 className="text-[10px] font-black text-amber-500/60 uppercase mb-2">Remove Buzzwords:</h6>
                 <div className="flex flex-wrap gap-2 opacity-50">
                    {result.keyword_analysis.buzzwords_to_remove.map((word, i) => (
                      <span key={i} className="text-[10px] text-slate-400 line-through">{word}</span>
                    ))}
                 </div>
              </div>
            </div>
          </div>

          {/* Action Plan */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 space-y-8">
            <h5 className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
              Deterministic Action Plan
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {result.action_plan.map((step, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <span className="w-6 h-6 bg-slate-800 text-emerald-500 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-300 font-medium leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-8">
            <button 
              onClick={() => setResult(null)}
              className="px-12 py-4 bg-slate-900 border border-slate-800 text-slate-500 hover:text-white hover:border-emerald-500/50 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all"
            >
              Reset Auditor
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
