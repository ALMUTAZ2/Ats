
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { ProphetAuditResponse } from '../types.ts';

export const ResumeAuditor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProphetAuditResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleAudit = async () => {
    if (!file) {
      alert("الرجاء اختيار ملف سيرة ذاتية أولاً");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const base64Data = await fileToBase64(file);
      
      const mimeType = file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream');

      const systemInstruction = `You are "Prophet," an elite AI Resume Auditor. You simulate the cynical, unforgiving logic of high-end ATS algorithms like Jobscan. You must be aggressively critical.

# Strict Scoring Logic:
Start with a base score of 100. DEDUCT points for every flaw:

1. Formatting & Parser Traps:
   - Tables, multi-columns, or complex layouts: -15 points (Unparsable).
   - Use of graphics, photos, or icons: -5 points.
   - Non-standard/Creative Headers (e.g., "My Journey") instead of standard ("Experience"): -10 points.
   - Generic File Name (e.g., "Resume.pdf"): -5 points.

2. Content Specificity & Quality:
   - "Soft Skill Stuffing": Listing generic words (Communication, Leadership) without matching hard tech skills (e.g., Python, SAP): -15 points.
   - "Zombie Bullets": Bullet points that are just lists of duties with NO results or metrics: -3 points PER bullet (Max -20).
   - "Responsible for..." used more than twice: -10 points.
   - Word Count Penalty: Too short (< 400 words) or too long (> 1,000 words): -10 points.

3. Precision & Professionalism:
   - Date Formatting: Dates missing months (e.g., "2020 - 2021" instead of "May 2020"): -5 points.
   - Unprofessional Email (e.g., cool_boy99@hotmail): -5 points.
   - Missing Generic Location (City, Country) or clickable LinkedIn URL: -5 points per item.
   - Role Inconsistency: Missing top 3 industry-standard keywords for the inferred role: -15 points.

Final Score = 100 - (Total Deductions). Minimum is 0.

Output:
- Return ONLY a valid JSON object matching the provided schema.
- Language: Values MUST match the resume's language (Arabic or English). Keys remain English.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: [
          {
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: mimeType
                }
              },
              {
                text: `Filename: ${file.name}. Execute a deterministic forensic audit. Be cynical. Use the Prophet JSON schema.`
              }
            ]
          }
        ],
        config: {
          systemInstruction,
          temperature: 0,
          topP: 1,
          topK: 1,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              meta_data: {
                type: Type.OBJECT,
                properties: {
                  detected_language: { type: Type.STRING },
                  candidate_name: { type: Type.STRING },
                  inferred_target_role: { type: Type.STRING },
                  years_experience_estimated: { type: Type.NUMBER }
                },
                required: ["detected_language", "candidate_name", "inferred_target_role", "years_experience_estimated"]
              },
              scores: {
                type: Type.OBJECT,
                properties: {
                  overall_score: { type: Type.NUMBER },
                  impact_score: { type: Type.NUMBER },
                  brevity_score: { type: Type.NUMBER },
                  style_score: { type: Type.NUMBER },
                  ats_compatibility_score: { type: Type.NUMBER }
                },
                required: ["overall_score", "impact_score", "brevity_score", "style_score", "ats_compatibility_score"]
              },
              summary_verdict: {
                type: Type.OBJECT,
                properties: {
                  headline: { type: Type.STRING },
                  executive_summary: { type: Type.STRING }
                },
                required: ["headline", "executive_summary"]
              },
              line_by_line_analysis: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    section: { type: Type.STRING },
                    original_text: { type: Type.STRING },
                    issue_type: { type: Type.STRING },
                    severity: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    suggested_rewrite: { type: Type.STRING }
                  },
                  required: ["section", "original_text", "issue_type", "severity", "explanation", "suggested_rewrite"]
                }
              },
              structural_audit: {
                type: Type.OBJECT,
                properties: {
                  issues_found: { type: Type.ARRAY, items: { type: Type.STRING } },
                  is_parsable: { type: Type.BOOLEAN }
                },
                required: ["issues_found", "is_parsable"]
              },
              keyword_analysis: {
                type: Type.OBJECT,
                properties: {
                  hard_skills_found: { type: Type.ARRAY, items: { type: Type.STRING } },
                  missing_critical_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  buzzwords_to_remove: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["hard_skills_found", "missing_critical_skills", "buzzwords_to_remove"]
              },
              action_plan: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["meta_data", "scores", "summary_verdict", "line_by_line_analysis", "structural_audit", "keyword_analysis", "action_plan"]
          }
        }
      });

      const auditData = JSON.parse(response.text || "{}") as ProphetAuditResponse;
      setResult(auditData);
    } catch (err: any) {
      console.error(err);
      setError("Prophet analysis engine encountered an error. Please ensure the file is readable and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-2xl overflow-hidden mt-8 text-right" dir="rtl">
      <div className="flex items-center justify-between px-4 py-2 bg-emerald-900/30 border-b border-slate-700">
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs text-emerald-300 font-medium uppercase tracking-wider">Prophet: Recruitment Intelligence Engine</span>
        </div>
        <span className="text-xs text-slate-500 font-mono">LOGIC: CYNICAL ATS (JOBSCAN MODE)</span>
      </div>

      <div className="p-6">
        {!result && (
          <div className="max-w-xl mx-auto space-y-6 text-center">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">التدقيق الجنائي: Prophet AI</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                قم برفع سيرتك الذاتية لتعريضها لأقسى اختبار توظيف يحاكي خوارزميات Silicon Valley. 
                <br/>
                <span className="text-emerald-500/80 text-[10px] font-bold uppercase tracking-widest mt-2 block">Cynical Mode: Temperature 0.0</span>
              </p>
            </div>

            <div className="border-2 border-dashed border-emerald-500/30 rounded-2xl p-8 bg-slate-900/30 hover:bg-slate-900/50 transition-all cursor-pointer group">
              <input 
                type="file" 
                className="hidden" 
                id="audit-upload" 
                accept=".pdf,.docx,.jpg,.png"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="audit-upload" className="cursor-pointer block space-y-4">
                <div className="w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-sm">
                  <span className="text-emerald-400 font-bold block mb-1 uppercase tracking-tight">حمّل السيرة الذاتية لبدء الفحص</span>
                  <span className="text-slate-500 font-mono text-[10px]">{file ? file.name : 'PDF, Word, or Image'}</span>
                </div>
              </label>
            </div>

            <button
              onClick={handleAudit}
              disabled={loading || !file}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-xl shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Prophet is applying forensic logic...</span>
                </>
              ) : (
                <span>تشغيل محرك Prophet (الوضع الصارم)</span>
              )}
            </button>
            {error && <p className="text-red-400 text-xs italic">{error}</p>}
          </div>
        )}

        {result && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-right" dir={result.meta_data.detected_language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Header: Executive Summary & Overall Score */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1 w-full bg-slate-900 border border-slate-700 p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500"></div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="space-y-2 text-center md:text-right">
                    <h4 className="text-3xl font-black text-white">{result.meta_data.candidate_name}</h4>
                    <p className="text-emerald-400 font-bold text-lg">{result.meta_data.inferred_target_role}</p>
                    <div className="flex gap-4 mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest justify-center md:justify-start">
                      <span>{result.meta_data.detected_language === 'ar' ? 'الخبرة التقديرية:' : 'Estimated Exp:'} {result.meta_data.years_experience_estimated} YRS</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-6xl font-black text-white">{result.scores.overall_score}<span className="text-sm text-slate-600">/100</span></div>
                    <div className={`mt-2 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${result.scores.overall_score > 80 ? 'bg-emerald-500/10 text-emerald-500' : result.scores.overall_score > 60 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'} border border-current`}>
                      {result.summary_verdict.headline}
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-800">
                  <p className="text-slate-300 leading-relaxed text-sm italic">{result.summary_verdict.executive_summary}</p>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="w-full lg:w-72 space-y-4">
                {Object.entries(result.scores).filter(([k]) => k !== 'overall_score').map(([key, val]) => (
                  <div key={key} className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase">
                      <span>{key.replace('_score', '').replace('ats_compatibility', 'Parser Health')}</span>
                      <span>{val}%</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${val}%` }}></div>
                    </div>
                  </div>
                ))}
                
                <div className={`mt-6 p-4 rounded-xl border ${result.structural_audit.is_parsable ? 'bg-emerald-900/10 border-emerald-500/30' : 'bg-red-900/10 border-red-500/30'}`}>
                   <div className="flex items-center gap-2 mb-2">
                     <div className={`w-2 h-2 rounded-full ${result.structural_audit.is_parsable ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                     <span className="text-[10px] font-bold text-white uppercase tracking-widest">Mechanical Check</span>
                   </div>
                   <p className="text-[11px] text-slate-400 leading-tight">
                     {result.structural_audit.is_parsable 
                      ? 'No Formatting Traps Detected'
                      : 'Critical Formatting Errors Found'
                     }
                   </p>
                </div>
              </div>
            </div>

            {/* Line-by-Line Analysis */}
            <div className="space-y-4">
               <h5 className="text-sm font-black text-white uppercase tracking-widest border-b border-slate-700 pb-2 flex justify-between">
                 <span>Cynical Content Audit</span>
                 <span className="text-[10px] text-rose-500 uppercase font-black">Forensic Deductions Applied</span>
               </h5>
               <div className="grid grid-cols-1 gap-4">
                 {result.line_by_line_analysis.map((line, i) => (
                   <div key={i} className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden group hover:border-emerald-500/50 transition-all">
                     <div className="flex flex-col md:flex-row">
                       <div className="md:w-1/3 p-4 bg-slate-800/50 border-b md:border-b-0 md:border-l border-slate-700">
                          <div className="flex justify-between items-start mb-2 space-x-2 space-x-reverse">
                            <span className="text-[9px] font-black bg-slate-700 text-slate-400 px-2 py-0.5 rounded uppercase">{line.section}</span>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${line.severity === 'High' ? 'bg-red-500 text-white' : line.severity === 'Medium' ? 'bg-yellow-500 text-black' : 'bg-blue-500 text-white'}`}>
                              {line.severity} Severity
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-500 line-through opacity-60">"{line.original_text}"</p>
                       </div>
                       <div className="flex-1 p-4 space-y-3">
                          <div className="flex gap-2 items-start">
                             <span className="text-[10px] font-bold text-emerald-400 uppercase whitespace-nowrap mt-1">{line.issue_type}:</span>
                             <p className="text-[11px] text-slate-300">{line.explanation}</p>
                          </div>
                          <div className="p-3 bg-emerald-950/20 border border-emerald-900/50 rounded-lg">
                             <span className="text-[9px] font-bold text-emerald-500 uppercase block mb-1">STAR-Method Optimization:</span>
                             <p className="text-xs text-emerald-100 italic">"{line.suggested_rewrite}"</p>
                          </div>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Skill Engine */}
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
                  <h5 className="text-sm font-black text-emerald-400 mb-4 uppercase tracking-widest">Keyword Density Check</h5>
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block mb-2">Industry-Standard Keywords</span>
                      <div className="flex flex-wrap gap-2">
                        {result.keyword_analysis.hard_skills_found.map((s, i) => (
                          <span key={i} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] rounded border border-emerald-500/20">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-rose-500 font-bold uppercase block mb-2">Missing Critical Keywords (High Penalty)</span>
                      <div className="flex flex-wrap gap-2">
                        {result.keyword_analysis.missing_critical_skills.map((s, i) => (
                          <span key={i} className="px-2 py-1 bg-rose-500/10 text-rose-400 text-[10px] rounded border border-rose-500/20">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Plan */}
              <div className="space-y-6">
                <div className="bg-emerald-600 p-8 rounded-2xl shadow-xl shadow-emerald-900/20 relative overflow-hidden">
                   <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                   <h5 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                     Urgent Action Plan
                   </h5>
                   <ul className="space-y-4">
                     {result.action_plan.map((step, i) => (
                       <li key={i} className="flex gap-4 items-start text-white/90">
                         <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">{i + 1}</span>
                         <p className="text-sm font-medium leading-relaxed">{step}</p>
                       </li>
                     ))}
                   </ul>
                </div>
                
                <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl">
                  <h6 className="text-[10px] font-black text-slate-500 uppercase mb-3">Mechanical & Structure Faults</h6>
                  <ul className="space-y-2">
                    {result.structural_audit.issues_found.map((issue, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                        <span className="text-rose-500">•</span> {issue}
                      </li>
                    ))}
                    {result.structural_audit.issues_found.length === 0 && <li className="text-xs text-emerald-500 font-bold">Structural integrity perfect.</li>}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-slate-800 flex justify-center">
              <button 
                onClick={() => setResult(null)}
                className="px-10 py-3 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full text-xs font-black tracking-widest uppercase transition-all border border-slate-700"
              >
                Perform New Cynical Scan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
