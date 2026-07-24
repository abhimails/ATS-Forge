import React, { useState } from "react";
import {
  CandidateProfile,
  WorkExperience,
  Education,
  SkillCategory,
  Project,
  Certification,
} from "../types";
import {
  Upload,
  FileText,
  Plus,
  Trash2,
  Sparkles,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  User,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Wrench,
  TrendingUp,
} from "lucide-react";

interface CandidateIngestionProps {
  profile: CandidateProfile;
  onUpdateProfile: (profile: CandidateProfile) => void;
  onNext: () => void;
}

export const CandidateIngestion: React.FC<CandidateIngestionProps> = ({
  profile,
  onUpdateProfile,
  onNext,
}) => {
  const [ingestionTab, setIngestionTab] = useState<"upload" | "manual">(
    "upload"
  );
  const [rawText, setRawText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState("");
  const [activeFormSection, setActiveFormSection] = useState<
    "contact" | "summary" | "experience" | "skills" | "education" | "projects" | "certs"
  >("experience");

  // Enhancing single bullet state
  const [enhancingBullet, setEnhancingBullet] = useState<{
    workId: string;
    bulletIdx: number;
    text: string;
    role: string;
  } | null>(null);
  const [metricHint, setMetricHint] = useState("");
  const [bulletVariations, setBulletVariations] = useState<any[]>([]);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // File Upload / Base64 parsing handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setParseError("");

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Str = reader.result as string;
      await parseCVOnServer({ fileBase64: base64Str, mimeType: selectedFile.type });
    };
    reader.onerror = () => {
      setParseError("Failed to read file.");
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleRawTextParse = async () => {
    if (!rawText.trim()) {
      setParseError("Please paste raw resume text or upload a CV file.");
      return;
    }
    await parseCVOnServer({ rawText });
  };

  const parseCVOnServer = async (payload: {
    rawText?: string;
    fileBase64?: string;
    mimeType?: string;
  }) => {
    setIsParsing(true);
    setParseError("");
    try {
      const res = await fetch("/api/parse-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to parse CV");
      }
      if (data.profile) {
        onUpdateProfile(data.profile);
        setIngestionTab("manual");
      }
    } catch (err: any) {
      setParseError(err.message || "Failed to process CV with AI parser.");
    } finally {
      setIsParsing(false);
    }
  };

  // Helper to check if a bullet has quantifiable metrics
  const hasMetric = (bulletText: string) => {
    // Regex looking for numbers, %, $, k, m, timeframes, or metric words
    return /\d+|\$|%|percent|increased|reduced|doubled|saved|managed|led/i.test(
      bulletText
    );
  };

  // Form Section Updates
  const updateContact = (field: string, val: string) => {
    onUpdateProfile({
      ...profile,
      contact: { ...profile.contact, [field]: val },
    });
  };

  const addWorkExperience = () => {
    const newExp: WorkExperience = {
      id: `work-${Date.now()}`,
      company: "New Company",
      role: "Software Engineer",
      startDate: "Jan 2022",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected scalable backend APIs and enhanced user engagement.",
      ],
    };
    onUpdateProfile({
      ...profile,
      workExperience: [newExp, ...profile.workExperience],
    });
  };

  const updateWorkExp = (id: string, field: string, value: any) => {
    onUpdateProfile({
      ...profile,
      workExperience: profile.workExperience.map((w) =>
        w.id === id ? { ...w, [field]: value } : w
      ),
    });
  };

  const removeWorkExp = (id: string) => {
    onUpdateProfile({
      ...profile,
      workExperience: profile.workExperience.filter((w) => w.id !== id),
    });
  };

  const addBullet = (workId: string) => {
    onUpdateProfile({
      ...profile,
      workExperience: profile.workExperience.map((w) =>
        w.id === workId
          ? {
              ...w,
              bullets: [
                ...w.bullets,
                "Improved operational efficiency across product team.",
              ],
            }
          : w
      ),
    });
  };

  const updateBullet = (
    workId: string,
    bulletIdx: number,
    text: string
  ) => {
    onUpdateProfile({
      ...profile,
      workExperience: profile.workExperience.map((w) =>
        w.id === workId
          ? {
              ...w,
              bullets: w.bullets.map((b, i) => (i === bulletIdx ? text : b)),
            }
          : w
      ),
    });
  };

  const removeBullet = (workId: string, bulletIdx: number) => {
    onUpdateProfile({
      ...profile,
      workExperience: profile.workExperience.map((w) =>
        w.id === workId
          ? {
              ...w,
              bullets: w.bullets.filter((_, i) => i !== bulletIdx),
            }
          : w
      ),
    });
  };

  // Single bullet enhancement trigger
  const handleEnhanceBullet = async () => {
    if (!enhancingBullet) return;
    setIsEnhancing(true);
    try {
      const res = await fetch("/api/enhance-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bullet: enhancingBullet.text,
          role: enhancingBullet.role,
          userMetricHint: metricHint,
        }),
      });
      const data = await res.json();
      if (data.variations) {
        setBulletVariations(data.variations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const applyBulletVariation = (newText: string) => {
    if (!enhancingBullet) return;
    updateBullet(enhancingBullet.workId, enhancingBullet.bulletIdx, newText);
    setEnhancingBullet(null);
    setBulletVariations([]);
    setMetricHint("");
  };

  return (
    <div className="space-y-6">
      {/* Top Description Banner */}
      <div className="bg-[#151921] border border-white/5 rounded-xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <User className="w-5 h-5 text-blue-400" />
              Candidate Profile Ingestion
            </h2>
            <p className="text-sm text-slate-400">
              Upload an existing resume (PDF, DOCX, TXT) or enter work experience manually.
              Our engine enforces metric-rich bullet points and STAR format structure.
            </p>
          </div>

          <div className="flex bg-[#0f1115] p-1 rounded-lg border border-white/5 self-start md:self-auto">
            <button
              onClick={() => setIngestionTab("upload")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition ${
                ingestionTab === "upload"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              CV Upload / Parser
            </button>
            <button
              onClick={() => setIngestionTab("manual")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition ${
                ingestionTab === "manual"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Interactive Form Editor
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Upload / Raw Text */}
      {ingestionTab === "upload" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* File Drag and Drop */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-400" /> Option 1: File
                Upload (PDF / DOCX / TXT)
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Drag and drop your current resume file or click to select from
                device.
              </p>

              <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500/60 bg-slate-800/50 hover:bg-slate-800 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition group">
                <Upload className="w-10 h-10 text-indigo-400 group-hover:scale-110 transition mb-3" />
                <span className="text-sm font-semibold text-slate-200">
                  {file ? file.name : "Click or drag resume file here"}
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Supports PDF, DOCX, TXT, or Image scans
                </span>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {isParsing && (
              <div className="mt-4 p-4 bg-indigo-950/50 border border-indigo-500/30 rounded-lg flex items-center space-x-3 text-indigo-300 text-xs">
                <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
                <span>AI Gemini 3.6 is parsing your CV structure...</span>
              </div>
            )}
          </div>

          {/* Raw Text Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" /> Option 2: Paste
                Raw Resume Text
              </h3>
              <p className="text-xs text-slate-400 mb-3">
                Paste text directly from LinkedIn, PDF, or Word document.
              </p>
              <textarea
                rows={8}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste your raw CV content here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none"
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              {parseError && (
                <span className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {parseError}
                </span>
              )}
              <button
                onClick={handleRawTextParse}
                disabled={isParsing || !rawText.trim()}
                className="ml-auto px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md transition disabled:opacity-50 flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Parse CV with Gemini</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Manual Form Editor */}
      {ingestionTab === "manual" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
          {/* Sub-navigation tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950/60 overflow-x-auto no-scrollbar px-4 pt-2">
            {[
              { id: "experience", label: "Work Experience", icon: Briefcase },
              { id: "contact", label: "Contact Info", icon: User },
              { id: "summary", label: "Summary", icon: FileText },
              { id: "skills", label: "Core Skills", icon: Wrench },
              { id: "education", label: "Education", icon: GraduationCap },
              { id: "projects", label: "Projects", icon: FolderGit2 },
              { id: "certs", label: "Certifications", icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFormSection(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                    activeFormSection === tab.id
                      ? "border-indigo-500 text-indigo-400 bg-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {/* WORK EXPERIENCE */}
            {activeFormSection === "experience" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-400" /> Work
                    Experience Roles ({profile.workExperience.length})
                  </h3>
                  <button
                    onClick={addWorkExperience}
                    className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white rounded-lg transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Position</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {profile.workExperience.map((exp) => (
                    <div
                      key={exp.id}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-400 uppercase">
                            Role / Job Title
                          </label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) =>
                              updateWorkExp(exp.id, "role", e.target.value)
                            }
                            className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-400 uppercase">
                            Company Name
                          </label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) =>
                              updateWorkExp(exp.id, "company", e.target.value)
                            }
                            className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-400 uppercase">
                            Dates (e.g. Jan 2021 - Present)
                          </label>
                          <div className="flex items-center space-x-2 mt-1">
                            <input
                              type="text"
                              value={exp.startDate}
                              onChange={(e) =>
                                updateWorkExp(exp.id, "startDate", e.target.value)
                              }
                              placeholder="Start"
                              className="w-1/2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                            />
                            <span className="text-slate-500 text-xs">-</span>
                            <input
                              type="text"
                              value={exp.endDate}
                              onChange={(e) =>
                                updateWorkExp(exp.id, "endDate", e.target.value)
                              }
                              placeholder="End"
                              className="w-1/2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bullets with Quantifiable Result Prompting */}
                      <div className="space-y-2 pt-2 border-t border-slate-900">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-slate-300">
                            Experience Bullet Points (STAR Format)
                          </label>
                          <button
                            onClick={() => addBullet(exp.id)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                          >
                            <Plus className="w-3 h-3" /> <span>Add Bullet</span>
                          </button>
                        </div>

                        {exp.bullets.map((bullet, bIdx) => {
                          const metricPresent = hasMetric(bullet);
                          return (
                            <div
                              key={bIdx}
                              className="space-y-1.5 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80"
                            >
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-mono text-slate-500">
                                  •
                                </span>
                                <input
                                  type="text"
                                  value={bullet}
                                  onChange={(e) =>
                                    updateBullet(exp.id, bIdx, e.target.value)
                                  }
                                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                />
                                <button
                                  onClick={() =>
                                    setEnhancingBullet({
                                      workId: exp.id,
                                      bulletIdx: bIdx,
                                      text: bullet,
                                      role: exp.role,
                                    })
                                  }
                                  className="p-1.5 text-indigo-400 hover:bg-indigo-500/20 rounded transition"
                                  title="Enhance with AI STAR Format & Metrics"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => removeBullet(exp.id, bIdx)}
                                  className="p-1.5 text-slate-500 hover:text-red-400 transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Quantifiable Result Prompting Badge */}
                              {!metricPresent && (
                                <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded px-2.5 py-1 text-[11px] text-amber-300">
                                  <div className="flex items-center space-x-1.5">
                                    <AlertCircle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                                    <span>
                                      <strong>Missing Metric Prompt:</strong> Can
                                      you estimate the % efficiency gained or team
                                      size managed here?
                                    </span>
                                  </div>
                                  <button
                                    onClick={() =>
                                      setEnhancingBullet({
                                        workId: exp.id,
                                        bulletIdx: bIdx,
                                        text: bullet,
                                        role: exp.role,
                                      })
                                    }
                                    className="text-amber-300 underline font-semibold hover:text-amber-200 ml-2"
                                  >
                                    Add Metric with AI
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => removeWorkExp(exp.id)}
                          className="text-xs text-red-400 hover:text-red-300 flex items-center space-x-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Position</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONTACT INFO */}
            {activeFormSection === "contact" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.contact.fullName}
                    onChange={(e) => updateContact("fullName", e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">
                    Email Address
                  </label>
                  <input
                    type="text"
                    value={profile.contact.email}
                    onChange={(e) => updateContact("email", e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={profile.contact.phone}
                    onChange={(e) => updateContact("phone", e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">
                    Location (City, State)
                  </label>
                  <input
                    type="text"
                    value={profile.contact.location}
                    onChange={(e) => updateContact("location", e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={profile.contact.linkedin || ""}
                    onChange={(e) => updateContact("linkedin", e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">
                    GitHub / Portfolio URL
                  </label>
                  <input
                    type="text"
                    value={profile.contact.github || ""}
                    onChange={(e) => updateContact("github", e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* PROFESSIONAL SUMMARY */}
            {activeFormSection === "summary" && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">
                  Professional Summary Paragraph
                </label>
                <textarea
                  rows={5}
                  value={profile.professionalSummary}
                  onChange={(e) =>
                    onUpdateProfile({
                      ...profile,
                      professionalSummary: e.target.value,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            )}

            {/* CORE SKILLS */}
            {activeFormSection === "skills" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase">
                    Skill Categories & Tags
                  </h3>
                  <button
                    onClick={() =>
                      onUpdateProfile({
                        ...profile,
                        skills: [
                          ...profile.skills,
                          { category: "New Category", skills: ["Skill 1", "Skill 2"] },
                        ],
                      })
                    }
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> <span>Add Category</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {profile.skills.map((cat, cIdx) => (
                    <div
                      key={cIdx}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={cat.category}
                          onChange={(e) => {
                            const newSkills = [...profile.skills];
                            newSkills[cIdx].category = e.target.value;
                            onUpdateProfile({ ...profile, skills: newSkills });
                          }}
                          className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs font-semibold text-indigo-300 focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            const newSkills = profile.skills.filter(
                              (_, i) => i !== cIdx
                            );
                            onUpdateProfile({ ...profile, skills: newSkills });
                          }}
                          className="text-xs text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {cat.skills.map((s, sIdx) => (
                          <span
                            key={sIdx}
                            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-md flex items-center space-x-1"
                          >
                            <span>{s}</span>
                            <button
                              onClick={() => {
                                const newSkills = [...profile.skills];
                                newSkills[cIdx].skills = newSkills[
                                  cIdx
                                ].skills.filter((_, i) => i !== sIdx);
                                onUpdateProfile({
                                  ...profile,
                                  skills: newSkills,
                                });
                              }}
                              className="text-slate-500 hover:text-slate-200 ml-1"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        <button
                          onClick={() => {
                            const val = prompt("Enter new skill tag:");
                            if (val) {
                              const newSkills = [...profile.skills];
                              newSkills[cIdx].skills.push(val.trim());
                              onUpdateProfile({
                                ...profile,
                                skills: newSkills,
                              });
                            }
                          }}
                          className="text-xs text-indigo-400 hover:text-indigo-300 px-2 py-0.5 border border-dashed border-indigo-500/40 rounded"
                        >
                          + Add Skill Tag
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EDUCATION */}
            {activeFormSection === "education" && (
              <div className="space-y-4">
                {profile.education.map((edu, eIdx) => (
                  <div
                    key={edu.id}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-3"
                  >
                    <div>
                      <label className="text-[11px] text-slate-400">
                        Degree & Major
                      </label>
                      <input
                        type="text"
                        value={`${edu.degree} in ${edu.fieldOfStudy}`}
                        onChange={(e) => {
                          const newEdu = [...profile.education];
                          newEdu[eIdx].degree = e.target.value;
                          onUpdateProfile({ ...profile, education: newEdu });
                        }}
                        className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400">
                        Institution
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const newEdu = [...profile.education];
                          newEdu[eIdx].institution = e.target.value;
                          onUpdateProfile({ ...profile, education: newEdu });
                        }}
                        className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400">
                        Graduation Year
                      </label>
                      <input
                        type="text"
                        value={edu.graduationYear}
                        onChange={(e) => {
                          const newEdu = [...profile.education];
                          newEdu[eIdx].graduationYear = e.target.value;
                          onUpdateProfile({ ...profile, education: newEdu });
                        }}
                        className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* QUANTIFIABLE RESULT PROMPTING MODAL */}
      {enhancingBullet && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2 text-indigo-400">
                <TrendingUp className="w-4 h-4" /> Quantifiable Result Enhancer
              </h3>
              <button
                onClick={() => setEnhancingBullet(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400">Current Bullet:</label>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-xs text-slate-300">
                "{enhancingBullet.text}"
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                Provide metric estimate hint (Optional):
              </label>
              <input
                type="text"
                value={metricHint}
                onChange={(e) => setMetricHint(e.target.value)}
                placeholder="e.g. 30% speedup, 10k users, 5 team members"
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            <button
              onClick={handleEnhanceBullet}
              disabled={isEnhancing}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs rounded transition flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isEnhancing
                  ? "Generating STAR Metrics..."
                  : "Generate STAR Format Variations"}
              </span>
            </button>

            {/* Variations */}
            {bulletVariations.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs font-semibold text-slate-300">
                  Select AI STAR Variation:
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {bulletVariations.map((v, i) => (
                    <div
                      key={i}
                      onClick={() => applyBulletVariation(v.text)}
                      className="p-3 bg-slate-950 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/50 rounded-lg cursor-pointer transition space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-indigo-400">
                          {v.styleTag}
                        </span>
                        <span className="text-emerald-400">
                          Verb: {v.actionVerb}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200">{v.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Continue Action */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          className="px-6 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2"
        >
          <span>Proceed to 5+ JD Keyword Matrix</span>
          <CheckCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
