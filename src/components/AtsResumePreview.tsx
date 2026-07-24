import React, { useState } from "react";
import { CandidateProfile } from "../types";
import { downloadPdfFromElement, printResumeElement } from "../utils/pdfExport";
import { downloadDocxResume } from "../utils/docxExport";
import { exportToPlainText } from "../utils/txtExport";
import {
  Download,
  FileCode,
  FileText,
  Printer,
  Copy,
  Check,
  Eye,
  Sliders,
  Type,
} from "lucide-react";

interface AtsResumePreviewProps {
  profile: CandidateProfile;
  onUpdateProfile: (profile: CandidateProfile) => void;
  title?: string;
}

export const AtsResumePreview: React.FC<AtsResumePreviewProps> = ({
  profile,
  onUpdateProfile,
  title = "ATS-Formatted Resume",
}) => {
  const [copied, setCopied] = useState(false);
  const [fontFamily, setFontFamily] = useState<"arial" | "times" | "calibri" | "georgia">(
    "arial"
  );
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");
  const [isEditable, setIsEditable] = useState(false);

  const { contact, professionalSummary, workExperience, skills, education, projects, certifications } = profile;

  const handleCopyText = () => {
    const txt = exportToPlainText(profile);
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case "times":
        return "font-serif";
      case "georgia":
        return "font-serif";
      case "calibri":
        return "font-sans";
      default:
        return "font-sans";
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case "sm":
        return "text-[12px] leading-snug";
      case "lg":
        return "text-[15px] leading-normal";
      default:
        return "text-[13.5px] leading-normal";
    }
  };

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="bg-[#151921] border border-white/5 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <Eye className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            {title}
          </span>
        </div>

        {/* Customization Options */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Font Selector */}
          <div className="flex items-center bg-[#0f1115] p-1 rounded-lg border border-white/5">
            <Type className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
            <button
              onClick={() => setFontFamily("arial")}
              className={`px-2 py-0.5 text-xs rounded font-medium ${
                fontFamily === "arial"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Arial
            </button>
            <button
              onClick={() => setFontFamily("times")}
              className={`px-2 py-0.5 text-xs rounded font-medium ${
                fontFamily === "times"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Times
            </button>
            <button
              onClick={() => setFontFamily("georgia")}
              className={`px-2 py-0.5 text-xs rounded font-medium ${
                fontFamily === "georgia"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Georgia
            </button>
          </div>

          {/* Size Selector */}
          <div className="flex items-center bg-[#0f1115] p-1 rounded-lg border border-white/5">
            <Sliders className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
            <button
              onClick={() => setFontSize("sm")}
              className={`px-2 py-0.5 text-xs rounded font-medium ${
                fontSize === "sm"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Compact
            </button>
            <button
              onClick={() => setFontSize("md")}
              className={`px-2 py-0.5 text-xs rounded font-medium ${
                fontSize === "md"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Standard
            </button>
          </div>

          <button
            onClick={() => setIsEditable(!isEditable)}
            className={`px-3 py-1 text-xs font-semibold rounded-md border transition ${
              isEditable
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-[#0f1115] text-slate-300 border-white/10"
            }`}
          >
            {isEditable ? "Inline Editing ON" : "Enable Edit"}
          </button>
        </div>

        {/* Quick Download Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => downloadPdfFromElement("ats-resume-document-view")}
            className="px-3 py-1.5 text-xs font-semibold bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600 hover:text-white rounded-lg transition flex items-center space-x-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => downloadDocxResume(profile)}
            className="px-3 py-1.5 text-xs font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600 hover:text-white rounded-lg transition flex items-center space-x-1"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>DOCX</span>
          </button>
          <button
            onClick={handleCopyText}
            className="px-3 py-1.5 text-xs font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white rounded-lg transition flex items-center space-x-1"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? "Copied!" : "Plain Text"}</span>
          </button>
          <button
            onClick={() => printResumeElement("ats-resume-document-view")}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* DOCUMENT PAGE CONTAINER (STRICT ATS FORMAT) */}
      <div className="bg-slate-950 p-4 sm:p-8 rounded-xl border border-slate-800 flex justify-center">
        <div
          id="ats-resume-document-view"
          contentEditable={isEditable}
          suppressContentEditableWarning
          className={`w-full max-w-[800px] bg-white text-slate-900 p-8 sm:p-12 shadow-2xl rounded-sm ${getFontFamilyClass()} ${getFontSizeClass()}`}
          style={{
            fontFamily:
              fontFamily === "arial"
                ? "Arial, Helvetica, sans-serif"
                : fontFamily === "times"
                ? "'Times New Roman', Times, serif"
                : fontFamily === "georgia"
                ? "Georgia, serif"
                : "Calibri, sans-serif",
          }}
        >
          {/* Header Contact Info */}
          <div className="text-center pb-4 border-b border-slate-300 mb-5">
            <h1 className="text-2xl font-bold uppercase tracking-wider text-black mb-1">
              {contact.fullName || "Candidate Name"}
            </h1>
            <div className="text-[11px] text-slate-700 space-x-1 font-medium">
              {[
                contact.location,
                contact.phone,
                contact.email,
                contact.linkedin,
                contact.github,
                contact.portfolio,
              ]
                .filter(Boolean)
                .join("  |  ")}
            </div>
          </div>

          {/* Professional Summary */}
          {professionalSummary && (
            <div className="mb-5">
              <h2 className="text-[12px] font-bold text-black uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-2">
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-slate-800">{professionalSummary}</p>
            </div>
          )}

          {/* Core Skills */}
          {skills && skills.length > 0 && (
            <div className="mb-5">
              <h2 className="text-[12px] font-bold text-black uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-2">
                CORE SKILLS
              </h2>
              <div className="space-y-1">
                {skills.map((cat, idx) => (
                  <div key={idx} className="text-slate-800">
                    <strong className="font-bold text-black">
                      {cat.category}:
                    </strong>{" "}
                    {cat.skills.join(", ")}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Professional Experience */}
          {workExperience && workExperience.length > 0 && (
            <div className="mb-5">
              <h2 className="text-[12px] font-bold text-black uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-2">
                PROFESSIONAL EXPERIENCE
              </h2>
              <div className="space-y-4">
                {workExperience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline font-bold text-black">
                      <span>{exp.role}</span>
                      <span className="text-[11px] text-slate-700">
                        {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <div className="italic text-slate-700 text-[12px] mb-1">
                      {exp.company}
                      {exp.location ? `, ${exp.location}` : ""}
                    </div>
                    <ul className="list-disc list-outside pl-4 space-y-1 text-slate-800">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div className="mb-5">
              <h2 className="text-[12px] font-bold text-black uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-2">
                PROJECTS
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline">
                      <strong className="font-bold text-black">
                        {proj.name}
                      </strong>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <span className="text-[11px] text-slate-600 italic">
                          ({proj.technologies.join(", ")})
                        </span>
                      )}
                    </div>
                    {proj.description && (
                      <p className="text-slate-800 text-[12px] mt-0.5">
                        {proj.description}
                      </p>
                    )}
                    {proj.bullets && proj.bullets.length > 0 && (
                      <ul className="list-disc list-outside pl-4 space-y-1 text-slate-800 mt-1">
                        {proj.bullets.map((b, idx) => (
                          <li key={idx}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div className="mb-5">
              <h2 className="text-[12px] font-bold text-black uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-2">
                EDUCATION
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                      <strong className="font-bold text-black">
                        {edu.degree} in {edu.fieldOfStudy}
                      </strong>
                      <div className="italic text-slate-700 text-[12px]">
                        {edu.institution}
                        {edu.location ? `, ${edu.location}` : ""}
                        {edu.gpa ? ` (GPA: ${edu.gpa})` : ""}
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-700 font-medium">
                      {edu.graduationYear}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div>
              <h2 className="text-[12px] font-bold text-black uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-2">
                CERTIFICATIONS
              </h2>
              <ul className="list-disc list-outside pl-4 space-y-1 text-slate-800">
                {certifications.map((cert) => (
                  <li key={cert.id}>
                    <strong className="text-black">{cert.name}</strong> –{" "}
                    {cert.issuer} ({cert.date})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
