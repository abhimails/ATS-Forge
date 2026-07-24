/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  CandidateProfile,
  JobDescription,
  KeywordMatrix,
  TailoredResume,
} from "./types";
import {
  SAMPLE_CANDIDATE_PROFILE,
  SAMPLE_5_JOB_DESCRIPTIONS,
  SAMPLE_SINGLE_TARGET_JD,
} from "./data/samples";
import { Navbar } from "./components/Navbar";
import { CandidateIngestion } from "./components/CandidateIngestion";
import { KeywordPooling } from "./components/KeywordPooling";
import { MasterResumeView } from "./components/MasterResumeView";
import { SingleJDTailor } from "./components/SingleJDTailor";
import { downloadPdfFromElement } from "./utils/pdfExport";
import { downloadDocxResume } from "./utils/docxExport";
import { exportToPlainText } from "./utils/txtExport";

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Candidate Data
  const [profile, setProfile] = useState<CandidateProfile>(
    SAMPLE_CANDIDATE_PROFILE
  );

  // 5+ JDs Corpus
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>(
    SAMPLE_5_JOB_DESCRIPTIONS
  );

  // Pooled Matrix Result
  const [keywordMatrix, setKeywordMatrix] = useState<KeywordMatrix | null>(null);

  // Master Resume Profile & STAR Improvements
  const [masterProfile, setMasterProfile] = useState<CandidateProfile | null>(
    null
  );
  const [masterBulletImprovements, setMasterBulletImprovements] = useState<
    any[]
  >([]);

  // Single Target Job Description
  const [singleTargetJd, setSingleTargetJd] = useState<JobDescription>(
    SAMPLE_SINGLE_TARGET_JD
  );

  // Tailored Result
  const [tailoredResult, setTailoredResult] = useState<TailoredResume | null>(
    null
  );

  // Notification Banner State
  const [bannerMsg, setBannerMsg] = useState<string | null>(
    "Loaded pre-configured sample profile & 5 target JDs. Click through steps or test with your own CV!"
  );

  const handleLoadSamples = () => {
    setProfile(SAMPLE_CANDIDATE_PROFILE);
    setJobDescriptions(SAMPLE_5_JOB_DESCRIPTIONS);
    setSingleTargetJd(SAMPLE_SINGLE_TARGET_JD);
    setBannerMsg("Reset to demo sample candidate & 5 target job descriptions.");
    setTimeout(() => setBannerMsg(null), 3500);
  };

  // Get active display profile for exports
  const getActiveProfileForExport = (): CandidateProfile => {
    if (currentStep === 4 && tailoredResult) {
      return {
        ...profile,
        professionalSummary: tailoredResult.tailoredSummary,
        skills: tailoredResult.tailoredSkills,
        workExperience: tailoredResult.tailoredWorkExperience,
      };
    }
    if (masterProfile) {
      return masterProfile;
    }
    return profile;
  };

  const handleExportPdf = () => {
    downloadPdfFromElement("ats-resume-document-view", "ATS_Optimized_Resume.pdf");
  };

  const handleExportDocx = () => {
    downloadDocxResume(getActiveProfileForExport(), "ATS_Optimized_Resume.doc");
  };

  const handleExportTxt = () => {
    const txt = exportToPlainText(getActiveProfileForExport());
    navigator.clipboard.writeText(txt);
    setBannerMsg("Plain text ATS resume copied to clipboard!");
    setTimeout(() => setBannerMsg(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentStep={currentStep}
        setStep={setCurrentStep}
        onLoadSamples={handleLoadSamples}
        onExportPdf={handleExportPdf}
        onExportDocx={handleExportDocx}
        onExportTxt={handleExportTxt}
        hasProfile={!!profile.contact.fullName}
        hasMatrix={!!keywordMatrix}
        hasMaster={!!masterProfile}
        hasTailored={!!tailoredResult}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {bannerMsg && (
          <div className="glass border border-blue-500/20 text-blue-200 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between shadow-lg backdrop-blur-md">
            <span className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              <span>{bannerMsg}</span>
            </span>
            <button
              onClick={() => setBannerMsg(null)}
              className="text-slate-400 hover:text-white font-bold ml-4 transition"
            >
              ✕
            </button>
          </div>
        )}

        {/* Step 1: Candidate Ingestion */}
        {currentStep === 1 && (
          <CandidateIngestion
            profile={profile}
            onUpdateProfile={setProfile}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {/* Step 2: Multi-JD Keyword Pooling */}
        {currentStep === 2 && (
          <KeywordPooling
            jobDescriptions={jobDescriptions}
            onUpdateJds={setJobDescriptions}
            keywordMatrix={keywordMatrix}
            onUpdateMatrix={setKeywordMatrix}
            profile={profile}
            onUpdateProfile={setProfile}
            onNext={() => setCurrentStep(3)}
          />
        )}

        {/* Step 3: Master ATS Resume */}
        {currentStep === 3 && (
          <MasterResumeView
            profile={profile}
            keywordMatrix={keywordMatrix}
            masterProfile={masterProfile}
            masterBulletImprovements={masterBulletImprovements}
            onUpdateMasterProfile={(master, imps) => {
              setMasterProfile(master);
              setMasterBulletImprovements(imps);
            }}
            onNext={() => setCurrentStep(4)}
          />
        )}

        {/* Step 4: Single-JD Tailor & Scoring */}
        {currentStep === 4 && (
          <SingleJDTailor
            masterProfile={masterProfile || profile}
            singleTargetJd={singleTargetJd}
            onUpdateSingleJd={setSingleTargetJd}
            tailoredResult={tailoredResult}
            onUpdateTailoredResult={setTailoredResult}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            ATSForge Engine • Gemini 3.6 Flash Server-Side AI
          </span>
          <span className="text-slate-600">
            Strict Single-Column ATS Formatting • STAR Bullet Refactoring • 0-100% Match Scoring
          </span>
        </div>
      </footer>
    </div>
  );
}
