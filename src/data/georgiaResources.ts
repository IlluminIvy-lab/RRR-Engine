import { GeorgiaResourceItem } from '../types';

export const SAMPLE_INSTITUTIONAL_EXPERIENCES = [
  {
    title: 'Food Service Lead / Head Cook',
    badge: 'Culinary & Production',
    text: 'Served as head culinary lead in high-volume institutional kitchen. Managed prep and meal production for 1,200 individuals daily. Supervised 15 crew members on sanitary procedures, temperature monitoring, portion control, knife safety, and daily line clean-down. Handled raw inventory requisition, FIFO rotation, and walk-in freezer management with zero health violations across 3 years.'
  },
  {
    title: 'Facilities Maintenance & HVAC Specialist',
    badge: 'Trades & Facilities',
    text: 'Maintained and repaired commercial plumbing, HVAC air handlers, pneumatic door actuators, and low-voltage lighting systems across a 150,000 sq ft compound. Conducted preventative diagnostics on water boilers, replaced centrifugal pump seals, repaired drywall and commercial doors, and logged daily work orders adhering strictly to Lockout/Tagout (LOTO) safety compliance.'
  },
  {
    title: 'Heavy Fleet & Diesel Mechanic',
    badge: 'Automotive & Diesel',
    text: 'Performed engine diagnostics, transmission servicing, hydraulic line replacement, and brake overhauls on heavy diesel tractors, utility trucks, and emergency generators. Operated diagnostic scan tools, conducted compression tests, performed preventative oil and filter services on 40+ fleet vehicles, and fabricated custom mounting brackets.'
  },
  {
    title: 'Law Library Coordinator & Records Clerk',
    badge: 'Admin & Compliance',
    text: 'Managed institutional law library operations and records retention. Assisted over 200 individuals with legal research using LexisNexis, organized court docketing files, typed legal briefs and administrative appeals with 70 WPM accuracy, maintained confidentiality protocols, and conducted monthly audits of physical catalog inventory with 100% accuracy.'
  },
  {
    title: 'Structural Welder & Metal Fabricator',
    badge: 'Manufacturing & Metals',
    text: 'Operated MIG and Stick (SMAW/GMAW) welding equipment to fabricate heavy security gates, industrial steel framing, and utility trailers. Interpreted technical blueprints and orthographic schematics, cut steel plate with plasma torches, deburred and beveled edges with pneumatic grinders, maintaining 1/16 inch tolerances and passing all visual bend tests.'
  },
  {
    title: 'Central Warehouse & Supply Logistics Specialist',
    badge: 'Logistics & Supply Chain',
    text: 'Coordinated intake, palletizing, inventory audits, and distribution of food goods, uniforms, and maintenance parts. Operated pallet jacks and forklift equipment safely in tight staging areas. Maintained rigorous barcode inventory ledgers, inspected incoming freight manifests for discrepancies, and prevented shrinkage.'
  }
];

export const GEORGIA_CORRIDOR_RESOURCES: GeorgiaResourceItem[] = [
  // Vital Records & DDS
  {
    name: 'Georgia Department of Driver Services (Atlanta - Whitehall St)',
    category: 'Vital Records & DDS',
    corridor: 'Atlanta Metro',
    address: '400 Whitehall St SW, Atlanta, GA 30303',
    contact: '(678) 413-8400',
    notes: 'Primary downtown Atlanta DDS center with dedicated Reentry State ID issuance and DOC fee-waiver processing.',
    badge: 'Official State ID',
    cost: '$32 fee (waived with GDC/DOC voucher)',
    referralRequirements: 'GDC release paperwork or DOC fee-waiver voucher for expedited/free processing'
  },
  {
    name: 'Georgia DDS Customer Service Center (Macon)',
    category: 'Vital Records & DDS',
    corridor: 'Macon / Central GA',
    address: '200 Cherry St, Macon, GA 31201 (Terminal Station)',
    contact: '(678) 413-8400',
    notes: 'Central Georgia DDS service center located in historic Terminal Station. Accepts GDC release paperwork and fee vouchers for rapid ID issuance.',
    badge: 'Official State ID',
    cost: '$32 fee (waived with GDC release paperwork/fee voucher)',
    referralRequirements: 'GDC release paperwork accepted for fee waiver'
  },
  {
    name: 'Georgia State Office of Vital Records',
    category: 'Vital Records & DDS',
    corridor: 'Atlanta Metro',
    address: '1680 Phoenix Blvd, Suite 100, Atlanta, GA 30349',
    contact: '(404) 679-4702',
    notes: 'Walk-in lobby service at this state facility is currently suspended until further notice. Order online via ROVER/VitalChek, apply by mail, or visit local county health department vital records offices (e.g. Fulton, DeKalb, Clayton, Bibb) for in-person same-day birth certificates.',
    badge: 'Vital Records (Online/County)',
    transportationAccess: 'Walk-in lobby currently suspended — use online (ROVER/VitalChek), mail, or a county health department office instead',
    referralRequirements: 'None for online/mail order; county health department walk-in is the in-person alternative'
  },
  // Transit
  {
    name: 'MARTA Mobility & Customer Service Center',
    category: 'Transit & Mobility',
    corridor: 'Atlanta Metro',
    address: '2424 Piedmont Rd NE, Atlanta, GA 30324 (HQ / Reduced Fare Office)',
    contact: '(404) 848-5000',
    notes: 'Comprehensive rail and bus transit spanning Fulton, DeKalb, and Clayton. Reduced Fare Breeze card office and transit pass distribution; note that Five Points station offices are modified during the Five Points Transformation project.',
    badge: 'Transit Mobility',
    cost: 'Reduced Fare Breeze card program available at this office'
  },
  {
    name: 'Macon-Bibb Transit Authority (MTA Terminal Station)',
    category: 'Transit & Mobility',
    corridor: 'Macon / Central GA',
    address: '200 Cherry St, Macon, GA 31201',
    contact: '(478) 803-2500',
    notes: 'Central Georgia transfer terminal connecting Macon industrial parks, Ocmulgee corridors, Robins logistics hubs, and Mercer employment centers.',
    badge: 'Macon Transit'
  },
  // Housing & Support
  {
    name: 'Gateway Center (Reentry Services Division)',
    category: 'Housing & Support',
    corridor: 'Atlanta Metro',
    address: '275 Pryor St SW, Atlanta, GA 30303',
    contact: '(404) 215-6600',
    notes: '24/7 intake, residential beds, lockers, mail services, case management, and transit vouchers.',
    badge: 'Rapid Intake',
    hoursOfOperation: '24/7 intake',
    cost: 'Free'
  },
  {
    name: 'City of Refuge (Workforce & Housing Campus)',
    category: 'Housing & Support',
    corridor: 'Atlanta Metro',
    address: '1300 Joseph E Boone Blvd NW, Atlanta, GA 30314',
    contact: '(404) 874-2241',
    notes: 'Comprehensive campus with transitional housing, workforce innovation academy, culinary school, and auto repair trade training.',
    badge: 'Workforce Campus',
    cost: 'Free (workforce/housing campus)'
  },
  {
    name: 'Daybreak Resource Center (Macon)',
    category: 'Housing & Support',
    corridor: 'Macon / Central GA',
    address: '174 Walnut St, Macon, GA 31201',
    contact: '(478) 216-9119',
    notes: 'Daytime shelter, hygiene facilities, mail drop, telehealth clinic, and legal ID assistance.',
    badge: 'Central GA Daybreak',
    hoursOfOperation: 'Daytime hours (daytime shelter, not overnight)',
    cost: 'Free'
  },
  // Banking
  {
    name: 'Peach State Federal Credit Union (Fresh Start Checking)',
    category: 'Second Chance Banking',
    corridor: 'Atlanta Metro',
    address: 'Metro Atlanta Branches (2357 Benjamin E Mays Dr SW, Atlanta | 1342 Glenwood Ave SE, Atlanta)',
    contact: '(855) 889-4328',
    notes: 'Verified Fresh Start second-chance checking account with Visa debit card, online/mobile banking, and opportunity to graduate to standard checking after 12 months in good standing.',
    badge: 'Fresh Start Checking',
    eligibility: 'Designed for those needing a second-chance account; can graduate to standard checking after 12 months in good standing'
  },
  {
    name: 'Robins Financial Credit Union (Central Georgia)',
    category: 'Second Chance Banking',
    corridor: 'Macon / Central GA',
    address: '5999 Zebulon Rd, Macon, GA 31210 / 515 Mulberry St, Macon, GA 31201',
    contact: '(478) 923-3773',
    notes: 'Community-first credit union offering low-barrier checking, direct deposit, and credit building loans across Macon-Bibb and Warner Robins.',
    badge: 'Central GA Credit Union',
    eligibility: 'Low-barrier account opening'
  },
  // Trades & Apprenticeships
  {
    name: 'IBEW Local 613 (Union Hall / Apprenticeship Intake)',
    category: 'Apprenticeships & Trades',
    corridor: 'Atlanta Metro',
    address: '501 Pulliam St SW #250, Atlanta, GA 30312 (Intake Office)',
    contact: '(404) 523-8107',
    notes: 'Union headquarters & intake office routing candidates to the Atlanta Electrical Training Center (AEJATC) in Norcross (6601 Bay Circle). 4-5 year paid commercial electrical apprenticeship with $18–$55+/hr wage progression and 100% employer-funded healthcare.',
    badge: 'Union Apprenticeship',
    cost: 'Paid apprenticeship ($18–$55+/hr wage progression), 100% employer-funded healthcare'
  },
  {
    name: 'Technical College System of Georgia (TCSG) - HOPE Career Grant',
    category: 'Apprenticeships & Trades',
    corridor: 'Statewide GA',
    address: 'System Office: 1800 Century Place NE, Atlanta, GA 30345 (Campuses: Atlanta Tech, Central GA Tech, Chattahoochee Tech)',
    contact: '(404) 679-1600',
    notes: '100% tuition-free programs for Welding, Commercial Truck Driving (CDL), Diesel Tech, Electrical, Precision Machining, and HVAC.',
    badge: '100% Free Tuition',
    cost: 'Free — 100% tuition covered'
  },
  {
    name: 'First Step Staffing (Atlanta Corridor)',
    category: 'Apprenticeships & Trades',
    corridor: 'Atlanta Metro',
    address: '236 Auburn Ave NE #203, Atlanta, GA 30303',
    contact: '(404) 577-3395',
    notes: 'Fast-track W-2 commercial employment with daily provided transit van transportation to warehouse/manufacturing sites.',
    badge: 'Same-Week W-2',
    transportationAccess: 'Daily provided transit van to warehouse/manufacturing job sites',
    cost: 'Free (fast-track W-2 employment placement)'
  },
  {
    name: 'WorkSource Georgia / WorkSource Atlanta',
    category: 'Apprenticeships & Trades',
    corridor: 'Statewide GA',
    address: '818 Pollard Blvd SW, Atlanta, GA 30315 | Middle GA: 3090 Mercer Univ Dr / 175 Emery Hwy, Macon',
    contact: '(404) 546-3000',
    notes: 'Federal WIOA training grants ($5,000-$8,000) covering 100% of CDL, forklift certification, and skilled industrial trade training.',
    badge: 'WIOA Grants',
    cost: 'Free — covered by WIOA training grants ($5,000–$8,000)'
  },
  // Legal Aid
  {
    name: 'Georgia Justice Project',
    category: 'Legal Aid',
    corridor: 'Atlanta Metro',
    address: '438 Edgewood Ave SE, Atlanta, GA 30312',
    contact: '(404) 827-0027',
    notes: 'Free criminal legal defense and reentry services for Georgians who cannot afford an attorney. Runs a record-clearing screener and record restriction (Georgia’s term for expungement) work.',
    badge: 'Free Legal Defense',
    dateLastVerified: '2026-10-13'
  },
  {
    name: 'Atlanta Legal Aid Society',
    category: 'Legal Aid',
    corridor: 'Atlanta Metro',
    address: '54 Ellis St NE, Atlanta, GA 30303',
    contact: '(404) 524-5811',
    notes: 'Free civil legal services for low-income metro Atlantans — housing, family, consumer, health, employment, and benefits cases. Serving since 1924.',
    badge: 'Free Civil Legal Aid',
    dateLastVerified: '2026-10-13'
  },
  {
    name: 'Georgia Legal Services Program (Macon)',
    category: 'Legal Aid',
    corridor: 'Macon / Central GA',
    address: '241 Third Street, Suite 230, Macon, GA 31201',
    contact: '(478) 751-6261',
    notes: 'Free civil legal services for low-income people across the 154 Georgia counties outside metro Atlanta.',
    badge: 'Free Civil Legal Aid',
    dateLastVerified: '2026-10-13'
  },
  // Employment & Job Placement
  {
    name: 'Goodwill of North Georgia — Career Centers',
    category: 'Employment & Job Placement',
    corridor: 'Atlanta Metro',
    address: '2201 Lawrenceville Hwy, Suite 300, Decatur, GA 30033',
    contact: '(404) 420-9900',
    notes: 'Free career centers: job listings, resume help, coaching, and training certifications, plus dedicated second-chance work — 31,000+ returning citizens served, 15,000+ placed over the past decade.',
    badge: 'Second-Chance Careers',
    dateLastVerified: '2026-10-13'
  },
  {
    name: 'Georgia Vocational Rehabilitation Agency (GVRA)',
    category: 'Employment & Job Placement',
    corridor: 'Statewide GA',
    address: '200 Piedmont Ave SE, West Tower, Suite 1410, Atlanta, GA 30334',
    contact: '(844) 367-4872',
    notes: 'State agency helping Georgians with disabilities achieve employment and independence — free employment services, training, and employer matching.',
    badge: 'State Employment Services',
    dateLastVerified: '2026-10-13'
  },
  {
    name: 'Walking the Last Mile to Reentry (GA Dept. of Labor)',
    category: 'Employment & Job Placement',
    corridor: 'Atlanta Metro',
    address: '148 Andrew Young Int’l Blvd NE, Suite 700, Atlanta, GA 30303',
    contact: '(404) 232-7305',
    notes: 'State reentry-to-work program: skills assessments, resume building, mock interviews, job placement, and employer connections for justice-involved people. Serves Fulton, Gwinnett, and DeKalb counties.',
    badge: 'Reentry Job Placement',
    dateLastVerified: '2026-10-13'
  },
  {
    name: 'Center for Employment Opportunities (CEO) — Atlanta',
    category: 'Employment & Job Placement',
    corridor: 'Atlanta Metro',
    address: '938 Peachtree St NE, Atlanta, GA 30309',
    contact: '(404) 689-6579',
    notes: 'Immediate paid transitional employment, job coaching, and full-time placement for people with recent convictions.',
    badge: 'Paid Transitional Work',
    dateLastVerified: '2026-10-13'
  },
  // Healthcare
  {
    name: 'Grady Health System',
    category: 'Healthcare',
    corridor: 'Atlanta Metro',
    address: '80 Jesse Hill Jr Dr SE, Atlanta, GA 30303',
    contact: '(404) 616-1000',
    notes: 'Atlanta’s largest safety-net hospital and Level I trauma center. Serves uninsured and underinsured patients on a sliding-scale basis.',
    badge: 'Safety-Net Hospital',
    dateLastVerified: '2026-10-13'
  },
  {
    name: 'Mercy Care Atlanta',
    category: 'Healthcare',
    corridor: 'Atlanta Metro',
    address: '424 Decatur St SE, Atlanta, GA 30312',
    contact: '(678) 843-8600',
    notes: 'Federally qualified health center: primary, dental, vision, mental health, and specialty care. Sliding-scale fees; no one turned away for inability to pay.',
    badge: 'Sliding-Scale Care',
    dateLastVerified: '2026-10-13'
  },
  {
    name: 'Macon-Bibb County Health Department',
    category: 'Healthcare',
    corridor: 'Macon / Central GA',
    address: '1600 Forsyth St, Macon, GA 31201',
    contact: '(478) 745-0411',
    notes: 'County public health: low-cost clinic, dental, WIC, immunizations, and vital records (birth certificates Mon–Fri 8am–4pm). No one denied for inability to pay. Call ahead — the department is relocating.',
    badge: 'Public Health Clinic',
    dateLastVerified: '2026-10-13'
  },
  {
    name: 'First Choice Primary Care (Macon)',
    category: 'Healthcare',
    corridor: 'Macon / Central GA',
    address: '2460 Shurling Dr, Macon, GA 31211',
    contact: '(478) 787-4266',
    notes: 'Federally qualified health center: primary care, chronic disease management, screenings, immunizations, and prescription assistance for insured, uninsured, and underinsured adults.',
    badge: 'Sliding-Scale Care',
    dateLastVerified: '2026-10-13'
  },
  // Food Assistance
  {
    name: 'Atlanta Community Food Bank',
    category: 'Food Assistance',
    corridor: 'Atlanta Metro',
    address: '3400 North Desert Dr, East Point, GA 30344',
    contact: '(404) 892-3333',
    notes: 'Feeding America member food bank serving metro Atlanta and north Georgia through 700+ partner agencies. Online food-finder and pantry referral tool.',
    badge: 'Food Pantry Network',
    dateLastVerified: '2026-10-13'
  },
  {
    name: 'Middle Georgia Community Food Bank',
    category: 'Food Assistance',
    corridor: 'Macon / Central GA',
    address: '4490 Ocmulgee East Blvd, Macon, GA 31217',
    contact: '(478) 742-3958',
    notes: 'Feeding America member food bank serving 24 Middle Georgia counties via 200+ partner agencies. Online pantry finder, mobile distributions, and SNAP application assistance.',
    badge: 'Food Pantry Network',
    dateLastVerified: '2026-10-13'
  },
  // Vital Records & DDS
  {
    name: 'Fulton County Board of Health — Vital Records',
    category: 'Vital Records & DDS',
    corridor: 'Atlanta Metro',
    address: '141 Pryor St SW, Suite 1029A, Atlanta, GA 30303',
    contact: '(770) 520-7500',
    notes: 'Issues certified birth and death certificates in person for vital events anywhere in Georgia. Walk-in service, $25 search fee, valid photo ID required.',
    badge: 'In-Person Birth Certificates',
    dateLastVerified: '2026-10-13'
  },
  // Housing & Support
  {
    name: 'Atlanta Mission',
    category: 'Housing & Support',
    corridor: 'Atlanta Metro',
    address: '2353 Bolton Rd NW, Atlanta, GA 30318',
    contact: '(404) 588-4000',
    notes: 'Atlanta’s largest homeless-services nonprofit: four shelters (men’s, recovery, women-and-children) plus transitional housing, vocational training, and meals.',
    badge: 'Emergency Shelter',
    dateLastVerified: '2026-10-13'
  },
  {
    name: 'The Salvation Army — Red Shield Services (Metro Atlanta)',
    category: 'Housing & Support',
    corridor: 'Atlanta Metro',
    address: '469 Marietta St NW, Atlanta, GA 30313',
    contact: '(404) 486-2700',
    notes: 'Emergency and transitional shelter for men, women, and families. Cold-weather program opens to anyone when temperatures drop below 40°F; family transitional program up to one year.',
    badge: 'Emergency Shelter',
    dateLastVerified: '2026-10-13'
  }
];

