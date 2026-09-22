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
import { FullApplicationPackage, LineProvenance } from '../types';
import {
  AI_DRAFT_TAG,
  MISSING_PLACEHOLDER_ORG,
  MISSING_PLACEHOLDER_DATES,
  MISSING_PLACEHOLDER_PHONE,
  MISSING_PLACEHOLDER_EMAIL,
  displayOrPlaceholder,
  needsReview,
} from './provenance';

export async function generateFullPackageDocx(pkg: FullApplicationPackage): Promise<void> {
  const candidate = pkg.candidate;
  const resume = pkg.resume;
  const coverLetter = pkg.coverLetter;

  const phone = displayOrPlaceholder(candidate.phone, MISSING_PLACEHOLDER_PHONE);
  const email = displayOrPlaceholder(candidate.email, MISSING_PLACEHOLDER_EMAIL);

  // Provenance tag appended to any line the user hasn't verified, so the
  // exported file never silently ships AI-drafted content as fact.
  const draftTagRun = (provenance: LineProvenance) =>
    new TextRun({
      text: ` [${provenance === 'missing' ? 'ADD INFO' : AI_DRAFT_TAG.toUpperCase()}]`,
      size: 16,
      italics: true,
      color: 'B45309',
      font: 'Arial',
    });

  const flaggedBulletRuns = (text: string, provenance: LineProvenance) => [
    new TextRun({ text, size: 18, color: '27272A', font: 'Arial' }),
    ...(needsReview({ text, provenance }) ? [draftTagRun(provenance)] : []),
  ];

  const createSectionHeading = (title: string) => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 80 },
      border: {
        bottom: {
          color: 'D97706',
          size: 10,
          style: BorderStyle.SINGLE,
          space: 4,
        },
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 20,
          color: '18181B',
          font: 'Arial',
        }),
      ],
    });
  };

  // 2x3 Competency Table
  const createCompetenciesTable = (grid: string[][]) => {
    const rows: TableRow[] = [];
    grid.forEach((rowItems) => {
      rows.push(
        new TableRow({
          children: rowItems.map((item) => {
            return new TableCell({
              width: { size: 33.33, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              children: [
                new Paragraph({
                  bullet: { level: 0 },
                  spacing: { before: 30, after: 30 },
                  children: [
                    new TextRun({
                      text: item,
                      size: 18,
                      color: '27272A',
                      font: 'Arial',
                    }),
                  ],
                }),
              ],
            });
          }),
        })
      );
    });

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows,
    });
  };

  const doc = new Document({
    sections: [
      // SECTION 1: PROFESSIONAL RESUME
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.5),
              right: convertInchesToTwip(0.5),
              bottom: convertInchesToTwip(0.5),
              left: convertInchesToTwip(0.5),
            },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 30 },
            children: [
              new TextRun({
                text: candidate.fullName.toUpperCase(),
                bold: true,
                size: 32,
                color: '18181B',
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 40 },
            children: [
              new TextRun({
                text: resume.targetTitle.toUpperCase(),
                bold: true,
                size: 22,
                color: 'B45309',
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 120 },
            border: {
              bottom: { color: 'E4E4E7', size: 6, style: BorderStyle.SINGLE, space: 6 },
            },
            children: [
              new TextRun({
                text: `${candidate.cityStateZip}   |   ${phone}   |   ${email}   |   ${candidate.linkedinOrPortfolio || 'References available upon request'}`,
                size: 17,
                color: '52525B',
                font: 'Arial',
              }),
            ],
          }),

          // Professional Summary
          createSectionHeading('Professional Summary'),
          new Paragraph({
            spacing: { before: 60, after: 100 },
            children: [
              new TextRun({
                text: resume.summary,
                size: 19,
                color: '3F3F46',
                font: 'Arial',
              }),
            ],
          }),

          // Core Competencies 2x3
          createSectionHeading('Core Operational & Technical Competencies'),
          createCompetenciesTable(resume.competenciesGrid),

          // Professional Experience
          createSectionHeading('Professional Experience & Operational Leadership'),
          ...resume.professionalExperience.flatMap((role) => {
            const orgKnown = role.organization.trim().length > 0;
            const datesKnown = role.dateRange.trim().length > 0;
            return [
              new Paragraph({
                spacing: { before: 100, after: 20 },
                children: [
                  new TextRun({
                    text: role.roleTitle,
                    bold: true,
                    size: 20,
                    color: '18181B',
                    font: 'Arial',
                  }),
                  new TextRun({
                    text: `   |   ${orgKnown ? role.organization : MISSING_PLACEHOLDER_ORG} (${role.location})`,
                    bold: true,
                    size: 19,
                    color: orgKnown ? '4B5563' : '9CA3AF',
                    italics: !orgKnown,
                    font: 'Arial',
                  }),
                  new TextRun({
                    text: `   [${datesKnown ? role.dateRange : MISSING_PLACEHOLDER_DATES}]`,
                    italics: true,
                    size: 18,
                    color: datesKnown ? 'B45309' : '9CA3AF',
                    font: 'Arial',
                  }),
                ],
              }),
              ...role.bullets.map((b) =>
                new Paragraph({
                  bullet: { level: 0 },
                  spacing: { before: 30, after: 30 },
                  children: flaggedBulletRuns(b.text, b.provenance),
                })
              ),
            ];
          }),

          // Certifications & Training
          createSectionHeading('Certifications, Safety & Professional Training'),
          ...(resume.certificationsAndTraining.length === 0
            ? [
                new Paragraph({
                  spacing: { before: 30, after: 30 },
                  children: [
                    new TextRun({
                      text: 'No certifications listed — add certifications you hold before sending.',
                      size: 18,
                      italics: true,
                      color: '9CA3AF',
                      font: 'Arial',
                    }),
                  ],
                }),
              ]
            : resume.certificationsAndTraining.map((cert) =>
                new Paragraph({
                  bullet: { level: 0 },
                  spacing: { before: 30, after: 30 },
                  children: flaggedBulletRuns(cert.text, cert.provenance),
                })
              )),

          // Education & Georgia HOPE Grants
          createSectionHeading('Education & Georgia HOPE Career Grant Pathways'),
          ...(resume.educationAndHopeGrants.length === 0
            ? [
                new Paragraph({
                  spacing: { before: 30, after: 30 },
                  children: [
                    new TextRun({
                      text: 'No education entries listed.',
                      size: 18,
                      italics: true,
                      color: '9CA3AF',
                      font: 'Arial',
                    }),
                  ],
                }),
              ]
            : resume.educationAndHopeGrants.map((edu) =>
                new Paragraph({
                  bullet: { level: 0 },
                  spacing: { before: 30, after: 30 },
                  children: flaggedBulletRuns(edu.text, edu.provenance),
                })
              )),
        ],
      },

      // SECTION 2: TARGETED COVER LETTER (Page Break)
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.7),
              right: convertInchesToTwip(0.7),
              bottom: convertInchesToTwip(0.7),
              left: convertInchesToTwip(0.7),
            },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 0, after: 30 },
            children: [
              new TextRun({
                text: candidate.fullName.toUpperCase(),
                bold: true,
                size: 26,
                color: '18181B',
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 0, after: 140 },
            border: {
              bottom: { color: 'E4E4E7', size: 6, style: BorderStyle.SINGLE, space: 6 },
            },
            children: [
              new TextRun({
                text: `${candidate.cityStateZip}   |   ${phone}   |   ${email}`,
                size: 17,
                color: '71717A',
                font: 'Arial',
              }),
            ],
          }),

          // Date
          new Paragraph({
            spacing: { before: 80, after: 80 },
            children: [
              new TextRun({
                text: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                size: 19,
                color: '3F3F46',
                font: 'Arial',
              }),
            ],
          }),

          // Recipient
          new Paragraph({
            spacing: { before: 0, after: 20 },
            children: [
              new TextRun({
                text: coverLetter.hiringManagerOrDepartment,
                bold: true,
                size: 19,
                color: '18181B',
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 0, after: 20 },
            children: [
              new TextRun({
                text: coverLetter.targetCompanyOrHospital,
                size: 19,
                color: '3F3F46',
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 0, after: 120 },
            children: [
              new TextRun({
                text: coverLetter.companyAddressOrCorridor,
                size: 19,
                color: '71717A',
                font: 'Arial',
              }),
            ],
          }),

          // Salutation
          new Paragraph({
            spacing: { before: 0, after: 80 },
            children: [
              new TextRun({
                text: `Dear ${coverLetter.hiringManagerOrDepartment},`,
                bold: true,
                size: 19,
                color: '18181B',
                font: 'Arial',
              }),
            ],
          }),

          // Paragraph 1: Opening
          new Paragraph({
            spacing: { before: 40, after: 100 },
            children: [
              new TextRun({
                text: coverLetter.openingParagraph,
                size: 20,
                color: '27272A',
                font: 'Arial',
              }),
            ],
          }),

          // Paragraph 2: Body (Operational Rigor)
          new Paragraph({
            spacing: { before: 40, after: 100 },
            children: [
              new TextRun({
                text: coverLetter.bodyParagraph,
                size: 20,
                color: '27272A',
                font: 'Arial',
              }),
            ],
          }),

          // Paragraph 3: Closing
          new Paragraph({
            spacing: { before: 40, after: 140 },
            children: [
              new TextRun({
                text: coverLetter.closingParagraph,
                size: 20,
                color: '27272A',
                font: 'Arial',
              }),
            ],
          }),

          // Sign-off
          new Paragraph({
            spacing: { before: 0, after: 40 },
            children: [
              new TextRun({
                text: coverLetter.signOff,
                size: 20,
                color: '27272A',
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 40, after: 0 },
            children: [
              new TextRun({
                text: candidate.fullName,
                bold: true,
                size: 20,
                color: '18181B',
                font: 'Arial',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanTitle = pkg.targetJobTitle.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `Career_Package_${cleanTitle}.docx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
