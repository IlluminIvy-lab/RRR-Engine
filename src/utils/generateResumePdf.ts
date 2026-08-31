import { jsPDF } from 'jspdf';
import { TranslationResult } from '../types';

export interface ResumePdfOptions {
  candidateName?: string;
  phone?: string;
  email?: string;
  location?: string;
}

export function generateResumePdf(
  data: TranslationResult, 
  options: ResumePdfOptions = {}
): void {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 45;
  const contentWidth = pageWidth - (margin * 2);

  const candidateName = options.candidateName?.trim() || 'PROFESSIONAL CANDIDATE';
  const location = options.location?.trim() || 'Georgia Logistics & Trade Corridor (Atlanta / Macon)';
  const contactInfo = [
    location,
    options.phone ? options.phone : 'Direct Phone: Available upon interview',
    options.email ? options.email : 'Email: Available upon direct contact'
  ].join('  |  ');

  let y = 48;

  // 1. Header Accent Bar
  doc.setFillColor(217, 119, 6); // amber-600 #d97706
  doc.rect(margin, y, contentWidth, 3, 'F');
  y += 18;

  // 2. Candidate Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(24, 24, 27); // zinc-900
  doc.text(candidateName.toUpperCase(), margin, y);
  y += 18;

  // 3. Commercial Target Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(180, 83, 9); // amber-700
  doc.text(data.commercialTitle.toUpperCase(), margin, y);
  y += 14;

  // 4. Contact & Location Meta Line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(113, 113, 122); // zinc-500
  doc.text(contactInfo, margin, y);
  y += 18;

  // Divider Line
  doc.setDrawColor(228, 228, 231); // zinc-200
  doc.setLineWidth(0.75);
  doc.line(margin, y, margin + contentWidth, y);
  y += 18;

  // Helper to draw section title
  const drawSectionTitle = (title: string) => {
    // Check if near bottom
    if (y > pageHeight - 80) {
      doc.addPage();
      y = 48;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(24, 24, 27); // dark text
    doc.text(title.toUpperCase(), margin, y);

    // subtle underline
    doc.setDrawColor(217, 119, 6); // amber
    doc.setLineWidth(1.5);
    doc.line(margin, y + 4, margin + 40, y + 4);

    doc.setDrawColor(228, 228, 231);
    doc.setLineWidth(0.5);
    doc.line(margin + 40, y + 4, margin + contentWidth, y + 4);

    y += 16;
  };

  // Section A: Professional Summary
  drawSectionTitle('Commercial Capability Summary');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(63, 63, 70); // zinc-700
  const summaryText = `High-discipline, outcome-driven operational specialist aligning rigorous institutional experience and facilities execution into commercial standards. Demonstrates proven capability in high-accountability environments with strict adherence to safety protocols, equipment reliability, team coordination, and rapid problem resolution across the Georgia logistics and infrastructure corridor.`;
  const splitSummary = doc.splitTextToSize(summaryText, contentWidth);
  doc.text(splitSummary, margin, y);
  y += splitSummary.length * 13 + 12;

  // Section B: Core Competencies (2-Column Format)
  drawSectionTitle('Core Technical & Operational Competencies');
  
  const colWidth = (contentWidth - 20) / 2;
  const col1X = margin;
  const col2X = margin + colWidth + 20;

  // Subheaders
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(180, 83, 9); // amber-700
  doc.text('TECHNICAL & HARD SKILLS', col1X, y);
  doc.setTextColor(3, 105, 161); // sky-700
  doc.text('HIGH-AGENCY EXECUTION SKILLS', col2X, y);
  y += 12;

  const startCompY = y;
  let currentY1 = startCompY;
  let currentY2 = startCompY;

  // Column 1: Hard Skills
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(39, 39, 42);

  data.competencies.hardSkills.forEach((skill) => {
    doc.setFillColor(217, 119, 6);
    doc.circle(col1X + 4, currentY1 - 3, 2, 'F');
    const splitSkill = doc.splitTextToSize(skill, colWidth - 14);
    doc.text(splitSkill, col1X + 12, currentY1);
    currentY1 += splitSkill.length * 12 + 4;
  });

  // Column 2: Soft/Execution Skills
  data.competencies.softSkills.forEach((skill) => {
    doc.setFillColor(3, 105, 161);
    doc.circle(col2X + 4, currentY2 - 3, 2, 'F');
    const splitSkill = doc.splitTextToSize(skill, colWidth - 14);
    doc.text(splitSkill, col2X + 12, currentY2);
    currentY2 += splitSkill.length * 12 + 4;
  });

  y = Math.max(currentY1, currentY2) + 10;

  // Section C: Quantified Operational Achievements (Resume Bullets)
  drawSectionTitle('Quantified Professional Achievements & Operational Outcomes');

  data.resumeBullets.forEach((bullet, index) => {
    if (y > pageHeight - 70) {
      doc.addPage();
      y = 48;
    }

    // Number badge or clean bullet
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(180, 83, 9);
    doc.text(`[0${index + 1}]`, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(39, 39, 42); // zinc-800
    const splitBullet = doc.splitTextToSize(bullet, contentWidth - 30);
    doc.text(splitBullet, margin + 28, y);
    y += splitBullet.length * 13 + 8;
  });

  y += 6;

  // Section D: Georgia Corridor Placement & Career Pathway
  drawSectionTitle('Georgia Corridor Placement & Apprenticeship Alignment');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(63, 63, 70);
  const pathwayText = `Target Placement Track: ${data.gaPathway}`;
  const splitPathway = doc.splitTextToSize(pathwayText, contentWidth - 16);
  
  // Highlight box for pathway
  const boxHeight = splitPathway.length * 13 + 14;
  doc.setFillColor(244, 244, 245); // zinc-100
  doc.roundedRect(margin, y, contentWidth, boxHeight, 4, 4, 'F');
  doc.setDrawColor(212, 212, 216);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, boxHeight, 4, 4, 'D');

  doc.setTextColor(24, 24, 27);
  doc.text(splitPathway, margin + 8, y + 14);
  y += boxHeight + 14;

  // Footer on bottom of page
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(161, 161, 170); // zinc-400
  const footerText = 'RRR Capability Engine & Reentry Decision System • Verified Commercial Resume Format';
  doc.text(footerText, margin, pageHeight - 25);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth - margin - doc.getTextWidth(`Generated on ${new Date().toLocaleDateString()}`), pageHeight - 25);

  // Trigger download
  const cleanTitle = data.commercialTitle.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Commercial_Resume_${cleanTitle}.pdf`);
}
