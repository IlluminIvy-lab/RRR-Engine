import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  BorderStyle, 
  AlignmentType,
  convertInchesToTwip
} from 'docx';
import { TranslationResult } from '../types';

export interface ResumeDocxOptions {
  candidateName?: string;
  phone?: string;
  email?: string;
  location?: string;
}

export async function generateResumeDocx(
  data: TranslationResult,
  options: ResumeDocxOptions = {}
): Promise<void> {
  const candidateName = options.candidateName?.trim() || 'PROFESSIONAL CANDIDATE';
  const location = options.location?.trim() || 'Georgia Logistics & Trade Corridor (Atlanta / Macon)';
  const phone = options.phone?.trim() || 'Direct Phone: Available upon interview';
  const email = options.email?.trim() || 'Email: Available upon direct contact';
  const contactLine = `${location}   |   ${phone}   |   ${email}`;

  // Helper for section headings
  const createSectionHeading = (title: string) => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 100 },
      border: {
        bottom: {
          color: 'D97706', // amber-600
          size: 12,
          style: BorderStyle.SINGLE,
          space: 4,
        },
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 22, // 11pt
          color: '18181B', // zinc-900
          font: 'Arial',
        }),
      ],
    });
  };

  // Competency table setup
  const createCompetencyTable = () => {
    const maxSkills = Math.max(data.competencies.hardSkills.length, data.competencies.softSkills.length);
    const rows: TableRow[] = [];

    // Header row
    rows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { fill: 'F4F4F5' },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.SINGLE, size: 6, color: 'D97706' },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                spacing: { before: 60, after: 60 },
                children: [
                  new TextRun({
                    text: 'TECHNICAL & HARD SKILLS',
                    bold: true,
                    size: 18,
                    color: 'B45309', // amber-700
                    font: 'Arial',
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { fill: 'F4F4F5' },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.SINGLE, size: 6, color: '0284C7' },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                spacing: { before: 60, after: 60 },
                children: [
                  new TextRun({
                    text: 'HIGH-AGENCY EXECUTION SKILLS',
                    bold: true,
                    size: 18,
                    color: '0369A1', // sky-700
                    font: 'Arial',
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );

    // Skill rows
    for (let i = 0; i < maxSkills; i++) {
      const hardSkill = data.competencies.hardSkills[i] || '';
      const softSkill = data.competencies.softSkills[i] || '';

      rows.push(
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              children: [
                new Paragraph({
                  bullet: { level: 0 },
                  spacing: { before: 40, after: 40 },
                  children: [
                    new TextRun({
                      text: hardSkill,
                      size: 19,
                      color: '27272A',
                      font: 'Arial',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              children: [
                new Paragraph({
                  bullet: { level: 0 },
                  spacing: { before: 40, after: 40 },
                  children: [
                    new TextRun({
                      text: softSkill,
                      size: 19,
                      color: '27272A',
                      font: 'Arial',
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
      );
    }

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows,
    });
  };

  // Build document sections
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.6),
              right: convertInchesToTwip(0.6),
              bottom: convertInchesToTwip(0.6),
              left: convertInchesToTwip(0.6),
            },
          },
        },
        children: [
          // Candidate Name
          new Paragraph({
            spacing: { before: 0, after: 40 },
            children: [
              new TextRun({
                text: candidateName.toUpperCase(),
                bold: true,
                size: 36, // 18pt
                color: '18181B',
                font: 'Arial',
              }),
            ],
          }),

          // Target Commercial Title
          new Paragraph({
            spacing: { before: 0, after: 60 },
            children: [
              new TextRun({
                text: data.commercialTitle.toUpperCase(),
                bold: true,
                size: 24, // 12pt
                color: 'B45309', // amber-700
                font: 'Arial',
              }),
            ],
          }),

          // Contact Details
          new Paragraph({
            spacing: { before: 0, after: 160 },
            border: {
              bottom: {
                color: 'E4E4E7',
                size: 6,
                style: BorderStyle.SINGLE,
                space: 6,
              },
            },
            children: [
              new TextRun({
                text: contactLine,
                size: 17, // 8.5pt
                color: '71717A',
                font: 'Arial',
              }),
            ],
          }),

          // 1. Professional Summary
          createSectionHeading('Commercial Capability Summary'),
          new Paragraph({
            spacing: { before: 80, after: 140 },
            children: [
              new TextRun({
                text: `High-discipline, outcome-driven operational specialist aligning rigorous institutional experience and facilities execution into commercial standards. Demonstrates proven capability in high-accountability environments with strict adherence to safety protocols, equipment reliability, team coordination, and rapid problem resolution across the Georgia logistics and infrastructure corridor.`,
                size: 19, // 9.5pt
                color: '3F3F46',
                font: 'Arial',
              }),
            ],
          }),

          // 2. Core Competencies Table
          createSectionHeading('Core Technical & Operational Competencies'),
          createCompetencyTable(),

          // 3. Quantified Achievements
          createSectionHeading('Quantified Professional Achievements & Operational Outcomes'),
          ...data.resumeBullets.map((bullet) => {
            return new Paragraph({
              bullet: { level: 0 },
              spacing: { before: 60, after: 60 },
              children: [
                new TextRun({
                  text: bullet,
                  size: 19, // 9.5pt
                  color: '27272A',
                  font: 'Arial',
                }),
              ],
            });
          }),

          // 4. Georgia Corridor Pathway
          createSectionHeading('Georgia Corridor Placement & Apprenticeship Alignment'),
          new Paragraph({
            spacing: { before: 80, after: 80 },
            children: [
              new TextRun({
                text: 'Target Placement Track: ',
                bold: true,
                size: 19,
                color: '18181B',
                font: 'Arial',
              }),
              new TextRun({
                text: data.gaPathway,
                size: 19,
                color: '3F3F46',
                font: 'Arial',
              }),
            ],
          }),

          // Footer note
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 240, after: 0 },
            children: [
              new TextRun({
                text: 'RRR Capability Engine & Reentry Decision System • Verified Commercial Resume Format',
                italics: true,
                size: 16, // 8pt
                color: 'A1A1AA',
                font: 'Arial',
              }),
            ],
          }),
        ],
      },
    ],
  });

  // Pack into blob and trigger download
  const blob = await Packer.toBlob(doc);
  const cleanTitle = data.commercialTitle.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `Commercial_Resume_${cleanTitle}.docx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
