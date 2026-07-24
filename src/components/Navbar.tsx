import React from "react";
import {
  FileText,
  Layers,
  Sparkles,
  Target,
  Download,
  RotateCcw,
  CheckCircle2,
  FileCode,
  Printer,
  ChevronRight,
} from "lucide-react";

interface NavbarProps {
  currentStep: number;
  setStep: (step: number) => void;
  onLoadSamples: () => void;
  onExportPdf: () => void;
  onExportDocx: () => void;
  onExportTxt: () => void;
  hasProfile: boolean;
  hasMatrix: boolean;
  hasMaster: boolean;
  hasTailored: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStep,
  setStep,
  onLoadSamples,
  onExportPdf,
  onExportDocx,
  onExportTxt,
  hasProfile,
  hasMatrix,
  hasMaster,
  hasTailored,
}) => {
  const steps = [
    {
      id: 1,
      title: "1. Profile Ingestion",
      shortTitle: "Profile",
      icon: FileText,
      completed: hasProfile,
    },
    {
      id: 2,
      title: "2. 5+ JD Keyword Matrix",
      shortTitle: "JD Pooling",
      icon: Layers,
      completed: hasMatrix,
    },
    {
      id: 3,
      title: "3. Master ATS Resume",
      shortTitle: "Master Resume",
      icon: Sparkles,
      completed: hasMaster,
    },
    {
      id: 4,
      title: "4. Single-JD Tailor & Score",
      shortTitle: "Job Tailor",
      icon: Target,
      completed: hasTailored,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0f1115]/95 backdrop-blur-md border-b border-white/5 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setStep(1)}>
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-lg tracking-tight text-white">
                  ATS<span className="text-blue-500">FORGE</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
                  Gemini 3.6 AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                ATS-Optimized Resume Maker & Keyword Tailoring Engine
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onLoadSamples}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white rounded-md border border-white/5 transition"
              title="Load pre-filled candidate profile and 5 sample Job Descriptions"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">Load Demo Data</span>
              <span className="md:hidden">Demo</span>
            </button>

            {/* Export Menu */}
            <div className="relative group">
              <button
                className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF / Word</span>
              </button>
              <div className="absolute right-0 mt-1 w-52 bg-[#151921] border border-white/10 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 py-1">
                <button
                  onClick={onExportPdf}
                  className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-blue-600/20 hover:text-white flex items-center space-x-2 transition"
                >
                  <FileText className="w-3.5 h-3.5 text-red-400" />
                  <span>Download Clean PDF</span>
                </button>
                <button
                  onClick={onExportDocx}
                  className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-blue-600/20 hover:text-white flex items-center space-x-2 transition"
                >
                  <FileCode className="w-3.5 h-3.5 text-blue-400" />
                  <span>Download Editable Word (.doc)</span>
                </button>
                <button
                  onClick={onExportTxt}
                  className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-blue-600/20 hover:text-white flex items-center space-x-2 transition"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copy Plain Text (For Web Forms)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Progress Bar / Steps Header */}
        <div className="flex items-center justify-between py-2 border-t border-white/5 overflow-x-auto no-scrollbar">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setStep(step.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                      : step.completed
                      ? "text-slate-300 hover:bg-white/5"
                      : "text-slate-500 hover:bg-white/5"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                      step.completed
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : isActive
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                  <span className="hidden lg:inline">{step.title}</span>
                  <span className="lg:hidden">{step.shortTitle}</span>
                </button>
                {idx < steps.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </header>
  );
};
