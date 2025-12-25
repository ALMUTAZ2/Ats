
import React, { useState } from 'react';

const BACKEND_CODE = `from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from pdfminer.high_level import extract_text
import docx
import tempfile
import re
import json

# --- ملاحظة: في بيئة الإنتاج يفضل استخدام spacy أو sentence-transformers للتحليل الدلالي ---
# من أجل هذا النموذج، سنقوم بمحاكاة التحليل الدلالي باستخدام قواميس ومرادفات متقدمة

app = FastAPI(title="ATS-Beater Enterprise Engine")

# --- Configuration & Specialized Skill Taxonomies ---
TAXONOMY = {
    "hard_skills": ["python", "java", "react", "fastapi", "docker", "sql", "aws", "nlp", "ai", "typescript", "machine learning", "kubernetes"],
    "soft_skills": ["leadership", "communication", "teamwork", "problem solving", "critical thinking", "agile", "management"],
    "tools": ["git", "jira", "slack", "postman", "figma", "vscode", "linux", "jenkins"],
    "certifications": ["pmp", "aws certified", "comptia", "cissp", "itil", "scrum master"]
}

# قاموس المرادفات لضمان الـ Semantic Matching
SYNONYMS = {
    "react": ["react.js", "reactjs", "frontend", "spa", "react library"],
    "python": ["py", "django", "flask", "scripting"],
    "teamwork": ["collaboration", "cooperation", "team player", "interpersonal skills"],
    "aws": ["amazon web services", "cloud computing", "ec2", "s3", "lambda"],
    "management": ["managing", "supervising", "leadership role", "administration"]
}

# --- Helper Functions ---

def clean_text(text: str) -> str:
    """تنظيف النص بشكل احترافي مع الحفاظ على الكلمات التقنية المركبة"""
    # إزالة الروابط والرموز غير الضرورية
    text = re.sub(r'http\\S+', '', text)
    text = re.sub(r'\\s+', ' ', text)
    # الحفاظ على الأحرف والرموز مثل C++ و .NET
    text = re.sub(r'[^a-zA-Z0-9+#.\\s-]', '', text)
    return text.lower().strip()

def extract_and_categorize(text: str) -> dict:
    """استخراج المهارات وتصنيفها مع معالجة المرادفات"""
    cleaned = clean_text(text)
    words = set(re.findall(r'\\w+|[+#.]+', cleaned))
    
    found_skills = {k: set() for k in TAXONOMY.keys()}
    
    # تطبيع الكلمات باستخدام المرادفات
    normalized_content = set()
    for word in words:
        found_as_synonym = False
        for primary, variants in SYNONYMS.items():
            if word == primary or word in variants:
                normalized_content.add(primary)
                found_as_synonym = True
                break
        if not found_as_synonym:
            normalized_content.add(word)

    # التصنيف بناءً على التاكسونومي
    for category, skills_list in TAXONOMY.items():
        for skill in skills_list:
            if skill in normalized_content:
                found_skills[category].add(skill)
                
    return found_skills

async def analyze_enterprise_ats(resume_text: str, jd_text: str):
    """محرك التحليل الاحترافي لحساب النقاط والتطابق الدلالي"""
    resume_analysis = extract_and_categorize(resume_text)
    jd_analysis = extract_and_categorize(jd_text)

    missing = {k: [] for k in TAXONOMY.keys()}
    match_counts = {k: 0 for k in TAXONOMY.keys()}

    for category in TAXONOMY.keys():
        jd_reqs = jd_analysis[category]
        res_skills = resume_analysis[category]
        
        missing[category] = list(jd_reqs - res_skills)
        match_counts[category] = len(jd_reqs.intersection(res_skills))

    # حساب النتيجة بناءً على أوزان (المهارات التقنية 60%، السلوكية 20%، الأدوات 10%، الشهادات 10%)
    weights = {"hard_skills": 0.6, "soft_skills": 0.2, "tools": 0.1, "certifications": 0.1}
    total_score = 0
    
    for category, weight in weights.items():
        total_reqs = len(jd_analysis[category])
        if total_reqs > 0:
            category_score = (match_counts[category] / total_reqs) * 100
            total_score += category_score * weight
        else:
            total_score += 100 * weight # إذا لم يطلب JD مهارات في هذا القسم، نعتبره متطابقاً

    recommendations = [
        "استخدم كلمات العمل (Action Verbs) مثل 'طورت' و 'قدت' في بداية جمل الخبرات.",
        "تأكد من مطابقة الكلمات المفتاحية التقنية كما وردت تماماً في الوصف الوظيفي لضمان تجاوز فلتر ATS.",
        "قم بتضمين قسم مخصص للمهارات (Skills Matrix) مقسم إلى فئات تقنية وسلوكية."
    ]

    return {
        "match_score": int(min(total_score, 100)),
        "missing_skills": missing,
        "recommendations": recommendations,
        "tier": "Enterprise"
    }

# --- API Routes ---

@app.get("/")
async def root():
    return {"status": "Enterprise ATS Engine Online"}

@app.post("/scan")
async def scan(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    """
    مسار التحليل الشامل:
    1. استخراج النص من PDF/Word (يدعم Scanned PDF عبر OCR مستقبلاً)
    2. التصنيف والتحليل الدلالي
    3. إرجاع النتائج بتنسيق JSON احترافي
    """
    try:
        suffix = ".pdf" if file.filename.lower().endswith(".pdf") else ".docx"
        with tempfile.NamedTemporaryFile(delete=True, suffix=suffix) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp.flush()

            if suffix == ".pdf":
                # في الإنتاج يفضل استخدام PyMuPDF لاستخراج الجداول والـ layout
                text = extract_text(tmp.name)
            else:
                doc = docx.Document(tmp.name)
                text = "\\n".join([p.text for p in doc.paragraphs])

        analysis_result = await analyze_enterprise_ats(text, job_description)
        return JSONResponse(content=analysis_result)

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})`;

export const CodeViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(BACKEND_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden mt-12 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span className="text-sm font-semibold text-slate-300">FastAPI Enterprise Logic (main.py)</span>
        </div>
        <button
          onClick={copyToClipboard}
          className="text-xs font-medium px-4 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-all border border-slate-600"
        >
          {copied ? 'تم النسخ!' : 'نسخ الكود المتقدم'}
        </button>
      </div>
      <div className="p-4 overflow-x-auto max-h-[700px] bg-[#0d1117] code-font">
        <pre className="text-xs text-slate-400 whitespace-pre leading-relaxed">
          <code>{BACKEND_CODE}</code>
        </pre>
      </div>
    </div>
  );
};
