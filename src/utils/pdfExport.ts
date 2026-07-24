import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function downloadPdfFromElement(elementId: string, filename = "ATS_Resume.pdf") {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element #${elementId} not found for PDF export`);
    return;
  }

  // Temporary styling override for crisp high-dpi capture
  const originalWidth = element.style.width;
  const originalMaxWidth = element.style.maxWidth;
  element.style.width = "800px";
  element.style.maxWidth = "none";

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 20;

    pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(filename);
  } catch (err) {
    console.error("PDF export error:", err);
  } finally {
    element.style.width = originalWidth;
    element.style.maxWidth = originalMaxWidth;
  }
}

export function printResumeElement(elementId: string) {
  window.print();
}
