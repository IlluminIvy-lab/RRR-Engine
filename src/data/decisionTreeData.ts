import { DecisionNode } from '../types';

export const DECISION_TREE_NODES: Record<string, DecisionNode> = {
  'node-1-id': {
    id: 'node-1-id',
    phase: 'Day 1-3',
    domain: 'IDs & Vital Records',
    contextBanner: 'Day 1-3 Critical Priority: State Identification & Legal Identity Establishment',
    question: 'What is your current government identification and vital records status?',
    options: [
      {
        key: 'A',
        label: 'I possess both a certified Birth Certificate and Social Security Card on hand.',
        actionGuidance: 'Proceed immediately to Georgia Department of Driver Services (DDS) to issue or renew your Georgia REAL ID Driver’s License or State ID Card.',
        gaSpecificResource: 'Georgia DDS Customer Service Center (Fulton: 400 Whitehall St SW, Atlanta | Bibb: 200 Cherry St / 1056 Center St, Macon). Fee: $32 (or waived with DOC voucher).',
        nextNodeId: 'node-2-transit',
        targetPhase: 'Day 1-3'
      },
      {
        key: 'B',
        label: 'I only possess a Georgia Department of Corrections (GDC) release document or ID voucher.',
        actionGuidance: 'Present your GDC Release Certificate and Reentry ID Waiver at a participating Georgia DDS center to receive an expedited, fee-waived Georgia State Identification Card.',
        gaSpecificResource: 'Georgia DDS Reentry Services Unit. Carry your official GDC discharge certificate with embossed seal and residential verification letter.',
        nextNodeId: 'node-2-transit',
        targetPhase: 'Day 1-3'
      },
      {
        key: 'C',
        label: 'I have zero identification documents (missing both Birth Certificate and SSN Card).',
        actionGuidance: 'Execute emergency Vital Records protocol: Submit expedited GA Form 3918 for birth certificate (online via ROVER/VitalChek, or in-person at County Health Departments as State Office walk-in is suspended), followed by in-person SSA replacement request.',
        gaSpecificResource: 'Order online (dph.georgia.gov) or walk-in at Fulton County Board of Health (10 Park Pl S) / Bibb County Health Dept (171 Emery Hwy, Macon). SSA Office: 61 Forsyth St SW, Atlanta.',
        nextNodeId: 'node-2-transit',
        targetPhase: 'Day 1-3'
      }
    ]
  },
  'node-2-transit': {
    id: 'node-2-transit',
    phase: 'Day 1-3',
    domain: 'Transit & Mobility',
    contextBanner: 'Day 1-3 Critical Priority: Corridor Transit & Appointment Mobility',
    question: 'What is your immediate transportation status for reporting, medical, and DDS appointments?',
    options: [
      {
        key: 'A',
        label: 'I have zero transit funds and need immediate transit cards in Atlanta Metro (MARTA).',
        actionGuidance: 'Obtain an emergency 30-day MARTA Breeze Card voucher through designated reentry transit intake programs without out-of-pocket costs.',
        gaSpecificResource: 'HOPE Atlanta (458 Ponce De Leon Ave NE, Atlanta) or Gateway Center (275 Pryor St SW) Emergency Transportation Voucher Desk.',
        nextNodeId: 'node-3-housing',
        targetPhase: 'Day 1-3'
      },
      {
        key: 'B',
        label: 'I am located in Macon / Central Georgia and need municipal transit or regional shuttle.',
        actionGuidance: 'Enroll in the Macon-Bibb Transit Authority (MTA) Reentry Mobility Pass and schedule regional vanpools connecting to industrial employment hubs.',
        gaSpecificResource: 'MTA Transfer Station (200 Cherry St, Macon, GA - (478) 803-2500) & Goodwill Central Georgia Career Center Transportation Subsidy (5171 Eisenhower Pkwy, Macon).',
        nextNodeId: 'node-3-housing',
        targetPhase: 'Day 1-3'
      },
      {
        key: 'C',
        label: 'I have reliable personal rides/family transit but need a 30-day corridor navigation plan.',
        actionGuidance: 'Program primary transit routes along the I-75 / I-85 / I-20 spine, register a backup digital Breeze account, and map paratransit options.',
        gaSpecificResource: 'MARTA On the Go App & Georgia Commute Options (GCO) regional carpool/vanpool transit incentives.',
        nextNodeId: 'node-3-housing',
        targetPhase: 'Day 1-3'
      }
    ]
  },
  'node-3-housing': {
    id: 'node-3-housing',
    phase: 'Day 1-3',
    domain: 'Transitional Housing',
    contextBanner: 'Day 1-3 Critical Priority: Night-1 Shelter Security & Structured Living',
    question: 'What is your current overnight housing stability and safe shelter status?',
    options: [
      {
        key: 'A',
        label: 'I have confirmed stable housing with family or an approved residence for 30+ days.',
        actionGuidance: 'Register your residential address with your supervising officer (if applicable) and advance immediately to Phase 2 (Day 3-10: Banking & Mobile Communications).',
        gaSpecificResource: 'Georgia Department of Community Supervision (DCS) Field Office locator and address verification protocols.',
        nextNodeId: 'node-4-banking',
        targetPhase: 'Day 3-10'
      },
      {
        key: 'B',
        label: 'I need immediate transitional housing or structured reentry bed in Atlanta Metro.',
        actionGuidance: 'Execute emergency intake at accredited transitional housing facilities providing case management, curfew compliance, and employment staging.',
        gaSpecificResource: 'City of Refuge Reentry Housing (1300 Joseph E Boone Blvd NW, Atlanta) | Gateway Center Reentry Division (275 Pryor St SW) | Atlanta Mission (The Potter\'s House).',
        nextNodeId: 'node-4-banking',
        targetPhase: 'Day 3-10'
      },
      {
        key: 'C',
        label: 'I need transitional housing or emergency lodging in Macon / Central Georgia.',
        actionGuidance: 'Complete same-day intake with licensed Central Georgia reentry residences equipped with workforce development partnerships.',
        gaSpecificResource: 'Macon Rescue Mission (661 Broadway, Macon, GA) | Daybreak Resource Center (174 Walnut St, Macon) | Salvation Army Central GA Reentry Housing.',
        nextNodeId: 'node-4-banking',
        targetPhase: 'Day 3-10'
      }
    ]
  },
  'node-4-banking': {
    id: 'node-4-banking',
    phase: 'Day 3-10',
    domain: 'Banking & Financial Setup',
    contextBanner: 'Day 3-10 Stabilization: Second-Chance Banking & Payroll Direct Deposit',
    question: 'What is your current banking and direct-deposit readiness to receive payroll without predatory check-cashing fees?',
    options: [
      {
        key: 'A',
        label: 'I have an active, unrestricted checking account with debit card and routing number.',
        actionGuidance: 'Secure a printed direct deposit authorization slip with routing/account numbers to present during Day 1 onboarding at trade and commercial employers.',
        gaSpecificResource: 'Verify FDIC insurance status and establish an emergency savings sub-account with auto-transfer safeguards.',
        nextNodeId: 'node-5-comms',
        targetPhase: 'Day 3-10'
      },
      {
        key: 'B',
        label: 'I have past ChexSystems / negative banking history preventing standard account opening.',
        actionGuidance: 'Open a verified Georgia Second-Chance checking account with $0 overdraft fees, standard routing/account numbers, and no ChexSystems disqualification.',
        gaSpecificResource: 'Peach State Federal Credit Union (Fresh Start Checking) | Wells Fargo (Clear Access Banking) | Credit Union of Georgia (Opportunity Checking).',
        nextNodeId: 'node-5-comms',
        targetPhase: 'Day 3-10'
      },
      {
        key: 'C',
        label: 'I have no bank account and currently rely strictly on cash or paper check-cashing.',
        actionGuidance: 'Open a modern FDIC-insured mobile account or Community Development Financial Institution (CDFI) account immediately to prevent predatory 3-5% check-cashing losses.',
        gaSpecificResource: 'Robins Financial Credit Union (Central GA branches) | Georgia United Credit Union | Chime / Varo mobile direct deposit with free nationwide Allpoint ATMs.',
        nextNodeId: 'node-5-comms',
        targetPhase: 'Day 3-10'
      }
    ]
  },
  'node-5-comms': {
    id: 'node-5-comms',
    phase: 'Day 3-10',
    domain: 'Banking & Financial Setup',
    contextBanner: 'Day 3-10 Stabilization: Reliable Cellular Link & Digital Job Readiness',
    question: 'What is your mobile phone and data access status for employer callbacks and dispatch?',
    options: [
      {
        key: 'A',
        label: 'I have a reliable smartphone with active cellular data, calling, and professional voicemail.',
        actionGuidance: 'Configure a clean, professional voicemail greeting and link your email to prepare for rapid interview scheduling and trade dispatch calls.',
        gaSpecificResource: 'Ensure voicemail does not contain background music or informal greetings; keep storage clear for employer messages.',
        nextNodeId: 'node-6-pathway',
        targetPhase: 'Day 10-30'
      },
      {
        key: 'B',
        label: 'I qualify for government assistance and need a free smartphone with unlimited data/talk.',
        actionGuidance: 'Enroll in the Georgia Lifeline Assistance Program / Affordable Connectivity Program (ACP) with same-day SIM card or smartphone delivery.',
        gaSpecificResource: 'Q Link Wireless / Assurance Wireless distribution desks located at Fulton County DFCS (5710 Stonewall Tell Rd) and Bibb County DFCS (456 Oglethorpe St, Macon).',
        nextNodeId: 'node-6-pathway',
        targetPhase: 'Day 10-30'
      },
      {
        key: 'C',
        label: 'I have no hardware and need computer/internet workstation access for applications.',
        actionGuidance: 'Access free public high-speed career workstations, resume printing, and digital job application terminals across the Georgia corridor.',
        gaSpecificResource: 'WorkSource Georgia Career Centers (Atlanta: 818 Pollard Blvd SW | Macon: 3090 Mercer University Dr) & Atlanta-Fulton Public Library System.',
        nextNodeId: 'node-6-pathway',
        targetPhase: 'Day 10-30'
      }
    ]
  },
  'node-6-pathway': {
    id: 'node-6-pathway',
    phase: 'Day 10-30',
    domain: 'GA Trade Pathways',
    contextBanner: 'Day 10-30 Execution: Fast-Track Trade Apprenticeships & Direct Commercial Hiring',
    question: 'Which primary trade or commercial corridor pathway matches your high-agency career trajectory?',
    options: [
      {
        key: 'A',
        label: 'Skilled Trades: Commercial Electrical, Welding, HVAC, or Structural Fabrication (Union / TCSG).',
        actionGuidance: 'Enroll in tuition-free HOPE Career Grant certification at Technical College System of Georgia (TCSG) or apply to union apprenticeships with paid day-one training.',
        gaSpecificResource: 'IBEW Local 613 Electrical Training Center (Atlanta) | Central Georgia Technical College Welding/HVAC (Macon Campus - Tuition 100% covered by HOPE Career Grant).',
        nextNodeId: 'node-7-complete',
        targetPhase: 'Day 10-30'
      },
      {
        key: 'B',
        label: 'Logistics & Heavy Transport: Commercial Driver’s License (CDL-A) or MARTA Fleet Technician.',
        actionGuidance: 'Apply for full WIOA grant funding ($4,500 - $6,000 value, $0 out-of-pocket) for 4-week CDL-A school or MARTA Transit Vehicle Apprentice Program.',
        gaSpecificResource: 'WorkSource Atlanta / WorkSource Middle Georgia WIOA Grant Desk & MARTA Heavy Vehicle Apprenticeship (Piedmont Rd HQ, Atlanta).',
        nextNodeId: 'node-7-complete',
        targetPhase: 'Day 10-30'
      },
      {
        key: 'C',
        label: 'Immediate W-2 Commercial Placement: High-Volume Production, Facilities, or Culinary Leadership.',
        actionGuidance: 'Begin immediate same-week paid W-2 commercial employment with fair-chance employers in manufacturing, logistics hubs, or commercial food service.',
        gaSpecificResource: 'First Step Staffing (Atlanta: 236 Auburn Ave NE - Daily transportation to job sites provided) | Goodwill Career Centers Macon & Atlanta | Georgia Quick Start Training.',
        nextNodeId: 'node-7-complete',
        targetPhase: 'Day 10-30'
      }
    ]
  },
  'node-7-complete': {
    id: 'node-7-complete',
    phase: 'Day 10-30',
    domain: 'GA Trade Pathways',
    contextBanner: 'Milestone Achieved: 30-Day Reentry Blueprint Operational',
    question: 'Your 30-day structured roadmap is complete. How would you like to proceed?',
    options: [
      {
        key: 'A',
        label: 'Run MODE 1: Translate my institutional work history and duties into commercial resume bullets.',
        actionGuidance: 'Switch to Capability Translator to convert your facility duties, shop experience, or trade work into industry-standard job titles and Georgia career pathways.',
        gaSpecificResource: 'RRR Capability Translator Engine (Mode 1).',
        nextNodeId: 'node-1-id',
        targetPhase: 'Day 10-30'
      },
      {
        key: 'B',
        label: 'Export my customized 30-day action dossier and Georgia resource directory as a structured checklist.',
        actionGuidance: 'Download or copy your complete sequential decision records with addresses, contact details, and next milestones.',
        gaSpecificResource: 'RRR Reentry Action Dossier Generator.',
        nextNodeId: null,
        targetPhase: 'Day 10-30'
      },
      {
        key: 'C',
        label: 'Continue to Day 90: check employment retention and start building credit.',
        actionGuidance: 'Your first 30 days are about landing a foothold. Day 90 is about proving you can hold it and starting to build a financial track record while you do.',
        gaSpecificResource: 'RRR Reentry Decision Tree Engine \u2014 Phase 4: Day 90.',
        nextNodeId: 'node-8-day90',
        targetPhase: 'Day 90'
      }
    ]
  },
  'node-8-day90': {
    id: 'node-8-day90',
    phase: 'Day 90',
    domain: 'Employment Retention & Advancement',
    contextBanner: 'Day 90 Check-In: Employment Retention & Credit Building',
    question: 'Ninety days in, what best describes where you are with your job and your finances?',
    options: [
      {
        key: 'A',
        label: 'I\u2019m still employed at my Day 10-30 placement and want to know what comes next.',
        actionGuidance: 'Ask your supervisor directly about a 90-day performance review and what raise, shift, or promotion path exists. Most fair-chance and W-2 placement employers formalize advancement at this mark \u2014 don\u2019t wait to be offered it, ask for it by name.',
        gaSpecificResource: 'WorkSource Georgia / WorkSource Atlanta career centers can help you request a formal skills assessment or wage-progression conversation if your employer doesn\u2019t initiate one.',
        nextNodeId: 'node-9-month6',
        targetPhase: 'Month 6'
      },
      {
        key: 'B',
        label: 'My job situation changed (laid off, quit, or hours cut) and I need to re-enter the job search.',
        actionGuidance: 'Go back through the Capability Translator with your new experience added \u2014 90 days of verified recent work history is a real credential you didn\u2019t have on Day 1. Use it.',
        gaSpecificResource: 'WorkSource Georgia / WorkSource Atlanta (818 Pollard Blvd SW, Atlanta | Middle GA: 3090 Mercer Univ Dr, Macon) for re-placement and WIOA-funded upskilling.',
        nextNodeId: 'node-9-month6',
        targetPhase: 'Month 6'
      },
      {
        key: 'C',
        label: 'I\u2019m employed and stable enough to start building credit or savings for the first time.',
        actionGuidance: 'Open or check in on your second-chance checking account, ask specifically about a credit-builder loan or secured card, and set up even a small automatic transfer into savings \u2014 consistency matters more than amount this early.',
        gaSpecificResource: 'Peach State Federal Credit Union (Fresh Start Checking, graduates to standard checking after 12 months) or Robins Financial Credit Union (Central GA) for credit-building products.',
        nextNodeId: 'node-9-month6',
        targetPhase: 'Month 6'
      }
    ]
  },
  'node-9-month6': {
    id: 'node-9-month6',
    phase: 'Month 6',
    domain: 'Long-Term Financial Stability',
    contextBanner: 'Month 6 Milestone: Stability Review & Long-Term Planning',
    question: 'At six months, what\u2019s the honest state of your stability \u2014 housing, income, and any supervision requirements?',
    options: [
      {
        key: 'A',
        label: 'Stable on all fronts \u2014 I want to plan my next real step up (credential, trade upgrade, or new role).',
        actionGuidance: 'This is the point to stack a credential on top of your work history instead of starting over \u2014 a HOPE Career Grant certificate or union apprenticeship carries more weight now that you have six months of verified performance behind it.',
        gaSpecificResource: 'Technical College System of Georgia (TCSG) HOPE Career Grant or IBEW Local 613 apprenticeship intake for the next credential tier.',
        nextNodeId: null,
        targetPhase: 'Month 6'
      },
      {
        key: 'B',
        label: 'Housing or income is still shaky and I need to re-stabilize before moving forward.',
        actionGuidance: 'Re-stabilizing at Month 6 is not a failure of the plan \u2014 go back through the Day 1-3 housing and Day 3-10 banking checkpoints with your current, updated information rather than starting completely from scratch.',
        gaSpecificResource: 'Gateway Center (275 Pryor St SW, Atlanta) or Daybreak Resource Center (174 Walnut St, Macon) for a re-stabilization intake.',
        nextNodeId: 'node-3-housing',
        targetPhase: 'Day 1-3'
      },
      {
        key: 'C',
        label: 'Export my complete 6-month journey as a full record, or start a fresh plan from Day 1-3.',
        actionGuidance: 'Download or copy your complete sequential decision record with every milestone, address, and resource from Day 1 through Month 6.',
        gaSpecificResource: 'RRR Reentry Action Dossier Generator.',
        nextNodeId: 'node-1-id',
        targetPhase: 'Day 1-3'
      }
    ]
  }
};
