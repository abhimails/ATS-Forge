export interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
  location?: string;
  gpa?: string;
  honors?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  bullets: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface SkillCategory {
  category: string; // e.g. "Technical Skills", "Tools & Frameworks", "Methodologies"
  skills: string[];
}

export interface CandidateProfile {
  contact: ContactInfo;
  professionalSummary: string;
  workExperience: WorkExperience[];
  skills: SkillCategory[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
}

export interface JobDescription {
  id: string;
  title: string;
  company: string;
  content: string;
}

export interface KeywordItem {
  keyword: string;
  category: 'Hard Skill' | 'Tool/Software' | 'Soft Skill' | 'Domain Jargon' | 'Certification/Degree' | 'Action Verb';
  frequency: number; // count across 5 JDs
  jdCount: number; // how many JDs contain this keyword
  relevanceScore: number; // 1-100
  matchedInProfile: boolean;
}

export interface KeywordMatrix {
  topHardSkills: KeywordItem[];
  topTools: KeywordItem[];
  topSoftSkills: KeywordItem[];
  topActionVerbs: KeywordItem[];
  topCertifications: KeywordItem[];
  overallSummary: string;
}

export interface MatchScoreResult {
  overallScore: number; // 0-100
  breakdown: {
    hardSkillsScore: number;
    toolsScore: number;
    actionVerbsScore: number;
    metricDensityScore: number;
  };
  matchedKeywords: string[];
  missingKeywords: {
    keyword: string;
    importance: 'High' | 'Medium' | 'Low';
    category: string;
  }[];
  formatComplianceScore: number; // 0-100
  formatChecklist: {
    rule: string;
    passed: boolean;
    feedback: string;
  }[];
  suggestions: string[];
}

export interface TailoredResume {
  jobTitle: string;
  targetCompany: string;
  tailoredSummary: string;
  tailoredSkills: SkillCategory[];
  tailoredWorkExperience: WorkExperience[];
  matchScore: MatchScoreResult;
  highlightedKeywordsAdded: string[];
}
