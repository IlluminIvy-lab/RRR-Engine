import { jsPDF } from 'jspdf';
import { FullApplicationPackage } from '../types';

export function generateFullPackagePdf(pkg: FullApplicationPackage): void {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  const candidate = pkg.candidate;
  const resume = pkg.resume;
  const coverLetter = pkg.coverLetter;

  // PAGE 1: RESUME
  let y = 40;

  // Top accent
  doc.setFillColor(217, 119, 6); // amber-600
  doc.rect(margin, y, contentWidth, 3, 'F');
  y += 18;

  // Candidate Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(24, 24, 27);
  doc.text(candidate.fullName.toUpperCase(), margin, y);
  y += 16;

  // Target Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(180, 83, 9); // amber-700
  doc.text(resume.targetTitle.toUpperCase(), margin, y);
  y += 12;

  // Contact line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(113, 113, 122);
  const contactStr = `${candidate.cityStateZip}  |  ${candidate.phone}  |  ${candidate.email}  |  ${candidate.linkedinOrPortfolio || 'Verified Professional'}`;
  doc.text(contactStr, margin, y);
  y += 14;

  // Divider
  doc.setDrawColor(228, 228, 231);
  doc.setLineWidth(0.75);
  doc.line(margin, y, margin + contentWidth, y);
  y += 14;

  const drawHeading = (title: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(24, 24, 27);
    doc.text(title.toUpperCase(), margin, y);
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(1.5);
    doc.line(margin, y + 3, margin + 35, y + 3);
    doc.setDrawColor(228, 228, 231);
    doc.setLineWidth(0.5);
    doc.line(margin + 35, y + 3, margin + contentWidth, y + 3);
    y += 14;
  };

  // 1. Summary
  drawHeading('Professional Summary');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(63, 63, 70);
  const splitSummary = doc.splitTextToSize(resume.summary, contentWidth);
  doc.text(splitSummary, margin, y);
  y += splitSummary.length * 12 + 10;

  // 2. Competencies Grid 2x3
  drawHeading('Core Operational & Technical Competencies');
  const colW = contentWidth / 3;
  resume.competenciesGrid.forEach((row) => {
    row.forEach((item, colIdx) => {
      const colX = margin + colIdx * colW;
      doc.setFillColor(217, 119, 6);
      doc.circle(colX + 3, y - 3, 2, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(39, 39, 42);
      const splitItem = doc.splitTextToSize(item, colW - 10);
      doc.text(splitItem, colX + 8, y);
    });
    y += 14;
  });
  y += 6;

  // 3. Professional Experience
  drawHeading('Professional Experience & Operational Execution');
  resume.professionalExperience.forEach((exp) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(24, 24, 27);
    doc.text(exp.roleTitle, margin, y);

    const meta = ` |  ${exp.organization} (${exp.location})  [${exp.dateRange}]`;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(113, 113, 122);
    doc.text(meta, margin + doc.getTextWidth(exp.roleTitle) + 4, y);
    y += 12;

    exp.bullets.forEach((b) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(39, 39, 42);
      doc.setFillColor(180, 83, 9);
      doc.circle(margin + 4, y - 2.5, 1.5, 'F');
      const splitB = doc.splitTextToSize(b, contentWidth - 16);
      doc.text(splitB, margin + 12, y);
      y += splitB.length * 11 + 3;
    });
    y += 4;
  });

  // 4. Certifications & Education
  drawHeading('Certifications & Georgia Career Pathways');
  const allCreds = [...resume.certificationsAndTraining, ...resume.educationAndHopeGrants];
  allCreds.forEach((c) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(39, 39, 42);
    doc.setFillColor(3, 105, 161);
    doc.circle(margin + 4, y - 2.5, 1.5, 'F');
    const splitC = doc.splitTextToSize(c, contentWidth - 16);
    doc.text(splitC, margin + 12, y);
    y += splitC.length * 11 + 2;
  });

  // PAGE 2: TARGETED COVER LETTER
  doc.addPage();
  let ly = 48;

  // Header
  doc.setFillColor(3, 105, 161); // sky-700
  doc.rect(margin, ly, contentWidth, 3, 'F');
  ly += 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(24, 24, 27);
  doc.text(candidate.fullName.toUpperCase(), margin, ly);
  ly += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(113, 113, 122);
  doc.text(`${candidate.cityStateZip}  |  ${candidate.phone}  |  ${candidate.email}`, margin, ly);
  ly += 16;

  doc.setDrawColor(228, 228, 231);
  doc.line(margin, ly, margin + contentWidth, ly);
  ly += 22;

  // Date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(63, 63, 70);
  doc.text(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), margin, ly);
  ly += 20;

  // Recipient
  doc.setFont('helvetica', 'bold');
  doc.text(coverLetter.hiringManagerOrDepartment, margin, ly);
  ly += 13;
  doc.setFont('helvetica', 'normal');
  doc.text(coverLetter.targetCompanyOrHospital, margin, ly);
  ly += 13;
  doc.setTextColor(113, 113, 122);
  doc.text(coverLetter.companyAddressOrCorridor, margin, ly);
  ly += 24;

  // Salutation
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(24, 24, 27);
  doc.text(`Dear ${coverLetter.hiringManagerOrDepartment},`, margin, ly);
  ly += 18;

  // 3 Paragraphs
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(39, 39, 42);

  const p1 = doc.splitTextToSize(coverLetter.openingParagraph, contentWidth);
  doc.text(p1, margin, ly);
  ly += p1.length * 13 + 16;

  const p2 = doc.splitTextToSize(coverLetter.bodyParagraph, contentWidth);
  doc.text(p2, margin, ly);
  ly += p2.length * 13 + 16;

  const p3 = doc.splitTextToSize(coverLetter.closingParagraph, contentWidth);
  doc.text(p3, margin, ly);
  ly += p3.length * 13 + 24;

  // Sign off
  doc.text(coverLetter.signOff, margin, ly);
  ly += 20;
  doc.setFont('helvetica', 'bold');
  doc.text(candidate.fullName, margin, ly);

  const cleanTitle = pkg.targetJobTitle.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Career_Package_${cleanTitle}.pdf`);
}
