import React, { useState } from "react";
import {
  JobDescription,
  KeywordMatrix,
  CandidateProfile,
  KeywordItem,
} from "../types";
import {
  Layers,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  BarChart3,
  Search,
  Filter,
  Check,
  Zap,
} from "lucide-react";

interface KeywordPoolingProps {
  jobDescriptions: JobDescription[];
  onUpdateJds: (jds: JobDescription[]) => void;
  keywordMatrix: KeywordMatrix | null;
  onUpdateMatrix: (matrix: KeywordMatrix) => void;
  profile: CandidateProfile;
  onUpdateProfile: (profile: CandidateProfile) => void;
  onNext: () => void;
}

export const KeywordPooling: React.FC<KeywordPoolingProps> = ({
  jobDescriptions,
  onUpdateJds,
  keywordMatrix,
  onUpdateMatrix,
  profile,
  onUpdateProfile,
  onNext,
}) => {
  const [isPooling, setIsPooling] = useState(false);
  const [poolingError, setPoolingError] = useState("");
  const [activeCategory, setActiveCategory] = useState<
    "all" | "hard" | "tools" | "soft" | "verbs" | "certs"
  >("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "missing" | "matched">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handlePoolKeywords = async () => {
    if (!jobDescriptions || jobDescriptions.length === 0) {
      setPoolingError("Please provide at least 1 (preferably 5+) target Job Descriptions.");
      return;
    }

    setIsPooling(true);
    setPoolingError("");

    try {
      const res = await fetch("/api/pool-keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescriptions,
          candidateSkills: profile.skills,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to pool keywords");
      }

      if (data.matrix) {
        onUpdateMatrix(data.matrix);
      }
    } catch (err: any) {
      setPoolingError(err.message || "Failed to process JD Keyword Matrix.");
    } finally {
      setIsPooling(false);
    }
  };

  const addJd = () => {
    const newJd: JobDescription = {
      id: `jd-${Date.now()}`,
      title: `Target Job Title ${jobDescriptions.length + 1}`,
      company: "Company Name",
      content:
        "Paste job description text here... Requirements include React, TypeScript, Node.js, AWS, and PostgreSQL.",
    };
    onUpdateJds([...jobDescriptions, newJd]);
  };

  const updateJd = (id: string, field: string, val: string) => {
    onUpdateJds(
      jobDescriptions.map((jd) => (jd.id === id ? { ...jd, [field]: val } : jd))
    );
  };

  const removeJd = (id: string) => {
    onUpdateJds(jobDescriptions.filter((jd) => jd.id !== id));
  };

  const addKeywordToProfileSkills = (keyword: string) => {
    // Check if skill already exists
    const allSkills = profile.skills.flatMap((s) => s.skills);
    if (allSkills.some((s) => s.toLowerCase() === keyword.toLowerCase())) {
      return;
    }

    const updatedSkills = [...profile.skills];
    if (updatedSkills.length > 0) {
      updatedSkills[0].skills.push(keyword);
    } else {
      updatedSkills.push({
        category: "Technical & Target Skills",
        skills: [keyword],
      });
    }

    onUpdateProfile({ ...profile, skills: updatedSkills });

    // Mark as matched locally in matrix if present
    if (keywordMatrix) {
      const markItem = (arr: KeywordItem[]) =>
        arr.map((item) =>
          item.keyword.toLowerCase() === keyword.toLowerCase()
            ? { ...item, matchedInProfile: true }
            : item
        );

      onUpdateMatrix({
        ...keywordMatrix,
        topHardSkills: markItem(keywordMatrix.topHardSkills),
        topTools: markItem(keywordMatrix.topTools),
        topSoftSkills: markItem(keywordMatrix.topSoftSkills),
        topActionVerbs: markItem(keywordMatrix.topActionVerbs),
        topCertifications: markItem(keywordMatrix.topCertifications),
      });
    }
  };

  // Helper to filter items for matrix view
  const filterList = (list: KeywordItem[] = []) => {
    return list.filter((item) => {
      const matchesSearch = item.keyword
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "matched"
          ? item.matchedInProfile
          : !item.matchedInProfile;

      return matchesSearch && matchesStatus;
    });
  };

  const hardSkillsFiltered = filterList(keywordMatrix?.topHardSkills);
  const toolsFiltered = filterList(keywordMatrix?.topTools);
  const softSkillsFiltered = filterList(keywordMatrix?.topSoftSkills);
  const actionVerbsFiltered = filterList(keywordMatrix?.topActionVerbs);
  const certsFiltered = filterList(keywordMatrix?.topCertifications);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#151921] border border-white/5 rounded-xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              Multi-JD Keyword Pooling Engine ({jobDescriptions.length} JDs Input)
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Submit 5+ target Job Descriptions to pool high-frequency hard skills, software tools,
              certifications, and action verbs into a weighted <strong>Keyword Matrix</strong>.
            </p>
          </div>

          <button
            onClick={handlePoolKeywords}
            disabled={isPooling || jobDescriptions.length === 0}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-lg shadow-blue-600/30 transition disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Sparkles className={`w-4 h-4 ${isPooling ? "animate-spin text-white" : "text-white"}`} />
            <span>
              {isPooling
                ? "Extracting & Pooling Matrix..."
                : `Pool Keywords across ${jobDescriptions.length} JDs`}
            </span>
          </button>
        </div>
      </div>

      {/* Target JDs Management */}
      <div className="bg-[#151921] border border-white/5 rounded-xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Corpus of Target Job Descriptions
            </h3>
            <span className="px-2 py-0.5 text-xs bg-[#0f1115] text-blue-400 rounded font-semibold border border-white/5">
              {jobDescriptions.length} JDs Loaded
            </span>
          </div>

          <button
            onClick={addJd}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-[#0f1115] hover:bg-white/5 text-slate-200 border border-white/10 rounded-md transition"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            <span>Add Job Description</span>
          </button>
        </div>

        {poolingError && (
          <div className="p-3 bg-red-950/50 border border-red-500/30 text-red-300 text-xs rounded-lg">
            {poolingError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobDescriptions.map((jd, idx) => (
            <div
              key={jd.id}
              className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    JD #{idx + 1}
                  </span>
                  <button
                    onClick={() => removeJd(jd.id)}
                    className="text-slate-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={jd.title}
                  onChange={(e) => updateJd(jd.id, "title", e.target.value)}
                  placeholder="Job Title"
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white font-semibold focus:outline-none"
                />
                <input
                  type="text"
                  value={jd.company}
                  onChange={(e) => updateJd(jd.id, "company", e.target.value)}
                  placeholder="Company Name"
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none"
                />
                <textarea
                  rows={4}
                  value={jd.content}
                  onChange={(e) => updateJd(jd.id, "content", e.target.value)}
                  placeholder="Paste Job Description text here..."
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-[11px] text-slate-300 focus:outline-none resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KEYWORD POOL MATRIX RESULTS */}
      {keywordMatrix ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" /> Pooled Keyword Matrix Results
              </h3>
              <p className="text-xs text-slate-400">
                Summary across JDs: {keywordMatrix.overallSummary}
              </p>
            </div>

            {/* Matrix Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter keywords..."
                  className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1 text-xs rounded font-medium ${
                    statusFilter === "all"
                      ? "bg-slate-800 text-white"
                      : "text-slate-400"
                  }`}
                >
                  All Status
                </button>
                <button
                  onClick={() => setStatusFilter("missing")}
                  className={`px-3 py-1 text-xs rounded font-medium ${
                    statusFilter === "missing"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "text-slate-400"
                  }`}
                >
                  Missing in Profile
                </button>
                <button
                  onClick={() => setStatusFilter("matched")}
                  className={`px-3 py-1 text-xs rounded font-medium ${
                    statusFilter === "matched"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "text-slate-400"
                  }`}
                >
                  Matched
                </button>
              </div>
            </div>
          </div>

          {/* Matrix Category Tabs */}
          <div className="flex border-b border-slate-800 gap-2">
            {[
              { id: "all", label: "All Categories" },
              { id: "hard", label: `Hard Skills (${hardSkillsFiltered.length})` },
              { id: "tools", label: `Tools & Software (${toolsFiltered.length})` },
              { id: "verbs", label: `Action Verbs (${actionVerbsFiltered.length})` },
              { id: "soft", label: `Soft Skills (${softSkillsFiltered.length})` },
              { id: "certs", label: `Certifications (${certsFiltered.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-4 py-2 text-xs font-semibold border-b-2 transition ${
                  activeCategory === tab.id
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Render Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* HARD SKILLS */}
            {(activeCategory === "all" || activeCategory === "hard") && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Top Hard Skills</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Weighted Frequency
                  </span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {hardSkillsFiltered.map((item, idx) => (
                    <KeywordBadge
                      key={idx}
                      item={item}
                      totalJds={jobDescriptions.length}
                      onAdd={() => addKeywordToProfileSkills(item.keyword)}
                    />
                  ))}
                  {hardSkillsFiltered.length === 0 && (
                    <p className="text-xs text-slate-500 italic">No hard skills found for this filter.</p>
                  )}
                </div>
              </div>
            )}

            {/* TOOLS & SOFTWARE */}
            {(activeCategory === "all" || activeCategory === "tools") && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Software Tools & Tech</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    JD Frequency
                  </span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {toolsFiltered.map((item, idx) => (
                    <KeywordBadge
                      key={idx}
                      item={item}
                      totalJds={jobDescriptions.length}
                      onAdd={() => addKeywordToProfileSkills(item.keyword)}
                    />
                  ))}
                  {toolsFiltered.length === 0 && (
                    <p className="text-xs text-slate-500 italic">No software tools found for this filter.</p>
                  )}
                </div>
              </div>
            )}

            {/* ACTION VERBS */}
            {(activeCategory === "all" || activeCategory === "verbs") && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                  <span>High-Impact Action Verbs</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    STAR Verbs
                  </span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {actionVerbsFiltered.map((item, idx) => (
                    <KeywordBadge
                      key={idx}
                      item={item}
                      totalJds={jobDescriptions.length}
                      onAdd={() => addKeywordToProfileSkills(item.keyword)}
                    />
                  ))}
                  {actionVerbsFiltered.length === 0 && (
                    <p className="text-xs text-slate-500 italic">No action verbs found for this filter.</p>
                  )}
                </div>
              </div>
            )}

            {/* SOFT SKILLS */}
            {(activeCategory === "all" || activeCategory === "soft") && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Core Competencies & Soft Skills</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Domain Jargon
                  </span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {softSkillsFiltered.map((item, idx) => (
                    <KeywordBadge
                      key={idx}
                      item={item}
                      totalJds={jobDescriptions.length}
                      onAdd={() => addKeywordToProfileSkills(item.keyword)}
                    />
                  ))}
                  {softSkillsFiltered.length === 0 && (
                    <p className="text-xs text-slate-500 italic">No soft skills found for this filter.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-dashed border-slate-800 rounded-xl p-12 text-center space-y-3">
          <Layers className="w-10 h-10 text-indigo-400 mx-auto opacity-80" />
          <h3 className="text-base font-bold text-white">
            Keyword Matrix Not Generated Yet
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click "Pool Keywords across {jobDescriptions.length} JDs" above to analyze the job description corpus and generate a weighted frequency matrix.
          </p>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-between items-center pt-4">
        <span className="text-xs text-slate-400">
          {keywordMatrix ? "Keyword Matrix ready for Master ATS Resume rewrite." : ""}
        </span>
        <button
          onClick={onNext}
          className="px-6 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2"
        >
          <span>Generate Master ATS Resume</span>
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Reusable Keyword Badge Component
const KeywordBadge: React.FC<{
  item: KeywordItem;
  totalJds: number;
  onAdd: () => void;
}> = ({ item, totalJds, onAdd }) => {
  return (
    <div
      className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center space-x-2 transition ${
        item.matchedInProfile
          ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
          : "bg-amber-950/30 border-amber-500/40 text-amber-200"
      }`}
    >
      {item.matchedInProfile ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
      ) : (
        <XCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
      )}

      <span className="font-medium">{item.keyword}</span>

      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-300">
        {item.jdCount}/{totalJds} JDs
      </span>

      {!item.matchedInProfile && (
        <button
          onClick={onAdd}
          className="p-0.5 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 rounded text-[10px] font-semibold transition"
          title="Add this keyword to Candidate Profile Skills"
        >
          <Plus className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
