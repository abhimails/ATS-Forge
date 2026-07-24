import React, { useState } from "react";
import {
  CandidateProfile,
  TailoredResume,
  JobDescription,
} from "../types";
import {
  Target,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Zap,
  Plus,
  ArrowRight,
  TrendingUp,
  FileCheck2,
} from "lucide-react";
import { AtsResumePreview } from "./AtsResumePreview";

interface SingleJDTailorProps {
  masterProfile: CandidateProfile;
  singleTargetJd: JobDescription;
  onUpdateSingleJd: (jd: JobDescription) => void;
  tailoredResult: TailoredResume | null;
  onUpdateTailoredResult: (tailored: TailoredResume) => void;
}

export const SingleJDTailor: React.FC<SingleJDTailorProps> = ({
  masterProfile,
  singleTargetJd,
  onUpdateSingleJd,
  tailoredResult,
  onUpdateTailoredResult,
}) => {
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailorError, setTailorError] = useState("");
  const [viewTab, setViewTab] = useState<"score" | "tailored">("score");

  const handleTailorForJob = async () => {
    if (!singleTargetJd.content.trim()) {
      setTailorError("Please enter a target Job Description.");
      return;
    }

    setIsTailoring(true);
    setTailorError("");

    try {
      const res = await fetch("/api/tailor-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          masterProfile,
          targetJd: singleTargetJd,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to tailor resume");
      }

      if (data.tailoredResume) {
        onUpdateTailoredResult(data.tailoredResume);
        setViewTab("tailored");
      }
    } catch (err: any) {
      setTailorError(err.message || "Error tailoring resume for job description.");
    } finally {
      setIsTailoring(false);
    }
  };

  const matchScore = tailoredResult?.matchScore;

  // Helper to get color for score
  const getScoreColor = (score = 0) => {
    if (score >= 85) return "text-emerald-400 border-emerald-500 bg-emerald-950/40";
    if (score >= 70) return "text-blue-400 border-blue-500 bg-blue-950/40";
    if (score >= 50) return "text-amber-400 border-amber-500 bg-amber-950/40";
    return "text-red-400 border-red-500 bg-red-950/40";
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#151921] border border-white/5 rounded-xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Single-JD Dynamic Tailoring Engine & Match Scoring
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Input a specific Job Description to generate an <strong>ATS Match Score (0–100%)</strong>, identify missing high-value keywords, and output a 1-click tailored resume customized for that application.
            </p>
          </div>

          <button
            onClick={handleTailorForJob}
            disabled={isTailoring || !singleTargetJd.content.trim()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-lg shadow-blue-600/30 transition disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Sparkles className={`w-4 h-4 ${isTailoring ? "animate-spin text-white" : "text-white"}`} />
            <span>
              {isTailoring
                ? "Calculating ATS Score & Tailoring..."
                : "1-Click Tailor Resume for this Job"}
            </span>
          </button>
        </div>

        {tailorError && (
          <div className="mt-4 p-3 bg-red-950/50 border border-red-500/30 text-red-300 text-xs rounded-lg">
            {tailorError}
          </div>
        )}
      </div>

      {/* Target JD Input Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-indigo-400" /> Target Application Job Posting
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400">Target Role Title</label>
            <input
              type="text"
              value={singleTargetJd.title}
              onChange={(e) =>
                onUpdateSingleJd({ ...singleTargetJd, title: e.target.value })
              }
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400">Company Name</label>
            <input
              type="text"
              value={singleTargetJd.company}
              onChange={(e) =>
                onUpdateSingleJd({ ...singleTargetJd, company: e.target.value })
              }
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400">Job Description Text</label>
          <textarea
            rows={5}
            value={singleTargetJd.content}
            onChange={(e) =>
              onUpdateSingleJd({ ...singleTargetJd, content: e.target.value })
            }
            placeholder="Paste target job description text here..."
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* TAILORING RESULTS & MATCH SCORE */}
      {tailoredResult && (
        <div className="space-y-6">
          {/* Section Switcher */}
          <div className="flex border-b border-slate-800 bg-slate-900/60 p-2 rounded-xl space-x-2">
            <button
              onClick={() => setViewTab("score")}
              className={`flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-lg transition ${
                viewTab === "score"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>ATS Match Score & Gap Matrix</span>
            </button>
            <button
              onClick={() => setViewTab("tailored")}
              className={`flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-lg transition ${
                viewTab === "tailored"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tailored ATS Resume Preview</span>
            </button>
          </div>

          {/* TAB 1: ATS SCORE & GAP ANALYSIS */}
          {viewTab === "score" && matchScore && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Overall Score Circle Gauge */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Overall ATS Match Score
                </span>

                <div
                  className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center shadow-2xl ${getScoreColor(
                    matchScore.overallScore
                  )}`}
                >
                  <span className="text-4xl font-extrabold tracking-tight">
                    {matchScore.overallScore}%
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest mt-1">
                    {matchScore.overallScore >= 85
                      ? "High Match"
                      : matchScore.overallScore >= 70
                      ? "Good Match"
                      : "Moderate"}
                  </span>
                </div>

                <p className="text-xs text-slate-400 px-2">
                  Target Role: <strong>{tailoredResult.jobTitle}</strong> at{" "}
                  <strong>{tailoredResult.targetCompany}</strong>
                </p>
              </div>

              {/* Score Breakdown Progress Bars */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:col-span-2 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" /> Score Category Breakdown
                </h3>

                <div className="space-y-3">
                  <ScoreBar
                    label="Hard Skills Match"
                    score={matchScore.breakdown.hardSkillsScore}
                  />
                  <ScoreBar
                    label="Software & Tools Alignment"
                    score={matchScore.breakdown.toolsScore}
                  />
                  <ScoreBar
                    label="Action Verb Strength"
                    score={matchScore.breakdown.actionVerbsScore}
                  />
                  <ScoreBar
                    label="Metric Density & STAR Format"
                    score={matchScore.breakdown.metricDensityScore}
                  />
                </div>

                {/* Added Keywords Banner */}
                {tailoredResult.highlightedKeywordsAdded.length > 0 && (
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" /> High-value keywords integrated into tailored CV:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tailoredResult.highlightedKeywordsAdded.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-[11px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded font-medium"
                        >
                          +{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Missing High-Value Keywords */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:col-span-3 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" /> Missing High-Value Keywords
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {matchScore.missingKeywords.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-white">
                          {item.keyword}
                        </span>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                          <span>{item.category}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded font-semibold ${
                              item.importance === "High"
                                ? "bg-red-500/20 text-red-300"
                                : item.importance === "Medium"
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {item.importance}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {matchScore.missingKeywords.length === 0 && (
                    <p className="text-xs text-emerald-400 italic">
                      Zero high-value missing keywords! Excellent alignment.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TAILORED ATS RESUME PREVIEW */}
          {viewTab === "tailored" && (
            <div className="space-y-4">
              <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-4 flex items-center justify-between text-xs text-indigo-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    Resume tailored specifically for <strong>{tailoredResult.jobTitle}</strong> at{" "}
                    <strong>{tailoredResult.targetCompany}</strong>.
                  </span>
                </div>
                <button
                  onClick={() => setViewTab("score")}
                  className="text-indigo-400 underline font-semibold hover:text-indigo-300"
                >
                  View Match Score ({matchScore?.overallScore}%)
                </button>
              </div>

              <AtsResumePreview
                profile={{
                  ...masterProfile,
                  professionalSummary: tailoredResult.tailoredSummary,
                  skills: tailoredResult.tailoredSkills,
                  workExperience: tailoredResult.tailoredWorkExperience,
                }}
                onUpdateProfile={() => {}}
                title={`Tailored Resume: ${tailoredResult.jobTitle}`}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Subcomponent: Score Progress Bar
const ScoreBar: React.FC<{ label: string; score: number }> = ({
  label,
  score,
}) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-semibold">
        <span className="text-slate-300">{label}</span>
        <span className="text-indigo-400">{score}%</span>
      </div>
      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};
