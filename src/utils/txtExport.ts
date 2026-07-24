import { CandidateProfile } from '../types';

export function exportToPlainText(profile: CandidateProfile): string {
  const { contact, professionalSummary, workExperience, skills, education, projects, certifications } = profile;

  let txt = "";

  // Header
  txt += `${contact.fullName.toUpperCase()}\n`;
  const contactLines = [
    contact.location,
    contact.phone,
    contact.email,
    contact.linkedin,
    contact.github,
    contact.portfolio,
  ].filter(Boolean);
  txt += `${contactLines.join(" | ")}\n\n`;

  // Professional Summary
  if (professionalSummary) {
    txt += `PROFESSIONAL SUMMARY\n`;
    txt += `====================\n`;
    txt += `${professionalSummary}\n\n`;
  }

  // Core Skills
  if (skills && skills.length > 0) {
    txt += `CORE SKILLS\n`;
    txt += `===========\n`;
    skills.forEach((cat) => {
      txt += `${cat.category}: ${cat.skills.join(", ")}\n`;
    });
    txt += `\n`;
  }

  // Work Experience
  if (workExperience && workExperience.length > 0) {
    txt += `PROFESSIONAL EXPERIENCE\n`;
    txt += `=======================\n`;
    workExperience.forEach((exp) => {
      const dates = `${exp.startDate} - ${exp.current ? "Present" : exp.endDate}`;
      txt += `${exp.role} | ${exp.company}`;
      if (exp.location) txt += ` (${exp.location})`;
      txt += `\n${dates}\n`;
      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets.forEach((b) => {
          txt += `• ${b}\n`;
        });
      }
      txt += `\n`;
    });
  }

  // Projects
  if (projects && projects.length > 0) {
    txt += `PROJECTS\n`;
    txt += `========\n`;
    projects.forEach((proj) => {
      txt += `${proj.name}`;
      if (proj.technologies && proj.technologies.length > 0) {
        txt += ` (${proj.technologies.join(", ")})`;
      }
      txt += `\n`;
      if (proj.description) txt += `${proj.description}\n`;
      if (proj.bullets && proj.bullets.length > 0) {
        proj.bullets.forEach((b) => {
          txt += `• ${b}\n`;
        });
      }
      txt += `\n`;
    });
  }

  // Education
  if (education && education.length > 0) {
    txt += `EDUCATION\n`;
    txt += `=========\n`;
    education.forEach((edu) => {
      txt += `${edu.degree} in ${edu.fieldOfStudy}\n`;
      txt += `${edu.institution} - ${edu.graduationYear}`;
      if (edu.gpa) txt += ` (GPA: ${edu.gpa})`;
      txt += `\n\n`;
    });
  }

  // Certifications
  if (certifications && certifications.length > 0) {
    txt += `CERTIFICATIONS\n`;
    txt += `==============\n`;
    certifications.forEach((cert) => {
      txt += `• ${cert.name} - ${cert.issuer} (${cert.date})\n`;
    });
    txt += `\n`;
  }

  return txt.trim();
}
