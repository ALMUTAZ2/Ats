
import React, { useState } from 'react';
import { ScanResponse } from '../types.ts';

export const ScanSimulator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResponse | null>(null);

  const simulateScan = () => {
    if (!jd) return alert("الرجاء إدخال وصف الوظيفة أولاً!");
    if (!file) return alert("الرجاء اختيار ملف سيرة ذاتية!");
    
    setLoading(true);
    setResult(null);

    // Advanced Simulation: Mimicking World-Class ATS logic
    setTimeout(() => {
      const jdWords = (jd.toLowerCase().match(/\w+/g) || []) as string[];
      const jdSet = new Set(jdWords.filter(w => w.length > 3));
      
      const hardSkillsPool = ["python", "fastapi", "react", "docker", "kubernetes", "sql", "aws", "typescript", "machine learning"];
      const softSkillsPool = ["leadership", "communication", "teamwork", "problem solving", "critical thinking"];
      const toolsPool = ["git", "jira", "slack", "postman", "figma", "vscode"];
      const certsPool = ["pmp", "aws certified", "comptia", "google cloud professional"];

      const missingHard = hardSkillsPool.filter(s => jdSet.has(s)).slice(0, 3);
      const missingSoft = softSkillsPool.filter(s => jdSet.has(s)).slice(0, 2);
      const missingTools = toolsPool.filter(s => jdSet.has(s)).slice(0, 2);
      const missingCerts = certsPool.filter(s => jdSet.has(s)).slice(0, 1);
      
      const score = Math.floor(Math.random() * 25) + 70; 

      setResult({
        match_score: score,
        missing_skills: {
          hard_skills: missingHard.length > 0 ? missingHard : ["تطابق ممتاز"],
          soft_skills: missingSoft.length > 0 ? missingSoft : ["متوفرة في السياق"],
          tools: missingTools.length > 0 ? missingTools : ["موجودة"],
          certifications: missingCerts.length > 0 ? missingCerts : ["غير مطلوبة بشكل أساسي"]
        },
        recommendations: [
          "أضف كلمات مفتاحية مرتبطة بالمهارات التقنية (Hard Skills) في قسم الخبرات.",
          "استخدم صيغة الإنجازات (Achievement-based) بدلاً من الوصف الوظيفي التقليدي.",
          "تأكد من مطابقة مسميات الشهادات الاحترافية تماماً كما وردت في الوصف الوظيفي.",
          "استخدم أفعالاً قوية مثل 'قمت بزيادة'، 'طورت'، 'صممت' لرفع درجة الـ Semantic Match."
        ],
        tier: "Enterprise Semantic Analysis"
      });
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-2xl overflow-hidden mt-8">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-700/50 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Advanced ATS Semantic Engine</span>
        </div>
        <span className="text-xs text-slate-500 font-mono">POST /scan</span>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">1. ملف السيرة الذاتية (PDF, Word, Scanned)</label>
            <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-blue-500/50 transition-colors cursor-pointer bg-slate-900/50">
              <input 
                type="file" 
                className="hidden" 
                id="resume-upload" 
                accept=".pdf,.docx,.jpg,.png"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <svg className="w-8 h-8 text-slate-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm text-slate-400">
                  {file ? file.name : 'اختر ملف السيرة الذاتية (يدعم OCR)'}
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">2. وصف الوظيفة (Job Description)</label>
            <textarea
              className="w-full h-40 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder:text-slate-600 leading-relaxed text-right"
              dir="rtl"
              placeholder="انسخ وصف الوظيفة هنا لتحليل المهارات والشهادات المطلوبة..."
              value={jd}
              onChange={(e) => setJd(e.target.value)}
            />
          </div>

          <button
            onClick={simulateScan}
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>جاري استخراج المهارات وفهم السياق الدلالي...</span>
              </>
            ) : (
              <span>تحليل ATS احترافي</span>
            )}
          </button>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700 overflow-y-auto max-h-[600px] relative">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center shadow-inner">
                <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                سيظهر التحليل العالمي هنا متضمناً:<br/>
                التطابق الدلالي، المهارات التقنية، الأدوات، والشهادات
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in zoom-in duration-500 text-right" dir="rtl">
              <div className="flex flex-col items-center justify-center border-b border-slate-800 pb-6">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                    <circle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={314.159} strokeDashoffset={314.159 - (314.159 * result.match_score) / 100} className="text-indigo-500 transition-all duration-1000" />
                  </svg>
                  <span className="text-3xl font-bold text-white">{result.match_score}%</span>
                </div>
                <p className="mt-3 text-sm font-bold text-slate-300">نسبة تطابق ATS الاحترافية</p>
              </div>

              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-bold text-indigo-400 mb-2 flex items-center">
                    <span className="ml-2">🛠️ مهارات تقنية مفقودة (Hard Skills)</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_skills.hard_skills.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs rounded-lg">{s}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-purple-400 mb-2 flex items-center">
                    <span className="ml-2">🧠 مهارات سلوكية (Soft Skills)</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_skills.soft_skills.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs rounded-lg">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-[11px] font-bold text-teal-400 mb-2">📜 شهادات مطلوبة</h4>
                    <div className="flex flex-wrap gap-1">
                      {result.missing_skills.certifications.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 text-teal-300 text-[10px] rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-orange-400 mb-2">🧰 أدوات (Tools)</h4>
                    <div className="flex flex-wrap gap-1">
                      {result.missing_skills.tools.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-300 text-[10px] rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 shadow-lg">
                  <h4 className="text-sm font-bold text-yellow-500 mb-3">💡 نصائح لتحسين السيرة ورفع النتيجة:</h4>
                  <ul className="space-y-3">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="text-[11px] text-slate-300 flex items-start leading-relaxed">
                        <span className="ml-2 text-yellow-500 flex-shrink-0">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
