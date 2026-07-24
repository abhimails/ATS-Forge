import { CandidateProfile } from '../types';

export function downloadDocxResume(profile: CandidateProfile, filename = "ATS_Optimized_Resume.doc") {
  const { contact, professionalSummary, workExperience, skills, education, projects, certifications } = profile;

  let html = `
  <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset="utf-8">
    <title>${contact.fullName} Resume</title>
    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 10.5pt;
        line-height: 1.35;
        color: #111111;
        margin: 0.5in 0.6in;
      }
      h1 {
        font-size: 18pt;
        text-transform: uppercase;
        margin: 0 0 4pt 0;
        text-align: center;
        letter-spacing: 0.5pt;
        color: #000000;
      }
      .contact-line {
        text-align: center;
        font-size: 9.5pt;
        color: #333333;
        margin-bottom: 12pt;
      }
      .section-header {
        font-size: 11pt;
        font-weight: bold;
        text-transform: uppercase;
        border-bottom: 1pt solid #000000;
        padding-bottom: 2pt;
        margin-top: 12pt;
        margin-bottom: 6pt;
        letter-spacing: 0.5pt;
      }
      p {
        margin: 0 0 6pt 0;
      }
      .job-header {
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        margin-top: 6pt;
      }
      .company-line {
        font-style: italic;
        margin-bottom: 4pt;
      }
      ul {
        margin: 0 0 6pt 16pt;
        padding: 0;
      }
      li {
        margin-bottom: 3pt;
      }
      .skill-cat {
        margin-bottom: 3pt;
      }
      .skill-cat strong {
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <h1>${contact.fullName}</h1>
    <div class="contact-line">
      ${[contact.location, contact.phone, contact.email, contact.linkedin, contact.github, contact.portfolio].filter(Boolean).join(" | ")}
    </div>

    ${professionalSummary ? `
      <div class="section-header">PROFESSIONAL SUMMARY</div>
      <p>${professionalSummary}</p>
    ` : ''}

    ${skills && skills.length > 0 ? `
      <div class="section-header">CORE SKILLS</div>
      ${skills.map(s => `<div class="skill-cat"><strong>${s.category}:</strong> ${s.skills.join(", ")}</div>`).join("")}
    ` : ''}

    ${workExperience && workExperience.length > 0 ? `
      <div class="section-header">PROFESSIONAL EXPERIENCE</div>
      ${workExperience.map(exp => `
        <div style="margin-bottom: 8pt;">
          <table style="width:100%; border-collapse:collapse; margin-bottom:2pt;">
            <tr>
              <td style="font-weight:bold; text-align:left;">${exp.role}</td>
              <td style="text-align:right; font-size:9.5pt; color:#333;">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</td>
            </tr>
            <tr>
              <td style="font-style:italic; text-align:left; color:#333;" colspan="2">${exp.company}${exp.location ? ` | ${exp.location}` : ''}</td>
            </tr>
          </table>
          <ul>
            ${exp.bullets.map(b => `<li>${b}</li>`).join("")}
          </ul>
        </div>
      `).join("")}
    ` : ''}

    ${projects && projects.length > 0 ? `
      <div class="section-header">PROJECTS</div>
      ${projects.map(proj => `
        <div style="margin-bottom: 6pt;">
          <strong style="font-size:10.5pt;">${proj.name}</strong> ${proj.technologies?.length ? `<span style="font-size:9.5pt; color:#444;">(${proj.technologies.join(", ")})</span>` : ''}
          ${proj.description ? `<p style="margin: 2pt 0;">${proj.description}</p>` : ''}
          ${proj.bullets?.length ? `
            <ul>
              ${proj.bullets.map(b => `<li>${b}</li>`).join("")}
            </ul>
          ` : ''}
        </div>
      `).join("")}
    ` : ''}

    ${education && education.length > 0 ? `
      <div class="section-header">EDUCATION</div>
      ${education.map(edu => `
        <div style="margin-bottom: 4pt;">
          <table style="width:100%; border-collapse:collapse;">
            <tr>
              <td style="font-weight:bold;">${edu.degree} in ${edu.fieldOfStudy}</td>
              <td style="text-align:right; font-size:9.5pt;">${edu.graduationYear}</td>
            </tr>
            <tr>
              <td style="font-style:italic; color:#333;" colspan="2">${edu.institution}${edu.location ? ` | ${edu.location}` : ''}${edu.gpa ? ` (GPA: ${edu.gpa})` : ''}</td>
            </tr>
          </table>
        </div>
      `).join("")}
    ` : ''}

    ${certifications && certifications.length > 0 ? `
      <div class="section-header">CERTIFICATIONS</div>
      <ul>
        ${certifications.map(c => `<li><strong>${c.name}</strong> - ${c.issuer} (${c.date})</li>`).join("")}
      </ul>
    ` : ''}
  </body>
  </html>
  `;

  const blob = new Blob(['\ufeff' + html], {
    type: 'application/msword'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
