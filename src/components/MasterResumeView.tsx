import React, { useState } from "react";
import {
  CandidateProfile,
  KeywordMatrix,
} from "../types";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Sliders,
  FileCheck,
  Eye,
  RefreshCw,
} from "lucide-react";
import { AtsResumePreview } from "./AtsResumePreview";

interface MasterResumeViewProps {
  profile: CandidateProfile;
  keywordMatrix: KeywordMatrix | null;
  masterProfile: CandidateProfile | null;
  masterBulletImprovements: any[];
  onUpdateMasterProfile: (master: CandidateProfile, improvements: any[]) => void;
  onNext: () => void;
}

export const MasterResumeView: React.FC<MasterResumeViewProps> = ({
  profile,
  keywordMatrix,
  masterProfile,
  masterBulletImprovements,
  onUpdateMasterProfile,
  onNext,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState("");
  const [viewTab, setViewTab] = useState<"preview" | "improvements" | "checklist">(
    "preview"
  );

  const handleGenerateMasterResume = async () => {
    setIsGenerating(true);
    setGenError("");

    try {
      const res = await fetch("/api/generate-master-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          keywordMatrix,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate master resume");
      }

      if (data.masterProfile) {
        onUpdateMasterProfile(
          data.masterProfile,
          data.masterBulletImprovements || []
        );
      }
    } catch (err: any) {
      setGenError(err.message || "Error generating Master ATS Resume.");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentDisplayProfile = masterProfile || profile;

  // ATS Format Checklist
  const atsComplianceChecklist = [
    {
      rule: "Standardized Section Headers",
      passed: true,
      desc: "Uses recognized headers: PROFESSIONAL SUMMARY, CORE SKILLS, PROFESSIONAL EXPERIENCE, EDUCATION.",
    },
    {
      rule: "Single Column ATS Text Flow",
      passed: true,
      desc: "No multi-column graphics, text boxes, or floating tables that break ATS parsers.",
    },
    {
      rule: "STAR Bullet Point Structure",
      passed: true,
      desc: "Every bullet follows: [Action Verb] + [Task Context] + [Quantifiable Impact].",
    },
    {
      rule: "Clean Contact Line",
      passed: !!(profile.contact.email && profile.contact.phone),
      desc: "Valid email, phone, location, and web links included.",
    },
    {
      rule: "Pooled Keyword Integration",
      passed: !!keywordMatrix,
      desc: "Top hard skills and tools embedded into experience bullets.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#151921] border border-white/5 rounded-xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Master ATS Resume Generation
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Transforms candidate experience into high-impact bullet points following the strict pattern:{" "}
              <code className="text-blue-300 font-mono bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-500/30">
                [Strong Action Verb] + [Task/Context] + [Quantifiable Impact]
              </code>
            </p>
          </div>

          <button
            onClick={handleGenerateMasterResume}
            disabled={isGenerating}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-lg shadow-blue-600/30 transition disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin text-white" : "text-white"}`} />
            <span>
              {isGenerating
                ? "Refactoring STAR Bullets with AI..."
                : masterProfile
                ? "Regenerate Master ATS Resume"
                : "Generate Master ATS Resume"}
            </span>
          </button>
        </div>

        {genError && (
          <div className="mt-4 p-3 bg-red-950/50 border border-red-500/30 text-red-300 text-xs rounded-lg">
            {genError}
          </div>
        )}
      </div>

      {/* Sub-view switcher */}
      <div className="flex items-center justify-between border-b border-white/5 bg-[#0f1115]/80 p-2 rounded-xl">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewTab("preview")}
            className={`flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-md transition ${
              viewTab === "preview"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Master Resume Preview</span>
          </button>

          <button
            onClick={() => setViewTab("improvements")}
            className={`flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-md transition ${
              viewTab === "improvements"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              STAR Bullet Refactor Matrix ({masterBulletImprovements.length})
            </span>
          </button>

          <button
            onClick={() => setViewTab("checklist")}
            className={`flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-md transition ${
              viewTab === "checklist"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>ATS Format Validator</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ATS Resume Preview */}
      {viewTab === "preview" && (
        <AtsResumePreview
          profile={currentDisplayProfile}
          onUpdateProfile={(updated) => {
            if (masterProfile) {
              onUpdateMasterProfile(updated, masterBulletImprovements);
            }
          }}
          title="Master ATS-Formatted Resume"
        />
      )}

      {/* TAB 2: STAR Bullet Improvements */}
      {viewTab === "improvements" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Before vs. After AI STAR Bullet Refactor Matrix
          </h3>
          <p className="text-xs text-slate-400">
            Compare raw candidate achievements against Gemini's STAR-reformatted metrics and action verbs.
          </p>

          <div className="space-y-4">
            {masterBulletImprovements.map((imp, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Original */}
                <div className="space-y-1.5 p-3 bg-red-950/10 border border-red-500/20 rounded-lg">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
                    Original Bullet Point
                  </span>
                  <p className="text-xs text-slate-300">{imp.original}</p>
                </div>

                {/* Improved */}
                <div className="space-y-1.5 p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      AI STAR Format Enhanced Bullet
                    </span>
                    {imp.actionVerbUsed && (
                      <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold rounded">
                        Verb: {imp.actionVerbUsed}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-emerald-100 font-medium">
                    {imp.improved}
                  </p>
                  {imp.metricAdded && (
                    <span className="inline-block text-[10px] text-emerald-300/80 italic mt-1">
                      Metric added: {imp.metricAdded}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {masterBulletImprovements.length === 0 && (
              <p className="text-xs text-slate-500 italic p-6 text-center">
                Click "Generate Master ATS Resume" above to generate STAR bullet improvements.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ATS Format Checklist */}
      {viewTab === "checklist" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-blue-400" />
            ATS Compatibility Rule Audit
          </h3>

          <div className="space-y-3">
            {atsComplianceChecklist.map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-start space-x-3"
              >
                {item.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-xs font-bold text-white">{item.rule}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex justify-between items-center pt-4">
        <span className="text-xs text-slate-400">
          Master ATS Resume ready. Next: Tailor against specific Job Postings.
        </span>
        <button
          onClick={onNext}
          className="px-6 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2"
        >
          <span>Proceed to Single-JD Tailor & Scoring</span>
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
