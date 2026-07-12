// EcoSphere seed data — realistic mock dataset for the virtual-round demo.
// Everything here is held in memory via context/store and mutated at runtime,
// which is enough to demonstrate every workflow described in the brief
// without a live backend.

export const departments = [
  { id: "d1", name: "Manufacturing", code: "MFG", head: "R. Iyer", employees: 84, status: "Active" },
  { id: "d2", name: "Logistics & Fleet", code: "LOG", head: "S. Bhatt", employees: 41, status: "Active" },
  { id: "d3", name: "Corporate Ops", code: "OPS", head: "A. Menon", employees: 63, status: "Active" },
  { id: "d4", name: "People & Culture", code: "PPL", head: "N. Rao", employees: 22, status: "Active" },
  { id: "d5", name: "Finance & Audit", code: "FIN", head: "V. Kapoor", employees: 19, status: "Active" },
];

export const employees = [
  { id: "e1", name: "Ananya Sharma", dept: "d1", avatarColor: "moss", xp: 1240, points: 340, badges: ["b1", "b2"] },
  { id: "e2", name: "Rohan Verma", dept: "d3", avatarColor: "indigo", xp: 980, points: 210, badges: ["b1"] },
  { id: "e3", name: "Kavya Nair", dept: "d4", avatarColor: "coral", xp: 1560, points: 480, badges: ["b1", "b2", "b3"] },
  { id: "e4", name: "Ishaan Gupta", dept: "d2", avatarColor: "amber", xp: 720, points: 150, badges: [] },
  { id: "e5", name: "Priya Desai", dept: "d5", avatarColor: "violet", xp: 1105, points: 300, badges: ["b1"] },
  { id: "e6", name: "Aditya Rao", dept: "d1", avatarColor: "moss", xp: 640, points: 90, badges: [] },
  { id: "e7", name: "Meera Joshi", dept: "d3", avatarColor: "indigo", xp: 1330, points: 410, badges: ["b1", "b2"] },
  { id: "e8", name: "Farhan Sheikh", dept: "d2", avatarColor: "coral", xp: 495, points: 60, badges: [] },
];

export const currentUser = employees[0]; // Ananya Sharma — used for "my" views

// ---------------- ENVIRONMENTAL ----------------

export const emissionFactors = [
  { id: "ef1", activity: "Grid Electricity (per kWh)", scope: "Scope 2", factor: 0.71, unit: "kg CO2e/kWh" },
  { id: "ef2", activity: "Diesel Fuel (per litre)", scope: "Scope 1", factor: 2.68, unit: "kg CO2e/L" },
  { id: "ef3", activity: "Air Freight (per kg-km)", scope: "Scope 3", factor: 0.602, unit: "kg CO2e/kg-km" },
  { id: "ef4", activity: "Steel Procurement (per kg)", scope: "Scope 3", factor: 1.85, unit: "kg CO2e/kg" },
  { id: "ef5", activity: "Business Travel — Flight (per km)", scope: "Scope 3", factor: 0.158, unit: "kg CO2e/km" },
];

export const carbonTransactions = [
  { id: "ct1", date: "2026-07-09", dept: "d1", source: "Manufacturing", factorId: "ef4", quantity: 4200, emissions: 7770, auto: true },
  { id: "ct2", date: "2026-07-08", dept: "d2", source: "Fleet", factorId: "ef2", quantity: 860, emissions: 2304.8, auto: true },
  { id: "ct3", date: "2026-07-07", dept: "d3", source: "Expense", factorId: "ef5", quantity: 3100, emissions: 489.8, auto: true },
  { id: "ct4", date: "2026-07-05", dept: "d1", source: "Purchase", factorId: "ef1", quantity: 18500, emissions: 13135, auto: true },
  { id: "ct5", date: "2026-07-03", dept: "d2", source: "Manual Entry", factorId: "ef2", quantity: 210, emissions: 562.8, auto: false },
  { id: "ct6", date: "2026-06-29", dept: "d3", source: "Expense", factorId: "ef5", quantity: 1450, emissions: 229.1, auto: true },
];

export const environmentalGoals = [
  { id: "g1", title: "Cut Scope 1 emissions 15% YoY", dept: "Logistics & Fleet", target: 15, progress: 62, unit: "%", due: "2026-12-31" },
  { id: "g2", title: "100% renewable grid power at Plant 2", dept: "Manufacturing", target: 100, progress: 41, unit: "%", due: "2027-03-31" },
  { id: "g3", title: "Zero single-use plastics in packaging", dept: "Manufacturing", target: 100, progress: 78, unit: "%", due: "2026-09-30" },
];

// ---------------- SOCIAL ----------------

export const csrActivities = [
  { id: "csr1", title: "River Cleanup Drive — Gomti Bank", category: "Environment", date: "2026-07-18", capacity: 40, registered: 27, evidenceRequired: true },
  { id: "csr2", title: "Blood Donation Camp", category: "Health", date: "2026-07-22", capacity: 60, registered: 51, evidenceRequired: true },
  { id: "csr3", title: "Digital Literacy for Seniors", category: "Education", date: "2026-08-02", capacity: 20, registered: 12, evidenceRequired: false },
  { id: "csr4", title: "Tree Plantation — Campus Green Belt", category: "Environment", date: "2026-08-09", capacity: 50, registered: 33, evidenceRequired: true },
];

export const employeeParticipation = [
  { id: "ep1", employee: "e1", activity: "csr1", proof: "photo_riverbank_01.jpg", status: "Pending", points: 40 },
  { id: "ep2", employee: "e3", activity: "csr2", proof: "donation_slip.pdf", status: "Approved", points: 50 },
  { id: "ep3", employee: "e7", activity: "csr1", proof: "photo_riverbank_02.jpg", status: "Approved", points: 40 },
  { id: "ep4", employee: "e5", activity: "csr3", proof: null, status: "Pending", points: 30 },
  { id: "ep5", employee: "e2", activity: "csr4", proof: "sapling_photo.jpg", status: "Pending", points: 35 },
];

export const diversityMetrics = {
  genderSplit: [
    { label: "Women", value: 41 },
    { label: "Men", value: 57 },
    { label: "Non-binary / undisclosed", value: 2 },
  ],
  leadershipWomenPct: 34,
  newHiresWomenPct: 46,
  trainingCompletionPct: 88,
  trainingByDept: [
    { dept: "Manufacturing", completion: 81 },
    { dept: "Logistics & Fleet", completion: 74 },
    { dept: "Corporate Ops", completion: 93 },
    { dept: "People & Culture", completion: 97 },
    { dept: "Finance & Audit", completion: 90 },
  ],
};

// ---------------- GOVERNANCE ----------------

export const policies = [
  { id: "p1", title: "Anti-Bribery & Anti-Corruption Policy", version: "v3.1", effective: "2026-01-15", acknowledgedPct: 92 },
  { id: "p2", title: "Data Privacy & Protection Policy", version: "v2.4", effective: "2026-03-01", acknowledgedPct: 87 },
  { id: "p3", title: "Supplier Code of Conduct", version: "v1.6", effective: "2025-11-10", acknowledgedPct: 95 },
  { id: "p4", title: "Whistleblower Protection Policy", version: "v2.0", effective: "2026-05-20", acknowledgedPct: 79 },
];

export const policyAcknowledgements = [
  { id: "pa1", employee: "e2", policy: "p4", acknowledgedOn: null, status: "Pending" },
  { id: "pa2", employee: "e4", policy: "p2", acknowledgedOn: null, status: "Pending" },
  { id: "pa3", employee: "e6", policy: "p4", acknowledgedOn: null, status: "Pending" },
  { id: "pa4", employee: "e1", policy: "p1", acknowledgedOn: "2026-06-30", status: "Acknowledged" },
];

export const audits = [
  { id: "a1", title: "Q2 FY26 Internal Financial Controls Audit", dept: "Finance & Audit", date: "2026-06-15", status: "Completed", findings: 2 },
  { id: "a2", title: "Supplier Compliance Audit — Tier 1 Vendors", dept: "Manufacturing", date: "2026-07-01", status: "In Progress", findings: 1 },
  { id: "a3", title: "Data Protection Readiness Audit", dept: "Corporate Ops", date: "2026-07-20", status: "Scheduled", findings: 0 },
];

export const complianceIssues = [
  { id: "ci1", title: "Vendor missing signed code-of-conduct", audit: "a2", severity: "Medium", owner: "e5", due: "2026-07-15", status: "Open" },
  { id: "ci2", title: "Overdue expense-report retention gap", audit: "a1", severity: "Low", owner: "e2", due: "2026-07-05", status: "Open" },
  { id: "ci3", title: "Access control review lapse — HR system", audit: "a1", severity: "High", owner: "e7", due: "2026-06-28", status: "Open" },
];

// ---------------- GAMIFICATION ----------------

export const challenges = [
  {
    id: "ch1",
    title: "Bike-to-Work Week",
    category: "Environment",
    description: "Commute by bicycle or on foot at least 3 days this week and log your route.",
    xp: 150,
    difficulty: "Easy",
    evidenceRequired: true,
    deadline: "2026-07-19",
    status: "Active",
  },
  {
    id: "ch2",
    title: "Paperless Desk Sprint",
    category: "Environment",
    description: "Digitize and clear all physical paperwork at your desk for 2 consecutive weeks.",
    xp: 100,
    difficulty: "Easy",
    evidenceRequired: false,
    deadline: "2026-07-26",
    status: "Active",
  },
  {
    id: "ch3",
    title: "Mentor a New Joiner",
    category: "Social",
    description: "Complete a 4-week structured mentorship for a new team member.",
    xp: 250,
    difficulty: "Medium",
    evidenceRequired: true,
    deadline: "2026-08-15",
    status: "Under Review",
  },
  {
    id: "ch4",
    title: "Compliance Quiz Champion",
    category: "Governance",
    description: "Score 90%+ on the quarterly policy & compliance refresher quiz.",
    xp: 80,
    difficulty: "Easy",
    evidenceRequired: false,
    deadline: "2026-07-31",
    status: "Active",
  },
  {
    id: "ch5",
    title: "Energy Audit Volunteer",
    category: "Environment",
    description: "Assist facilities in a walk-through energy audit of your floor.",
    xp: 200,
    difficulty: "Medium",
    evidenceRequired: true,
    deadline: "2026-06-20",
    status: "Completed",
  },
  { id: "ch6", title: "Draft: Waste Segregation Challenge", category: "Environment", description: "Coming soon — draft under design.", xp: 120, difficulty: "Easy", evidenceRequired: true, deadline: "2026-09-01", status: "Draft" },
];

export const challengeParticipation = [
  { id: "cp1", challenge: "ch1", employee: "e1", progress: 66, proof: "route_log.png", approval: "Pending", xpAwarded: 0 },
  { id: "cp2", challenge: "ch2", employee: "e3", progress: 100, proof: null, approval: "Approved", xpAwarded: 100 },
  { id: "cp3", challenge: "ch1", employee: "e7", progress: 100, proof: "route_log_2.png", approval: "Approved", xpAwarded: 150 },
  { id: "cp4", challenge: "ch5", employee: "e5", progress: 100, proof: "audit_notes.pdf", approval: "Approved", xpAwarded: 200 },
];

export const badges = [
  { id: "b1", name: "First Step", description: "Complete your first CSR activity or challenge.", unlockRule: "1+ completed activity", icon: "Footprints", color: "moss" },
  { id: "b2", name: "Green Streak", description: "Complete 3 environmental challenges.", unlockRule: "3+ environment challenges completed", icon: "Leaf", color: "moss" },
  { id: "b3", name: "Community Pillar", description: "Reach 400 CSR participation points.", unlockRule: "400+ points from CSR", icon: "HeartHandshake", color: "coral" },
  { id: "b4", name: "1000 XP Club", description: "Cross 1000 total XP.", unlockRule: "1000+ XP", icon: "Trophy", color: "amber" },
];

export const rewards = [
  { id: "r1", name: "Reusable Bamboo Bottle", pointsRequired: 120, stock: 34, status: "Active" },
  { id: "r2", name: "Extra Day Off (WFH)", pointsRequired: 300, stock: 15, status: "Active" },
  { id: "r3", name: "₹1000 Sustainable Store Voucher", pointsRequired: 450, stock: 8, status: "Active" },
  { id: "r4", name: "EcoSphere Hoodie", pointsRequired: 220, stock: 0, status: "Out of Stock" },
];

// ---------------- CATEGORIES ----------------

export const categories = [
  { id: "c1", name: "Environment", type: "CSR Activity", status: "Active" },
  { id: "c2", name: "Health", type: "CSR Activity", status: "Active" },
  { id: "c3", name: "Education", type: "CSR Activity", status: "Active" },
  { id: "c4", name: "Environment", type: "Challenge", status: "Active" },
  { id: "c5", name: "Social", type: "Challenge", status: "Active" },
  { id: "c6", name: "Governance", type: "Challenge", status: "Active" },
];

// ---------------- SCORES ----------------

export const departmentScores = [
  { dept: "Manufacturing", environmental: 71, social: 66, governance: 80 },
  { dept: "Logistics & Fleet", environmental: 58, social: 61, governance: 74 },
  { dept: "Corporate Ops", environmental: 76, social: 84, governance: 88 },
  { dept: "People & Culture", environmental: 69, social: 91, governance: 85 },
  { dept: "Finance & Audit", environmental: 64, social: 70, governance: 93 },
];

export const scoreWeights = { environmental: 40, social: 30, governance: 30 };

export const carbonTrend = [
  { month: "Feb", emissions: 28100 },
  { month: "Mar", emissions: 26900 },
  { month: "Apr", emissions: 27650 },
  { month: "May", emissions: 25200 },
  { month: "Jun", emissions: 24100 },
  { month: "Jul", emissions: 24491 },
];

export const notificationsSeed = [
  { id: "n1", type: "compliance", text: "New compliance issue raised: Access control review lapse — HR system", time: "2h ago", read: false },
  { id: "n2", type: "badge", text: "Kavya Nair unlocked the badge Community Pillar", time: "5h ago", read: false },
  { id: "n3", type: "approval", text: "CSR approval needed: River Cleanup Drive (3 pending)", time: "1d ago", read: true },
  { id: "n4", type: "policy", text: "Reminder: Whistleblower Protection Policy acknowledgement pending", time: "1d ago", read: true },
  { id: "n5", type: "badge", text: "Rohan Verma unlocked the badge First Step", time: "2d ago", read: true },
];
