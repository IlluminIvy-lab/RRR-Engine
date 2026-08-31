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
    badge: 'Official State ID'
  },
  {
    name: 'Georgia DDS Customer Service Center (Macon)',
    category: 'Vital Records & DDS',
    corridor: 'Macon / Central GA',
    address: '200 Cherry St / 1056 Center St, Macon, GA 31201',
    contact: '(678) 413-8400',
    notes: 'Central Georgia DDS service center. Accepts GDC release paperwork for rapid ID issuance.',
    badge: 'Official State ID'
  },
  {
    name: 'Georgia State Office of Vital Records',
    category: 'Vital Records & DDS',
    corridor: 'Atlanta Metro',
    address: '1680 Phoenix Blvd, Suite 100, Atlanta, GA 30349',
    contact: '(404) 679-4702',
    notes: 'Walk-in certified birth certificates and birth record amendments with expedited same-day turnaround.',
    badge: 'Vital Records'
  },
  // Transit
  {
    name: 'MARTA Reentry Mobility Program / Breeze Office',
    category: 'Transit & Mobility',
    corridor: 'Atlanta Metro',
    address: '2424 Piedmont Rd NE, Atlanta, GA 30324 (Five Points Hub)',
    contact: '(404) 848-5000',
    notes: 'Comprehensive rail and bus rapid transit spanning Fulton, DeKalb, and Clayton counties.',
    badge: 'Transit Voucher'
  },
  {
    name: 'Macon-Bibb Transit Authority (MTA Terminal)',
    category: 'Transit & Mobility',
    corridor: 'Macon / Central GA',
    address: '200 Cherry St, Macon, GA 31201',
    contact: '(478) 803-2500',
    notes: 'Central Georgia hub connecting Macon industrial zones, Ocmulgee corridors, and Mercer employment hubs.',
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
    badge: 'Rapid Intake'
  },
  {
    name: 'City of Refuge (Workforce & Housing Campus)',
    category: 'Housing & Support',
    corridor: 'Atlanta Metro',
    address: '1300 Joseph E Boone Blvd NW, Atlanta, GA 30314',
    contact: '(404) 564-7752',
    notes: 'Comprehensive campus with transitional housing, tech academy, culinary school, and auto repair training.',
    badge: 'Workforce Campus'
  },
  {
    name: 'Daybreak Resource Center (Macon)',
    category: 'Housing & Support',
    corridor: 'Macon / Central GA',
    address: '174 Walnut St, Macon, GA 31201',
    contact: '(478) 216-9119',
    notes: 'Daytime shelter, hygiene facilities, mail drop, telehealth clinic, and legal ID assistance.',
    badge: 'Central GA Daybreak'
  },
  // Banking
  {
    name: 'Delta Community Credit Union (Fresh Start)',
    category: 'Second Chance Banking',
    corridor: 'Atlanta Metro',
    address: 'Multiple metro branches (Peachtree St, Downtown, Airport Hub)',
    contact: '(800) 544-3328',
    notes: 'Second chance checking with full Visa debit card, online banking, and $0 maintenance with direct deposit.',
    badge: 'Second Chance FDIC'
  },
  {
    name: 'Robins Financial Credit Union (Central Georgia)',
    category: 'Second Chance Banking',
    corridor: 'Macon / Central GA',
    address: '1700 Bowman Rd, Macon, GA 31210 / Multiple Macon Branches',
    contact: '(478) 923-3773',
    notes: 'Community-first credit union offering low-barrier checking, direct deposit, and credit building loans.',
    badge: 'Central GA Credit Union'
  },
  // Trades & Apprenticeships
  {
    name: 'IBEW Local 613 Electrical Training Center',
    category: 'Apprenticeships & Trades',
    corridor: 'Atlanta Metro',
    address: '501 Pulliam St SW #250, Atlanta, GA 30312',
    contact: '(404) 523-8107',
    notes: 'Premier 5-year paid commercial electrical apprenticeship ($18-$36/hr progression, 100% employer-funded healthcare).',
    badge: 'Union Apprenticeship'
  },
  {
    name: 'Technical College System of Georgia (TCSG) - HOPE Career Grant',
    category: 'Apprenticeships & Trades',
    corridor: 'Statewide GA',
    address: 'Atlanta Tech, Central GA Tech (Macon), Chattahoochee Tech',
    contact: '(404) 679-1600',
    notes: '100% tuition-free programs for Welding, Commercial Truck Driving (CDL), Diesel Tech, Electrical, and HVAC.',
    badge: '100% Free Tuition'
  },
  {
    name: 'First Step Staffing (Atlanta Corridor)',
    category: 'Apprenticeships & Trades',
    corridor: 'Atlanta Metro',
    address: '236 Auburn Ave NE #203, Atlanta, GA 30303',
    contact: '(404) 577-3395',
    notes: 'Fast-track W-2 commercial employment with daily provided transit van transportation to warehouse/manufacturing sites.',
    badge: 'Same-Week W-2'
  },
  {
    name: 'WorkSource Georgia / WorkSource Atlanta',
    category: 'Apprenticeships & Trades',
    corridor: 'Statewide GA',
    address: '818 Pollard Blvd SW, Atlanta, GA 30315 | Macon: 3090 Mercer Univ Dr',
    contact: '(404) 546-3000',
    notes: 'Federal WIOA training grants ($5,000-$8,000) covering 100% of CDL, forklift certification, and medical tech training.',
    badge: 'WIOA Grants'
  }
];
