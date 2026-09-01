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
    address: '200 Cherry St, Macon, GA 31201 (Terminal Station)',
    contact: '(678) 413-8400',
    notes: 'Central Georgia DDS service center located in historic Terminal Station. Accepts GDC release paperwork and fee vouchers for rapid ID issuance.',
    badge: 'Official State ID'
  },
  {
    name: 'Georgia State Office of Vital Records',
    category: 'Vital Records & DDS',
    corridor: 'Atlanta Metro',
    address: '1680 Phoenix Blvd, Suite 100, Atlanta, GA 30349',
    contact: '(404) 679-4702',
    notes: 'Walk-in lobby service at this state facility is currently suspended until further notice. Order online via ROVER/VitalChek, apply by mail, or visit local county health department vital records offices (e.g. Fulton, DeKalb, Clayton, Bibb) for in-person same-day birth certificates.',
    badge: 'Vital Records (Online/County)'
  },
  // Transit
  {
    name: 'MARTA Mobility & Customer Service Center',
    category: 'Transit & Mobility',
    corridor: 'Atlanta Metro',
    address: '2424 Piedmont Rd NE, Atlanta, GA 30324 (HQ / Reduced Fare Office)',
    contact: '(404) 848-5000',
    notes: 'Comprehensive rail and bus transit spanning Fulton, DeKalb, and Clayton. Reduced Fare Breeze card office and transit pass distribution; note that Five Points station offices are modified during the Five Points Transformation project.',
    badge: 'Transit Mobility'
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
    badge: 'Rapid Intake'
  },
  {
    name: 'City of Refuge (Workforce & Housing Campus)',
    category: 'Housing & Support',
    corridor: 'Atlanta Metro',
    address: '1300 Joseph E Boone Blvd NW, Atlanta, GA 30314',
    contact: '(404) 874-2241',
    notes: 'Comprehensive campus with transitional housing, workforce innovation academy, culinary school, and auto repair trade training.',
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
    name: 'Peach State Federal Credit Union (Fresh Start Checking)',
    category: 'Second Chance Banking',
    corridor: 'Atlanta Metro',
    address: 'Metro Atlanta Branches (2357 Benjamin E Mays Dr SW, Atlanta | 1342 Glenwood Ave SE, Atlanta)',
    contact: '(855) 889-4328',
    notes: 'Verified Fresh Start second-chance checking account with Visa debit card, online/mobile banking, and opportunity to graduate to standard checking after 12 months in good standing.',
    badge: 'Fresh Start Checking'
  },
  {
    name: 'Robins Financial Credit Union (Central Georgia)',
    category: 'Second Chance Banking',
    corridor: 'Macon / Central GA',
    address: '5999 Zebulon Rd, Macon, GA 31210 / 515 Mulberry St, Macon, GA 31201',
    contact: '(478) 923-3773',
    notes: 'Community-first credit union offering low-barrier checking, direct deposit, and credit building loans across Macon-Bibb and Warner Robins.',
    badge: 'Central GA Credit Union'
  },
  // Trades & Apprenticeships
  {
    name: 'IBEW Local 613 (Union Hall / Apprenticeship Intake)',
    category: 'Apprenticeships & Trades',
    corridor: 'Atlanta Metro',
    address: '501 Pulliam St SW #250, Atlanta, GA 30312 (Intake Office)',
    contact: '(404) 523-8107',
    notes: 'Union headquarters & intake office routing candidates to the Atlanta Electrical Training Center (AEJATC) in Norcross (6601 Bay Circle). 4-5 year paid commercial electrical apprenticeship with $18–$55+/hr wage progression and 100% employer-funded healthcare.',
    badge: 'Union Apprenticeship'
  },
  {
    name: 'Technical College System of Georgia (TCSG) - HOPE Career Grant',
    category: 'Apprenticeships & Trades',
    corridor: 'Statewide GA',
    address: 'System Office: 1800 Century Place NE, Atlanta, GA 30345 (Campuses: Atlanta Tech, Central GA Tech, Chattahoochee Tech)',
    contact: '(404) 679-1600',
    notes: '100% tuition-free programs for Welding, Commercial Truck Driving (CDL), Diesel Tech, Electrical, Precision Machining, and HVAC.',
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
    address: '818 Pollard Blvd SW, Atlanta, GA 30315 | Middle GA: 3090 Mercer Univ Dr / 175 Emery Hwy, Macon',
    contact: '(404) 546-3000',
    notes: 'Federal WIOA training grants ($5,000-$8,000) covering 100% of CDL, forklift certification, and skilled industrial trade training.',
    badge: 'WIOA Grants'
  }
];
